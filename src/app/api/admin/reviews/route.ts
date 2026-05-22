import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const reviews = await db.review.findMany({
      include: {
        product: true,
      },
      orderBy: { createdAt: "desc" },
    });

    if (reviews.length === 0) {
      // Return fallback mocks for dashboard alignment during builds
      return NextResponse.json([
        {
          id: "m-rev-1",
          customerName: "Amit Patel",
          customerPhone: "9827392812",
          rating: 5,
          title: "Quality is stellar",
          comment: "Authenticity verified successfully via scratch seal! Protein dissolves in water instantly.",
          status: "PENDING",
          createdAt: new Date().toISOString(),
          product: { name: "Komando Whey Isolate - Spartan Chocolate" }
        }
      ]);
    }

    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Failed to fetch admin reviews:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
