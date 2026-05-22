"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Check, Quote } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  title: string;
  comment: string;
  product: string;
  verified: boolean;
  date: string;
}

const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "ARJUN SHARMA",
    location: "DELHI",
    rating: 5,
    title: "GAINED SOLID MASS IN 3 MONTHS",
    comment:
      "HARD Mass Gainer has been a game-changer for me. As a hardgainer, I struggled for years to put on weight. Three months on this and I've finally started seeing real progress. Cookie With Cream flavor tastes amazing with cold milk. The scratch code verification gave me confidence it's genuine.",
    product: "HARD MASS GAINER",
    verified: true,
    date: "2 WEEKS AGO",
  },
  {
    id: "2",
    name: "PRIYA MENON",
    location: "MUMBAI",
    rating: 5,
    title: "BEST MASS GAINER I'VE TRIED IN INDIA",
    comment:
      "SPARTAN Mass Gainer is seriously good. The Chocolate Ice Cream flavor is rich without being too sweet. Mixes smooth with no lumps. I've been using it post-workout for 2 months and my recovery has improved noticeably. Love that Komando Labs verifies authenticity with scratch codes.",
    product: "SPARTAN MASS GAINER",
    verified: true,
    date: "1 MONTH AGO",
  },
  {
    id: "3",
    name: "RAHUL KUMAR",
    location: "BANGALORE",
    rating: 5,
    title: "FINALLY A BRAND I CAN TRUST",
    comment:
      "As a fitness coach, I only recommend verified brands to my clients. Komando Labs ticks all the boxes — third-party lab tested, transparent labels, scratch code authentication. Switched two of my clients to HARD Mass Gainer and both are seeing great results.",
    product: "HARD MASS GAINER",
    verified: true,
    date: "3 WEEKS AGO",
  },
  {
    id: "4",
    name: "VIKRAM PATEL",
    location: "AHMEDABAD",
    rating: 5,
    title: "GREAT TASTE AND REAL INGREDIENTS",
    comment:
      "I was skeptical about trying a new brand, but SPARTAN Mass Gainer exceeded my expectations. The chocolate flavor actually tastes good — not chalky at all. The label is fully transparent and the FSSAI certification gives me peace of mind. Will definitely repurchase.",
    product: "SPARTAN MASS GAINER",
    verified: true,
    date: "1 WEEK AGO",
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const paginate = (dir: number) => {
    setDirection(dir);
    setCurrent((prev) => {
      if (dir === 1) return prev === testimonials.length - 1 ? 0 : prev + 1;
      return prev === 0 ? testimonials.length - 1 : prev - 1;
    });
  };

  const slideVariants = {
    enter: (d: number) => ({
      x: d > 0 ? 80 : -80,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (d: number) => ({
      x: d < 0 ? 80 : -80,
      opacity: 0,
    }),
  };

  const t = testimonials[current];

  return (
    <section className="section-padding relative border-t border-[#1A1A1A] bg-[#0A0A0A]">
      {/* Background Image with Balanced Visibility */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.25] pointer-events-none"
        style={{ backgroundImage: "url('/images/backgrounds/testimonials-bg.jpg')" }} 
      />
      {/* Dark matte overlay */}
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
            BATTLE TESTED REVIEWS
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-black uppercase tracking-tight text-white italic">
            TRUSTED BY ATHLETES
          </h2>
          <div className="w-16 h-[2px] bg-red-600 mx-auto mt-4 mb-4" />
          <p className="text-xs uppercase tracking-wider text-neutral-400 max-w-lg mx-auto">
            Real feedback from high-intensity performers operating across India.
          </p>
        </motion.div>

        {/* Testimonial Carousel */}
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            {/* Main Card */}
            <div className="relative min-h-[340px] md:min-h-[290px]">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={t.id}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="absolute inset-0"
                >
                  <div className="rounded-none bg-[#111111] border border-neutral-800 p-8 md:p-10 h-full flex flex-col justify-between relative">
                    <div className="absolute left-0 top-0 w-[3px] h-full bg-red-600" />
                    
                    <div>
                      {/* Quote icon & Stars Row */}
                      <div className="flex justify-between items-start mb-4">
                        <Quote className="w-8 h-8 text-red-600/10" />
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3.5 h-3.5 ${
                                star <= t.rating
                                  ? "fill-amber-500 text-amber-500"
                                  : "fill-neutral-800 text-neutral-800"
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="font-display text-lg font-black tracking-tight text-white mb-2 uppercase italic">
                        {t.title}
                      </h3>

                      {/* Comment */}
                      <p className="text-xs text-neutral-400 leading-relaxed mb-6 font-sans">
                        {t.comment}
                      </p>
                    </div>

                    {/* Author & Info */}
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-neutral-850">
                      <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div className="w-10 h-10 rounded-none bg-neutral-900 border border-neutral-850 flex items-center justify-center">
                          <span className="font-display font-black text-sm text-red-600">
                            {t.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-white uppercase tracking-wider">
                              {t.name}
                            </span>
                            {t.verified && (
                              <span className="flex items-center gap-0.5 text-[8px] font-mono bg-neutral-900 border border-neutral-850 px-1 py-0.5 text-neutral-400">
                                <Check className="w-2.5 h-2.5 text-red-600" /> VERIFIED
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mt-0.5 block">
                            {t.location} // {t.date}
                          </span>
                        </div>
                      </div>

                      {/* Product badge */}
                      <span className="hidden sm:inline-flex text-[9px] font-mono tracking-widest text-neutral-400 bg-neutral-900 border border-neutral-850 px-3 py-1.5 rounded-none">
                        {t.product}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={() => paginate(-1)}
                className="p-2.5 rounded-none bg-[#111111] border border-neutral-800 hover:border-red-650 hover:bg-[#161616] text-neutral-400 hover:text-white transition-all duration-300"
                aria-label="Previous review"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Dots */}
              <div className="flex items-center gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setDirection(i > current ? 1 : -1);
                      setCurrent(i);
                    }}
                    className={`h-1 transition-all duration-300 rounded-none ${
                      i === current
                        ? "w-6 bg-red-600"
                        : "w-2 bg-neutral-800 hover:bg-neutral-600"
                    }`}
                    aria-label={`Go to review ${i + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={() => paginate(1)}
                className="p-2.5 rounded-none bg-[#111111] border border-neutral-800 hover:border-red-650 hover:bg-[#161616] text-neutral-400 hover:text-white transition-all duration-300"
                aria-label="Next review"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
