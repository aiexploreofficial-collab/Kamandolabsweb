import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { CouponType } from "@prisma/client";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { id } = await params;

    const coupon = await db.coupon.findUnique({
      where: { id },
    });

    if (!coupon) {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    }

    return NextResponse.json(coupon);
  } catch (error) {
    console.error("Failed to fetch coupon details:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { id } = await params;
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
      isActive,
      productIds,
      categoryIds,
    } = body;

    const coupon = await db.coupon.findUnique({
      where: { id },
    });

    if (!coupon) {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    }

    const updateData: any = {};
    if (code !== undefined) updateData.code = code.toUpperCase().trim();
    if (description !== undefined) updateData.description = description;
    if (type !== undefined) updateData.type = type as CouponType;
    if (value !== undefined) updateData.value = Number(value);
    if (minCartValue !== undefined) updateData.minCartValue = minCartValue ? Number(minCartValue) : null;
    if (maxDiscount !== undefined) updateData.maxDiscount = maxDiscount ? Number(maxDiscount) : null;
    if (usageLimit !== undefined) updateData.usageLimit = usageLimit ? Number(usageLimit) : null;
    if (validFrom !== undefined) updateData.validFrom = new Date(validFrom);
    if (validUntil !== undefined) updateData.validUntil = new Date(validUntil);
    if (isActive !== undefined) updateData.isActive = isActive;
    if (productIds !== undefined) updateData.productIds = productIds || null;
    if (categoryIds !== undefined) updateData.categoryIds = categoryIds || null;

    const updated = await db.coupon.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, coupon: updated });
  } catch (error: any) {
    console.error("Failed to update coupon:", error);
    if (error.code === "P2002") {
      return NextResponse.json({ error: "A coupon with this code already exists." }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update coupon" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { id } = await params;

    // Hard delete coupon as per content model instructions
    await db.coupon.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete coupon:", error);
    return NextResponse.json(
      { error: "Cannot delete this coupon. It may have been used by customers." },
      { status: 500 }
    );
  }
}
