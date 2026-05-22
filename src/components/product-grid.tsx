"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Shield, ArrowRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";

function StarRating({ rating, reviews }: { rating: number; reviews: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3 h-3 ${
              star <= Math.round(rating)
                ? "fill-amber-500 text-amber-500"
                : "fill-neutral-800 text-neutral-800"
            }`}
          />
        ))}
      </div>
      <span className="text-[10px] font-mono text-neutral-400">
        {rating} ({reviews} REVIEW{reviews !== 1 ? "S" : ""})
      </span>
    </div>
  );
}

function ProductCard({ product, index }: { product: any; index: number }) {
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

  const rating = Number(product.avgRating) || 5.0;
  const reviews = product.totalReviews || 1;
  const flavor = defaultVariant.flavor || defaultVariant.name || "Standard";
  const categoryName = product.category?.name || "Mass Gainers";
  
  const badge = product.slug === "spartan-mass-gainer" ? "BEST SELLER" : "PREMIUM FORMULA";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.4,
        delay: index * 0.08,
        ease: "easeOut",
      }}
    >
      <Link
        href={`/shop/${product.slug}`}
        className="group relative flex flex-col bg-[#111111] border border-neutral-800 hover:border-red-600 rounded-none overflow-hidden transition-all duration-300 h-full"
      >
        {/* Red Left Accent Line on Hover */}
        <div className="absolute left-0 top-0 w-[3px] h-0 bg-red-600 group-hover:h-full transition-all duration-300" />

        {/* Product Image Area */}
        <div className="relative aspect-square overflow-hidden bg-[#161616] border-b border-neutral-850">
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <div className="w-full h-full relative group-hover:scale-105 transition-transform duration-550">
              <Image
                src={imageUrl}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-contain"
              />
            </div>
          </div>

          {/* Badge & Authentic Label */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
            {badge ? (
              <span className="bg-red-600 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-none">
                {badge}
              </span>
            ) : (
              <div />
            )}
            <span className="flex items-center gap-1 text-[8px] font-mono tracking-wider text-neutral-400 bg-neutral-900/90 border border-neutral-850 px-1.5 py-0.5">
              <Shield className="w-2.5 h-2.5 text-red-600" /> AUTHENTIC
            </span>
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col flex-1 p-5 justify-between">
          <div>
            {/* Category */}
            <span className="text-[9px] font-mono tracking-widest text-neutral-500 mb-1.5 block">
              {categoryName.toUpperCase()} // SEC_AR
            </span>

            {/* Name */}
            <h3 className="font-display font-black text-xl text-white italic tracking-tight group-hover:text-red-500 transition-colors leading-tight mb-1.5 uppercase line-clamp-1">
              {product.name}
            </h3>

            {/* Flavor */}
            <p className="text-[10px] font-mono tracking-wider text-neutral-400 mb-3 uppercase line-clamp-1">{flavor}</p>

            {/* Rating */}
            <StarRating rating={rating} reviews={reviews} />
          </div>

          {/* Pricing & CTA */}
          <div className="mt-5 pt-4 border-t border-neutral-850 flex items-center justify-between">
            <div>
              <span className="text-xl font-display font-black text-white">
                {formatPrice(defaultVariant.salePrice)}
              </span>
            </div>
            <span
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-none bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold uppercase tracking-wider transition-all duration-300"
            >
              VIEW DETAILS
              <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function ProductGrid() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeaturedProducts() {
      try {
        const res = await fetch("/api/products?featured=true");
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (err) {
        console.error("Error fetching featured products:", err);
      } finally {
        setLoading(false);
      }
    }
    loadFeaturedProducts();
  }, []);

  return (
    <section className="section-padding relative border-t border-[#1A1A1A] bg-[#0A0A0A]">
      {/* Background Image with Clear Visibility */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.3] pointer-events-none"
        style={{ backgroundImage: "url('/images/backgrounds/products-bg.jpg')" }} 
      />
      {/* Balanced dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-[#0A0A0A]/70 to-[#0A0A0A] pointer-events-none" />

      <div className="container-main relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-12"
        >
          <div className="max-w-xl">
            <span className="text-[10px] font-black tracking-[0.3em] uppercase text-red-600 mb-3 block">
              PRIMARY ARSENAL
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-black uppercase tracking-tight text-white italic">
              ENGINEERED FOR RESULTS
            </h2>
            <div className="w-16 h-[2px] bg-red-600 mt-4 mb-4" />
            <p className="text-xs uppercase tracking-wider text-neutral-400">
              Our high-yield performance gainers, built for peak power output and rapid tissue repair.
            </p>
          </div>
          <Link
            href="/shop"
            className="mt-6 md:mt-0 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-white transition-colors group"
          >
            VIEW ALL PRODUCTS
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Product Grid */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6 justify-center">
          {loading ? (
            <div className="col-span-1 sm:col-span-2 py-12 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-neutral-400 text-xs tracking-wider uppercase font-mono">Syncing Weapons Arsenal...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="col-span-1 sm:col-span-2 py-12 text-center text-neutral-500 text-xs font-mono uppercase tracking-wider">
              No featured supplements available.
            </div>
          ) : (
            products.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))
          )}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 text-center"
        >
          <Link href="/shop" className="btn-secondary text-xs tracking-widest">
            EXPLORE FULL COLLECTION
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
