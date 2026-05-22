import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { OrderStatus, PaymentMethod, BlacklistType, FraudRiskLevel } from "@prisma/client";
import { normalizePhone, generateOrderNumber } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, address, items, couponCode } = body;

    if (!name || !phone || !address || !items || items.length === 0) {
      return NextResponse.json({ error: "Missing checkout parameters" }, { status: 400 });
    }

    const cleanPhone = normalizePhone(phone);

    // 1. Blacklist check
    const isBlacklisted = await db.blacklist.findFirst({
      where: {
        type: BlacklistType.PHONE,
        value: cleanPhone,
      },
    });

    if (isBlacklisted) {
      return NextResponse.json(
        { error: "Order blocked. Contact information is blacklisted." },
        { status: 403 }
      );
    }

    // 2. Validate inventory and calculate prices
    let subtotal = 0;
    const itemsToCreate: any[] = [];
    const updateInventoryPromises: any[] = [];

    for (const item of items) {
      const variant = await db.productVariant.findUnique({
        where: { id: item.variantId },
        include: { product: true },
      });

      if (!variant || !variant.isActive) {
        return NextResponse.json({ error: "Product variant not found" }, { status: 404 });
      }

      if (variant.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${variant.product.name} - ${variant.name}` },
          { status: 400 }
        );
      }

      const itemTotal = Number(variant.salePrice) * item.quantity;
      subtotal += itemTotal;

      itemsToCreate.push({
        productId: variant.productId,
        variantId: variant.id,
        productName: variant.product.name,
        variantName: variant.name,
        quantity: item.quantity,
        unitPrice: variant.salePrice,
        totalPrice: itemTotal,
      });

      // Stock decrement promise
      updateInventoryPromises.push(
        db.productVariant.update({
          where: { id: variant.id },
          data: { stock: { decrement: item.quantity } },
        })
      );
    }

    // 3. Shipping cost calculation
    let shippingCharge = subtotal >= 1500 ? 0 : 99; // Free shipping above 1500, else flat 99

    // Check dynamic shipping rules in DB if available
    const activeRules = await db.shippingRule.findMany({
      where: { isActive: true },
      orderBy: { priority: "desc" },
    });

    if (activeRules.length > 0) {
      for (const rule of activeRules) {
        if (rule.type === "FREE_ABOVE" && rule.minCartValue && subtotal >= Number(rule.minCartValue)) {
          shippingCharge = Number(rule.shippingCharge);
          break;
        } else if (rule.type === "FLAT") {
          shippingCharge = Number(rule.shippingCharge);
          break;
        }
      }
    }

    // 4. Validate coupon code if applied
    let discountAmount = 0;
    let couponRecord = null;

    if (couponCode) {
      couponRecord = await db.coupon.findFirst({
        where: {
          code: {
            equals: couponCode.trim(),
            mode: "insensitive",
          },
        },
      });

      if (couponRecord && couponRecord.isActive) {
        // Enforce validations
        const now = new Date();
        const validDates = now >= couponRecord.validFrom && now <= couponRecord.validUntil;
        const validMinCart = !couponRecord.minCartValue || subtotal >= Number(couponRecord.minCartValue);
        const validUsageLimit = !couponRecord.usageLimit || couponRecord.usedCount < couponRecord.usageLimit;

        // Check single use
        const alreadyUsed = await db.couponUsage.findUnique({
          where: {
            couponId_phone: {
              couponId: couponRecord.id,
              phone: cleanPhone,
            },
          },
        });

        if (validDates && validMinCart && validUsageLimit && !alreadyUsed) {
          if (couponRecord.type === "FLAT") {
            discountAmount = Number(couponRecord.value);
          } else if (couponRecord.type === "PERCENTAGE") {
            discountAmount = (subtotal * Number(couponRecord.value)) / 100;
            if (couponRecord.maxDiscount && discountAmount > Number(couponRecord.maxDiscount)) {
              discountAmount = Number(couponRecord.maxDiscount);
            }
          }
          if (discountAmount > subtotal) discountAmount = subtotal;
        }
      }
    }

    const totalAmount = subtotal + shippingCharge - discountAmount;

    // 5. Fraud risk scoring & intelligence
    let fraudScore = 0;
    const fraudFlags: string[] = [];

    // Analyze phone
    if (cleanPhone.length !== 10) {
      fraudScore += 20;
      fraudFlags.push("INVALID_PHONE_LENGTH");
    }

    // Analyze address details
    const addressStr = JSON.stringify(address).toLowerCase();
    const suspiciousKeywords = ["test", "fake", "xyz", "asdf", "dummy"];
    suspiciousKeywords.forEach((word) => {
      if (addressStr.includes(word)) {
        fraudScore += 30;
        fraudFlags.push(`SUSPICIOUS_ADDRESS_KEYWORD_${word.toUpperCase()}`);
      }
    });

    // Check high order value guest risk
    if (totalAmount > 15000) {
      fraudScore += 25;
      fraudFlags.push("HIGH_VALUE_COD_ORDER");
    }

    // Classify fraud level
    let riskLevel: FraudRiskLevel = FraudRiskLevel.LOW;
    if (fraudScore >= 70) riskLevel = FraudRiskLevel.CRITICAL;
    else if (fraudScore >= 50) riskLevel = FraudRiskLevel.HIGH;
    else if (fraudScore >= 25) riskLevel = FraudRiskLevel.MEDIUM;

    // 6. DB Transaction to create order
    const result = await db.$transaction(async (tx) => {
      // Decrement inventory
      await Promise.all(updateInventoryPromises);

      // Create main Order
      const newOrder = await tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          customerName: name,
          customerEmail: email || null,
          customerPhone: cleanPhone,
          shippingAddress: address,
          couponCode: couponRecord ? couponRecord.code : null,
          couponSnapshot: couponRecord ? JSON.parse(JSON.stringify(couponRecord)) : null,
          subtotal,
          shippingAmount: shippingCharge,
          discountAmount,
          totalAmount,
          status: OrderStatus.PENDING,
          paymentMethod: PaymentMethod.COD,
          fraudScore,
          fraudFlags,
          items: {
            create: itemsToCreate,
          },
          statusHistory: {
            create: {
              fromStatus: null,
              toStatus: OrderStatus.PENDING,
              notes: "Order placed successfully via COD checkout.",
            },
          },
        },
      });

      // Update coupon usage count and logs
      if (couponRecord) {
        await tx.coupon.update({
          where: { id: couponRecord.id },
          data: { usedCount: { increment: 1 } },
        });

        await tx.couponUsage.create({
          data: {
            couponId: couponRecord.id,
            orderId: newOrder.id,
            phone: cleanPhone,
            discountApplied: discountAmount,
          },
        });
      }

      // Record fraud event log if risk level is medium or higher
      if (riskLevel !== FraudRiskLevel.LOW) {
        await tx.fraudLog.create({
          data: {
            orderId: newOrder.id,
            phone: cleanPhone,
            riskLevel,
            reason: `Automated risk screening triggered with score ${fraudScore}. Flags: ${fraudFlags.join(", ")}`,
            details: { score: fraudScore, flags: fraudFlags },
          },
        });
      }

      return newOrder;
    });

    return NextResponse.json({ success: true, order: result });
  } catch (error) {
    console.error("Checkout process failed:", error);
    return NextResponse.json({ error: "Failed to place order" }, { status: 500 });
  }
}
