"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, ShieldAlert, Loader2, Sparkles, Phone, Package, Beaker, Weight, Hash } from "lucide-react";
import { isValidIndianPhone } from "@/lib/utils";

export default function VerificationForm() {
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
      const res = await fetch("/api/verify-product", {
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
            <p className="text-neutral-400 text-sm font-semibold tracking-wide animate-pulse">
              Running Cryptographic Check...
            </p>
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
                {/* Success Icon */}
                <div className="w-16 h-16 bg-emerald-950/10 border border-emerald-900/50 rounded-none flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-8 h-8 text-emerald-400" />
                </div>

                <h2 className="text-xl font-display font-black text-emerald-400 tracking-tight mb-1 uppercase italic">
                  ✓ 100% Genuine Product
                </h2>
                <p className="text-xs text-neutral-400 leading-relaxed max-w-sm mx-auto mb-6">
                  {result.message || "Your authenticity check succeeded. This product matches our high laboratory standards."}
                </p>

                {/* Product Detail Card */}
                <div className="bg-[#161616] border border-emerald-900/30 p-5 rounded-none text-left mb-6 flex flex-col gap-3">

                  {/* Product Name — always shown */}
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 bg-emerald-950/20 border border-emerald-900/30 rounded-none mt-0.5">
                      <Package className="w-3.5 h-3.5 text-emerald-500" />
                    </div>
                    <div>
                      <span className="text-neutral-500 block uppercase font-bold text-[9px] tracking-wider">Product</span>
                      <span className="font-black text-white mt-0.5 block uppercase italic text-sm">{result.productName}</span>
                    </div>
                  </div>

                  {/* Flavour — only if available */}
                  {result.flavour && (
                    <div className="flex items-start gap-3 pt-3 border-t border-neutral-800">
                      <div className="p-1.5 bg-emerald-950/20 border border-emerald-900/30 rounded-none mt-0.5">
                        <Beaker className="w-3.5 h-3.5 text-emerald-500" />
                      </div>
                      <div>
                        <span className="text-neutral-500 block uppercase font-bold text-[9px] tracking-wider">Flavour</span>
                        <span className="font-bold text-white mt-0.5 block uppercase text-xs">{result.flavour}</span>
                      </div>
                    </div>
                  )}

                  {/* Size — only if available */}
                  {result.size && (
                    <div className="flex items-start gap-3 pt-3 border-t border-neutral-800">
                      <div className="p-1.5 bg-emerald-950/20 border border-emerald-900/30 rounded-none mt-0.5">
                        <Weight className="w-3.5 h-3.5 text-emerald-500" />
                      </div>
                      <div>
                        <span className="text-neutral-500 block uppercase font-bold text-[9px] tracking-wider">Size / Weight</span>
                        <span className="font-bold text-white mt-0.5 block uppercase text-xs">{result.size}</span>
                      </div>
                    </div>
                  )}

                  {/* Variant Name — for legacy codes */}
                  {!result.size && result.variantName && (
                    <div className="flex items-start gap-3 pt-3 border-t border-neutral-800">
                      <div className="p-1.5 bg-emerald-950/20 border border-emerald-900/30 rounded-none mt-0.5">
                        <Weight className="w-3.5 h-3.5 text-emerald-500" />
                      </div>
                      <div>
                        <span className="text-neutral-500 block uppercase font-bold text-[9px] tracking-wider">Specification</span>
                        <span className="font-bold text-white mt-0.5 block uppercase text-xs">{result.variantName}</span>
                      </div>
                    </div>
                  )}

                  {/* Batch Code — only if available */}
                  {result.batchCode && (
                    <div className="flex items-start gap-3 pt-3 border-t border-neutral-800">
                      <div className="p-1.5 bg-emerald-950/20 border border-emerald-900/30 rounded-none mt-0.5">
                        <Hash className="w-3.5 h-3.5 text-emerald-500" />
                      </div>
                      <div>
                        <span className="text-neutral-500 block uppercase font-bold text-[9px] tracking-wider">Batch Code</span>
                        <span className="font-bold text-white mt-0.5 block font-mono text-xs tracking-wider">{result.batchCode}</span>
                      </div>
                    </div>
                  )}
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
                  <ShieldAlert className="w-8 h-8 text-red-500" />
                </div>

                <h2 className="text-xl font-display font-black text-red-500 tracking-tight mb-3 uppercase italic">
                  Already Verified
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
              <div className="bg-red-950/10 border border-red-900/50 text-red-500 p-3.5 rounded-none text-xs flex items-start gap-2">
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
              <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-2 flex items-center gap-1 block">
                <Phone className="w-3.5 h-3.5 text-red-600" /> Phone Number (To log verification audit)
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
  );
}
