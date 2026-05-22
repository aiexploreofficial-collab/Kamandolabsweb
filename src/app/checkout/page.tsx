"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { useCart } from "@/context/cart-context";
import { formatPrice, isValidIndianPhone } from "@/lib/utils";
import { ShieldCheck, Ticket, Check, Truck, AlertTriangle } from "lucide-react";
import Image from "next/image";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartTotal, clearCart } = useCart();

  // Form inputs
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);

  // General checkout state
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<string[]>([]);

  useEffect(() => {
    if (cart.length === 0) {
      router.push("/cart");
    }
  }, [cart, router]);

  // Shipping cost logic
  const shippingCharge = cartTotal >= 1500 ? 0 : 99;
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const finalTotal = cartTotal + shippingCharge - discountAmount;

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    if (!phone) {
      setCouponError("Please enter your phone number first to validate coupon eligibility.");
      return;
    }
    if (!isValidIndianPhone(phone)) {
      setCouponError("Please enter a valid 10-digit Indian phone number.");
      return;
    }

    setCouponLoading(true);
    setCouponError("");
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: couponCode,
          cartValue: cartTotal,
          phone,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setAppliedCoupon(data);
      } else {
        setCouponError(data.error || "Failed to validate coupon");
        setAppliedCoupon(null);
      }
    } catch (err) {
      console.error(err);
      setCouponError("Failed to validate coupon");
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors([]);

    // Validations
    const errors = [];
    if (!isValidIndianPhone(phone)) {
      errors.push("Please provide a valid 10-digit mobile number starting with 6-9.");
    }
    if (zip.length !== 6 || isNaN(Number(zip))) {
      errors.push("Please enter a valid 6-digit pin code.");
    }

    if (errors.length > 0) {
      setFormErrors(errors);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          address: { street, city, state, zip },
          items: cart.map((item) => ({
            variantId: item.variantId,
            quantity: item.quantity,
          })),
          couponCode: appliedCoupon ? appliedCoupon.code : null,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        clearCart();
        router.push(`/checkout/success?orderNumber=${data.order.orderNumber}`);
      } else {
        setFormErrors([data.error || "Failed to submit checkout order."]);
      }
    } catch (err) {
      console.error(err);
      setFormErrors(["Failed to establish secure connection to checkout server."]);
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) return null;

  return (
    <div className="bg-[#0A0A0A] text-white min-h-screen flex flex-col relative overflow-hidden">
      <Navbar />

      {/* Premium Visual Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/backgrounds/checkout-bg.jpg"
          alt="Gym Texture Checkout Background"
          fill
          priority
          className="object-cover object-center opacity-40 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-[#0A0A0A]/70 to-[#0A0A0A]" />
      </div>

      <main className="container-main pt-28 pb-16 flex-1 relative z-10">
        <h1 className="font-display font-black text-3xl md:text-4xl text-white tracking-tight mb-10 uppercase italic">
          SECURE <span className="text-red-650">CHECKOUT</span>
        </h1>

        {formErrors.length > 0 && (
          <div className="bg-red-950/10 border border-red-900/50 text-red-600 p-4 rounded-none text-xs mb-8 flex flex-col gap-1.5">
            {formErrors.map((err, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{err}</span>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleCheckoutSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Shipping form (Left Column) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="bg-[#111111] border border-neutral-800 p-6 md:p-8 rounded-none">
              <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-400 mb-6 italic">1. Delivery Address</h2>
              
              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5 block">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#161616] border border-neutral-800 focus:border-red-600 rounded-none px-4 py-2.5 text-xs text-white outline-none transition-all"
                    placeholder="Rahul Sharma"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5 block">Mobile Number (For COD verification)</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-[#161616] border border-neutral-800 focus:border-red-600 rounded-none px-4 py-2.5 text-xs text-white outline-none transition-all"
                      placeholder="e.g. 9876543210"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5 block">Email Address (Optional)</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#161616] border border-neutral-800 focus:border-red-600 rounded-none px-4 py-2.5 text-xs text-white outline-none transition-all"
                      placeholder="rahul@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5 block">Street Address</label>
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="w-full bg-[#161616] border border-neutral-800 focus:border-red-600 rounded-none px-4 py-2.5 text-xs text-white outline-none transition-all"
                    placeholder="Flat No, Wing, Building Name, Street"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5 block">City</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-[#161616] border border-neutral-800 focus:border-red-600 rounded-none px-4 py-2.5 text-xs text-white outline-none transition-all"
                      placeholder="e.g. Mumbai"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5 block">Pin Code</label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      className="w-full bg-[#161616] border border-neutral-800 focus:border-red-600 rounded-none px-4 py-2.5 text-xs text-white outline-none transition-all font-mono"
                      placeholder="400001"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5 block">State</label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full bg-[#161616] border border-neutral-800 focus:border-red-600 rounded-none px-4 py-2.5 text-xs text-white outline-none transition-all"
                    placeholder="e.g. Maharashtra"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Option */}
            <div className="bg-[#111111] border border-neutral-800 p-6 md:p-8 rounded-none">
              <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-400 mb-4 italic">2. Payment Method</h2>
              
              <div className="p-4 bg-red-950/10 border border-red-900/50 rounded-none flex items-start gap-4">
                <input
                  type="radio"
                  id="cod"
                  name="payment"
                  defaultChecked
                  className="mt-1 h-4 w-4 border-neutral-800 bg-[#161616] text-red-600 focus:ring-red-600 outline-none cursor-pointer rounded-none"
                />
                <label htmlFor="cod" className="cursor-pointer">
                  <span className="text-xs font-bold text-white block uppercase tracking-wider">Cash on Delivery (COD)</span>
                  <span className="text-[11px] text-neutral-400 block mt-1 leading-normal">
                    Due to custom regional fulfillment rules, we offer COD only. Double security checks and verification codes are applied to prevent fraud attempts.
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Pricing summary + Coupons (Right Column) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Promo Code box */}
            <div className="bg-[#111111] border border-neutral-800 p-6 rounded-none">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-4 italic">Apply Promo Code</h3>
              
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-emerald-950/10 border border-emerald-900/50 text-emerald-400 p-3 rounded-none">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    <div>
                      <span className="text-xs font-black uppercase tracking-wider block">{appliedCoupon.code} Applied</span>
                      <span className="text-[10px] text-neutral-400 font-bold">Discount of {formatPrice(appliedCoupon.discountAmount)}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="text-xs font-bold text-red-400 hover:text-red-350"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Ticket className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter Coupon Code"
                      className="w-full bg-[#161616] border border-neutral-800 focus:border-red-600 rounded-none py-2.5 pl-10 pr-4 text-xs text-white uppercase outline-none transition-all"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={couponLoading || !couponCode}
                    className="bg-neutral-800 text-white hover:bg-neutral-700 disabled:bg-neutral-900 disabled:text-neutral-600 px-4 rounded-none text-xs font-bold transition-all uppercase"
                  >
                    {couponLoading ? "Checking..." : "Apply"}
                  </button>
                </div>
              )}

              {couponError && (
                <p className="text-[11px] text-red-600 font-medium mt-2">{couponError}</p>
              )}
            </div>

            {/* Total Pricing panel */}
            <div className="bg-[#111111] border border-neutral-800 p-6 rounded-none">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-6 italic">Checkout Summary</h3>
              
              <div className="flex flex-col gap-4 border-b border-neutral-800 pb-6 mb-6 text-xs">
                {cart.map((item) => (
                  <div key={item.variantId} className="flex justify-between items-center text-neutral-400 gap-4">
                    <span className="line-clamp-1 uppercase font-semibold">{item.productName} <strong className="text-neutral-500 font-normal">x{item.quantity}</strong></span>
                    <span className="font-bold text-white flex-shrink-0">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-4 border-b border-neutral-800 pb-6 mb-6 text-xs">
                <div className="flex justify-between text-neutral-400">
                  <span>Subtotal</span>
                  <span className="font-bold text-white">{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Shipping (COD charges)</span>
                  {shippingCharge === 0 ? (
                    <span className="font-bold text-emerald-400 uppercase">FREE</span>
                  ) : (
                    <span className="font-bold text-white">{formatPrice(shippingCharge)}</span>
                  )}
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-400 font-bold">
                    <span>Coupon Discount ({appliedCoupon.code})</span>
                    <span>-{formatPrice(appliedCoupon.discountAmount)}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-baseline mb-8">
                <span className="font-display font-bold text-white uppercase italic">Order Total</span>
                <span className="text-2xl font-black text-white">{formatPrice(finalTotal)}</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3.5 px-6 rounded-none font-bold transition-all flex items-center justify-center gap-2 text-sm"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Confirm COD Order
                  </>
                )}
              </button>

              <div className="mt-4 flex items-center justify-center gap-1.5 text-[9px] text-neutral-500 font-bold uppercase tracking-wider text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Double Sealed Verification Protocol Active
              </div>
            </div>
          </div>

        </form>
      </main>

      <Footer />
    </div>
  );
}
