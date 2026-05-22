"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ShieldCheck, Flame, FlaskConical, Award, ShoppingCart, CheckCircle, ChevronDown, RefreshCw } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/utils";
import VariantSelector from "./variant-selector";
import Image from "next/image";

interface ProductDetailProps {
  product: any;
  onReviewSubmit?: (reviewData: any) => Promise<boolean>;
}

// Static default contents mapped by category/slug for nutrition, ingredients, and FAQs
const NUTRITION_TEMPLATES: Record<string, { label: string; value: string; pct: string }[]> = {
  "hard-mass-gainer": [
    { label: "Protein", value: "20g", pct: "40%" },
    { label: "Calories", value: "340 kcal", pct: "17%" },
    { label: "Carbohydrates", value: "60g", pct: "20%" },
    { label: "Fats", value: "3g", pct: "4%" },
    { label: "Servings", value: "25", pct: "N/A" },
    { label: "Weight", value: "2.5 KG", pct: "N/A" },
  ],
  "spartan-mass-gainer": [
    { label: "Protein", value: "19g", pct: "38%" },
    { label: "Calories", value: "465 kcal", pct: "23%" },
    { label: "Carbohydrates", value: "62g", pct: "21%" },
    { label: "Fats", value: "4g", pct: "5%" },
    { label: "Servings", value: "25", pct: "N/A" },
    { label: "Weight", value: "2.5 KG", pct: "N/A" },
  ],
  protein: [
    { label: "Protein", value: "25g", pct: "50%" },
    { label: "BCAAs", value: "5.5g", pct: "N/A" },
    { label: "Glutamic Acid", value: "4g", pct: "N/A" },
    { label: "Carbohydrates", value: "3g", pct: "1%" },
    { label: "Fats", value: "1.5g", pct: "2%" },
    { label: "Calories", value: "120 kcal", pct: "6%" },
  ],
  creatine: [
    { label: "Creatine Monohydrate", value: "3g", pct: "100%" },
    { label: "Calories", value: "0 kcal", pct: "0%" },
    { label: "Fats", value: "0g", pct: "0%" },
    { label: "Carbohydrates", value: "0g", pct: "0%" },
  ],
  "pre-workout": [
    { label: "L-Citrulline", value: "6000mg", pct: "N/A" },
    { label: "Beta-Alanine", value: "3200mg", pct: "N/A" },
    { label: "Caffeine Anhydrous", value: "300mg", pct: "N/A" },
    { label: "L-Tyrosine", value: "1000mg", pct: "N/A" },
    { label: "Sodium", value: "120mg", pct: "5%" },
  ],
  default: [
    { label: "Energy", value: "140 kcal", pct: "7%" },
    { label: "Protein", value: "10g", pct: "20%" },
    { label: "Total Carbohydrates", value: "18g", pct: "6%" },
    { label: "Total Fats", value: "3g", pct: "4%" },
  ],
};

const INGREDIENTS_TEMPLATES: Record<string, string> = {
  "hard-mass-gainer": "Premium slow and fast-release proteins (Whey Protein Concentrate, Calcium Caseinate), Complex Carbohydrates (Maltodextrin, Oat Flour), Cookie Crumbs, Natural and Artificial Flavors, Soy Lecithin, Xanthan Gum, Sucralose, Lactase Enzyme Blend.",
  "spartan-mass-gainer": "Premium Carbohydrate Blend (Maltodextrin, Organic Oat Flour, Sweet Potato Powder), Protein Matrix (Whey Protein Isolate, Whey Protein Concentrate, Micellar Casein), Cocoa Powder, Natural and Artificial Flavors, Sucralose, Medium Chain Triglycerides (MCTs).",
  protein: "Whey Protein Isolate, Whey Protein Concentrate, Cocoa Powder (processed with alkali), Natural and Artificial Flavors, Soy Lecithin, Xanthan Gum, Sucralose, Lactase Enzyme Blend.",
  creatine: "100% Pure Micronized Creatine Monohydrate (200 Mesh). Zero fillers, zero artificial colors, zero additives.",
  "pre-workout": "L-Citrulline Malate (2:1), Beta-Alanine, L-Tyrosine, Caffeine Anhydrous, L-Theanine, Silica, Calcium Silicate, Citric Acid, Natural and Artificial Flavors, Sucralose, Acesulfame Potassium, Red Beet Powder (color).",
  default: "Premium Active Blend, Natural Flavouring, Sweetener (Sucralose), Silicon Dioxide, Citric Acid, Electrolyte Blend.",
};

const FAQ_TEMPLATES = [
  {
    q: "How and when should I consume this?",
    a: "Mix 1 scoop with 200-250ml of cold water or skimmed milk. For optimal results, consume within 30 minutes post-workout, or first thing in the morning."
  },
  {
    q: "Is Komando Labs supplement lab-tested?",
    a: "Yes. Every single batch of Komando Labs supplements undergoes rigorous third-party lab testing. You can verify your unique tub authenticity using the scratch code verify portal on our site."
  },
  {
    q: "Are there any side effects?",
    a: "Our products are formulated using clinically researched, premium-grade ingredients and are safe for healthy adults. If you have pre-existing medical conditions, please consult your physician before starting."
  }
];

export default function ProductDetail({ product, onReviewSubmit }: ProductDetailProps) {
  const { addToCart } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"details" | "nutrition" | "ingredients" | "faqs">("details");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Gallery main image state
  const rawImages = Array.isArray(product.gallery) 
    ? product.gallery 
    : typeof product.gallery === "string" 
      ? (() => { try { return JSON.parse(product.gallery); } catch(e) { return []; } })()
      : [];
  
  const images = rawImages.map((img: any) => {
    if (!img) return "";
    if (typeof img === "string") return img;
    if (typeof img === "object" && img.url) return img.url;
    return "";
  }).filter(Boolean);
  
  const [mainImage, setMainImage] = useState<string>("");

  useEffect(() => {
    if (product?.variants?.length > 0) {
      const def = product.variants.find((v: any) => v.isDefault) || product.variants[0];
      setSelectedVariant(def);
    }
    if (images.length > 0) {
      setMainImage(images[0]);
    }
  }, [product, images]);

  if (!product) return null;

  const bgAccentClass = "bg-red-600 hover:bg-red-700";
  const textAccentClass = "text-red-500";
  const borderAccentClass = "border-neutral-800";
  const bgAccentLight = "bg-red-600/10";
  const glowAccentClass = "from-red-600/10";

  // Match template based on slug first, then category
  const productSlug = product.slug || "";
  const categorySlug = product.category?.slug || "";
  const nutritionFacts = NUTRITION_TEMPLATES[productSlug] || NUTRITION_TEMPLATES[categorySlug] || NUTRITION_TEMPLATES.default;
  const ingredients = INGREDIENTS_TEMPLATES[productSlug] || INGREDIENTS_TEMPLATES[categorySlug] || INGREDIENTS_TEMPLATES.default;

  const handleAddCart = () => {
    if (!selectedVariant) return;
    addToCart(
      {
        variantId: selectedVariant.id,
        productId: product.id,
        productName: product.name,
        variantName: selectedVariant.name,
        image: mainImage || "",
        price: Number(selectedVariant.salePrice),
        slug: product.slug,
      },
      quantity
    );
  };

  return (
    <div className="space-y-16">
      {/* Product top panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        
        {/* Gallery column (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="aspect-square w-full rounded-none bg-[#161616] border border-neutral-850 flex items-center justify-center relative overflow-hidden group">
            <Image
              src={mainImage || "/images/placeholders/jar-placeholder.png"}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain p-6 transition-transform duration-700 group-hover:scale-105"
            />
          </div>

          {/* Thumbnail list */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
              {images.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setMainImage(img)}
                  className={`relative aspect-square w-20 rounded-none bg-[#111111] border overflow-hidden flex-shrink-0 transition-all ${
                    mainImage === img 
                      ? "border-red-600 scale-95"
                      : "border-neutral-800 hover:border-neutral-700"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt={`${product.name} gallery ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Quality check Badges */}
          <div className="grid grid-cols-3 gap-3 pt-4">
            {[
              { icon: ShieldCheck, label: "FSSAI Approved" },
              { icon: FlaskConical, label: "3rd Party Tested" },
              { icon: Award, label: "100% Authentic" },
            ].map((badge, idx) => (
              <div key={idx} className="bg-[#111111] border border-neutral-800 p-3.5 rounded-none text-center flex flex-col items-center gap-1.5 hover:border-red-650 transition-all duration-300">
                <badge.icon className="w-5 h-5 text-red-600" />
                <span className="text-[9px] font-mono font-bold text-neutral-450 uppercase tracking-wider">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Info Column (6 cols) */}
        <div className="lg:col-span-6 flex flex-col justify-between">
          <div className="space-y-6">
            {/* Category / Breadcrumb */}
            <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-red-600">
              {product.category?.name || "Premium Supplements"}
            </div>

            <h1 className="font-display font-black text-3xl md:text-4xl lg:text-5xl text-white tracking-tight leading-none italic uppercase">
              {product.name}
            </h1>

            {/* Ratings Summary */}
            <div className="flex items-center gap-2 bg-[#111111] border border-neutral-800 w-fit px-3.5 py-2 rounded-none">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <span className="text-xs font-mono font-bold text-neutral-200">
                {product.avgRating || "4.9"}
              </span>
              <span className="text-neutral-800 text-xs">|</span>
              <span className="text-xs font-mono font-medium text-neutral-400 uppercase tracking-wider">
                {product.totalReviews || 0} reviews
              </span>
            </div>

            {/* Product short intro */}
            <p className="text-neutral-400 text-xs md:text-sm leading-relaxed max-w-xl">
              {product.shortDescription || "Unleash your ultimate physical potential with precision engineered nutrition. Made with raw imported ingredients, processed in certified state-of-the-art facilities."}
            </p>

            {/* Variants selection */}
            {product.variants?.length > 0 && (
              <div className="py-4 border-t border-b border-neutral-850">
                <VariantSelector
                  variants={product.variants}
                  selectedVariant={selectedVariant}
                  onChange={(v) => setSelectedVariant(v)}
                  themeColor={product.themeColor}
                />
              </div>
            )}
          </div>

          {/* Pricing & Add to Cart Frame */}
          <div className="bg-[#111111] border border-neutral-800 p-6 rounded-none mt-8 relative">
            <div className="absolute left-0 top-0 w-[3px] h-full bg-red-600" />
            
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-[10px] font-mono text-neutral-500 font-bold uppercase tracking-wider block">Price (Inclusive of Taxes)</span>
                <div className="flex items-baseline gap-3 mt-1.5">
                  <span className="text-3xl font-display font-black text-white">
                    {selectedVariant ? formatPrice(selectedVariant.salePrice) : "Price N/A"}
                  </span>
                  {selectedVariant?.mrp > selectedVariant?.salePrice && (
                    <>
                      <span className="text-sm text-neutral-500 line-through font-semibold">
                        {formatPrice(selectedVariant.mrp)}
                      </span>
                      <span className="text-[9px] font-mono font-extrabold text-white px-2 py-0.5 rounded-none bg-red-600">
                        SAVE {Math.round(((selectedVariant.mrp - selectedVariant.salePrice) / selectedVariant.mrp) * 100)}%
                      </span>
                    </>
                  )}
                </div>
              </div>

              {selectedVariant?.stock > 0 ? (
                <span className="text-[9px] font-mono font-bold text-emerald-400 bg-neutral-900 border border-emerald-500/20 px-3 py-1 rounded-none tracking-wider">
                  ACTIVE BATCH // IN STOCK
                </span>
              ) : (
                <span className="text-[9px] font-mono font-bold text-red-500 bg-neutral-900 border border-red-500/20 px-3 py-1 rounded-none tracking-wider">
                  SOLD OUT // DEACTIVATED
                </span>
              )}
            </div>

            {/* Quantity Selector & Action Button */}
            <div className="flex gap-4">
              <div className="flex items-center bg-[#161616] border border-neutral-800 rounded-none overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-4 py-3 text-neutral-400 hover:text-white transition-colors font-bold"
                >
                  -
                </button>
                <span className="px-2 text-sm font-mono font-black text-white w-6 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-4 py-3 text-neutral-400 hover:text-white transition-colors font-bold"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddCart}
                disabled={!selectedVariant || selectedVariant.stock <= 0}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-none font-bold uppercase tracking-wider text-xs transition-all ${
                  selectedVariant?.stock > 0
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-neutral-800 border border-neutral-850 text-neutral-500 cursor-not-allowed"
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                Command Order
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Tabs description, nutrition, ingredients, FAQs */}
      <section className="bg-[#111111] border border-neutral-800 rounded-none p-6 md:p-8">
        <div className="flex border-b border-neutral-850 overflow-x-auto gap-8 mb-8 scrollbar-none">
          {[
            { id: "details", label: "Product Info" },
            { id: "nutrition", label: "Nutrition Profile" },
            { id: "ingredients", label: "Ingredients" },
            { id: "faqs", label: "FAQs" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-4 text-xs font-mono font-bold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-red-600 text-white"
                  : "border-transparent text-neutral-550 hover:text-neutral-350"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="min-h-[220px]">
          <AnimatePresence mode="wait">
            {activeTab === "details" && (
              <motion.div
                key="details"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="prose prose-invert max-w-none text-neutral-400 text-xs md:text-sm leading-relaxed space-y-4"
              >
                <p>{product.description || "No detailed description available."}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  <div className="bg-[#161616] border border-neutral-800 p-4 rounded-none">
                    <h4 className="text-red-650 font-mono font-bold text-xs mb-1.5 uppercase tracking-wider">Suggested Use</h4>
                    <p className="text-xs text-neutral-400">Consume 1-2 servings daily. Ideal post-workout or in-between meals as required to meet your nutritional metrics.</p>
                  </div>
                  <div className="bg-[#161616] border border-neutral-800 p-4 rounded-none">
                    <h4 className="text-red-650 font-mono font-bold text-xs mb-1.5 uppercase tracking-wider">Warnings</h4>
                    <p className="text-xs text-neutral-400">Store in a cool dry place. Keep out of reach of children. Do not exceed the recommended dose.</p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "nutrition" && (
              <motion.div
                key="nutrition"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-mono font-bold text-base uppercase tracking-wider">Nutrition Information</h3>
                    <p className="text-neutral-500 text-xs mt-0.5">Values based on standard single serving size.</p>
                  </div>
                  <span className="text-[9px] font-mono font-bold text-neutral-400 bg-[#161616] border border-neutral-800 px-2.5 py-1 rounded-none">1 Serving Size: {productSlug.includes("mass-gainer") ? "~100g" : "~33g"}</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {nutritionFacts.map((fact, idx) => (
                    <div key={idx} className="bg-[#161616] border border-neutral-800 p-4 rounded-none flex items-center justify-between">
                      <div>
                        <span className="text-[9px] font-mono font-bold text-neutral-500 uppercase tracking-wider block">{fact.label}</span>
                        <span className="text-white font-display font-black text-lg mt-1 block">{fact.value}</span>
                      </div>
                      {fact.pct !== "N/A" && (
                        <span className="text-[9px] font-mono font-bold text-neutral-400 bg-[#111111] border border-neutral-800 px-2 py-1 rounded-none">% RDA: {fact.pct}</span>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "ingredients" && (
              <motion.div
                key="ingredients"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <h3 className="text-white font-mono font-bold text-base uppercase tracking-wider">Ingredient Composition</h3>
                <p className="text-neutral-450 text-xs md:text-sm leading-relaxed bg-[#161616] border border-neutral-800 p-6 rounded-none">
                  {ingredients}
                </p>
                <div className="flex items-center gap-2 text-xs text-neutral-500 font-mono uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-emerald-450" />
                  <span>Free from banned substances. Gluten-free and non-GMO.</span>
                </div>
              </motion.div>
            )}

            {activeTab === "faqs" && (
              <motion.div
                key="faqs"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-3"
              >
                {FAQ_TEMPLATES.map((faq, idx) => (
                  <div
                    key={idx}
                    className="border border-neutral-800 bg-[#161616] rounded-none overflow-hidden"
                  >
                    <button
                      onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                      className="w-full flex items-center justify-between p-5 text-left text-xs font-mono uppercase tracking-wider font-bold text-white hover:bg-[#111111] transition-colors"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-neutral-400 transition-transform duration-300 ${
                          activeFaq === idx ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <AnimatePresence initial={false}>
                      {activeFaq === idx && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: "auto" }}
                          exit={{ height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <p className="p-5 pt-4 text-xs text-neutral-400 border-t border-neutral-800 leading-relaxed font-sans">
                            {faq.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
