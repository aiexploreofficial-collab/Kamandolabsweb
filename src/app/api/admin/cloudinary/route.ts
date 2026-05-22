import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { uploadImageBuffer, deleteImage } from "@/lib/cloudinary";

export async function POST(request: Request) {
  try {
    // Authenticate user
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    // Parse form data file
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert file to Node buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary under folder
    const result = await uploadImageBuffer(buffer, "komando-labs/products");

    return NextResponse.json({
      success: true,
      url: result.url,
      public_id: result.public_id,
      alt: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ") || "product image",
    });
  } catch (error: any) {
    console.error("Cloudinary upload API error:", error);
    return NextResponse.json({ error: error.message || "Failed to upload image" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    // Authenticate user
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    // Parse URL parameter for public_id
    const { searchParams } = new URL(request.url);
    const publicId = searchParams.get("public_id");

    if (!publicId) {
      return NextResponse.json({ error: "Missing public_id parameter" }, { status: 400 });
    }

    // Delete image from Cloudinary
    const success = await deleteImage(publicId);

    if (!success) {
      return NextResponse.json({ error: "Failed to delete asset from Cloudinary" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Cloudinary delete API error:", error);
    return NextResponse.json({ error: error.message || "Failed to delete image" }, { status: 500 });
  }
}
