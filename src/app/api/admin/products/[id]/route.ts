import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { ProductStatus } from "@prisma/client";
import slugify from "slugify";
import { deleteImage } from "@/lib/cloudinary";

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

    const product = await db.product.findUnique({
      where: { id },
      include: {
        variants: true,
        category: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Failed to fetch admin product details:", error);
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
      name,
      description,
      shortDescription,
      categoryId,
      status,
      isFeatured,
      themeColor,
      gallery,
      seoTitle,
      seoDescription,
      seoKeywords,
      variants = [],
    } = body;

    const product = await db.product.findUnique({
      where: { id },
      include: { variants: true },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const slug = name ? slugify(name, { lower: true, strict: true }) : product.slug;

    const updated = await db.$transaction(async (tx) => {
      // 1. Update product base fields
      const p = await tx.product.update({
        where: { id },
        data: {
          name: name ?? product.name,
          slug,
          description: description ?? product.description,
          shortDescription: shortDescription ?? product.shortDescription,
          categoryId: categoryId ?? product.categoryId,
          status: (status as ProductStatus) ?? product.status,
          isFeatured: isFeatured ?? product.isFeatured,
          themeColor: themeColor ?? product.themeColor,
          gallery: gallery ?? product.gallery,
          seoTitle: seoTitle ?? product.seoTitle,
          seoDescription: seoDescription ?? product.seoDescription,
          seoKeywords: seoKeywords ?? product.seoKeywords,
        },
      });

      // 2. Sync variants
      if (variants && variants.length > 0) {
        const incomingIds = variants.map((v: any) => v.id).filter(Boolean);

        // Deactivate variants not in incoming list
        await tx.productVariant.updateMany({
          where: {
            productId: id,
            id: { notIn: incomingIds },
          },
          data: { isActive: false },
        });

        // Insert or update incoming variants
        for (let idx = 0; idx < variants.length; idx++) {
          const v = variants[idx];
          const variantData = {
            name: v.name || `${v.flavor} - ${v.size}`,
            flavor: v.flavor || null,
            size: v.size || null,
            mrp: Number(v.mrp),
            salePrice: Number(v.salePrice),
            stock: Number(v.stock || 0),
            isDefault: idx === 0, // Make first variant default
            isActive: true,
          };

          if (v.id) {
            // Update existing
            await tx.productVariant.update({
              where: { id: v.id },
              data: variantData,
            });
          } else {
            // Create new
            await tx.productVariant.create({
              data: {
                ...variantData,
                productId: id,
              },
            });
          }
        }
      }

      return p;
    });

    return NextResponse.json({ success: true, product: updated });
  } catch (error: any) {
    console.error("Failed to update product:", error);
    if (error.code === "P2002") {
      return NextResponse.json({ error: "A product with a similar name/slug already exists." }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update product." }, { status: 500 });
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

    // Retrieve product to check gallery for Cloudinary assets
    const product = await db.product.findUnique({
      where: { id },
      select: { gallery: true },
    });

    if (product?.gallery) {
      const gallery = Array.isArray(product.gallery)
        ? product.gallery
        : typeof product.gallery === "string"
        ? (() => {
            try {
              return JSON.parse(product.gallery);
            } catch (e) {
              return [];
            }
          })()
        : [];

      for (const item of gallery) {
        if (item && typeof item === "object" && (item as any).public_id) {
          try {
            await deleteImage((item as any).public_id);
          } catch (err) {
            console.error(`Failed to delete Cloudinary asset: ${(item as any).public_id}`, err);
          }
        }
      }
    }

    // Hard delete product as per instructions for content models
    await db.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete product:", error);
    return NextResponse.json(
      { error: "Cannot delete this product. It may be linked to customer orders." },
      { status: 500 }
    );
  }
}
