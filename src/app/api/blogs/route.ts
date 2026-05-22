import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { BlogStatus } from "@prisma/client";

const MOCK_BLOGS = [
  {
    id: "blog-1",
    title: "The Science of Fast-Absorbing Whey Isolate",
    slug: "science-fast-absorbing-whey-isolate",
    excerpt: "Discover the biochemistry of muscle recovery and why microfiltered whey protein isolate delivers superior protein synthesis rates compared to concentrate.",
    content: "Protein is the building block of muscle. But not all proteins are created equal. In this guide, we dive deep into the microfiltration process that isolates pure whey from fats and lactose, leaving a fast-absorbing, muscle-rebuilding powerhouse. Athletes require rapid amino acid delivery following intense training sessions. By consuming whey isolate, you initiate protein synthesis at an accelerated rate, repairing muscle microtears and stimulating hypertrophic growth. Studies show that cold-filtered isolate maintains vital immunoglobulins while providing an exceptionally clean protein density of over 90%. Learn how to optimize your dosage and timing to command your strength.",
    tags: ["Protein", "Muscle Recovery", "Science"],
    readingTime: 4,
    authorName: "Dr. Anil Sharma",
    createdAt: "2026-05-18T10:00:00Z",
    publishedAt: "2026-05-18T10:00:00Z",
  },
  {
    id: "blog-2",
    title: "Creatine Monohydrate: Debunking the Myth",
    slug: "creatine-monohydrate-debunking-the-myth",
    excerpt: "Water retention, bloating, and dosage strategies. Let's separate peer-reviewed athletic facts from locker room pseudoscience.",
    content: "Creatine monohydrate is the most researched sports supplement on the planet. Yet, it remains shrouded in misconceptions. A common myth is that creatine causes subcutaneous water retention, making you look bloated or soft. In reality, creatine triggers cellular hydration, pulling water into the muscle cell itself, which increases cell volume and promotes protein synthesis. This intramuscular hydration is essential for explosive muscle power, ATP regeneration, and cell volumization. We break down the clinical evidence behind loading phases versus steady daily consumption of 3-5g micronized creatine. Fuel your workouts with pure scientific consensus.",
    tags: ["Creatine", "Performance", "Myths"],
    readingTime: 5,
    authorName: "Coach Vikram",
    createdAt: "2026-05-19T14:30:00Z",
    publishedAt: "2026-05-19T14:30:00Z",
  },
  {
    id: "blog-3",
    title: "Pre-Workout Formulation: Beta-Alanine Explained",
    slug: "pre-workout-formulation-beta-alanine-explained",
    excerpt: "What is the tingle effect? Understanding carnosine buffering, L-Citrulline blood flows, and pre-workout dosages.",
    content: "We've all felt the paresthesia—that distinct skin tingle—after drinking a high-performance pre-workout. That sensation is caused by Beta-Alanine, a vital amino acid that synthesizes carnosine in your muscles. Carnosine acts as an acid buffer, delaying muscle fatigue by neutralizing hydrogen ions produced during high-intensity lifting. Combined with L-Citrulline for enhanced nitric oxide production, a clinical dose of Beta-Alanine will unlock skin-tearing pumps and massive endurance spikes. Here is the science of why Komando Pre-Workout V10 uses a clinical dose to supercharge your training output.",
    tags: ["Pre-workout", "Endurance", "Ingredients"],
    readingTime: 6,
    authorName: "Dr. Anil Sharma",
    createdAt: "2026-05-20T08:15:00Z",
    publishedAt: "2026-05-20T08:15:00Z",
  }
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tag = searchParams.get("tag");
  const slug = searchParams.get("slug");

  try {
    // If querying single blog details via search params
    if (slug) {
      const blog = await db.blog.findUnique({
        where: { slug },
      });

      if (!blog) {
        const mock = MOCK_BLOGS.find((b) => b.slug === slug);
        if (mock) return NextResponse.json(mock);
        return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
      }

      return NextResponse.json(blog);
    }

    // Default: Fetch all published blogs
    const blogs = await db.blog.findMany({
      where: { status: BlogStatus.PUBLISHED },
      orderBy: { publishedAt: "desc" },
    });

    if (blogs.length === 0) {
      let filtered = [...MOCK_BLOGS];
      if (tag) {
        filtered = filtered.filter((b) => b.tags.includes(tag));
      }
      return NextResponse.json(filtered);
    }

    let result = blogs;
    if (tag) {
      // Filter JSON arrays locally
      result = blogs.filter((b: any) => {
        const tagsArr = Array.isArray(b.tags) ? b.tags : JSON.parse(b.tags || "[]");
        return tagsArr.includes(tag);
      });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("API error fetching blogs:", error);
    // Fallback
    let filtered = [...MOCK_BLOGS];
    if (tag) {
      filtered = filtered.filter((b) => b.tags.includes(tag));
    }
    return NextResponse.json(filtered);
  }
}
