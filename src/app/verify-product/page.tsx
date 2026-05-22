"use client";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import VerificationForm from "@/components/verification-form";
import { ShieldCheck, HelpCircle, Award, CheckCircle2, Lock, Flame } from "lucide-react";
import { motion } from "framer-motion";

export default function VerifyProductPage() {
  return (
    <div className="bg-[#0A0A0A] text-white min-h-screen flex flex-col relative overflow-hidden">
      <Navbar />

      <main className="container-main pt-32 pb-24 flex-1 flex items-center justify-center relative z-10">
        <div className="max-w-6xl w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
            
            {/* Left Side: Verification Form & Instructions */}
            <div className="lg:col-span-7 space-y-8">
              <div>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="inline-flex p-2.5 bg-red-600/10 border border-neutral-800 rounded-none mb-4"
                >
                  <ShieldCheck className="w-6 h-6 text-red-500" />
                </motion.div>
                <h1 className="font-display font-black text-3xl md:text-5xl text-white tracking-tight uppercase italic">
                  Authenticity <span className="text-red-500">Check</span>
                </h1>
                <p className="text-neutral-400 mt-3 text-xs md:text-sm uppercase tracking-wider max-w-xl leading-relaxed">
                  Protect your body with genuine products. Every official Komando Labs container comes equipped with a custom security label to verify its laboratory authenticity.
                </p>
              </div>

              <VerificationForm />

              {/* Guide helper info */}
              <div className="bg-[#111111] border border-neutral-800 p-5 rounded-none flex items-start gap-4 text-xs text-neutral-400 leading-normal">
                <HelpCircle className="w-5 h-5 text-red-500/70 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-display font-black uppercase text-neutral-200 mb-1">Where is my 12-digit scratch code?</h4>
                  <p className="text-neutral-400 font-mono text-[10px]">
                    Locate the official metallic hologram security sticker on your product lid. Carefully scratch the silver coating with a coin or card edge to reveal your unique authentication key.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side: Authenticity Visual Panel & Trust Badges */}
            <div className="lg:col-span-5 space-y-6">
              {/* Authenticity Badge Showcase Card */}
              <div className="bg-[#111111] border border-neutral-800 p-6 rounded-none relative overflow-hidden">
                <h3 className="font-display font-black text-lg text-white uppercase tracking-wider mb-6 flex items-center gap-2 italic">
                  <Flame className="w-4 h-4 text-red-500 animate-pulse" /> Security Standard
                </h3>

                <div className="space-y-4">
                  {/* Badge 1 */}
                  <div className="flex items-start gap-3.5 p-3 rounded-none hover:bg-neutral-900/40 transition-colors">
                    <div className="p-2 bg-[#0A0A0A] border border-neutral-800 rounded-none text-red-500">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-white uppercase tracking-wide">100% Lab Certified</h4>
                      <p className="text-[11px] text-neutral-500 mt-0.5 leading-normal">
                        Sourced and custom-engineered under strictly audited certified environments for maximum formulation purity.
                      </p>
                    </div>
                  </div>

                  {/* Badge 2 */}
                  <div className="flex items-start gap-3.5 p-3 rounded-none hover:bg-neutral-900/40 transition-colors">
                    <div className="p-2 bg-[#0A0A0A] border border-neutral-800 rounded-none text-red-500">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-white uppercase tracking-wide">Batch-Specific Traceability</h4>
                      <p className="text-[11px] text-neutral-500 mt-0.5 leading-normal">
                        Every container is stamped with batch numbers tied to precise physical factory run cycles.
                      </p>
                    </div>
                  </div>

                  {/* Badge 3 */}
                  <div className="flex items-start gap-3.5 p-3 rounded-none hover:bg-neutral-900/40 transition-colors">
                    <div className="p-2 bg-[#0A0A0A] border border-neutral-800 rounded-none text-red-500">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-white uppercase tracking-wide">Anti-Counterfeiting Network</h4>
                      <p className="text-[11px] text-neutral-500 mt-0.5 leading-normal">
                        Single-use cryptographic validation system keeps verification unique, secure, and tamper-proof.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Premium Verification Mockup Box */}
              <div className="bg-[#111111] border border-neutral-800 p-6 rounded-none text-center relative overflow-hidden">
                {/* Holographic illustration effect */}
                <div className="relative mx-auto w-36 h-20 bg-[#0A0A0A] border border-neutral-800 rounded-none flex flex-col items-center justify-center overflow-hidden mb-5 group">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-10 border border-dashed border-red-650/40 rounded-none flex items-center justify-center bg-red-950/10">
                    <span className="font-mono text-[9px] font-black text-red-500 tracking-[0.2em] select-none">SCRATCH CODE</span>
                  </div>
                  <div className="absolute bottom-1 right-2 text-[8px] font-mono text-neutral-600 uppercase font-bold tracking-wider">KOMANDO LABS</div>
                  <div className="absolute top-1 left-2 text-[8px] font-mono text-neutral-600 uppercase font-bold tracking-wider">ORIGINAL</div>
                </div>

                <h4 className="font-bold text-xs text-white uppercase tracking-widest mb-1.5">Hologram Verification Seal</h4>
                <p className="text-[11px] text-neutral-500 leading-normal max-w-xs mx-auto">
                  Ensure the seal packaging has not been broken, punctured, or pre-scratched prior to your validation attempt.
                </p>
              </div>

            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
