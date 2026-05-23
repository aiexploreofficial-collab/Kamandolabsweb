import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { BlogStatus } from "@prisma/client";
import slugify from "slugify";


export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const blogs = await db.blog.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(blogs);
  } catch (error) {
    console.error("Failed to fetch admin blogs:", error);
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
      title,
      content,
      excerpt,
      coverImage,
      tags = [],
      status = BlogStatus.DRAFT,
      isAiGenerated = false,
      aiPrompt = "",
    } = body;

    const authorId = session.user.id;
    const authorName = session.user.name || "Admin";

    let finalTitle = title;
    let finalContent = content;
    let finalExcerpt = excerpt;
    let finalTags = tags;
    let finalReadingTime = 4;

    if (isAiGenerated) {
      if (!aiPrompt) {
        return NextResponse.json({ error: "AI prompt is required for generation." }, { status: 400 });
      }

      if (!process.env.GEMINI_API_KEY) {
         return NextResponse.json({ error: "GEMINI_API_KEY is not configured on the server." }, { status: 500 });
      }

      const prompt = `You are an expert fitness copywriter and sports nutritionist for 'Komando Labs'.
Write a high-quality, scientifically accurate blog article based on the following request: "${aiPrompt}".
Do NOT use markdown backticks in your response. Return ONLY a pure JSON object matching this exact schema:
{
  "title": "A catchy, bold, SEO-friendly title",
  "excerpt": "A short 2-sentence summary",
  "content": "The full blog content in plain text with paragraphs separated by double newlines. Make it detailed, professional, and at least 300 words.",
  "tags": ["Tag1", "Tag2", "Tag3"],
  "readingTime": 5
}`;

      try {
        const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              responseMimeType: "application/json",
            }
          })
        });

        if (!geminiRes.ok) {
           throw new Error("Failed to fetch from Gemini API");
        }

        const jsonResp = await geminiRes.json();
        const aiText = jsonResp.candidates[0].content.parts[0].text;
        const generatedData = JSON.parse(aiText);

        finalTitle = generatedData.title;
        finalContent = generatedData.content;
        finalExcerpt = generatedData.excerpt;
        finalTags = generatedData.tags;
        finalReadingTime = generatedData.readingTime || 4;

      } catch (err) {
        console.error("AI Generation Error:", err);
        return NextResponse.json({ error: "AI Generation failed. Please try again." }, { status: 500 });
      }
    }

    if (!finalTitle || !finalContent) {
      return NextResponse.json({ error: "Title and content are required." }, { status: 400 });
    }

    const slug = slugify(finalTitle.replace("AI: ", ""), { lower: true, strict: true }) + (isAiGenerated ? `-${Date.now().toString().slice(-4)}` : "");

    const newBlog = await db.blog.create({
      data: {
        title: finalTitle,
        slug,
        content: finalContent,
        excerpt: finalExcerpt,
        coverImage: coverImage || "/images/blog/blog-placeholder.jpg",
        status: status as BlogStatus,
        isAiGenerated,
        aiPrompt: isAiGenerated ? aiPrompt : null,
        authorId,
        authorName,
        tags: finalTags,
        readingTime: finalReadingTime,
        publishedAt: status === BlogStatus.PUBLISHED ? new Date() : null,
        seoTitle: finalTitle,
        seoDescription: finalExcerpt,
      },
    });

    return NextResponse.json({ success: true, blog: newBlog });
  } catch (error) {
    console.error("Failed to create blog:", error);
    return NextResponse.json({ error: "Failed to create blog post." }, { status: 500 });
  }
}
