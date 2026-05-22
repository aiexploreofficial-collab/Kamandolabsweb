"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Check } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setEmail("");
    }, 4000);
  };

  return (
    <section className="relative overflow-hidden bg-red-600 py-16 md:py-20">
      {/* Background Image overlay for grit */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.2] pointer-events-none mix-blend-multiply"
        style={{ backgroundImage: "url('/images/backgrounds/newsletter-bg.jpg')" }} 
      />

      <div className="container-main relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center"
        >
          {/* Badge */}
          <span className="text-[10px] font-mono tracking-[0.3em] text-black bg-white px-3 py-1 font-bold uppercase mb-6 inline-block rounded-none select-none">
            JOIN THE INNER CIRCLE
          </span>

          {/* Headline */}
          <h2 className="font-display text-4xl md:text-5xl font-black text-white leading-none uppercase italic mb-4">
            GET EXCLUSIVE DROPS & EARLY ACCESS DEALS
          </h2>

          <p className="text-xs uppercase tracking-wider text-red-100 max-w-md mx-auto mb-8 font-mono">
            Be the first to secure new formulations, exclusive operations, and high-yield performance strategies.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ENTER EMAIL CODE //"
                required
                disabled={submitted}
                className="flex-1 px-5 py-3.5 rounded-none bg-[#111111] border border-neutral-900 focus:border-white text-white placeholder:text-neutral-600 text-xs font-mono transition-all duration-300 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={submitted}
                className="bg-black hover:bg-neutral-950 text-white font-black text-xs uppercase tracking-widest px-8 py-3.5 rounded-none transition-colors duration-300 flex items-center justify-center gap-2"
              >
                {submitted ? (
                  <>
                    <Check className="w-4.5 h-4.5 text-red-500" />
                    SECURED
                  </>
                ) : (
                  <>
                    SUBSCRIBE
                    <Send className="w-3 h-3" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Privacy note */}
          <p className="mt-4 text-[9px] font-mono tracking-widest text-red-200 uppercase">
            NO SPAM. ZERO WAFFLE. OPT OUT ANYTIME.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
