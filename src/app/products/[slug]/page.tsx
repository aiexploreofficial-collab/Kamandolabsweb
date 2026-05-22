"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { motion } from "framer-motion";
import { Star, ShieldCheck, Flame, FlaskConical, Award, Truck, ShoppingCart, MessageSquarePlus, Clock, CheckCircle } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const gallery = product
    ? (Array.isArray(product.gallery) 
      ? product.gallery 
      : typeof product.gallery === "string" 
        ? (() => { try { return JSON.parse(product.gallery); } catch(e) { return []; } })()
        : [])
    : [];
  const getImageUrl = (item: any) => {
    if (!item) return "/images/placeholders/jar-placeholder.png";
    if (typeof item === "string") return item;
    if (typeof item === "object" && item.url) return item.url;
    return "/images/placeholders/jar-placeholder.png";
  };
  const imageUrl = gallery.length > 0 && gallery[0] ? getImageUrl(gallery[0]) : "/images/placeholders/jar-placeholder.png";

  // Review Form state
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewPhone, setReviewPhone] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [localReviews, setLocalReviews] = useState<any[]>([]);

  useEffect(() => {
    async function loadProduct() {
      if (!slug) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
          setLocalReviews(data.reviews || []);
          // Set default variant
          const def = data.variants?.find((v: any) => v.isDefault) || data.variants?.[0];
          setSelectedVariant(def);
        } else {
          router.push("/shop");
        }
      } catch (err) {
        console.error("Failed to load product detail", err);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [slug, router]);

  const handleAddCart = () => {
    if (!product || !selectedVariant) return;
    addToCart(
      {
        variantId: selectedVariant.id,
        productId: product.id,
        productName: product.name,
        variantName: selectedVariant.name,
        image: imageUrl,
        price: Number(selectedVariant.salePrice),
        slug: product.slug,
      },
      quantity
    );
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewPhone || !reviewComment) {
      alert("Name, phone and comment are required.");
      return;
    }
    setReviewSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          customerName: reviewName,
          customerPhone: reviewPhone,
          rating: reviewRating,
          title: reviewTitle,
          comment: reviewComment,
        }),
      });

      if (res.ok) {
        setReviewSuccess(true);
        // Add to local state (marked as pending or directly shown for UX)
        setLocalReviews((prev) => [
          {
            id: `temp-${Date.now()}`,
            customerName: reviewName,
            rating: reviewRating,
            title: reviewTitle,
            comment: reviewComment,
            createdAt: new Date().toISOString(),
            isPending: true,
          },
          ...prev,
        ]);
        setReviewName("");
        setReviewTitle("");
        setReviewComment("");
        setReviewPhone("");
      } else {
        const data = await res.json();
        alert(data.error || "Failed to submit review");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to submit review");
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#050505] text-white min-h-screen flex flex-col justify-between">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 py-32">
          <div className="w-10 h-10 border-3 border-red-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-neutral-500 text-sm tracking-wide">Loading supplement details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) return null;

  const isSpartanRed = product.themeColor === "spartan-red";
  const colorAccentClass = isSpartanRed ? "text-red-500" : "text-blue-500";
  const bgAccentClass = isSpartanRed ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700";
  const borderAccentClass = isSpartanRed ? "border-red-600/30" : "border-blue-600/30";
  const ringAccentClass = isSpartanRed ? "focus:ring-red-600 focus:border-red-600" : "focus:ring-blue-600 focus:border-blue-600";
  const glowAccentClass = isSpartanRed ? "from-red-600/10" : "from-blue-600/10";

  return (
    <div className="bg-[#050505] text-white min-h-screen flex flex-col relative overflow-hidden">
      <Navbar />

      {/* Premium Visual Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/backgrounds/products-bg.jpg"
          alt="Gym Texture Background"
          fill
          priority
          className="object-cover object-center opacity-30 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#050505]/70 to-[#050505]" />
      </div>

      <main className="container-main pt-28 pb-16 flex-1 relative z-10">
        {/* Product core row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Visual Canvas (Left Column) */}
          <div className="lg:col-span-6 relative">
            <div className={`absolute -top-10 -left-10 w-72 h-72 bg-gradient-to-br ${glowAccentClass} to-transparent rounded-full blur-[100px] pointer-events-none`} />
            
            <div className={`aspect-square w-full rounded-3xl bg-neutral-950/80 border border-white/[0.04] ${borderAccentClass} flex items-center justify-center relative overflow-hidden shadow-2xl z-10`}>
              <Image
                src={imageUrl}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain p-6"
              />
            </div>

            {/* Trust highlights */}
            <div className="grid grid-cols-3 gap-3 mt-6">
              {[
                { icon: ShieldCheck, label: "FSSAI Approved" },
                { icon: FlaskConical, label: "3rd Party Tested" },
                { icon: Award, label: "100% Authentic" },
              ].map((badge, idx) => (
                <div key={idx} className="bg-neutral-950 border border-white/[0.03] p-3 rounded-xl text-center flex flex-col items-center gap-1">
                  <badge.icon className="w-5 h-5 text-emerald-400" />
                  <span className="text-[10px] font-semibold text-neutral-400">{badge.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Details & Customizers (Right Column) */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              {/* Category Breadcrumb */}
              <div className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
                {product.category?.name || "Supplements"}
              </div>

              <h1 className="font-display font-black text-3xl md:text-4xl text-white tracking-tight mb-4">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-6 bg-white/5 border border-white/5 w-fit px-3 py-1.5 rounded-lg">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="text-xs font-bold text-neutral-300">
                  {product.avgRating || "4.9"} ({localReviews.length} Reviews)
                </span>
              </div>

              {/* Short Description */}
              <p className="text-neutral-400 text-sm leading-relaxed mb-6">
                {product.description || product.shortDescription}
              </p>

              {/* Variant Selector */}
              {product.variants?.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">Select Size / Flavor</h3>
                  <div className="flex flex-wrap gap-2.5">
                    {product.variants.map((v: any) => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariant(v)}
                        className={`px-4 py-3 rounded-xl border text-xs font-bold transition-all ${
                          selectedVariant?.id === v.id
                            ? `${bgAccentClass} text-white border-transparent shadow-[0_0_20px_rgba(220,38,38,0.2)]`
                            : "bg-neutral-950 border-white/[0.08] text-neutral-400 hover:text-white hover:border-white/20"
                        }`}
                      >
                        {v.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions / Pricing Card */}
            <div className="bg-neutral-950 border border-white/[0.04] p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-xs text-neutral-500 font-semibold uppercase tracking-wider">Sale Price</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-black text-white">
                      {selectedVariant ? formatPrice(selectedVariant.salePrice) : "Price N/A"}
                    </span>
                    {selectedVariant?.mrp > selectedVariant?.salePrice && (
                      <span className="text-sm text-neutral-500 line-through font-medium">
                        {formatPrice(selectedVariant.mrp)}
                      </span>
                    )}
                  </div>
                </div>

                {selectedVariant?.stock > 0 ? (
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md">
                    IN STOCK
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-md">
                    OUT OF STOCK
                  </span>
                )}
              </div>

              {/* Quantity Selector & Add to Cart */}
              <div className="flex gap-4">
                <div className="flex items-center bg-neutral-900 border border-white/[0.05] rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-4 py-3 text-neutral-400 hover:text-white transition-colors"
                  >
                    -
                  </button>
                  <span className="px-2 text-sm font-bold text-white w-6 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-4 py-3 text-neutral-400 hover:text-white transition-colors"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddCart}
                  disabled={!selectedVariant || selectedVariant.stock <= 0}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold transition-all shadow-[0_0_30px_rgba(0,0,0,0.3)] ${
                    selectedVariant?.stock > 0
                      ? `${bgAccentClass} text-white`
                      : "bg-neutral-900 border border-white/5 text-neutral-600 cursor-not-allowed"
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Reviews Section */}
        <section className="mt-20 pt-12 border-t border-white/[0.04]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Reviews list */}
            <div className="lg:col-span-7">
              <h2 className="font-display font-bold text-2xl mb-8 flex items-center gap-2">
                Customer Reviews
                <span className="text-sm font-semibold text-neutral-500">({localReviews.length})</span>
              </h2>

              {localReviews.length === 0 ? (
                <p className="text-neutral-500 text-sm">No reviews yet for this product. Be the first to review!</p>
              ) : (
                <div className="flex flex-col gap-6">
                  {localReviews.map((review) => (
                    <div
                      key={review.id}
                      className="bg-neutral-950 border border-white/[0.03] p-5 rounded-2xl relative"
                    >
                      {review.isPending && (
                        <span className="absolute top-4 right-4 flex items-center gap-1 text-[9px] font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded">
                          <Clock className="w-3 h-3" /> Moderation Pending
                        </span>
                      )}
                      
                      <div className="flex items-center gap-1.5 mb-2.5">
                        <div className="flex text-amber-500">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-current" />
                          ))}
                        </div>
                        <span className="text-xs font-semibold text-neutral-300 ml-1">{review.customerName}</span>
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded flex items-center gap-0.5 ml-2">
                          <CheckCircle className="w-2.5 h-2.5" /> Verified Purchase
                        </span>
                      </div>

                      {review.title && (
                        <h4 className="text-sm font-bold text-white mb-2">{review.title}</h4>
                      )}

                      <p className="text-xs text-neutral-400 leading-relaxed">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Write a review form */}
            <div className="lg:col-span-5">
              <div className="bg-neutral-950 border border-white/[0.03] p-6 rounded-2xl">
                <h3 className="font-display font-bold text-lg mb-6 flex items-center gap-2">
                  <MessageSquarePlus className="w-5 h-5 text-red-500" /> Share Your Review
                </h3>

                {reviewSuccess ? (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl text-sm flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold">Review Submitted!</h4>
                      <p className="text-xs mt-0.5 text-neutral-400">Your review is in moderation queue and will appear publicly once approved.</p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5 block">Your Name</label>
                        <input
                          type="text"
                          required
                          value={reviewName}
                          onChange={(e) => setReviewName(e.target.value)}
                          className={`w-full bg-white/[0.02] border border-white/10 ${ringAccentClass} rounded-xl px-4 py-2.5 text-xs text-white outline-none transition-all`}
                          placeholder="e.g. Rahul Dev"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5 block">Phone Number</label>
                        <input
                          type="tel"
                          required
                          value={reviewPhone}
                          onChange={(e) => setReviewPhone(e.target.value)}
                          className={`w-full bg-white/[0.02] border border-white/10 ${ringAccentClass} rounded-xl px-4 py-2.5 text-xs text-white outline-none transition-all`}
                          placeholder="10-digit number"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5 block">Star Rating</label>
                      <div className="flex gap-1.5">
                        {[1, 2, 3, 4, 5].map((val) => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => setReviewRating(val)}
                            className={`p-1 transition-all ${reviewRating >= val ? "text-amber-500" : "text-neutral-600"}`}
                          >
                            <Star className="w-6 h-6 fill-current" />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5 block">Review Title</label>
                      <input
                        type="text"
                        value={reviewTitle}
                        onChange={(e) => setReviewTitle(e.target.value)}
                        className={`w-full bg-white/[0.02] border border-white/10 ${ringAccentClass} rounded-xl px-4 py-2.5 text-xs text-white outline-none transition-all`}
                        placeholder="e.g. Extreme pump, loved it!"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5 block">Review Comment</label>
                      <textarea
                        required
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        rows={4}
                        className={`w-full bg-white/[0.02] border border-white/10 ${ringAccentClass} rounded-xl px-4 py-2.5 text-xs text-white outline-none transition-all`}
                        placeholder="Write your honest product feedback..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={reviewSubmitting}
                      className={`w-full py-3 ${bgAccentClass} text-xs font-bold text-white rounded-xl transition-all shadow-[0_0_20px_rgba(220,38,38,0.1)]`}
                    >
                      {reviewSubmitting ? "Submitting..." : "Post Review"}
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
