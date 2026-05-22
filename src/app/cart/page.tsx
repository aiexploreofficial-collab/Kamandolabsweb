"use client";

import React, { useState } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { Trash2, ShoppingBag, ArrowRight, ShieldCheck, Ticket, AlertCircle, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, cartTotal, cartCount } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState("");
  const [couponSuccessMsg, setCouponSuccessMsg] = useState("");

  // Calculations
  const shippingCharge = cartTotal >= 1500 || cartTotal === 0 ? 0 : 99;
  
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === "FLAT") {
      discountAmount = Number(appliedCoupon.value);
    } else if (appliedCoupon.type === "PERCENTAGE") {
      discountAmount = (cartTotal * Number(appliedCoupon.value)) / 100;
      if (appliedCoupon.maxDiscount && discountAmount > Number(appliedCoupon.maxDiscount)) {
        discountAmount = Number(appliedCoupon.maxDiscount);
      }
    }
    if (discountAmount > cartTotal) discountAmount = cartTotal;
  }

  const finalTotal = cartTotal + shippingCharge - discountAmount;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setValidatingCoupon(true);
    setCouponError("");
    setCouponSuccessMsg("");

    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: couponCode.toUpperCase().trim(),
          cartValue: cartTotal,
          phone: "0000000000", // Placeholder for initial guest preview
        }),
      });

      const data = await res.json();
      if (res.ok && data.valid) {
        setAppliedCoupon(data.coupon);
        setCouponSuccessMsg(`Coupon "${couponCode.toUpperCase()}" applied successfully!`);
      } else {
        setCouponError(data.error || "Invalid coupon code.");
        setAppliedCoupon(null);
      }
    } catch (err) {
      console.error(err);
      setCouponError("Failed to validate coupon code.");
      setAppliedCoupon(null);
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponSuccessMsg("");
    setCouponError("");
  };

  return (
    <div className="bg-[#0A0A0A] text-white min-h-screen flex flex-col justify-between">
      <Navbar />

      <main className="container-main pt-28 pb-16 flex-1">
        <h1 className="font-display font-black text-3xl md:text-4xl text-white tracking-tight mb-8 uppercase italic">
          SHOPPING <span className="text-red-650">CART</span>
        </h1>

        {cart.length === 0 ? (
          <div className="py-24 text-center border border-dashed border-neutral-800 rounded-none max-w-xl mx-auto bg-[#111111]">
            <ShoppingBag className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold uppercase italic">Your Cart is Empty</h2>
            <p className="text-neutral-400 mt-2 text-sm max-w-xs mx-auto">
              Ready to command your strength? Head back to the store to load up on premium supplements.
            </p>
            <Link
              href="/shop"
              className="mt-8 inline-block btn-primary px-8 py-3.5 text-xs font-bold uppercase tracking-wider"
            >
              Shop All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Cart Items List (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              <AnimatePresence>
                {cart.map((item) => (
                  <motion.div
                    key={item.variantId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="flex flex-col sm:flex-row items-center gap-4 bg-[#111111] border border-neutral-800 p-5 rounded-none justify-between hover:border-neutral-700 transition-colors duration-200"
                  >
                    {/* Visual Thumbnail */}
                    <div className="aspect-square w-20 bg-[#161616] border border-neutral-800 rounded-none flex items-center justify-center overflow-hidden flex-shrink-0 relative">
                      <Image
                        src={item.image && (item.image.startsWith("/") || item.image.startsWith("http")) ? item.image : "/images/placeholders/jar-placeholder.png"}
                        alt={item.productName}
                        fill
                        sizes="80px"
                        className="object-contain p-2"
                      />
                    </div>

                    {/* Title & Flavor Description */}
                    <div className="flex-1 text-center sm:text-left min-w-0">
                      <Link href={`/shop/${item.slug}`} className="block">
                        <h3 className="font-bold text-base text-white hover:text-red-605 transition-colors leading-snug truncate uppercase italic">
                          {item.productName}
                        </h3>
                      </Link>
                      <p className="text-[10px] text-neutral-400 font-extrabold uppercase tracking-wider mt-1">
                        {item.variantName}
                      </p>
                      <span className="text-sm font-bold text-neutral-300 mt-2 block sm:hidden">
                        {formatPrice(item.price)}
                      </span>
                    </div>

                    {/* Adjusters Row */}
                    <div className="flex flex-row items-center gap-6 justify-between w-full sm:w-auto mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-neutral-800">
                      {/* Counter */}
                      <div className="flex items-center bg-[#161616] border border-neutral-800 rounded-none overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          className="px-3.5 py-2.5 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors text-sm font-bold"
                        >
                          -
                        </button>
                        <span className="px-2 text-sm font-black text-white w-6 text-center select-none">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          className="px-3.5 py-2.5 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors text-sm font-bold"
                        >
                          +
                        </button>
                      </div>

                      {/* Total line item price */}
                      <div className="text-right min-w-[80px]">
                        <span className="text-base font-black text-white block">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                        <span className="text-[10px] text-neutral-400">
                          {formatPrice(item.price)} each
                        </span>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.variantId)}
                        className="text-neutral-500 hover:text-red-650 hover:bg-neutral-800 transition-colors p-2 rounded-none"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-[18px] h-[18px]" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Checkout Pricing Sidebar (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Coupon Form */}
              <div className="bg-[#111111] border border-neutral-800 p-6 rounded-none">
                <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider mb-4 flex items-center gap-2 italic">
                  <Ticket className="w-4 h-4 text-red-600" /> Apply Coupon Code
                </h3>
                
                {appliedCoupon ? (
                  <div className="bg-emerald-950/10 border border-emerald-900/50 text-emerald-400 p-4 rounded-none flex items-center justify-between text-xs font-semibold">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Applied: <strong className="text-white">{appliedCoupon.code}</strong></span>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-[10px] uppercase font-bold text-neutral-400 hover:text-white"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="ENTER COUPON CODE"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      disabled={validatingCoupon}
                      className="flex-1 bg-[#161616] border border-neutral-800 focus:border-red-600 rounded-none px-4 py-2.5 text-xs text-white uppercase outline-none transition-all font-bold tracking-wider disabled:opacity-50"
                    />
                    <button
                      type="submit"
                      disabled={validatingCoupon || !couponCode.trim()}
                      className="bg-neutral-850 hover:bg-neutral-800 border border-neutral-800 text-xs font-bold px-4 py-2.5 rounded-none transition-all uppercase"
                    >
                      {validatingCoupon ? "Checking..." : "Apply"}
                    </button>
                  </form>
                )}

                {couponError && (
                  <div className="text-red-600 text-xs mt-2.5 flex items-center gap-1.5 bg-red-950/10 p-2.5 rounded-none border border-red-900/50">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{couponError}</span>
                  </div>
                )}
                {couponSuccessMsg && (
                  <div className="text-emerald-400 text-xs mt-2.5 flex items-center gap-1.5 bg-emerald-950/10 p-2.5 rounded-none border border-emerald-900/50">
                    <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{couponSuccessMsg}</span>
                  </div>
                )}
              </div>

              {/* Order Summary Pricing Card */}
              <div className="bg-[#111111] border border-neutral-800 p-6 rounded-none space-y-4">
                <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider pb-3 border-b border-neutral-800 italic">
                  Order Summary
                </h3>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-neutral-400">
                    <span>Items Subtotal</span>
                    <span className="font-bold text-white">{formatPrice(cartTotal)}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Coupon Discount</span>
                      <span className="font-bold">-{formatPrice(discountAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-neutral-400">
                    <span>Shipping Charges</span>
                    <span className="font-bold text-white">
                      {shippingCharge === 0 ? "FREE" : formatPrice(shippingCharge)}
                    </span>
                  </div>
                </div>

                <div className="border-t border-neutral-800 pt-4 flex justify-between items-baseline">
                  <span className="text-sm text-neutral-400 font-bold uppercase">Final Total</span>
                  <span className="text-2xl font-black text-white">{formatPrice(finalTotal)}</span>
                </div>

                <Link
                  href="/checkout"
                  className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-red-600 hover:bg-red-700 text-sm font-bold uppercase tracking-wider text-white rounded-none transition-all"
                >
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="pt-2 flex items-center gap-2 text-[10px] text-neutral-500 justify-center">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Secure Guest COD Checkout Only</span>
                </div>
              </div>

            </div>

          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
