import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { BlogStatus } from "@prisma/client";
import slugify from "slugify";

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

    const blog = await db.blog.findUnique({
      where: { id },
    });

    if (!blog) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }

    return NextResponse.json(blog);
  } catch (error) {
    console.error("Failed to fetch blog details:", error);
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
      title,
      content,
      excerpt,
      coverImage,
      tags,
      status,
      seoTitle,
      seoDescription,
    } = body;

    const blog = await db.blog.findUnique({
      where: { id },
    });

    if (!blog) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }

    const updateData: any = {};
    if (title !== undefined) {
      updateData.title = title;
      updateData.slug = slugify(title.replace("AI: ", ""), { lower: true, strict: true });
    }
    if (content !== undefined) {
      updateData.content = content;
      // Recalculate reading time: roughly 200 words per minute
      const wordCount = content.trim().split(/\s+/).length;
      updateData.readingTime = Math.max(1, Math.ceil(wordCount / 200));
    }
    if (excerpt !== undefined) updateData.excerpt = excerpt;
    if (coverImage !== undefined) updateData.coverImage = coverImage;
    if (tags !== undefined) updateData.tags = tags;
    if (status !== undefined) {
      updateData.status = status as BlogStatus;
      if (status === BlogStatus.PUBLISHED && !blog.publishedAt) {
        updateData.publishedAt = new Date();
      }
    }
    if (seoTitle !== undefined) updateData.seoTitle = seoTitle;
    if (seoDescription !== undefined) updateData.seoDescription = seoDescription;

    const updated = await db.blog.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, blog: updated });
  } catch (error: any) {
    console.error("Failed to update blog:", error);
    if (error.code === "P2002") {
      return NextResponse.json({ error: "A blog with this title already exists." }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update blog post" }, { status: 500 });
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

    // Hard delete blog as content model
    await db.blog.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete blog:", error);
    return NextResponse.json({ error: "Failed to delete blog post." }, { status: 500 });
  }
}
