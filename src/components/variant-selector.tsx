"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";

interface Variant {
  id: string;
  name: string;
  flavor: string | null;
  size: string | null;
  mrp: number;
  salePrice: number;
  stock: number;
  isActive: boolean;
}

interface VariantSelectorProps {
  variants: Variant[];
  selectedVariant: Variant | null;
  onChange: (variant: Variant) => void;
  themeColor?: string | null;
}

export default function VariantSelector({
  variants,
  selectedVariant,
  onChange,
  themeColor = "spartan-red",
}: VariantSelectorProps) {
  const activeVariants = useMemo(() => {
    return variants.filter((v) => v.isActive);
  }, [variants]);

  // Extract unique flavors and sizes
  const flavors = useMemo(() => {
    const set = new Set<string>();
    activeVariants.forEach((v) => {
      if (v.flavor) set.add(v.flavor);
    });
    return Array.from(set);
  }, [activeVariants]);

  const sizes = useMemo(() => {
    const set = new Set<string>();
    activeVariants.forEach((v) => {
      if (v.size) set.add(v.size);
    });
    return Array.from(set);
  }, [activeVariants]);

  const handleFlavorSelect = (flavor: string) => {
    // Try to find a variant with selected flavor and current size, or fallback to any variant with this flavor
    const currentSize = selectedVariant?.size;
    let match = activeVariants.find((v) => v.flavor === flavor && v.size === currentSize);
    if (!match) {
      match = activeVariants.find((v) => v.flavor === flavor);
    }
    if (match) onChange(match);
  };

  const handleSizeSelect = (size: string) => {
    // Try to find a variant with current flavor and selected size, or fallback to any variant with this size
    const currentFlavor = selectedVariant?.flavor;
    let match = activeVariants.find((v) => v.flavor === currentFlavor && v.size === size);
    if (!match) {
      match = activeVariants.find((v) => v.size === size);
    }
    if (match) onChange(match);
  };

  const bgAccentClass = "bg-red-600";
  const borderAccentClass = "border-red-600";
  const textAccentClass = "text-red-500";

  if (activeVariants.length === 0) {
    return <div className="text-neutral-550 text-xs font-mono uppercase tracking-wider">No active variants available.</div>;
  }

  // If there are no structured flavors or sizes, just list the variant names directly
  if (flavors.length === 0 && sizes.length === 0) {
    return (
      <div className="flex flex-col gap-3">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-450">Options</span>
        <div className="flex flex-wrap gap-2">
          {activeVariants.map((v) => (
            <button
              key={v.id}
              onClick={() => onChange(v)}
              className={`px-4 py-3 rounded-none border text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 relative ${
                selectedVariant?.id === v.id
                  ? `${bgAccentClass} text-white border-transparent`
                  : "bg-[#161616] border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700"
              }`}
            >
              {v.name}
              {v.stock === 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#111111] text-red-500 border border-red-600 text-[8px] px-1 rounded-none font-mono font-black uppercase">
                  Out
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Flavor Selection */}
      {flavors.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-450">Select Flavor</span>
            {selectedVariant?.flavor && (
              <span className={`text-[10px] font-mono font-bold uppercase ${textAccentClass}`}>{selectedVariant.flavor}</span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {flavors.map((flavor) => {
              const isSelected = selectedVariant?.flavor === flavor;
              // Check if flavor option is out of stock in all sizes
              const flavorVariants = activeVariants.filter((v) => v.flavor === flavor);
              const totalStock = flavorVariants.reduce((sum, v) => sum + v.stock, 0);
              
              return (
                <button
                  key={flavor}
                  onClick={() => handleFlavorSelect(flavor)}
                  className={`px-4 py-3 rounded-none border text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 relative ${
                    isSelected
                      ? `${bgAccentClass} text-white border-transparent`
                      : "bg-[#161616] border-neutral-800 text-neutral-450 hover:text-white hover:border-neutral-700"
                  }`}
                >
                  {flavor}
                  {totalStock === 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-[#111111] text-red-500 border border-red-600 text-[8px] px-1 rounded-none font-mono font-black uppercase">
                      Out
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Size Selection */}
      {sizes.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-450">Select Size</span>
            {selectedVariant?.size && (
              <span className={`text-[10px] font-mono font-bold uppercase ${textAccentClass}`}>{selectedVariant.size}</span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => {
              const isSelected = selectedVariant?.size === size;
              // Check stock for this specific size with currently selected flavor (or first flavor if not selected)
              const matchedVariant = activeVariants.find(
                (v) => v.size === size && v.flavor === selectedVariant?.flavor
              ) || activeVariants.find((v) => v.size === size);
              const isOutOfStock = !matchedVariant || matchedVariant.stock <= 0;

              return (
                <button
                  key={size}
                  onClick={() => handleSizeSelect(size)}
                  className={`px-4 py-3 rounded-none border text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 relative ${
                    isSelected
                      ? `${bgAccentClass} text-white border-transparent`
                      : "bg-[#161616] border-neutral-800 text-neutral-450 hover:text-white hover:border-neutral-700"
                  }`}
                >
                  {size}
                  {isOutOfStock && (
                    <span className="absolute -top-1.5 -right-1.5 bg-[#111111] text-red-500 border border-red-600 text-[8px] px-1 rounded-none font-mono font-black uppercase">
                      Out
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
