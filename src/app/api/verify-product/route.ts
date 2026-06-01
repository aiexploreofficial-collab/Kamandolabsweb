import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { VerificationStatus } from "@prisma/client";
import { normalizePhone, hashScratchCode } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, phone } = body;

    if (!code || !phone) {
      return NextResponse.json({ error: "Code and Phone are required." }, { status: 400 });
    }

    const cleanPhone = normalizePhone(phone);
    const codeUpper = code.toUpperCase().trim();

    // Hash the raw code to compare with database hashes
    const codeHash = await hashScratchCode(codeUpper);

    const ipAddress =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const userAgent = request.headers.get("user-agent");

    // 1. Fetch code hash record — include both legacy variant and new manual fields
    const verCode = await db.verificationCode.findUnique({
      where: { codeHash },
      include: {
        productVariant: {
          include: { product: true },
        },
      },
    });

    // Helper: resolve product display info from either legacy or new manual fields
    const resolveProductInfo = (code: typeof verCode) => {
      if (!code) return null;
      if (code.productName) {
        // New manual entry
        return {
          productName: code.productName,
          flavour: code.flavour || null,
          size: code.size || null,
          batchCode: code.batchCode || null,
          variantName: null,
        };
      } else if (code.productVariant) {
        // Legacy variant-linked
        return {
          productName: code.productVariant.product.name,
          flavour: code.productVariant.flavor || null,
          size: code.productVariant.size || null,
          batchCode: code.batch || null,
          variantName: code.productVariant.name,
        };
      }
      return { productName: "Komando Labs Product", flavour: null, size: null, batchCode: null, variantName: null };
    };

    // Case A: Invalid Code
    if (!verCode) {
      await db.verificationAttemptLog.create({
        data: {
          codeInput: codeUpper,
          verificationCodeId: null,
          ipAddress,
          userAgent,
          phone: cleanPhone,
          status: VerificationStatus.INVALID,
        },
      });

      return NextResponse.json(
        {
          status: "INVALID",
          error: "Verification failed. The code entered does not match any genuine Komando Labs product. Please ensure you scratched carefully and typed the correct characters. Beware of counterfeit products!",
        },
        { status: 400 }
      );
    }

    const productInfo = resolveProductInfo(verCode);

    // Case B: Already Used Code
    if (verCode.isUsed) {
      // Allow the original verifier to view details without error
      if (verCode.verifiedPhone === cleanPhone) {
        return NextResponse.json({
          status: "VALID_ALREADY_VERIFIED_BY_YOU",
          ...productInfo,
          verifiedAt: verCode.verifiedAt,
        });
      }

      // Track fraud/tampering event
      await db.verificationAttemptLog.create({
        data: {
          codeInput: codeUpper,
          verificationCodeId: verCode.id,
          ipAddress,
          userAgent,
          phone: cleanPhone,
          status: VerificationStatus.ALREADY_USED,
        },
      });

      return NextResponse.json(
        {
          status: "ALREADY_USED",
          error: `This security code was already verified by phone number XXXXXX${verCode.verifiedPhone?.slice(-4)} on ${verCode.verifiedAt?.toLocaleDateString("en-IN")}. If you just opened this package, please contact support immediately to report a counterfeit check.`,
        },
        { status: 400 }
      );
    }

    // Case C: Fresh Genuine Code Verification
    await db.$transaction(async (tx) => {
      await tx.verificationCode.update({
        where: { id: verCode.id },
        data: {
          isUsed: true,
          verifiedAt: new Date(),
          verifiedPhone: cleanPhone,
        },
      });

      await tx.verificationAttemptLog.create({
        data: {
          codeInput: codeUpper,
          verificationCodeId: verCode.id,
          ipAddress,
          userAgent,
          phone: cleanPhone,
          status: VerificationStatus.VALID,
        },
      });
    });

    return NextResponse.json({
      status: "VALID",
      success: true,
      ...productInfo,
      message: "Congratulations! Your Komando Labs product is 100% authentic and certified by our quality laboratories. Fuel your performance with total peace of mind.",
    });
  } catch (error) {
    console.error("Verification processing failed:", error);
    return NextResponse.json({ error: "Failed to process authenticity verification." }, { status: 500 });
  }
}
