"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/cart-context";
import CartItem from "./cart-item";
import { formatPrice } from "@/lib/utils";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, cartCount, cartTotal, updateQuantity, removeFromCart } = useCart();

  // Prevent background scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/85 cursor-pointer"
          />

          {/* Drawer Body panel */}
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="w-screen max-w-md bg-[#0A0A0A] border-l border-neutral-800 flex flex-col justify-between shadow-2xl relative"
            >
              {/* Top Banner Header */}
              <div className="px-6 py-5 border-b border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-red-600" />
                  <span className="font-display font-bold text-base text-white uppercase tracking-wider italic">
                    Your Cart ({cartCount})
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-neutral-400 hover:text-white rounded-none hover:bg-[#161616] transition-all"
                  aria-label="Close cart"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable list content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-20">
                    <ShoppingCart className="w-12 h-12 text-neutral-600 mb-4" />
                    <h4 className="font-bold text-white text-base uppercase italic">Your Cart is Empty</h4>
                    <p className="text-neutral-400 text-xs mt-2 max-w-xs mx-auto">
                      Load up on premium workout fuels & active recovery formulas to unlock your goals.
                    </p>
                    <button
                      onClick={onClose}
                      className="mt-6 btn-secondary px-5 py-2.5 text-xs text-neutral-300 font-bold uppercase rounded-none hover:bg-neutral-800 transition-all tracking-wider"
                    >
                      Browse Catalog
                    </button>
                  </div>
                ) : (
                  cart.map((item) => (
                    <CartItem
                      key={item.variantId}
                      item={item}
                      onUpdateQuantity={updateQuantity}
                      onRemove={removeFromCart}
                    />
                  ))
                )}
              </div>

              {/* Bottom footer values */}
              {cart.length > 0 && (
                <div className="border-t border-neutral-800 bg-[#111111] p-6 space-y-4">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-neutral-400 font-semibold uppercase tracking-wider">Subtotal</span>
                    <span className="text-2xl font-black text-white">{formatPrice(cartTotal)}</span>
                  </div>
                  <p className="text-[10px] text-neutral-400 leading-normal">
                    Shipping & taxes calculated at checkout. Free shipping available on orders above ₹1,500.
                  </p>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      onClick={onClose}
                      className="py-3.5 border border-neutral-800 hover:border-neutral-700 bg-neutral-850 hover:bg-neutral-800 text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-white rounded-none transition-all text-center"
                    >
                      Keep Browsing
                    </button>
                    <Link
                      href="/checkout"
                      onClick={onClose}
                      className="py-3.5 bg-red-600 hover:bg-red-700 text-xs font-bold uppercase tracking-wider text-white rounded-none transition-all flex items-center justify-center gap-1.5"
                    >
                      Checkout <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
