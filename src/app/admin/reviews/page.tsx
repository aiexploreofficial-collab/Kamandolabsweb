"use client";

import { useEffect, useState } from "react";
import { Star, CheckCircle2, XCircle, Trash2, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL"); // "ALL" | "PENDING" | "APPROVED" | "REJECTED"

  const loadReviews = async () => {
    try {
      const res = await fetch("/api/admin/reviews");
      if (res.ok) {
        const json = await res.json();
        setReviews(json);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleModerate = async (id: string, action: "APPROVED" | "REJECTED") => {
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: action }),
      });
      if (res.ok) {
        loadReviews();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this review?")) return;
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        loadReviews();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredReviews = reviews.filter((rev) => {
    if (filter === "ALL") return true;
    return rev.status === filter;
  });

  return (
    <div className="flex flex-col gap-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-800 gap-4">
        <div>
          <h1 className="font-display font-black text-2xl tracking-tight uppercase italic">Review Moderation</h1>
          <p className="text-xs text-neutral-500 mt-1">Approve or reject customer reviews for product pages.</p>
        </div>

        {/* Filters */}
        <div className="flex bg-neutral-950 p-1 border border-neutral-800 rounded-none text-[10px] font-bold uppercase tracking-wider">
          {["ALL", "PENDING", "APPROVED", "REJECTED"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-2 rounded-none transition-all ${
                filter === tab ? "bg-red-600 text-white" : "text-neutral-400 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-24 text-center">
          <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-neutral-500 text-xs">Syncing feedback logs...</p>
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="py-16 text-center bg-neutral-950/40 border border-neutral-800 rounded-none">
          <ShieldAlert className="w-8 h-8 text-neutral-600 mx-auto mb-3" />
          <p className="text-neutral-500 text-xs font-semibold">No reviews match the selected filter.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          <AnimatePresence mode="popLayout">
            {filteredReviews.map((rev) => (
              <motion.div
                key={rev.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="bg-neutral-950 border border-neutral-800 hover:border-red-650 p-5 rounded-none flex flex-col md:flex-row justify-between gap-6"
              >
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <span className="text-xs font-bold text-white">{rev.customerName}</span>
                    <span className="text-[10px] text-neutral-500 font-mono">{rev.customerPhone}</span>
                    <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-none bg-white/5 border border-neutral-800 text-neutral-400">
                      {rev.product?.name || "Product Info N/A"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${i < rev.rating ? "fill-current" : "text-neutral-700"}`}
                        />
                      ))}
                    </div>
                    <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-none ${
                      rev.status === "PENDING"
                        ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                        : rev.status === "APPROVED"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-red-600/10 text-red-500 border border-red-600/20"
                    }`}>
                      {rev.status}
                    </span>
                  </div>

                  {rev.title && <h4 className="text-xs font-bold text-white mb-1.5">"{rev.title}"</h4>}
                  <p className="text-xs text-neutral-400 leading-relaxed">"{rev.comment}"</p>
                </div>

                {/* Moderation Controls */}
                <div className="flex md:flex-col justify-end gap-2 items-center md:items-end">
                  <div className="flex gap-2">
                    {rev.status !== "APPROVED" && (
                      <button
                        onClick={() => handleModerate(rev.id, "APPROVED")}
                        className="p-2 bg-[#111111] hover:bg-emerald-600 border border-neutral-800 text-emerald-400 hover:text-white rounded-none transition-all"
                        title="Approve Review"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    )}
                    {rev.status !== "REJECTED" && (
                      <button
                        onClick={() => handleModerate(rev.id, "REJECTED")}
                        className="p-2 bg-[#111111] hover:bg-red-600 border border-neutral-800 text-red-500 hover:text-white rounded-none transition-all"
                        title="Reject Review"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(rev.id)}
                      className="p-2 bg-neutral-900 hover:bg-red-950 border border-neutral-800 hover:border-red-900/30 text-neutral-400 hover:text-red-500 rounded-none transition-all"
                      title="Hard Delete Review"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-[10px] text-neutral-500 font-medium md:mt-2">
                    Posted on {new Date(rev.createdAt).toLocaleDateString("en-IN")}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
