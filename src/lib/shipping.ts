import { db } from "./db";

export interface CalculateShippingParams {
  subtotal: number;
}

export async function calculateShipping({ subtotal }: CalculateShippingParams): Promise<{
  shippingCharge: number;
  appliedRuleName: string;
}> {
  try {
    // 1. Fetch active shipping rules from database ordered by priority desc
    const activeRules = await db.shippingRule.findMany({
      where: { isActive: true },
      orderBy: { priority: "desc" },
    });

    // 2. Evaluate each rule
    for (const rule of activeRules) {
      if (rule.type === "FREE_ABOVE") {
        const minCartValue = rule.minCartValue ? Number(rule.minCartValue) : 0;
        if (subtotal >= minCartValue) {
          return {
            shippingCharge: Number(rule.shippingCharge),
            appliedRuleName: rule.name,
          };
        }
      } else if (rule.type === "FLAT") {
        return {
          shippingCharge: Number(rule.shippingCharge),
          appliedRuleName: rule.name,
        };
      } else if (rule.type === "SLAB") {
        const minVal = rule.minCartValue ? Number(rule.minCartValue) : 0;
        const maxVal = rule.maxCartValue ? Number(rule.maxCartValue) : Infinity;
        if (subtotal >= minVal && subtotal <= maxVal) {
          return {
            shippingCharge: Number(rule.shippingCharge),
            appliedRuleName: rule.name,
          };
        }
      }
    }

    // 3. Fallback default rules if no database rules matched or exist
    // Default Rule: Free above ₹1999, else Flat ₹99
    if (subtotal >= 1999) {
      return {
        shippingCharge: 0,
        appliedRuleName: "Default Free Shipping (Above ₹1999)",
      };
    }

    return {
      shippingCharge: 99,
      appliedRuleName: "Default Flat Shipping",
    };
  } catch (error) {
    console.error("Failed to calculate shipping charge:", error);
    // Safe fallback if database is offline
    if (subtotal >= 1999) {
      return {
        shippingCharge: 0,
        appliedRuleName: "Default Free Shipping (Above ₹1999)",
      };
    }
    return {
      shippingCharge: 99,
      appliedRuleName: "Default Flat Shipping",
    };
  }
}
