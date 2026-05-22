"use client";

import { useState } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, ShieldAlert, Award, Loader2, Sparkles, Phone, HelpCircle } from "lucide-react";
import { isValidIndianPhone } from "@/lib/utils";
import Image from "next/image";

export default function VerificationPage() {
  const [code, setCode] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResult(null);

    if (!code.trim()) {
      setError("Please enter the scratch code.");
      return;
    }
    if (!isValidIndianPhone(phone)) {
      setError("Please enter a valid 10-digit Indian phone number.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, phone }),
      });

      const data = await res.json();
      if (res.ok) {
        setResult(data);
      } else {
        setError(data.error || "Failed to verify. Please try again.");
        if (data.status) {
          setResult(data);
        }
      }
    } catch (err) {
      console.error(err);
      setError("Fulfillment server timeout. Please check connectivity.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0A0A0A] text-white min-h-screen flex flex-col">
      <Navbar />

      <main className="container-main pt-28 pb-16 flex-1 flex flex-col items-center justify-center">
        <div className="max-w-xl w-full">
          
          {/* Header */}
          <div className="text-center mb-10">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex p-3 bg-red-950/10 border border-red-900/50 rounded-none mb-4"
            >
              <ShieldCheck className="w-8 h-8 text-red-600" />
            </motion.div>
            <h1 className="font-display font-black text-3xl md:text-4xl text-white tracking-tight uppercase italic">
              AUTHENTICITY <span className="text-red-650">CHECK</span>
            </h1>
            <p className="text-neutral-400 mt-3 text-xs md:text-sm max-w-sm mx-auto leading-relaxed">
              Verify your Komando Labs product authenticity. Scratch the security label on your container to reveal your 12-digit code.
            </p>
          </div>

          {/* Form / Result Board */}
          <div className="bg-[#111111] border border-neutral-800 p-6 md:p-8 rounded-none relative overflow-hidden shadow-2xl">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loader"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-16 text-center flex flex-col items-center justify-center gap-4"
                >
                  <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
                  <p className="text-neutral-400 text-sm font-semibold tracking-wide animate-pulse">Running Cryptographic Check...</p>
                </motion.div>
              ) : result ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="py-4"
                >
                  {result.status === "VALID" || result.status === "VALID_ALREADY_VERIFIED_BY_YOU" ? (
                    <div className="text-center">
                      <div className="w-16 h-16 bg-emerald-950/10 border border-emerald-900/50 rounded-none flex items-center justify-center mx-auto mb-6">
                        <Sparkles className="w-8 h-8 text-emerald-400" />
                      </div>
                      
                      <h2 className="text-xl font-display font-black text-emerald-400 tracking-tight mb-2 uppercase italic">
                        100% GENUINE PRODUCT
                      </h2>
                      
                      <p className="text-xs text-neutral-400 leading-relaxed max-w-sm mx-auto mb-6">
                        {result.message || "Your authenticity check succeeded. This product matches our high laboratory standards."}
                      </p>

                      <div className="bg-[#161616] border border-neutral-800 p-4 rounded-none text-left text-xs mb-6 flex flex-col gap-2">
                        <div>
                          <span className="text-neutral-500 block uppercase font-bold text-[9px]">Product</span>
                          <span className="font-bold text-white mt-0.5 block uppercase italic">{result.productName}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-1 pt-2 border-t border-neutral-800">
                          <div>
                            <span className="text-neutral-500 block uppercase font-bold text-[9px]">Specification</span>
                            <span className="font-bold text-white mt-0.5 block uppercase">{result.variantName}</span>
                          </div>
                          <div>
                            <span className="text-neutral-500 block uppercase font-bold text-[9px]">Batch Code</span>
                            <span className="font-bold text-white mt-0.5 block font-mono">{result.batch || "KMD-L2"}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => setResult(null)}
                        className="text-xs font-bold text-neutral-400 hover:text-white transition-colors uppercase tracking-wider"
                      >
                        Verify Another Code
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="w-16 h-16 bg-red-950/10 border border-red-900/50 rounded-none flex items-center justify-center mx-auto mb-6">
                        <ShieldAlert className="w-8 h-8 text-red-650" />
                      </div>

                      <h2 className="text-xl font-display font-black text-red-650 tracking-tight mb-3 uppercase italic">
                        SECURITY ALERT
                      </h2>

                      <div className="bg-red-950/10 border border-red-900/50 p-4 rounded-none text-left text-xs text-neutral-300 leading-relaxed mb-6 font-semibold">
                        {result.error}
                      </div>

                      <button
                        onClick={() => setResult(null)}
                        className="btn-primary py-2.5 px-6 rounded-none text-xs font-bold"
                      >
                        Try Again
                      </button>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col gap-5"
                >
                  {error && (
                    <div className="bg-red-950/10 border border-red-900/50 text-red-600 p-3.5 rounded-none text-xs flex items-start gap-2">
                      <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-2 block">
                      12-Digit Security Scratch Code
                    </label>
                    <input
                      type="text"
                      required
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="e.g. KMD8392JS72A"
                      className="w-full bg-[#161616] border border-neutral-800 focus:border-red-600 rounded-none px-4 py-3 text-sm text-white font-mono tracking-widest outline-none uppercase transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-2 block flex items-center gap-1">
                      <Phone className="w-3 h-3 text-red-600" /> Phone Number (To log verification audit)
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="10-Digit Mobile Number"
                      className="w-full bg-[#161616] border border-neutral-800 focus:border-red-600 rounded-none px-4 py-3 text-xs text-white outline-none transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-primary w-full py-3 px-6 rounded-none font-bold transition-all text-center mt-2"
                  >
                    Authenticate Now
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* Guide helper info */}
          <div className="mt-8 bg-[#111111] border border-neutral-800 p-4 rounded-none flex items-start gap-3.5 text-xs text-neutral-400 leading-normal">
            <HelpCircle className="w-5 h-5 text-neutral-600 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-neutral-350 mb-0.5 uppercase tracking-wider">Where can I find the code?</h4>
              <p>Every genuine box of Komando Labs supplements contains a security seal label on the lid. Gently scratch with a coin to reveal your unique 12-digit code.</p>
            </div>
          </div>

        </div>

        {/* HOW TO VERIFY YOUR PRODUCT Instruction Section */}
        <div className="w-full max-w-5xl mt-20 border-t border-neutral-900 pt-16">
          <div className="text-center mb-12">
            <h2 className="font-display font-black text-2xl md:text-3xl text-white tracking-tight uppercase italic">
              HOW TO VERIFY YOUR PRODUCT
            </h2>
            <p className="text-neutral-400 mt-2 text-xs md:text-sm max-w-lg mx-auto uppercase font-bold tracking-wider">
              Follow these 3 simple steps to verify your Komando Labs product authenticity.
            </p>
          </div>

          {/* 3 Step Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            
            {/* Step 1 */}
            <motion.div 
              whileHover={{ y: -4 }}
              className="bg-[#111111] border border-neutral-800 p-6 rounded-none flex flex-col justify-between transition-all hover:border-red-600 group"
            >
              <div>
                <div className="flex justify-between items-start mb-6">
                  <span className="text-[10px] font-mono font-bold text-red-500 uppercase tracking-widest bg-red-950/20 px-2.5 py-1 border border-red-900/30 rounded-none">
                    Step 01
                  </span>
                </div>
                
                {/* Step Image */}
                <div className="aspect-[4/3] w-full bg-[#161616] border border-neutral-800 flex items-center justify-center mb-6 relative overflow-hidden group-hover:border-neutral-700 transition-all rounded-none">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/90 via-transparent to-transparent z-10" />
                  <Image
                    src="/images/verification/step1-scratch.png"
                    alt="Scratch Security Label"
                    fill
                    className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="relative z-20 flex flex-col items-center">
                    <div className="w-12 h-12 bg-neutral-900/90 border border-red-600/30 rounded-none flex items-center justify-center shadow-lg">
                      <Award className="w-6 h-6 text-red-500" />
                    </div>
                  </div>
                </div>

                <h3 className="font-display font-black text-lg text-white uppercase italic tracking-tight mb-2">
                  Scratch Security Label
                </h3>
                <p className="text-neutral-400 text-xs leading-relaxed">
                  Locate the security label on your Komando Labs product and scratch carefully to reveal the hidden 12-digit code.
                </p>
              </div>
            </motion.div>

            {/* Step 2 */}
            <motion.div 
              whileHover={{ y: -4 }}
              className="bg-[#111111] border border-neutral-800 p-6 rounded-none flex flex-col justify-between transition-all hover:border-red-600 group"
            >
              <div>
                <div className="flex justify-between items-start mb-6">
                  <span className="text-[10px] font-mono font-bold text-red-500 uppercase tracking-widest bg-red-950/20 px-2.5 py-1 border border-red-900/30 rounded-none">
                    Step 02
                  </span>
                </div>
                
                {/* Step Image */}
                <div className="aspect-[4/3] w-full bg-[#161616] border border-neutral-800 flex items-center justify-center mb-6 relative overflow-hidden group-hover:border-neutral-700 transition-all rounded-none">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/90 via-transparent to-transparent z-10" />
                  <Image
                    src="/images/verification/step2-code.png"
                    alt="Enter Verification Code"
                    fill
                    className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="relative z-20 flex flex-col items-center">
                    <div className="w-12 h-12 bg-neutral-900/90 border border-red-600/30 rounded-none flex items-center justify-center shadow-lg">
                      <Phone className="w-5 h-5 text-red-500" />
                    </div>
                  </div>
                </div>

                <h3 className="font-display font-black text-lg text-white uppercase italic tracking-tight mb-2">
                  Enter Verification Code
                </h3>
                <p className="text-neutral-400 text-xs leading-relaxed">
                  Enter your 12-digit scratch code along with your phone number in the verification form above.
                </p>
              </div>
            </motion.div>

            {/* Step 3 */}
            <motion.div 
              whileHover={{ y: -4 }}
              className="bg-[#111111] border border-neutral-800 p-6 rounded-none flex flex-col justify-between transition-all hover:border-red-600 group"
            >
              <div>
                <div className="flex justify-between items-start mb-6">
                  <span className="text-[10px] font-mono font-bold text-red-500 uppercase tracking-widest bg-red-950/20 px-2.5 py-1 border border-red-900/30 rounded-none">
                    Step 03
                  </span>
                </div>
                
                {/* Step Image */}
                <div className="aspect-[4/3] w-full bg-[#161616] border border-neutral-800 flex items-center justify-center mb-6 relative overflow-hidden group-hover:border-neutral-700 transition-all rounded-none">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/90 via-transparent to-transparent z-10" />
                  <Image
                    src="/images/verification/step3-result.png"
                    alt="Get Authenticity Result"
                    fill
                    className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="relative z-20 flex flex-col items-center">
                    <div className="w-12 h-12 bg-neutral-900/90 border border-red-600/30 rounded-none flex items-center justify-center shadow-lg">
                      <ShieldCheck className="w-6 h-6 text-red-500" />
                    </div>
                  </div>
                </div>

                <h3 className="font-display font-black text-lg text-white uppercase italic tracking-tight mb-2">
                  Get Authenticity Result
                </h3>
                <p className="text-neutral-400 text-xs leading-relaxed">
                  Instantly know whether your product is genuine and securely verified by Komando Labs.
                </p>
              </div>
            </motion.div>

          </div>

          {/* Why Verify Info Strip */}
          <div className="mt-12 bg-[#111111] border border-neutral-800 p-8 rounded-none relative overflow-hidden">
            {/* Subtle top border accent */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-red-600" />
            
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="text-center lg:text-left">
                <span className="text-[10px] font-mono font-bold text-red-500 uppercase tracking-widest block mb-1">Authenticity Safeguard</span>
                <h3 className="font-display font-black text-xl md:text-2xl text-white tracking-tight uppercase italic">
                  WHY VERIFY?
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full lg:w-auto flex-1 max-w-4xl lg:ml-8">
                {/* Benefit 1 */}
                <div className="flex items-center gap-3 bg-[#161616] p-4 border border-neutral-800 hover:border-neutral-700 transition-all rounded-none">
                  <div className="w-8 h-8 rounded-none bg-red-950/20 border border-red-900/40 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-4 h-4 text-red-500" />
                  </div>
                  <span className="text-xs font-bold text-neutral-200 uppercase tracking-wider">Prevent fake products</span>
                </div>

                {/* Benefit 2 */}
                <div className="flex items-center gap-3 bg-[#161616] p-4 border border-neutral-800 hover:border-neutral-700 transition-all rounded-none">
                  <div className="w-8 h-8 rounded-none bg-red-950/20 border border-red-900/40 flex items-center justify-center flex-shrink-0">
                    <Award className="w-4 h-4 text-red-500" />
                  </div>
                  <span className="text-xs font-bold text-neutral-200 uppercase tracking-wider">Confirm genuine purchase</span>
                </div>

                {/* Benefit 3 */}
                <div className="flex items-center gap-3 bg-[#161616] p-4 border border-neutral-800 hover:border-neutral-700 transition-all rounded-none">
                  <div className="w-8 h-8 rounded-none bg-red-950/20 border border-red-900/40 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-4 h-4 text-red-500" />
                  </div>
                  <span className="text-xs font-bold text-neutral-200 uppercase tracking-wider">Track verification securely</span>
                </div>

                {/* Benefit 4 */}
                <div className="flex items-center gap-3 bg-[#161616] p-4 border border-neutral-800 hover:border-neutral-700 transition-all rounded-none">
                  <div className="w-8 h-8 rounded-none bg-red-950/20 border border-red-900/40 flex items-center justify-center flex-shrink-0">
                    <Award className="w-4 h-4 text-red-500" />
                  </div>
                  <span className="text-xs font-bold text-neutral-200 uppercase tracking-wider">Build customer trust</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
