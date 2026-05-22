"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Target } from "lucide-react";

const categories = [
  {
    name: "MASS GAINERS",
    slug: "mass-gainer",
    description: "HIGH-CALORIE MUSCLE FUEL",
    icon: Target,
    count: 2,
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
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

export default function CategorySection() {
  return (
    <section className="section-padding relative border-t border-[#1A1A1A] bg-[#0A0A0A]">
      {/* Background Image with Clear Visibility */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.35] pointer-events-none"
        style={{ backgroundImage: "url('/images/backgrounds/category-bg.jpg')" }} 
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
          className="text-center mb-12"
        >
          <span className="text-[10px] font-black tracking-[0.3em] uppercase text-red-600 mb-3 block">
            CLASSIFIED CATEGORIES
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-black uppercase tracking-tight text-white italic">
            TARGET ACQUISITION
          </h2>
          <div className="w-16 h-[2px] bg-red-600 mx-auto mt-4 mb-4" />
          <p className="text-xs uppercase tracking-wider text-neutral-400 max-w-lg mx-auto">
            Precision-engineered formulas calibrated for extreme output.
          </p>
        </motion.div>

        {/* Category Grid - Centered */}
        <div className="flex justify-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="w-full max-w-sm"
          >
            {categories.map((cat) => (
              <motion.div key={cat.slug} variants={itemVariants}>
                <Link
                  href={`/category/${cat.slug}`}
                  className="group relative flex flex-col justify-between p-8 bg-[#111111] border border-neutral-800 hover:border-red-600 transition-all duration-300 rounded-none h-64 overflow-hidden"
                >
                  {/* Subtle red outline accent */}
                  <div className="absolute top-0 left-0 w-[2px] h-0 bg-red-600 group-hover:h-full transition-all duration-300" />
                  
                  {/* Top Bar inside card */}
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500">
                      SEC_ID // 001
                    </span>
                    <span className="kmd-badge bg-neutral-900 group-hover:bg-red-600 border border-neutral-800 group-hover:border-red-600 text-white font-mono text-[9px] px-2.5 py-1">
                      {cat.count} AVAILABLE
                    </span>
                  </div>

                  {/* Icon & Details at bottom */}
                  <div className="mt-auto">
                    <div className="mb-4">
                      <cat.icon className="w-8 h-8 text-red-600 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <h3 className="font-display font-black text-2xl text-white italic tracking-tight mb-1 uppercase group-hover:text-red-500 transition-colors duration-300">
                      {cat.name}
                    </h3>
                    <p className="text-[10px] font-mono tracking-wider text-neutral-400">
                      {cat.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
