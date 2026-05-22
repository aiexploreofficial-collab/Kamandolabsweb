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

    // 1. Fetch code hash record
    const verCode = await db.verificationCode.findUnique({
      where: { codeHash },
      include: {
        productVariant: {
          include: { product: true },
        },
      },
    });

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

    // Case B: Already Used Code
    if (verCode.isUsed) {
      // Allow the original verifier to view details without error
      if (verCode.verifiedPhone === cleanPhone) {
        return NextResponse.json({
          status: "VALID_ALREADY_VERIFIED_BY_YOU",
          productName: verCode.productVariant.product.name,
          variantName: verCode.productVariant.name,
          batch: verCode.batch,
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

      // Highlight security warning
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
      // Mark code as used
      await tx.verificationCode.update({
        where: { id: verCode.id },
        data: {
          isUsed: true,
          verifiedAt: new Date(),
          verifiedPhone: cleanPhone,
        },
      });

      // Log attempt
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
      productName: verCode.productVariant.product.name,
      variantName: verCode.productVariant.name,
      batch: verCode.batch,
      message: "Congratulations! Your Komando Labs product is 100% authentic and certified by our quality laboratories. Fuel your performance with total peace of mind.",
    });

  } catch (error) {
    console.error("Verification processing failed:", error);
    return NextResponse.json({ error: "Failed to process authenticity verification." }, { status: 500 });
  }
}
