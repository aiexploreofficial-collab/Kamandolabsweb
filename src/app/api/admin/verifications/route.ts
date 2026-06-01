import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { generateScratchCode, hashScratchCode } from "@/lib/utils";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    // Get recent attempts — handle both legacy (productVariant) and new (manual) codes
    const attempts = await db.verificationAttemptLog.findMany({
      include: {
        verificationCode: {
          include: {
            productVariant: {
              include: { product: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    // Get count of codes
    const codeCounts = await db.verificationCode.groupBy({
      by: ["isUsed"],
      _count: { _all: true },
    });

    // Get all codes with product details for the codes table
    const allCodes = await db.verificationCode.findMany({
      include: {
        productVariant: {
          include: { product: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 200,
    });

    return NextResponse.json({
      success: true,
      attempts,
      counts: codeCounts,
      allCodes,
    });
  } catch (error) {
    console.error("Failed to fetch admin verification logs:", error);
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
      // New manual entry fields
      productName,
      flavour,
      size,
      batchCode,
      count = 10,
      // Legacy field for backward compat (keep working)
      variantId,
      batchName,
    } = body;

    // Validation: either manual fields OR legacy variantId
    if (variantId) {
      // === LEGACY MODE: Variant-based ===
      if (count <= 0 || count > 500) {
        return NextResponse.json(
          { error: "Valid count (1–500) is required." },
          { status: 400 }
        );
      }
      const variant = await db.productVariant.findUnique({ where: { id: variantId } });
      if (!variant) {
        return NextResponse.json({ error: "Variant not found" }, { status: 404 });
      }

      const batchCodes: { plain: string; hash: string }[] = [];
      for (let i = 0; i < count; i++) {
        const plainCode = generateScratchCode(12);
        const hashed = await hashScratchCode(plainCode);
        batchCodes.push({ plain: plainCode, hash: hashed });
      }

      await db.verificationCode.createMany({
        data: batchCodes.map((bc) => ({
          codeHash: bc.hash,
          productVariantId: variantId,
          batch: batchName || `BATCH-${Date.now()}`,
          isUsed: false,
        })),
        skipDuplicates: true,
      });

      return NextResponse.json({
        success: true,
        batch: batchName,
        count: batchCodes.length,
        plainCodes: batchCodes.map((bc) => bc.plain),
      });
    }

    // === NEW MANUAL MODE ===
    if (!productName || !size) {
      return NextResponse.json(
        { error: "Product Name and Size are required." },
        { status: 400 }
      );
    }

    if (count <= 0 || count > 500) {
      return NextResponse.json(
        { error: "Number of codes must be between 1 and 500." },
        { status: 400 }
      );
    }

    const batchCodes: { plain: string; hash: string }[] = [];
    for (let i = 0; i < count; i++) {
      const plainCode = generateScratchCode(12);
      const hashed = await hashScratchCode(plainCode);
      batchCodes.push({ plain: plainCode, hash: hashed });
    }

    await db.verificationCode.createMany({
      data: batchCodes.map((bc) => ({
        codeHash: bc.hash,
        productName: productName.trim(),
        flavour: flavour?.trim() || null,
        size: size.trim(),
        batchCode: batchCode?.trim() || null,
        isUsed: false,
      })),
      skipDuplicates: true,
    });

    return NextResponse.json({
      success: true,
      productName,
      count: batchCodes.length,
      plainCodes: batchCodes.map((bc) => bc.plain),
    });
  } catch (error) {
    console.error("Failed to generate scratch codes:", error);
    return NextResponse.json({ error: "Failed to generate scratch codes" }, { status: 500 });
  }
}
