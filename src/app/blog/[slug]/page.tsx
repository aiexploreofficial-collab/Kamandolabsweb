"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Calendar, Clock, ArrowLeft, User, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBlog() {
      if (!slug) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/blogs?slug=${slug}`);
        if (res.ok) {
          const data = await res.json();
          setBlog(data);
        } else {
          router.push("/blog");
        }
      } catch (err) {
        console.error(err);
        router.push("/blog");
      } finally {
        setLoading(false);
      }
    }
    loadBlog();
  }, [slug, router]);

  if (loading) {
    return (
      <div className="bg-[#0A0A0A] text-white min-h-screen flex flex-col justify-between">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 py-32">
          <div className="w-10 h-10 border-3 border-red-600 border-t-transparent rounded-none animate-spin" />
          <p className="text-neutral-500 text-sm tracking-wide uppercase italic">Retrieving article...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!blog) return null;

  const tagsArr = Array.isArray(blog.tags)
    ? blog.tags
    : JSON.parse(blog.tags || "[]");

  return (
    <div className="bg-[#0A0A0A] text-white min-h-screen flex flex-col">
      <Navbar />

      <main className="container-main pt-28 pb-16 flex-1 max-w-4xl mx-auto w-full">
        {/* Back Link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4 text-red-500" /> Back to Intel
        </Link>

        {/* Article header info */}
        <header className="mb-10 pb-8 border-b border-white/[0.04]">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {tagsArr.map((tag: string) => (
              <span
                key={tag}
                className="text-[9px] font-extrabold uppercase tracking-widest text-red-500 bg-red-600/10 border border-red-500/20 px-2 py-0.5 rounded-none"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="font-display font-black text-3xl md:text-5xl text-white tracking-tight leading-tight mb-6 uppercase italic">
            {blog.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-xs text-neutral-400 font-medium">
            <span className="flex items-center gap-1.5 text-white">
              <User className="w-4 h-4 text-red-500" /> By {blog.authorName}
            </span>
            
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-neutral-500" />
              {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>

            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-neutral-500" />
              {blog.readingTime} minute read
            </span>
          </div>
        </header>

        {/* Cover visual placeholder */}
        <div className="w-full aspect-video rounded-none bg-neutral-950 border border-white/[0.04] flex items-center justify-center mb-12 relative overflow-hidden">
          <BookOpen className="w-16 h-16 text-neutral-900" />
        </div>

        {/* Content body */}
        <article className="prose prose-invert max-w-none text-neutral-300 text-sm md:text-base leading-relaxed flex flex-col gap-6">
          <p className="font-semibold text-white text-base md:text-lg border-l-2 border-red-600 pl-4 py-1.5 my-2">
            {blog.excerpt}
          </p>
          <div className="whitespace-pre-line text-neutral-300">
            {blog.content}
          </div>
        </article>

        {/* AI Disclaimer */}
        {blog.isAiGenerated && (
          <div className="mt-16 p-4 bg-white/[0.01] border border-white/[0.03] rounded-none text-[10px] text-neutral-500 font-bold uppercase tracking-wider text-center">
            💡 AI Research Assistant Formulation
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
