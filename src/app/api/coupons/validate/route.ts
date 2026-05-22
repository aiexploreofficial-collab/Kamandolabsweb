import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { normalizePhone } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, cartValue, phone } = body;

    if (!code || !cartValue || !phone) {
      return NextResponse.json({ error: "Missing coupon validation params" }, { status: 400 });
    }

    const cleanPhone = normalizePhone(phone);

    // 1. Fetch active coupon (case-insensitive lookup)
    const coupon = await db.coupon.findFirst({
      where: {
        code: {
          equals: code.trim(),
          mode: "insensitive",
        },
      },
    });

    if (!coupon || !coupon.isActive) {
      return NextResponse.json({ error: "Invalid coupon code" }, { status: 400 });
    }

    // 2. Validate dates
    const now = new Date();
    if (now < coupon.validFrom) {
      return NextResponse.json({ error: "Coupon is not active yet" }, { status: 400 });
    }
    if (now > coupon.validUntil) {
      return NextResponse.json({ error: "Coupon has expired" }, { status: 400 });
    }

    // 3. Check min cart value
    if (coupon.minCartValue && Number(cartValue) < Number(coupon.minCartValue)) {
      return NextResponse.json(
        { error: `Minimum order value required is ₹${coupon.minCartValue}` },
        { status: 400 }
      );
    }

    // 4. Check global usage limit
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json({ error: "Coupon usage limit reached" }, { status: 400 });
    }

    // 5. Enforce single-use per phone number (bypass for preview placeholder "0000000000")
    if (cleanPhone !== "0000000000") {
      const alreadyUsed = await db.couponUsage.findUnique({
        where: {
          couponId_phone: {
            couponId: coupon.id,
            phone: cleanPhone,
          },
        },
      });

      if (alreadyUsed) {
        return NextResponse.json(
          { error: "You have already used this coupon code" },
          { status: 400 }
        );
      }
    }

    // 6. Calculate discount
    let discountAmount = 0;
    if (coupon.type === "FLAT") {
      discountAmount = Number(coupon.value);
    } else if (coupon.type === "PERCENTAGE") {
      discountAmount = (Number(cartValue) * Number(coupon.value)) / 100;
      if (coupon.maxDiscount && discountAmount > Number(coupon.maxDiscount)) {
        discountAmount = Number(coupon.maxDiscount);
      }
    }

    // Cap discount at cart value
    if (discountAmount > Number(cartValue)) {
      discountAmount = Number(cartValue);
    }

    return NextResponse.json({
      success: true,
      valid: true,
      couponId: coupon.id,
      code: coupon.code,
      type: coupon.type,
      discountAmount,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        type: coupon.type,
        value: Number(coupon.value),
        minCartValue: coupon.minCartValue ? Number(coupon.minCartValue) : null,
        maxDiscount: coupon.maxDiscount ? Number(coupon.maxDiscount) : null,
      },
    });
  } catch (error) {
    console.error("Coupon validation error:", error);
    return NextResponse.json({ error: "Failed to validate coupon" }, { status: 500 });
  }
}
