"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Shield, FlaskConical, Award, Truck } from "lucide-react";
import Image from "next/image";

const trustBadges = [
  { icon: FlaskConical, label: "Lab Tested" },
  { icon: Shield, label: "FSSAI Certified" },
  { icon: Award, label: "100% Authentic" },
  { icon: Truck, label: "Free Shipping ₹500+" },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0A0A0A]">
      {/* ── Background Layers ── */}
      <div className="absolute inset-0">
        {/* Premium Visual Gym Background — brighter / more visible */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/backgrounds/hero-bg.jpg"
            alt="Gym Texture Hero Background"
            fill
            priority
            className="object-cover object-center opacity-70 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/50 via-transparent to-[#0A0A0A]" />
        </div>

        {/* Clean tactical grid pattern */}
        <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />

        {/* Red radial tactical indicators — very subtle */}
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(255,26,26,0.08)_0%,transparent_70%)] pointer-events-none" />
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 container-main w-full pt-32 pb-16 lg:pt-36 lg:pb-24">
        <div className="max-w-4xl mx-auto text-center">
          {/* Pre-heading badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-red-650/10 border border-red-600/30 mb-8 rounded-none"
          >
            <span className="w-1.5 h-1.5 bg-red-600 rounded-none" />
            <span className="text-[10px] font-black tracking-widest uppercase text-red-500">
              India&apos;s Premium Supplement Brand
            </span>
          </motion.div>

          {/* Main Headline — Aggressive, Italic, Uppercase */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="font-display font-black italic tracking-tighter leading-[0.9] uppercase text-white text-[clamp(3rem,9vw,7.5rem)]"
          >
            <span className="block">
              COMMAND
            </span>
            <span className="block mt-2">
              YOUR{" "}
              <span className="relative inline-block text-red-600">
                STRENGTH
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute -bottom-2 left-0 right-0 h-[4px] bg-red-600 origin-left rounded-none"
                />
              </span>
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-10 text-sm md:text-base text-neutral-405 uppercase font-bold tracking-wider max-w-xl mx-auto leading-relaxed"
          >
            Premium fitness-performance supplements, lab-tested for purity
            <br className="hidden md:block" />
            and engineered for results. Fuel your ambition.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/shop" className="btn-primary text-xs tracking-widest font-black uppercase group">
              Shop Now
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            <Link href="/verify" className="btn-secondary text-xs tracking-widest font-black uppercase group">
              <Shield className="w-4 h-4 text-red-500" />
              Verify Product
            </Link>
          </motion.div>

          {/* Trust Badges Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            className="mt-16 flex flex-wrap items-center justify-center gap-4 md:gap-8"
          >
            {[
              { icon: FlaskConical, label: "Third-Party Lab Tested" },
              { icon: Shield, label: "FSSAI Licensed" },
              { icon: Award, label: "Scratch-Code Verified" },
            ].map((badge) => (
              <div key={badge.label} className="flex items-center gap-2 text-neutral-400">
                <badge.icon className="w-4 h-4 text-red-650" />
                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                  {badge.label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Trust Badges Details Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.3 }}
          className="mt-16 lg:mt-24"
        >
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
            {trustBadges.map((badge) => (
              <div
                key={badge.label}
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-none bg-[#111111] border border-neutral-850 hover:bg-[#151515] hover:border-neutral-700 transition-all duration-300 group"
              >
                <badge.icon className="w-4 h-4 text-red-500 group-hover:text-red-400 transition-colors" />
                <span className="text-xs font-bold text-neutral-300 tracking-widest uppercase group-hover:text-white transition-colors">
                  {badge.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom separator line */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-neutral-900" />
    </section>
  );
}
