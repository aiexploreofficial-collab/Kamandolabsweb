import { db } from "./db";
import { normalizePhone } from "./utils";

export interface CouponValidationResult {
  isValid: boolean;
  error?: string;
  discountAmount?: number;
  couponId?: string;
  code?: string;
}

export async function validateCoupon(
  code: string,
  cartValue: number,
  phone: string
): Promise<CouponValidationResult> {
  try {
    const cleanPhone = normalizePhone(phone);
    const codeUpper = code.toUpperCase().trim();

    // 1. Fetch coupon
    const coupon = await db.coupon.findUnique({
      where: { code: codeUpper },
    });

    if (!coupon || !coupon.isActive) {
      return { isValid: false, error: "Invalid coupon code" };
    }

    // 2. Validate dates
    const now = new Date();
    if (now < coupon.validFrom) {
      return { isValid: false, error: "Coupon is not active yet" };
    }
    if (now > coupon.validUntil) {
      return { isValid: false, error: "Coupon has expired" };
    }

    // 3. Check min cart value
    if (coupon.minCartValue && cartValue < Number(coupon.minCartValue)) {
      return {
        isValid: false,
        error: `Minimum order value required is ₹${Number(coupon.minCartValue)}`,
      };
    }

    // 4. Check global usage limit
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return { isValid: false, error: "Coupon usage limit reached" };
    }

    // 5. Enforce single-use per phone number
    const alreadyUsed = await db.couponUsage.findUnique({
      where: {
        couponId_phone: {
          couponId: coupon.id,
          phone: cleanPhone,
        },
      },
    });

    if (alreadyUsed) {
      return { isValid: false, error: "You have already used this coupon code" };
    }

    // 6. Calculate discount
    let discountAmount = 0;
    if (coupon.type === "FLAT") {
      discountAmount = Number(coupon.value);
    } else if (coupon.type === "PERCENTAGE") {
      discountAmount = (cartValue * Number(coupon.value)) / 100;
      if (coupon.maxDiscount && discountAmount > Number(coupon.maxDiscount)) {
        discountAmount = Number(coupon.maxDiscount);
      }
    }

    // Cap discount at cart value
    if (discountAmount > cartValue) {
      discountAmount = cartValue;
    }

    return {
      isValid: true,
      discountAmount,
      couponId: coupon.id,
      code: coupon.code,
    };
  } catch (error) {
    console.error("Error validating coupon:", error);
    return { isValid: false, error: "Failed to validate coupon" };
  }
}
