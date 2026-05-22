"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, Mail, Loader2, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError(res.error || "Invalid administrator credentials.");
      } else {
        router.refresh();
        router.push("/admin/dashboard");
      }
    } catch (err) {
      console.error(err);
      setError("Fulfillment server timeout.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0A0A0A] text-white min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Premium Visual Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/backgrounds/admin-login-bg.jpg"
          alt="Gym Texture Admin Login Background"
          fill
          priority
          className="object-cover object-center opacity-40 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-[#0A0A0A]/70 to-[#0A0A0A]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full bg-[#111111] border border-neutral-800 p-8 rounded-none relative z-10 overflow-hidden"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-red-600/10 border border-neutral-800 rounded-none mb-4">
            <ShieldCheck className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="font-display font-black text-2xl tracking-tight text-white uppercase italic">
            KOMANDO <span className="text-red-500">ADMIN</span>
          </h1>
          <p className="text-[10px] text-neutral-500 mt-2 font-bold tracking-wider uppercase">
            AUTHORISED ADMINISTRATOR LOGIN ONLY
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3.5 rounded-none text-xs mb-6 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span className="uppercase font-mono text-[10px]">{error}</span>
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-2 block">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@komandolabs.com"
                className="w-full bg-[#0A0A0A] border border-neutral-800 focus:border-red-650 rounded-none py-3 pl-10 pr-4 text-xs text-white outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-2 block">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#0A0A0A] border border-neutral-800 focus:border-red-650 rounded-none py-3 pl-10 pr-4 text-xs text-white outline-none transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3.5 px-6 rounded-none font-bold transition-all text-center flex items-center justify-center gap-2 mt-4"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : (
              "Sign In to Console"
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
