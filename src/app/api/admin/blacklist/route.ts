import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { BlacklistType } from "@prisma/client";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const blacklist = await db.blacklist.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(blacklist);
  } catch (error) {
    console.error("Failed to fetch blacklist:", error);
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
    const { phone, reason } = body;

    if (!phone) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
    }

    const adminId = session.user.id;

    const blacklistEntry = await db.blacklist.create({
      data: {
        type: BlacklistType.PHONE,
        value: phone,
        reason: reason || "Flagged for checkout abuse/fraud",
        addedBy: adminId,
      },
    });

    return NextResponse.json({ success: true, blacklistEntry });
  } catch (error) {
    console.error("Failed to blacklist phone:", error);
    return NextResponse.json({ error: "Failed to blacklist or phone already exists" }, { status: 500 });
  }
}
