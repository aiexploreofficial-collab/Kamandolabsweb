import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { ProductStatus } from "@prisma/client";
import slugify from "slugify";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const products = await db.product.findMany({
      include: {
        variants: true,
        category: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const categories = await db.category.findMany({
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ success: true, products, categories });
  } catch (error) {
    console.error("Failed to fetch admin products:", error);
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
      name,
      description,
      shortDescription,
      categoryId,
      status = ProductStatus.DRAFT,
      isFeatured = false,
      themeColor = "spartan-red",
      gallery = [],
      seoTitle,
      seoDescription,
      seoKeywords,
      variants = [],
    } = body;

    if (!name || !categoryId) {
      return NextResponse.json({ error: "Product name and category are required." }, { status: 400 });
    }

    const slug = slugify(name, { lower: true, strict: true });

    // Validate category exists
    const category = await db.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return NextResponse.json({ error: "Selected category does not exist." }, { status: 400 });
    }

    // Create product and variants in transaction
    const newProduct = await db.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          name,
          slug,
          description,
          shortDescription,
          categoryId,
          status: status as ProductStatus,
          isFeatured,
          themeColor,
          gallery,
          seoTitle: seoTitle || name,
          seoDescription: seoDescription || shortDescription,
          seoKeywords,
        },
      });

      if (variants && variants.length > 0) {
        await tx.productVariant.createMany({
          data: variants.map((v: any, idx: number) => ({
            productId: product.id,
            name: v.name || `${v.flavor} - ${v.size}`,
            flavor: v.flavor || null,
            size: v.size || null,
            mrp: Number(v.mrp),
            salePrice: Number(v.salePrice),
            stock: Number(v.stock || 0),
            isDefault: idx === 0, // Make the first variant default
            isActive: true,
          })),
        });
      }

      return product;
    });

    return NextResponse.json({ success: true, product: newProduct });
  } catch (error: any) {
    console.error("Failed to create product:", error);
    if (error.code === "P2002") {
      return NextResponse.json({ error: "A product with a similar name or slug already exists." }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create product. Internal error." }, { status: 500 });
  }
}
