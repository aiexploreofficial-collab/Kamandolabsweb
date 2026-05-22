"use client";

import React from "react";
import { Trash2, Minus, Plus } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";

interface CartItemType {
  variantId: string;
  productId: string;
  productName: string;
  variantName: string;
  image: string;
  price: number;
  quantity: number;
  slug: string;
}

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (variantId: string, quantity: number) => void;
  onRemove: (variantId: string) => void;
}

export default function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  return (
    <div className="flex gap-4 bg-[#111111] border border-neutral-800 p-4 rounded-none items-center justify-between">
      {/* Visual Thumbnail */}
      <div className="aspect-square w-16 bg-[#161616] border border-neutral-800 rounded-none flex items-center justify-center overflow-hidden flex-shrink-0 relative">
        {item.image && (item.image.startsWith("/") || item.image.startsWith("http")) ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.image} alt={item.productName} className="w-full h-full object-cover" />
        ) : (
          <Image
            src="/images/placeholders/jar-placeholder.png"
            alt={item.productName}
            fill
            sizes="64px"
            className="object-contain p-1"
          />
        )}
      </div>

      {/* Info Column */}
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-sm text-white truncate hover:text-red-600 transition-colors uppercase italic">
          {item.productName}
        </h4>
        <p className="text-[10px] text-neutral-400 font-extrabold uppercase mt-0.5 tracking-wider">
          {item.variantName}
        </p>
        <span className="text-xs font-black text-white mt-1.5 block">
          {formatPrice(item.price)}
        </span>
      </div>

      {/* Adjusters Column */}
      <div className="flex flex-col items-end gap-3 justify-between">
        {/* Delete button */}
        <button
          onClick={() => onRemove(item.variantId)}
          className="text-neutral-500 hover:text-red-600 transition-colors p-1"
          aria-label="Remove item"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        {/* Counter */}
        <div className="flex items-center bg-[#161616] border border-neutral-800 rounded-none overflow-hidden">
          <button
            onClick={() => onUpdateQuantity(item.variantId, item.quantity - 1)}
            className="px-2.5 py-1 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors text-xs font-bold"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="px-1.5 text-xs font-bold text-white w-5 text-center select-none">{item.quantity}</span>
          <button
            onClick={() => onUpdateQuantity(item.variantId, item.quantity + 1)}
            className="px-2.5 py-1 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors text-xs font-bold"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
