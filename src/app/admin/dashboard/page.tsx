"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/utils";
import {
  TrendingUp,
  ShoppingBag,
  ShieldAlert,
  ShieldCheck,
  Clock,
  ArrowUpRight,
  RefreshCw,
  Star,
  CheckCircle,
  XCircle
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadAnalytics = async () => {
    setRefreshing(true);
    try {
      const res = await fetch("/api/admin/analytics");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const handleModerateReview = async (reviewId: string, action: "APPROVED" | "REJECTED") => {
    try {
      const res = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: action }),
      });
      if (res.ok) {
        // Refresh local stats
        loadAnalytics();
      } else {
        alert("Failed to moderate review.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-neutral-500 text-xs tracking-wider uppercase">Loading console metrics...</p>
      </div>
    );
  }

  const { stats, recentOrders = [], recentReviews = [] } = data || {};

  return (
    <div className="flex flex-col gap-8">
      {/* Top Title Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
        <div>
          <h1 className="font-display font-black text-2xl tracking-tight uppercase italic">Dashboard</h1>
          <p className="text-xs text-neutral-500 mt-1">Real-time supplement business metrics.</p>
        </div>

        <button
          onClick={loadAnalytics}
          disabled={refreshing}
          className="p-2.5 bg-neutral-950 border border-neutral-800 hover:border-red-650 text-neutral-400 hover:text-white rounded-none transition-all"
          aria-label="Refresh data"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin text-red-500" : ""}`} />
        </button>
      </div>

      {/* Grid KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Sales */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-[#111111] border border-neutral-800 p-5 rounded-none relative overflow-hidden"
        >
          <div className="flex items-center justify-between text-neutral-500 mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Sales</span>
            <TrendingUp className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{formatPrice(stats?.totalSales || 0)}</div>
          <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider mt-1.5">COD Fulfilled</div>
        </motion.div>

        {/* Total Orders */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-[#111111] border border-neutral-800 p-5 rounded-none relative overflow-hidden"
        >
          <div className="flex items-center justify-between text-neutral-500 mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Orders</span>
            <ShoppingBag className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{stats?.totalOrders || 0}</div>
          <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-1.5 flex items-center gap-1">
            <Clock className="w-3 h-3 text-red-600" /> {stats?.pendingOrders || 0} Pending Confirmation
          </div>
        </motion.div>

        {/* Security / Fraud warning */}
        <motion.div
          whileHover={{ y: -2 }}
          className={`bg-[#111111] border p-5 rounded-none relative overflow-hidden transition-all ${
            stats?.unresolvedFraudAlerts > 0 ? "border-red-600" : "border-neutral-800"
          }`}
        >
          <div className="flex items-center justify-between text-neutral-500 mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider">Fraud Screenings</span>
            <ShieldAlert className={`w-4 h-4 ${stats?.unresolvedFraudAlerts > 0 ? "text-red-650 animate-pulse" : "text-neutral-500"}`} />
          </div>
          <div className="text-2xl font-black text-white font-mono">{stats?.unresolvedFraudAlerts || 0}</div>
          <div className={`text-[10px] font-bold uppercase tracking-wider mt-1.5 ${
            stats?.unresolvedFraudAlerts > 0 ? "text-red-400" : "text-neutral-500"
          }`}>
            {stats?.unresolvedFraudAlerts > 0 ? "Critical Alerts Flagged" : "System Secure"}
          </div>
        </motion.div>

        {/* Authenticity Codes */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-[#111111] border border-neutral-800 p-5 rounded-none relative overflow-hidden"
        >
          <div className="flex items-center justify-between text-neutral-500 mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider">Scratch Code Checks</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {stats?.usedVerificationCodes || 0} <span className="text-neutral-500 text-xs font-normal">/ {stats?.totalVerificationCodes || 0}</span>
          </div>
          <div className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider mt-1.5">Genuine Jars Scratched</div>
        </motion.div>
      </div>

      {/* Grid lists */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-4">
        
        {/* Recent Orders table */}
        <div className="lg:col-span-8 bg-[#111111] border border-neutral-800 p-6 rounded-none">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Recent Orders</h3>
            <Link href="/admin/orders" className="text-xs font-bold text-red-600 hover:text-red-500 flex items-center gap-1">
              View All <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p className="text-neutral-600 text-xs py-6">No orders placed yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-800 text-neutral-500 font-bold uppercase tracking-wider">
                    <th className="pb-3">Order ID</th>
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/40">
                  {recentOrders.map((ord: any) => (
                    <tr key={ord.id} className="hover:bg-white/[0.01]">
                      <td className="py-3.5 font-mono font-bold text-white">{ord.orderNumber}</td>
                      <td className="py-3.5 text-neutral-350">{ord.customerName}</td>
                      <td className="py-3.5 font-bold text-white font-mono">{formatPrice(ord.totalAmount)}</td>
                      <td className="py-3.5">
                        <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-none ${
                          ord.status === "PENDING"
                            ? "bg-amber-500/10 text-amber-550 border border-amber-500/20"
                            : "bg-emerald-500/10 text-emerald-450 border border-emerald-500/20"
                        }`}>
                          {ord.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pending Reviews Moderation queue */}
        <div className="lg:col-span-4 bg-[#111111] border border-neutral-800 p-6 rounded-none flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-6">Pending Moderation</h3>

            {recentReviews.length === 0 ? (
              <p className="text-neutral-600 text-xs py-8 text-center">No reviews awaiting approval.</p>
            ) : (
              <div className="flex flex-col gap-4">
                {recentReviews.map((rev: any) => (
                  <div key={rev.id} className="bg-white/[0.01] border border-neutral-800 p-4 rounded-none">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-white">{rev.customerName}</span>
                      <div className="flex text-amber-500">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-2.5 h-2.5 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed mb-3">"{rev.comment}"</p>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleModerateReview(rev.id, "APPROVED")}
                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-none text-[10px] font-bold hover:bg-emerald-500 hover:text-white transition-all"
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> Approve
                      </button>
                      <button
                        onClick={() => handleModerateReview(rev.id, "REJECTED")}
                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-red-600/10 border border-red-600/20 text-red-500 rounded-none text-[10px] font-bold hover:bg-red-650 hover:text-white transition-all"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Link href="/admin/reviews" className="text-xs font-bold text-red-600 hover:text-red-500 mt-6 block text-center uppercase tracking-wider">
            Manage All Reviews
          </Link>
        </div>

      </div>
    </div>
  );
}
