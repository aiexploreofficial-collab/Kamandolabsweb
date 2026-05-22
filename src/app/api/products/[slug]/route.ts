import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ReviewStatus } from "@prisma/client";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const product = await db.product.findUnique({
      where: { slug },
      include: {
        variants: {
          where: { isActive: true },
        },
        category: true,
        reviews: {
          where: { status: ReviewStatus.APPROVED },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("API error fetching product detail:", error);
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
}
