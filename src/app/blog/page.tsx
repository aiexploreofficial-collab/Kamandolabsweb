"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { motion } from "framer-motion";
import { BookOpen, Calendar, Clock, ArrowRight, User } from "lucide-react";
import Image from "next/image";

export default function BlogListingPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("");

  useEffect(() => {
    async function loadBlogs() {
      setLoading(true);
      try {
        let url = "/api/blogs";
        if (selectedTag) url += `?tag=${selectedTag}`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setBlogs(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadBlogs();
  }, [selectedTag]);

  const filteredBlogs = blogs.filter((blog) => {
    const titleMatch = blog.title.toLowerCase().includes(searchQuery.toLowerCase());
    const excerptMatch = blog.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    return titleMatch || excerptMatch;
  });

  // Extract all unique tags
  const allTags = Array.from(
    new Set(
      blogs.flatMap((blog) => {
        try {
          return Array.isArray(blog.tags) ? blog.tags : JSON.parse(blog.tags || "[]");
        } catch {
          return [];
        }
      })
    )
  );

  return (
    <div className="bg-[#0A0A0A] text-white min-h-screen flex flex-col">
      <Navbar />

      {/* Header Banner */}
      <section className="relative pt-28 pb-16 bg-[#0A0A0A] border-b border-neutral-800">
        <div className="container-main relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-display font-black tracking-tight uppercase italic"
          >
            THE KOMANDO <span className="text-red-650">INTEL</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-neutral-400 mt-4 text-xs md:text-sm max-w-md mx-auto"
          >
            Science-backed nutrition guides, workout optimization, and supplement facts. No fluff, just pure performance statistics.
          </motion.p>
        </div>
      </section>

      <main className="container-main py-12 flex-1">
        {/* Search & Tags row */}
        <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center mb-12 pb-6 border-b border-neutral-800">
          {/* Search box */}
          <div className="w-full md:max-w-xs">
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#161616] border border-neutral-800 focus:border-red-650 rounded-none px-4 py-2.5 text-xs text-white outline-none transition-all"
            />
          </div>

          {/* Tags list */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTag("")}
              className={`px-3.5 py-2 text-xs font-bold rounded-none uppercase tracking-wider transition-all border ${
                !selectedTag
                  ? "bg-red-600 text-white border-red-600"
                  : "text-neutral-400 hover:text-white bg-neutral-900 border-neutral-800"
              }`}
            >
              All Topics
            </button>
            {allTags.map((tag: any) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3.5 py-2 text-xs font-bold rounded-none uppercase tracking-wider transition-all border ${
                  selectedTag === tag
                    ? "bg-red-600 text-white border-red-600"
                    : "text-neutral-400 hover:text-white bg-neutral-900 border-neutral-800"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Blogs grid */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-4">
            <div className="w-10 h-10 border-3 border-red-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-neutral-500 text-xs tracking-wide">Syncing research library...</p>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="py-24 text-center border border-dashed border-neutral-800 bg-[#111111] rounded-none">
            <BookOpen className="w-10 h-10 text-neutral-600 mx-auto mb-4" />
            <h3 className="text-base font-bold uppercase italic">No Articles Found</h3>
            <p className="text-neutral-400 mt-2 text-xs">Try widening your filters or keywords search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((blog, idx) => {
              const tagsArr = Array.isArray(blog.tags)
                ? blog.tags
                : JSON.parse(blog.tags || "[]");

              return (
                <motion.article
                  key={blog.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="group flex flex-col bg-[#111111] border border-neutral-800 hover:border-red-600 rounded-none p-5 justify-between transition-all duration-300 hover:bg-[#141414]"
                >
                  <div>
                    {/* Visual container */}
                    <div className="aspect-video w-full rounded-none bg-[#161616] flex items-center justify-center border border-neutral-800 mb-5 overflow-hidden relative">
                      <Image
                        src={blog.image && (blog.image.startsWith("/") || blog.image.startsWith("http")) ? blog.image : "/images/placeholders/blog-placeholder.png"}
                        alt={blog.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center gap-4 text-[10px] text-neutral-450 font-bold uppercase tracking-wider mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {blog.readingTime} min read
                      </span>
                    </div>

                    <Link href={`/blog/${blog.slug}`}>
                      <h2 className="font-display font-bold text-lg text-white group-hover:text-red-600 transition-colors leading-snug mb-3 uppercase italic">
                        {blog.title}
                      </h2>
                    </Link>

                    <p className="text-xs text-neutral-400 line-clamp-3 leading-relaxed mb-6">
                      {blog.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs text-neutral-400 font-medium">
                      <User className="w-3.5 h-3.5 text-red-600" /> {blog.authorName}
                    </span>

                    <Link
                      href={`/blog/${blog.slug}`}
                      className="text-xs font-bold text-red-600 hover:text-red-555 flex items-center gap-1 group-hover:translate-x-0.5 transition-all"
                    >
                      Read Guide <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
