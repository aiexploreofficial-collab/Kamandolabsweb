import { db } from "./db";
import { normalizePhone } from "./utils";
import { FraudRiskLevel, BlacklistType } from "@prisma/client";

export interface FraudCheckResult {
  isBlocked: boolean;
  riskScore: number;
  riskLevel: FraudRiskLevel;
  flags: string[];
}

export async function performFraudCheck(
  phone: string,
  email?: string | null,
  name?: string
): Promise<FraudCheckResult> {
  const cleanPhone = normalizePhone(phone);
  const flags: string[] = [];
  let score = 0;

  try {
    // 1. Blacklist Check
    const blacklistRecord = await db.blacklist.findFirst({
      where: {
        type: BlacklistType.PHONE,
        value: cleanPhone,
      },
    });

    if (blacklistRecord) {
      flags.push("PHONE_BLACKLISTED");
      return {
        isBlocked: true,
        riskScore: 100,
        riskLevel: FraudRiskLevel.CRITICAL,
        flags,
      };
    }

    // 2. Suspicious Rapid Repeat Orders (within 10 minutes)
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    const rapidOrders = await db.order.count({
      where: {
        customerPhone: cleanPhone,
        createdAt: {
          gte: tenMinutesAgo,
        },
      },
    });

    if (rapidOrders >= 2) {
      flags.push("RAPID_REPEAT_ORDERS");
      score += 50;
    }

    // 3. Duplicate Orders (within 24 hours)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 1000);
    const dailyOrders = await db.order.count({
      where: {
        customerPhone: cleanPhone,
        createdAt: {
          gte: oneDayAgo,
        },
      },
    });

    if (dailyOrders >= 1) {
      flags.push("DUPLICATE_ORDER_24H");
      score += 25;
    }

    // 4. Mismatched email checks (if email matches but phone is different, or same phone different names)
    if (email) {
      const emailNormalized = email.toLowerCase().trim();
      const distinctPhones = await db.order.findMany({
        where: {
          customerEmail: emailNormalized,
          createdAt: { gte: oneDayAgo },
        },
        select: { customerPhone: true },
        distinct: ["customerPhone"],
      });

      if (distinctPhones.length > 1) {
        flags.push("EMAIL_LINKED_TO_MULTIPLE_PHONES");
        score += 15;
      }
    }

    // 5. Name check logic (e.g. nonsense names, repeating characters, or multiple names with same phone)
    if (name) {
      const nameClean = name.toLowerCase().trim();
      if (nameClean.length < 3) {
        flags.push("SUSPICIOUS_SHORT_NAME");
        score += 10;
      }
      
      const distinctNames = await db.order.findMany({
        where: {
          customerPhone: cleanPhone,
          createdAt: { gte: oneDayAgo },
        },
        select: { customerName: true },
        distinct: ["customerName"],
      });

      if (distinctNames.length > 1) {
        flags.push("PHONE_LINKED_TO_MULTIPLE_NAMES");
        score += 20;
      }
    }

    // Determine Risk Level based on Score
    let riskLevel: FraudRiskLevel = FraudRiskLevel.LOW;
    if (score >= 70) {
      riskLevel = FraudRiskLevel.CRITICAL;
    } else if (score >= 40) {
      riskLevel = FraudRiskLevel.HIGH;
    } else if (score >= 20) {
      riskLevel = FraudRiskLevel.MEDIUM;
    }

    return {
      isBlocked: riskLevel === FraudRiskLevel.CRITICAL,
      riskScore: Math.min(100, score),
      riskLevel,
      flags,
    };
  } catch (error) {
    console.error("Fraud check evaluation failed:", error);
    // Return low risk fallback to avoid blocking valid customers if DB suffers errors
    return {
      isBlocked: false,
      riskScore: 0,
      riskLevel: FraudRiskLevel.LOW,
      flags: ["FRAUD_CHECK_SYSTEM_ERROR"],
    };
  }
}
