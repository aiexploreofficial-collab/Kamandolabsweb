import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { ReviewStatus } from "@prisma/client";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    // 1. Auth check
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const body = await request.json();
    const { status } = body;

    if (!status || !Object.values(ReviewStatus).includes(status)) {
      return NextResponse.json({ error: "Invalid review status" }, { status: 400 });
    }

    // 2. Fetch original review details
    const review = await db.review.findUnique({
      where: { id },
    });

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    // 3. Update review status
    const updatedReview = await db.review.update({
      where: { id },
      data: { status },
    });

    // 4. Recalculate average rating for product if status has changed to/from APPROVED
    if (status === ReviewStatus.APPROVED || review.status === ReviewStatus.APPROVED) {
      // Find all approved reviews for this product
      const approvedReviews = await db.review.findMany({
        where: {
          productId: review.productId,
          status: ReviewStatus.APPROVED,
        },
      });

      const totalReviews = approvedReviews.length;
      const avgRating =
        totalReviews > 0
          ? approvedReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
          : 0;

      // Update product rating caches
      await db.product.update({
        where: { id: review.productId },
        data: {
          avgRating: Number(avgRating.toFixed(2)),
          totalReviews,
        },
      });
    }

    return NextResponse.json({ success: true, review: updatedReview });
  } catch (error) {
    console.error("Failed to moderate review:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const review = await db.review.findUnique({
      where: { id },
    });

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    // Hard delete
    await db.review.delete({
      where: { id },
    });

    // Recalculate averages if the deleted review was APPROVED
    if (review.status === ReviewStatus.APPROVED) {
      const approvedReviews = await db.review.findMany({
        where: {
          productId: review.productId,
          status: ReviewStatus.APPROVED,
        },
      });

      const totalReviews = approvedReviews.length;
      const avgRating =
        totalReviews > 0
          ? approvedReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
          : 0;

      await db.product.update({
        where: { id: review.productId },
        data: {
          avgRating: Number(avgRating.toFixed(2)),
          totalReviews,
        },
      });
    }

    return NextResponse.json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    console.error("Failed to delete review:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
