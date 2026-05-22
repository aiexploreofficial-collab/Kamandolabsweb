import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ProductStatus } from "@prisma/client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");
  const isFeatured = searchParams.get("featured") === "true";
  const category = searchParams.get("category");

  try {
    // Attempt DB query
    const whereClause: any = {};
    
    if (q) {
      whereClause.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { shortDescription: { contains: q, mode: "insensitive" } },
      ];
    }
    
    if (isFeatured) {
      whereClause.isFeatured = true;
    }

    if (category) {
      whereClause.category = {
        slug: category,
      };
    }

    // Only active products on front-end
    whereClause.status = ProductStatus.ACTIVE;

    const products = await db.product.findMany({
      where: whereClause,
      include: {
        variants: {
          where: { isActive: true },
          orderBy: { salePrice: "asc" },
        },
        category: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("API error fetching products:", error);
    return NextResponse.json([], { status: 500 });
  }
}
