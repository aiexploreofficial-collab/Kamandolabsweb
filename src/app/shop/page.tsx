"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Filter, SlidersHorizontal, ArrowUpDown, ShieldCheck, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";

const CATEGORIES = [
  { name: "All", slug: "" },
  { name: "Mass Gainers", slug: "mass-gainer" },
];

export default function ShopPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("featured"); // "featured" | "price-asc" | "price-desc" | "rating"
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        let url = "/api/products";
        const params: string[] = [];
        if (selectedCategory) params.push(`category=${selectedCategory}`);
        if (params.length > 0) url += "?" + params.join("&");

        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (err) {
        console.error("Error loading products:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [selectedCategory]);

  const sortedProducts = [...products].sort((a, b) => {
    const aPrice = a.variants?.[0]?.salePrice || 0;
    const bPrice = b.variants?.[0]?.salePrice || 0;
    const aMrp = a.variants?.[0]?.mrp || 0;
    const bMrp = b.variants?.[0]?.mrp || 0;
    const aRating = parseFloat(a.avgRating) || 0;
    const bRating = parseFloat(b.avgRating) || 0;

    if (sortBy === "price-asc") return aPrice - bPrice;
    if (sortBy === "price-desc") return bPrice - aPrice;
    if (sortBy === "rating") return bRating - aRating;
    return 0; // Default (featured / order as returned)
  });

  return (
    <div className="bg-[#0A0A0A] text-white min-h-screen flex flex-col relative">
      <Navbar />

      {/* Header Banner */}
      <section className="relative pt-28 pb-16 border-b border-neutral-900 overflow-hidden">
        {/* Premium Visual Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/backgrounds/hero-bg.jpg"
            alt="Gym Texture Header Background"
            fill
            priority
            className="object-cover object-center opacity-60 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-[#0A0A0A]/50 to-[#0A0A0A]" />
        </div>
        
        <div className="container-main relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-display font-black italic tracking-wider uppercase text-white"
          >
            COMMAND YOUR <span className="text-red-650 underline decoration-red-650 decoration-2 underline-offset-4">PERFORMANCE</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-neutral-400 mt-4 text-xs md:text-sm tracking-wider uppercase max-w-xl mx-auto"
          >
            Premium fitness & performance supplements, precision-engineered to fuel your goals. Clean, lab-tested, results-driven.
          </motion.p>
        </div>
      </section>

      {/* Shop Layout */}
      <main className="container-main pt-12 pb-28 md:pb-36 flex-1 min-h-[60vh] relative z-10">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-neutral-850">
          {/* Categories select tabs for desktop */}
          <div className="hidden md:flex items-center gap-1.5 bg-[#111111] p-1 border border-neutral-800 rounded-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-4 py-2 text-xs font-mono font-bold tracking-wider uppercase transition-all duration-300 rounded-none ${
                  selectedCategory === cat.slug
                    ? "bg-red-600 text-white"
                    : "text-neutral-450 hover:text-white hover:bg-neutral-800"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Mobile filter buttons */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex-1 flex items-center justify-center gap-2 bg-[#111111] border border-neutral-800 hover:border-neutral-700 px-4 py-3 rounded-none text-sm font-medium transition-all"
            >
              <Filter className="w-4 h-4 text-red-600" />
              <span className="font-mono text-xs uppercase tracking-wider">Category Filter</span>
            </button>
          </div>

          {/* Sort By Select */}
          <div className="flex items-center gap-3">
            <span className="text-neutral-500 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" /> Sort By
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#111111] border border-neutral-800 hover:border-neutral-700 focus:border-red-600 rounded-none px-4 py-2.5 text-xs text-neutral-300 font-semibold outline-none cursor-pointer transition-all"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* Mobile Filter Sheet */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden bg-[#111111] border border-neutral-800 rounded-none p-5 mb-8"
            >
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400 mb-3">Filter by Category</h3>
              <div className="flex flex-col gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.slug}
                    onClick={() => {
                      setSelectedCategory(cat.slug);
                      setIsFilterOpen(false);
                    }}
                    className={`text-left px-4 py-3 rounded-none text-xs font-mono uppercase tracking-wider transition-all ${
                      selectedCategory === cat.slug
                        ? "bg-red-650 text-white"
                        : "text-neutral-400 hover:text-white bg-[#161616] border border-neutral-850"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Products Grid */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-4">
            <div className="w-10 h-10 border-3 border-red-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-neutral-500 text-sm tracking-wide">Loading premium gear...</p>
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="py-24 text-center border border-dashed border-neutral-850 rounded-none">
            <SlidersHorizontal className="w-10 h-10 text-neutral-600 mx-auto mb-4" />
            <h3 className="text-lg font-mono font-bold uppercase tracking-wider text-white">No Products Found</h3>
            <p className="text-neutral-500 mt-2 text-xs uppercase tracking-wider">We are currently loading fresh batches of supplements. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedProducts.map((product, idx) => {
              const defaultVariant = product.variants?.[0] || {
                id: "no-variant",
                mrp: 0,
                salePrice: 0,
                stock: 0,
                name: "Standard",
              };
              
              const gallery = Array.isArray(product.gallery) 
                ? product.gallery 
                : typeof product.gallery === "string" 
                  ? (() => { try { return JSON.parse(product.gallery); } catch(e) { return []; } })()
                  : [];
              const getImageUrl = (item: any) => {
                if (!item) return "/images/placeholders/jar-placeholder.png";
                if (typeof item === "string") return item;
                if (typeof item === "object" && item.url) return item.url;
                return "/images/placeholders/jar-placeholder.png";
              };
              const imageUrl = gallery.length > 0 && gallery[0] ? getImageUrl(gallery[0]) : "/images/placeholders/jar-placeholder.png";

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  className="group relative bg-[#111111] border border-neutral-800 hover:border-red-600 rounded-none p-5 flex flex-col justify-between overflow-hidden transition-all duration-300"
                >
                  {/* Red Left Accent Line on Hover */}
                  <div className="absolute left-0 top-0 w-[3px] h-0 bg-red-600 group-hover:h-full transition-all duration-300" />

                  {/* Header Badge Row */}
                  <div className="flex items-center justify-between mb-4 relative z-10">
                    <span className="flex items-center gap-1 text-[9px] font-mono tracking-wider text-neutral-300 bg-neutral-900 border border-neutral-850 px-2 py-0.5 rounded-none uppercase">
                      <ShieldCheck className="w-3.5 h-3.5 text-red-600" /> Lab Certified
                    </span>
                    {defaultVariant.mrp > defaultVariant.salePrice && (
                      <span className="text-[9px] font-mono font-extrabold text-white bg-red-600 px-2 py-0.5 rounded-none uppercase">
                        SAVE {Math.round(((defaultVariant.mrp - defaultVariant.salePrice) / defaultVariant.mrp) * 100)}%
                      </span>
                    )}
                  </div>

                  {/* Product Visual Container */}
                  <Link href={`/shop/${product.slug}`} className="block mb-4 relative z-10">
                    <div className="aspect-square w-full rounded-none bg-[#161616] border border-neutral-850 flex items-center justify-center relative transition-all duration-300 overflow-hidden">
                      <div className="w-full h-full relative group-hover:scale-105 transition-transform duration-500">
                        <Image
                          src={imageUrl}
                          alt={product.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-contain p-4"
                        />
                      </div>
                    </div>
                  </Link>

                  {/* Title and descriptions */}
                  <div className="flex-1 mb-4 relative z-10">
                    <div className="flex items-center gap-1.5 mb-2.5">
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3 h-3 ${
                              star <= Math.round(Number(product.avgRating) || 5)
                                ? "fill-amber-500 text-amber-500"
                                : "fill-neutral-850 text-neutral-850"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] font-mono text-neutral-400">{Number(product.avgRating) || 5.0}</span>
                    </div>

                    <Link href={`/shop/${product.slug}`} className="block">
                      <h3 className="font-display font-black text-xl italic tracking-tight text-white uppercase group-hover:text-red-500 transition-colors leading-tight mb-2">
                        {product.name}
                      </h3>
                    </Link>

                    <p className="text-[11px] font-sans tracking-wide text-neutral-450 line-clamp-2 leading-relaxed">
                      {product.shortDescription}
                    </p>
                  </div>

                  {/* Price and CTAs */}
                  <div className="pt-4 border-t border-neutral-850 flex items-center justify-between gap-4 relative z-10">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-display font-black text-white">{formatPrice(defaultVariant.salePrice)}</span>
                        {defaultVariant.mrp > defaultVariant.salePrice && (
                          <span className="text-xs text-neutral-500 line-through font-medium">
                            {formatPrice(defaultVariant.mrp)}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        addToCart({
                          variantId: defaultVariant.id,
                          productId: product.id,
                          productName: product.name,
                          variantName: defaultVariant.name,
                          image: imageUrl,
                          price: Number(defaultVariant.salePrice),
                          slug: product.slug,
                        })
                      }
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-none bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold uppercase tracking-wider transition-all duration-300"
                      aria-label="Add to cart"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      ADD TO CART
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
