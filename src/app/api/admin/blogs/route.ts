import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { BlogStatus } from "@prisma/client";
import slugify from "slugify";

// Pre-defined high-quality articles for the AI simulation to look incredibly realistic
const PRESETS = [
  {
    keywords: ["creatine", "loading", "kidney", "hydration"],
    title: "The Ultimate Creatine Guide: Science, Dosages, and Facts",
    excerpt: "Everything you need to know about the most researched strength supplement. Loading phases, cellular hydration, and debunking health concerns.",
    content: "Creatine monohydrate is undisputed as the king of strength supplements. In this comprehensive guide, we dissect the biological mechanisms that make creatine so powerful. At a cellular level, creatine increases phosphocreatine stores, which directly accelerates ATP (adenosine triphosphate) resynthesis during high-intensity training. This means more power, more explosive reps, and faster recovery between sets. A major myth surrounding creatine is water retention. Creatine indeed causes cellular hydration by drawing water into the muscle cell itself, which is a key stimulus for protein synthesis and muscle hypertrophy. We detail the loading protocol (20g/day for 5 days) versus the daily maintenance dose (5g/day). Make informed choices based on peer-reviewed clinical studies.",
    tags: ["Creatine", "Performance", "Science"],
    readingTime: 5,
  },
  {
    keywords: ["whey", "isolate", "protein", "recovery", "anabolic"],
    title: "Whey Isolate vs. Concentrate: The Biochemistry of Recovery",
    excerpt: "A deep dive into cross-flow microfiltration, lactose tolerances, and amino acid absorption rates for serious lifters.",
    content: "When it comes to post-workout nutrition, speed of absorption is critical. Whey protein isolate represents the pinnacle of refinement. Produced using cold-temperature cross-flow microfiltration, the whey is isolated from fats, cholesterol, and lactose. What remains is a pure protein concentration exceeding 90%. Whey isolate is rich in branched-chain amino acids (BCAAs), particularly Leucine, which triggers the mTOR anabolic signaling pathway for muscle protein synthesis. Because it is pre-filtered, it digest rapidly with zero bloating, delivering vital aminos to damaged muscle fibers within 30 minutes of consumption. Compare this to standard concentrate, which contains higher fats and lactose. Choose whey isolate to command your recovery phase.",
    tags: ["Protein", "Recovery", "Nutrition"],
    readingTime: 4,
  },
  {
    keywords: ["pre-workout", "focus", "caffeine", "pump", "beta-alanine"],
    title: "Shattering Plateaus: The Science Behind Pre-Workout Synergies",
    excerpt: "How L-Citrulline, Beta-Alanine, and caffeine coordinate in the blood stream to elevate athletic thresholds.",
    content: "A premium pre-workout is more than just a mega-dose of caffeine. It is a precise formulation of synergistic ingredients. L-Citrulline acts as a direct precursor to nitric oxide, causing vasodilation—which dilates blood vessels, increases oxygen transport, and yields skin-tearing pumps. Beta-Alanine binds with histidine to form carnosine, a powerful intramuscular acid buffer that delays paresthesia and muscle fatigue during high-rep protocols. Finally, caffeine anhydrous and L-Tyrosine cross the blood-brain barrier to optimize cognitive focus and drive central nervous system stimulation. By combining these key pathways, you unlock maximum athletic output and crush plateau limits.",
    tags: ["Pre-Workout", "Endurance", "Ingredients"],
    readingTime: 6,
  }
];

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

      // Simulation of AI generation based on prompt keywords matching
      const promptLower = aiPrompt.toLowerCase();
      const match = PRESETS.find((p) =>
        p.keywords.some((keyword) => promptLower.includes(keyword))
      ) || PRESETS[0]; // fallback to creatine

      finalTitle = `AI: ${match.title}`;
      finalContent = `[Generated by Komando AI Writer]\n\n${match.content}\n\n*Optimized for ${match.tags.join(", ")}.*`;
      finalExcerpt = match.excerpt;
      finalTags = match.tags;
      finalReadingTime = match.readingTime;
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
