"use client";

import { motion } from "framer-motion";
import { FlaskConical, Gem, Target, ShieldAlert } from "lucide-react";
import Image from "next/image";

const features = [
  {
    icon: FlaskConical,
    title: "LAB TESTED & CERTIFIED",
    description:
      "Every batch undergoes rigorous third-party lab testing for purity, potency, and safety. FSSAI certified for your peace of mind.",
    badge: "FSSAI LICENSED",
    image: "/images/features/lab-tested.png",
  },
  {
    icon: Gem,
    title: "PREMIUM INGREDIENTS",
    description:
      "We source only the highest-grade raw materials globally. No fillers, no proprietary blends — complete label transparency.",
    badge: "NO FILLERS",
    image: "/images/features/premium-ingredients.png",
  },
  {
    icon: Target,
    title: "PERFORMANCE DRIVEN",
    description:
      "Formulated with clinically-dosed ingredients backed by peer-reviewed research. Designed for real-world results.",
    badge: "SCIENCE-BACKED",
    image: "/images/features/performance-driven.png",
  },
  {
    icon: ShieldAlert,
    title: "AUTHENTICITY VERIFIED",
    description:
      "Every product comes with a unique scratch code. Verify authenticity instantly on our website — because you deserve the real thing.",
    badge: "SECURE VERIFICATION",
    image: "/images/features/authenticity-verified.png",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export default function WhyKomando() {
  return (
    <section className="section-padding relative border-t border-[#1A1A1A] bg-[#0A0A0A]">
      {/* Background Image with Clear Visibility */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.25] pointer-events-none"
        style={{ backgroundImage: "url('/images/backgrounds/hero-bg.jpg')" }} 
      />
      {/* Balanced dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-[#0A0A0A]/75 to-[#0A0A0A] pointer-events-none" />

      <div className="container-main relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="text-[10px] font-black tracking-[0.3em] uppercase text-red-600 mb-3 block">
            ELITE PERFORMANCE METRICS
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-black uppercase tracking-tight text-white italic">
            THE KOMANDO DIFFERENCE
          </h2>
          <div className="w-16 h-[2px] bg-red-600 mx-auto mt-4 mb-4" />
          <p className="text-xs uppercase tracking-wider text-neutral-400 max-w-xl mx-auto">
            We don&apos;t just sell supplements — we engineer high-integrity chemical solutions for maximum human output.
          </p>
        </motion.div>

        {/* Feature Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="group relative rounded-none bg-[#111111] border border-neutral-800 hover:border-red-600 transition-all duration-300 overflow-hidden flex flex-col md:flex-row min-h-[260px] shadow-[0_4px_30px_rgba(0,0,0,0.4)] hover:shadow-[0_0_30px_rgba(255,26,26,0.15)]"
            >
              {/* Text content container */}
              <div className="flex-1 p-8 flex flex-col justify-between relative z-10 bg-gradient-to-r from-[#111111] via-[#111111] to-[#111111]/80 md:to-transparent">
                {/* Left edge red indicator on hover */}
                <div className="absolute left-0 top-0 w-[3px] h-0 bg-[#FF1A1A] group-hover:h-full transition-all duration-300" />
                
                <div>
                  {/* Top row: Icon + Badge */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-none bg-neutral-900 border border-neutral-850 flex items-center justify-center group-hover:border-[#FF1A1A] transition-colors duration-300">
                      <feature.icon className="w-5 h-5 text-[#FF1A1A]" />
                    </div>

                    <span className="text-[9px] font-mono tracking-widest text-neutral-400 bg-neutral-900 border border-neutral-850 px-2.5 py-1 rounded-none uppercase">
                      {feature.badge}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-display text-lg font-black italic tracking-tight text-white mb-2 uppercase group-hover:text-[#FF1A1A] transition-colors duration-300">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-[11px] font-sans tracking-wide text-neutral-400 leading-relaxed max-w-[280px] md:max-w-none">
                    {feature.description}
                  </p>
                </div>
              </div>

              {/* Premium Image container */}
              <div className="w-full md:w-[42%] h-[180px] md:h-auto relative overflow-hidden bg-neutral-950">
                {/* Image with zoom effect */}
                <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-110">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    fill
                    sizes="(max-w-768px) 100vw, 42vw"
                    className="object-cover opacity-85 group-hover:opacity-100 transition-opacity duration-300"
                  />
                </div>
                {/* Gradient overlays to blend the image seamlessly */}
                {/* Desktop Left-to-Right Fade */}
                <div className="hidden md:block absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#111111] to-transparent z-10" />
                {/* Mobile Top-to-Bottom Fade */}
                <div className="block md:hidden absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-[#111111] to-transparent z-10" />
                {/* Dark dynamic overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-red-950/10 group-hover:to-transparent transition-all duration-300 z-10" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
