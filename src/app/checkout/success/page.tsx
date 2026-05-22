"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { motion } from "framer-motion";
import { CheckCircle2, Shield, ShoppingBag, ArrowRight } from "lucide-react";
import React, { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber") || "KMD-ORD-XXXXX";

  return (
    <div className="max-w-2xl mx-auto text-center py-16">
      {/* Success Icon */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 10, delay: 0.2 }}
        className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(16,185,129,0.15)]"
      >
        <CheckCircle2 className="w-10 h-10 text-emerald-400" />
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 15 }}
        className="text-3xl md:text-4xl font-display font-black text-white tracking-tight mb-4"
      >
        ORDER <span className="text-emerald-400">CONFIRMED</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-neutral-400 text-sm max-w-md mx-auto mb-10 leading-relaxed"
      >
        Thank you for choosing Komando Labs. Your cash on delivery order has been received and is being prepared for fulfillment.
      </motion.p>

      {/* Order Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-neutral-950 border border-white/[0.04] p-6 rounded-2xl mb-12"
      >
        <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Your Order Reference Number</div>
        <div className="text-2xl font-mono font-bold text-white mt-2 select-all tracking-wider">{orderNumber}</div>
        <div className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider mt-4">
          A confirmation SMS has been dispatched for delivery routing.
        </div>
      </motion.div>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
      >
        <Link href="/verify" className="w-full sm:w-auto bg-neutral-900 border border-white/5 hover:border-white/10 text-xs font-bold text-neutral-300 py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all">
          <Shield className="w-4 h-4 text-red-500" /> Verify Product Authenticity
        </Link>
        <Link href="/shop" className="w-full sm:w-auto btn-primary text-xs font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(220,38,38,0.15)]">
          Continue Shopping <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="bg-[#050505] text-white min-h-screen flex flex-col">
      <Navbar />

      <main className="container-main pt-28 pb-16 flex-1 flex items-center justify-center">
        <Suspense fallback={
          <div className="text-center py-24">
            <div className="w-10 h-10 border-3 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-neutral-500 text-sm">Parsing transaction records...</p>
          </div>
        }>
          <SuccessContent />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
