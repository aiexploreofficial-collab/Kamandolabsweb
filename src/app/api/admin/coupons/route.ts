import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { CouponType } from "@prisma/client";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const coupons = await db.coupon.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(coupons);
  } catch (error) {
    console.error("Failed to fetch admin coupons:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const body = await request.json();
    const {
      code,
      description,
      type,
      value,
      minCartValue,
      maxDiscount,
      usageLimit,
      validFrom,
      validUntil,
      isActive = true,
      productIds = null,
      categoryIds = null,
    } = body;

    if (!code || !type || value === undefined || !validFrom || !validUntil) {
      return NextResponse.json({ error: "Required fields are missing." }, { status: 400 });
    }

    // Check duplicate code
    const existing = await db.coupon.findUnique({
      where: { code: code.toUpperCase().trim() },
    });

    if (existing) {
      return NextResponse.json({ error: "A coupon with this code already exists." }, { status: 400 });
    }

    const coupon = await db.coupon.create({
      data: {
        code: code.toUpperCase().trim(),
        description,
        type: type as CouponType,
        value: Number(value),
        minCartValue: minCartValue ? Number(minCartValue) : null,
        maxDiscount: maxDiscount ? Number(maxDiscount) : null,
        usageLimit: usageLimit ? Number(usageLimit) : null,
        validFrom: new Date(validFrom),
        validUntil: new Date(validUntil),
        isActive,
        productIds: productIds || null,
        categoryIds: categoryIds || null,
      },
    });

    return NextResponse.json({ success: true, coupon });
  } catch (error) {
    console.error("Failed to create coupon:", error);
    return NextResponse.json({ error: "Failed to create coupon." }, { status: 500 });
  }
}
