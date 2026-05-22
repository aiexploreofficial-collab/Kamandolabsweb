"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ProductDetail from "@/components/product-detail";
import { useCart } from "@/context/cart-context";
import Image from "next/image";

export default function ShopProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProduct() {
      if (!slug) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
        } else {
          router.push("/shop");
        }
      } catch (err) {
        console.error("Failed to load product details:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [slug, router]);

  return (
    <div className="bg-[#050505] text-white min-h-screen flex flex-col justify-between relative overflow-hidden">
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

      <div className="flex-1 relative z-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-4 py-36">
            <div className="w-10 h-10 border-3 border-red-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-neutral-500 text-sm tracking-wide">Loading supplement details...</p>
          </div>
        ) : product ? (
          <div className="container-main pt-28 pb-16">
            <ProductDetail product={product} />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 py-36 text-center">
            <h2 className="text-xl font-bold">Product not found</h2>
            <p className="text-neutral-500 text-sm">The requested product could not be loaded.</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
