"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/utils";
import {
  Tag,
  Plus,
  Search,
  RefreshCw,
  Edit2,
  Trash2,
  Calendar,
  Percent,
  TrendingDown,
  Lock,
  Unlock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL"); // "ALL" | "ACTIVE" | "INACTIVE"

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<any>(null);

  // Form State
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("PERCENTAGE"); // "FLAT" | "PERCENTAGE"
  const [value, setValue] = useState("");
  const [minCartValue, setMinCartValue] = useState("");
  const [maxDiscount, setMaxDiscount] = useState("");
  const [usageLimit, setUsageLimit] = useState("");
  const [validFrom, setValidFrom] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  const loadCoupons = async () => {
    try {
      const res = await fetch("/api/admin/coupons");
      if (res.ok) {
        const json = await res.json();
        setCoupons(json);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const openCreateModal = () => {
    setEditingCoupon(null);
    setCode("");
    setDescription("");
    setType("PERCENTAGE");
    setValue("");
    setMinCartValue("");
    setMaxDiscount("");
    setUsageLimit("");
    
    // Set default dates: today to next month
    const today = new Date();
    const nextMonth = new Date();
    nextMonth.setMonth(today.getMonth() + 1);

    setValidFrom(today.toISOString().split("T")[0]);
    setValidUntil(nextMonth.toISOString().split("T")[0]);
    setIsActive(true);
    setShowModal(true);
  };

  const openEditModal = (coupon: any) => {
    setEditingCoupon(coupon);
    setCode(coupon.code || "");
    setDescription(coupon.description || "");
    setType(coupon.type || "PERCENTAGE");
    setValue(coupon.value.toString() || "");
    setMinCartValue(coupon.minCartValue ? coupon.minCartValue.toString() : "");
    setMaxDiscount(coupon.maxDiscount ? coupon.maxDiscount.toString() : "");
    setUsageLimit(coupon.usageLimit ? coupon.usageLimit.toString() : "");
    
    // Formats dates to YYYY-MM-DD for date inputs
    setValidFrom(new Date(coupon.validFrom).toISOString().split("T")[0]);
    setValidUntil(new Date(coupon.validUntil).toISOString().split("T")[0]);
    setIsActive(coupon.isActive);
    setShowModal(true);
  };

  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !type || !value || !validFrom || !validUntil) return;

    setSubmitting(true);
    const payload = {
      code: code.toUpperCase().trim(),
      description,
      type,
      value: Number(value),
      minCartValue: minCartValue ? Number(minCartValue) : null,
      maxDiscount: maxDiscount ? Number(maxDiscount) : null,
      usageLimit: usageLimit ? Number(usageLimit) : null,
      validFrom: new Date(validFrom).toISOString(),
      validUntil: new Date(validUntil).toISOString(),
      isActive,
    };

    try {
      const url = editingCoupon ? `/api/admin/coupons/${editingCoupon.id}` : "/api/admin/coupons";
      const method = editingCoupon ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setShowModal(false);
        loadCoupons();
      } else {
        const json = await res.json();
        alert(json.error || "Failed to save coupon");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving coupon");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (coupon: any) => {
    try {
      const res = await fetch(`/api/admin/coupons/${coupon.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !coupon.isActive }),
      });
      if (res.ok) {
        loadCoupons();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this coupon?")) return;

    try {
      const res = await fetch(`/api/admin/coupons/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        loadCoupons();
      } else {
        const json = await res.json();
        alert(json.error || "Failed to delete coupon");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting coupon");
    }
  };

  const filteredCoupons = coupons.filter((c) => {
    const matchesSearch = c.code.toLowerCase().includes(search.toLowerCase()) ||
                          (c.description || "").toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filter === "ALL" ? true : filter === "ACTIVE" ? c.isActive : !c.isActive;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex flex-col gap-8">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-neutral-800 gap-4">
        <div>
          <h1 className="font-display font-black text-2xl tracking-tight uppercase italic">Discount Engine</h1>
          <p className="text-xs text-neutral-500 mt-1">Configure active promotional coupons, cart caps, and limit usages.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search coupon code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-neutral-950 border border-neutral-800 focus:border-red-600 rounded-none pl-9 pr-4 py-2 text-xs text-white placeholder-neutral-550 focus:outline-none w-56 tracking-wide"
            />
          </div>

          <button
            onClick={openCreateModal}
            className="bg-red-600 hover:bg-red-700 font-bold uppercase tracking-wider text-[10px] px-4 py-2.5 rounded-none transition-all flex items-center gap-2"
          >
            <Plus className="w-3.5 h-3.5" /> Add Coupon
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-neutral-950 p-1 border border-neutral-800 rounded-none w-fit text-[10px] font-bold uppercase tracking-wider">
        {["ALL", "ACTIVE", "INACTIVE"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2.5 rounded-none transition-all ${
              filter === tab ? "bg-red-600 text-white" : "text-neutral-400 hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="py-24 text-center">
          <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-neutral-500 text-xs">Syncing promotion indexes...</p>
        </div>
      ) : filteredCoupons.length === 0 ? (
        <div className="py-20 text-center bg-neutral-950/40 border border-neutral-800 rounded-none">
          <Tag className="w-8 h-8 text-neutral-600 mx-auto mb-3" />
          <p className="text-neutral-500 text-xs font-semibold">No promotional codes configured.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCoupons.map((c) => {
            const hasExpired = new Date(c.validUntil) < new Date();
            const usagePercent = c.usageLimit ? (c.usedCount / c.usageLimit) * 100 : 0;

            return (
              <motion.div
                key={c.id}
                whileHover={{ y: -3 }}
                className="bg-[#111111] border border-neutral-800 p-5 rounded-none flex flex-col justify-between gap-5 relative overflow-hidden transition-all"
              >
                <div>
                  {/* Coupon Header */}
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-mono font-black text-sm tracking-wider text-red-500 bg-red-950/20 border border-red-900/30 px-2.5 py-1 rounded-none">
                      {c.code}
                    </span>
                    <button
                      onClick={() => handleToggleActive(c)}
                      className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-none transition-colors ${
                        c.isActive && !hasExpired
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white"
                          : "bg-red-650/10 text-red-550 border border-red-900/20 hover:bg-red-600 hover:text-white"
                      }`}
                    >
                      {hasExpired ? "EXPIRED" : c.isActive ? "ACTIVE" : "INACTIVE"}
                    </button>
                  </div>

                  <p className="text-xs font-bold text-white mb-1">
                    {c.type === "PERCENTAGE" ? `${c.value}% OFF` : `${formatPrice(c.value)} OFF`}
                  </p>
                  <p className="text-[11px] text-neutral-400 leading-relaxed mb-4">
                    {c.description || "Flat store promotional campaign discount code."}
                  </p>

                  {/* Date range details */}
                  <div className="flex items-center gap-1.5 text-[10px] text-neutral-500 font-mono mb-4">
                    <Calendar className="w-3.5 h-3.5 text-neutral-600" />
                    <span>
                      {new Date(c.validFrom).toLocaleDateString("en-IN")} — {new Date(c.validUntil).toLocaleDateString("en-IN")}
                    </span>
                  </div>

                  {/* Progress limit bar */}
                  <div className="flex flex-col gap-1 text-[10px] text-neutral-450 font-mono">
                    <div className="flex justify-between font-bold">
                      <span>Usage parameters:</span>
                      <span>
                        {c.usedCount} / {c.usageLimit || "∞"}
                      </span>
                    </div>
                    {c.usageLimit && (
                      <div className="w-full bg-neutral-900 h-1.5 rounded-none overflow-hidden border border-neutral-800">
                        <div
                          className="bg-red-600 h-full rounded-none transition-all duration-300"
                          style={{ width: `${Math.min(100, usagePercent)}%` }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Cart caps details */}
                  <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-neutral-800/40 text-[10px] text-neutral-500 font-mono">
                    <div>
                      <span>Min Basket:</span>
                      <p className="font-bold text-neutral-300 mt-0.5">
                        {c.minCartValue ? formatPrice(c.minCartValue) : "No Limit"}
                      </p>
                    </div>
                    <div>
                      <span>Max Discount:</span>
                      <p className="font-bold text-neutral-300 mt-0.5">
                        {c.maxDiscount ? formatPrice(c.maxDiscount) : "No Limit"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="flex gap-2 border-t border-neutral-800/40 pt-4 mt-2">
                  <button
                    onClick={() => openEditModal(c)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-neutral-300 hover:text-white rounded-none text-[10px] font-bold transition-all uppercase tracking-wider"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Modify
                  </button>
                  <button
                    onClick={() => handleDeleteCoupon(c.id)}
                    className="flex-shrink-0 p-2 bg-neutral-900 hover:bg-red-950/20 border border-neutral-800 hover:border-red-600 text-neutral-500 hover:text-red-500 rounded-none transition-all"
                    title="Delete Promo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Create/Edit Coupon Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-neutral-950 border border-neutral-800 rounded-none p-6 md:p-8 max-w-lg w-full relative z-10 flex flex-col gap-6"
            >
              <div className="flex items-start justify-between pb-3 border-b border-neutral-800">
                <div>
                  <h3 className="font-display font-black text-base uppercase text-white italic">
                    {editingCoupon ? "Modify Coupon Parameters" : "Create Promo Code"}
                  </h3>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    Define discount value, cart constraints, date periods, and max caps.
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1 text-neutral-500 hover:text-white"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveCoupon} className="flex flex-col gap-4.5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] uppercase font-black tracking-wider text-neutral-400">Coupon Code</label>
                    <input
                      type="text"
                      placeholder="e.g. GETFIT20"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-none px-4 py-2.5 text-xs text-white uppercase tracking-wider focus:outline-none focus:border-red-600"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] uppercase font-black tracking-wider text-neutral-400">Discount Type</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-none px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-600"
                    >
                      <option value="PERCENTAGE">PERCENTAGE (%)</option>
                      <option value="FLAT">FLAT (INR)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] uppercase font-black tracking-wider text-neutral-400">
                      {type === "PERCENTAGE" ? "Percentage Value (%)" : "Flat Value (INR)"}
                    </label>
                    <input
                      type="number"
                      placeholder={type === "PERCENTAGE" ? "e.g. 20" : "e.g. 500"}
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-none px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-red-600"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] uppercase font-black tracking-wider text-neutral-400">Usage Limit (Global)</label>
                    <input
                      type="number"
                      placeholder="e.g. 100 (Leave blank for unlimited)"
                      value={usageLimit}
                      onChange={(e) => setUsageLimit(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-none px-4 py-2.5 text-xs text-white font-mono focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] uppercase font-black tracking-wider text-neutral-400">Min Cart Threshold</label>
                    <input
                      type="number"
                      placeholder="e.g. 1999 (INR)"
                      value={minCartValue}
                      onChange={(e) => setMinCartValue(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-none px-4 py-2.5 text-xs text-white font-mono focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] uppercase font-black tracking-wider text-neutral-400">Max Cap Discount</label>
                    <input
                      type="number"
                      placeholder="e.g. 500 (INR)"
                      value={maxDiscount}
                      onChange={(e) => setMaxDiscount(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-none px-4 py-2.5 text-xs text-white font-mono focus:outline-none"
                      disabled={type === "FLAT"}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] uppercase font-black tracking-wider text-neutral-400">Valid From</label>
                    <input
                      type="date"
                      value={validFrom}
                      onChange={(e) => setValidFrom(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-none px-4 py-2.5 text-xs text-white focus:outline-none"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] uppercase font-black tracking-wider text-neutral-400">Valid Until</label>
                    <input
                      type="date"
                      value={validUntil}
                      onChange={(e) => setValidUntil(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-none px-4 py-2.5 text-xs text-white focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase font-black tracking-wider text-neutral-400">Marketing Text Description</label>
                  <input
                    type="text"
                    placeholder="e.g. Get 20% off on Whey Isolate products above Rs.1999."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-none px-4 py-2.5 text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-3 bg-neutral-900 border border-neutral-800 rounded-none px-4 py-3 h-[46px] mt-1">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 rounded-none bg-neutral-950 border-neutral-800 text-red-600 focus:ring-0 focus:ring-offset-0"
                  />
                  <label htmlFor="isActive" className="text-xs text-neutral-350 font-semibold cursor-pointer">
                    Enable coupon code for checkout validation
                  </label>
                </div>

                <div className="flex justify-end gap-3 border-t border-neutral-800 pt-4 mt-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="bg-neutral-900 hover:bg-neutral-850 text-white font-bold uppercase tracking-wider text-[10px] px-6 py-3.5 rounded-none transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-red-600 hover:bg-red-700 disabled:bg-neutral-800 disabled:text-neutral-550 font-bold uppercase tracking-wider text-[10px] px-8 py-3.5 rounded-none transition-all flex items-center gap-1.5"
                  >
                    {submitting ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-3.5 h-3.5" /> Save Coupon
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
