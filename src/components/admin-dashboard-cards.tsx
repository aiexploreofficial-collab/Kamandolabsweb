"use client";

import React from "react";
import {
  ShoppingBag,
  DollarSign,
  TrendingUp,
  Dumbbell,
  Tag,
  ShieldAlert,
  AlertOctagon,
  BookOpen,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface StatsData {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  totalProducts: number;
  couponUsage: number;
  verificationCount: number;
  fraudAlerts: number;
  blogCount: number;
}

interface StatsCardsProps {
  stats: StatsData;
}

export default function AdminDashboardCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: "TOTAL ORDERS",
      value: stats.totalOrders,
      icon: ShoppingBag,
      alert: false,
    },
    {
      title: "TOTAL REVENUE",
      value: formatPrice(stats.totalRevenue),
      icon: DollarSign,
      alert: false,
    },
    {
      title: "AVG ORDER VALUE",
      value: formatPrice(stats.averageOrderValue),
      icon: TrendingUp,
      alert: false,
    },
    {
      title: "TOTAL PRODUCTS",
      value: stats.totalProducts,
      icon: Dumbbell,
      alert: false,
    },
    {
      title: "COUPON USAGE",
      value: stats.couponUsage,
      icon: Tag,
      alert: false,
    },
    {
      title: "VERIFICATION COUNT",
      value: stats.verificationCount,
      icon: ShieldAlert,
      alert: false,
    },
    {
      title: "FRAUD ALERTS",
      value: stats.fraudAlerts,
      icon: AlertOctagon,
      alert: stats.fraudAlerts > 0,
    },
    {
      title: "AI BLOG POSTS",
      value: stats.blogCount,
      icon: BookOpen,
      alert: false,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className={`bg-[#111111] border ${
              card.alert ? "border-red-650" : "border-neutral-800"
            } rounded-none p-5 relative overflow-hidden flex flex-col justify-between h-[125px] transition-all duration-300 hover:border-neutral-700`}
          >
            {/* Top red line indicator on active/alert card */}
            {card.alert && <div className="absolute top-0 left-0 w-full h-[3px] bg-red-600 animate-pulse" />}

            {/* Background design */}
            <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-5 pointer-events-none">
              <Icon className="w-20 h-20" />
            </div>

            <div className="flex items-center justify-between w-full relative z-10">
              <span className="text-[9px] font-mono tracking-widest text-neutral-400 uppercase">
                {card.title}
              </span>
              <span className={`p-1.5 rounded-none bg-neutral-900 border border-neutral-850 ${card.alert ? "text-red-500 animate-pulse" : "text-neutral-500"}`}>
                <Icon className="w-4 h-4" />
              </span>
            </div>

            <div className="mt-4 relative z-10">
              <span className="text-2xl font-display font-black text-white tracking-tight uppercase italic">
                {card.value}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
