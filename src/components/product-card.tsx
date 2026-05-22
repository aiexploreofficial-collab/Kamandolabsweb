"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star, Shield, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";

interface Variant {
  id: string;
  name: string;
  mrp: number;
  salePrice: number;
  stock: number;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  avgRating: string | number;
  themeColor: string | null;
  variants: Variant[];
  gallery?: any;
}

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addToCart } = useCart();
  
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

  const isSpartanRed = product.themeColor === "spartan-red";
  const hoverBorder = isSpartanRed ? "hover:border-red-600" : "hover:border-red-600";
  const textAccent = isSpartanRed ? "group-hover:text-red-500" : "group-hover:text-red-500";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={`group relative bg-[#111111] border border-neutral-800 ${hoverBorder} rounded-none p-5 flex flex-col justify-between overflow-hidden transition-all duration-300`}
    >
      {/* Red Left Accent Line on Hover */}
      <div className="absolute left-0 top-0 w-[3px] h-0 bg-red-600 group-hover:h-full transition-all duration-300" />

      {/* Header Badge */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <span className="flex items-center gap-1 text-[9px] font-mono tracking-wider text-neutral-300 bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded-none uppercase">
          <Shield className="w-3 h-3 text-red-600" /> SECURED // AUTHENTIC
        </span>
      </div>

      {/* Product Image */}
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

      {/* Content */}
      <div className="flex-1 mb-4 relative z-10">
        {/* Rating Row */}
        <div className="flex items-center gap-1.5 mb-2.5">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-3 h-3 ${
                  star <= Math.round(Number(product.avgRating) || 5)
                    ? "fill-amber-500 text-amber-500"
                    : "fill-neutral-800 text-neutral-800"
                }`}
              />
            ))}
          </div>
          <span className="text-[10px] font-mono text-neutral-400">{Number(product.avgRating) || 5.0}</span>
        </div>

        {/* Title */}
        <Link href={`/shop/${product.slug}`} className="block">
          <h3 className={`font-display font-black text-xl italic tracking-tight text-white uppercase ${textAccent} transition-colors leading-tight mb-2`}>
            {product.name}
          </h3>
        </Link>

        {/* Short Description */}
        <p className="text-[11px] font-sans tracking-wide text-neutral-400 line-clamp-2 leading-relaxed">
          {product.shortDescription}
        </p>
      </div>

      {/* Footer Pricing & CTA */}
      <div className="pt-4 border-t border-neutral-850 flex items-center justify-between gap-4 relative z-10">
        <div>
          <span className="text-xl font-display font-black text-white">{formatPrice(defaultVariant.salePrice)}</span>
        </div>

        <Link
          href={`/shop/${product.slug}`}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-none bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold uppercase tracking-wider transition-all duration-300"
        >
          VIEW ARSENAL
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </motion.div>
  );
}
