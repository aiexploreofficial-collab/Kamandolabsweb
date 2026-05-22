"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ProductCard from "@/components/product-card";
import { motion } from "framer-motion";
import { SlidersHorizontal, ArrowUpDown } from "lucide-react";

export default function CategoryProductsPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("featured"); // "featured" | "price-asc" | "price-desc" | "rating"

  // Title formatting helper
  const categoryTitle = slug
    ? slug
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ")
    : "Category";

  useEffect(() => {
    async function loadCategoryProducts() {
      if (!slug) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/products?category=${slug}`);
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (err) {
        console.error("Failed to load products for category:", err);
      } finally {
        setLoading(false);
      }
    }
    loadCategoryProducts();
  }, [slug]);

  const sortedProducts = [...products].sort((a, b) => {
    const aPrice = a.variants?.[0]?.salePrice || 0;
    const bPrice = b.variants?.[0]?.salePrice || 0;
    const aRating = parseFloat(a.avgRating) || 0;
    const bRating = parseFloat(b.avgRating) || 0;

    if (sortBy === "price-asc") return aPrice - bPrice;
    if (sortBy === "price-desc") return bPrice - aPrice;
    if (sortBy === "rating") return bRating - aRating;
    return 0; // featured
  });

  return (
    <div className="bg-[#0A0A0A] text-white min-h-screen flex flex-col justify-between">
      <Navbar />

      <div className="flex-1">
        {/* Banner Section */}
        <section className="relative pt-28 pb-16 bg-[#0A0A0A] border-b border-neutral-800 overflow-hidden">
          <div className="container-main relative z-10 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-display font-black tracking-tight uppercase italic"
            >
              Category: <span className="text-red-500">{categoryTitle}</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-neutral-400 mt-4 text-xs md:text-sm max-w-lg mx-auto uppercase tracking-wider leading-relaxed"
            >
              Premium formulas engineered specifically to conquer your {categoryTitle.toLowerCase()} goals. Clean, lab-certified, results-driven.
            </motion.p>
          </div>
        </section>

        {/* Toolbar & Grid Section */}
        <main className="container-main py-12">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-neutral-800">
            <div className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-2">
              <span>{products.length} Products Available</span>
            </div>

            {/* Sort Select */}
            <div className="flex items-center gap-3">
              <span className="text-neutral-500 text-xs font-semibold uppercase tracking-wider flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5" /> Sort
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#111111] border border-neutral-800 hover:border-neutral-700 rounded-none px-4 py-2.5 text-xs text-neutral-300 font-bold outline-none cursor-pointer transition-colors"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {/* Grid list */}
          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center gap-4">
              <div className="w-10 h-10 border-3 border-red-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-neutral-500 text-xs uppercase tracking-wider">Loading {categoryTitle}...</p>
            </div>
          ) : sortedProducts.length === 0 ? (
            <div className="py-24 text-center border border-dashed border-neutral-800 rounded-none">
              <SlidersHorizontal className="w-10 h-10 text-neutral-600 mx-auto mb-4" />
              <h3 className="text-sm font-bold uppercase tracking-wider">No Products Found</h3>
              <p className="text-neutral-500 mt-2 text-xs uppercase tracking-wider">We are currently loading fresh batches of supplements in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedProducts.map((product, idx) => (
                <ProductCard key={product.id} product={product} index={idx} />
              ))}
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}
