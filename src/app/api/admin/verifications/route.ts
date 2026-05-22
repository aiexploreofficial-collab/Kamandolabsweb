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

    // Get recent attempts
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
      take: 20,
    });

    // Get count of codes
    const codeCounts = await db.verificationCode.groupBy({
      by: ["isUsed"],
      _count: {
        _all: true,
      },
    });

    return NextResponse.json({
      success: true,
      attempts,
      counts: codeCounts,
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
    const { variantId, count = 10, batchName } = body;

    if (!variantId || count <= 0 || count > 500) {
      return NextResponse.json(
        { error: "Variant ID and valid count (1 - 500) are required." },
        { status: 400 }
      );
    }

    // Verify variant exists
    const variant = await db.productVariant.findUnique({
      where: { id: variantId },
    });

    if (!variant) {
      return NextResponse.json({ error: "Variant not found" }, { status: 404 });
    }

    const batchCodes: { plain: string; hash: string }[] = [];

    // Generate codes & hashes
    for (let i = 0; i < count; i++) {
      const plainCode = generateScratchCode(12);
      const hashed = await hashScratchCode(plainCode);
      batchCodes.push({ plain: plainCode, hash: hashed });
    }

    // Bulk insert into database
    await db.verificationCode.createMany({
      data: batchCodes.map((bc) => ({
        codeHash: bc.hash,
        productVariantId: variantId,
        batch: batchName || `BATCH-${Date.now()}`,
        isUsed: false,
      })),
      skipDuplicates: true, // Safeguard duplicate hashes
    });

    // Return the PLAIN codes so the administrator can copy/download them immediately
    return NextResponse.json({
      success: true,
      batch: batchName,
      count: batchCodes.length,
      plainCodes: batchCodes.map((bc) => bc.plain),
    });

  } catch (error) {
    console.error("Failed to generate scratch codes:", error);
    return NextResponse.json({ error: "Failed to generate scratch codes" }, { status: 500 });
  }
}
