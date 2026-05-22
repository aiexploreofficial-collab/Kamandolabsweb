"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/utils";
import {
  ShoppingBag,
  Search,
  RefreshCw,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  ArrowLeftRight,
  ShieldAlert,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Clipboard,
  ChevronDown,
  ChevronRight,
  AlertOctagon,
  UserX
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL"); // "ALL" | "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED"
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [updating, setUpdating] = useState(false);
  const [notes, setNotes] = useState("");
  const [blacklisting, setBlacklisting] = useState(false);
  const [blacklistReason, setBlacklistReason] = useState("");

  const loadOrders = async () => {
    try {
      const res = await fetch(`/api/admin/orders?status=${filter}&q=${search}`);
      if (res.ok) {
        const json = await res.json();
        setOrders(json);
        // Sync selected order if open
        if (selectedOrder) {
          const updatedSelected = json.find((o: any) => o.id === selectedOrder.id);
          if (updatedSelected) {
            setSelectedOrder(updatedSelected);
          }
        }
      }
    } catch (err) {
      console.error("Error loading orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [filter, search]);

  const handleStatusChange = async (orderId: string, toStatus: string) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toStatus, notes }),
      });
      if (res.ok) {
        setNotes("");
        await loadOrders();
      } else {
        const json = await res.json();
        alert(json.error || "Failed to update order status");
      }
    } catch (err) {
      console.error(err);
      alert("Error transitioning status");
    } finally {
      setUpdating(false);
    }
  };

  const handleBlacklistPhone = async (phone: string) => {
    if (!confirm(`Are you sure you want to permanently blacklist ${phone}? This prevents any future orders.`)) return;
    setBlacklisting(true);
    try {
      const res = await fetch("/api/admin/blacklist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, reason: blacklistReason || "High fraud score / COD refusal history" }),
      });
      if (res.ok) {
        alert(`Phone ${phone} successfully blacklisted.`);
        setBlacklistReason("");
      } else {
        const json = await res.json();
        alert(json.error || "Failed to blacklist phone");
      }
    } catch (err) {
      console.error(err);
      alert("Error writing blacklist entry");
    } finally {
      setBlacklisting(false);
    }
  };

  const getFraudRiskColor = (score: number) => {
    if (score >= 75) return "text-red-500 border-red-600/30 bg-red-650/10";
    if (score >= 45) return "text-amber-500 border-amber-500/20 bg-amber-500/10";
    return "text-emerald-400 border-emerald-500/20 bg-emerald-500/10";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-amber-500/10 text-amber-500 border border-amber-500/20";
      case "CONFIRMED":
        return "bg-sky-500/10 text-sky-400 border border-sky-500/20";
      case "PROCESSING":
        return "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20";
      case "SHIPPED":
        return "bg-purple-500/10 text-purple-400 border border-purple-500/20";
      case "DELIVERED":
        return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
      case "CANCELLED":
      case "RETURNED":
      case "RTO":
        return "bg-red-600/10 text-red-500 border border-red-600/20";
      default:
        return "bg-neutral-900 text-neutral-400 border border-neutral-800";
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Page Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-neutral-800 gap-4">
        <div>
          <h1 className="font-display font-black text-2xl tracking-tight uppercase italic text-white">COD Order Control</h1>
          <p className="text-xs text-neutral-500 mt-1 uppercase">Review orders, manage logistics flow, and audit fraud scores.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="SEARCH ORDER #, CUSTOMER, PHONE..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-[#111111] border border-neutral-800 focus:border-red-600 rounded-none pl-9 pr-4 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none w-60 tracking-wide uppercase"
            />
          </div>

          <button
            onClick={loadOrders}
            className="p-2 bg-[#111111] border border-neutral-800 hover:border-red-600 text-neutral-400 hover:text-white rounded-none transition-all"
            aria-label="Refresh orders"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex bg-[#111111] p-1 border border-neutral-800 rounded-none w-fit text-[10px] font-bold uppercase tracking-wider">
        {["ALL", "PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"].map((tab) => (
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

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Orders Table */}
        <div className={`${selectedOrder ? "lg:col-span-7" : "lg:col-span-12"} bg-[#111111] border border-neutral-800 p-6 rounded-none`}>
          {loading ? (
            <div className="py-24 text-center">
              <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-none animate-spin mx-auto mb-4" />
              <p className="text-neutral-500 text-xs uppercase italic">Syncing logistic ledgers...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="py-20 text-center">
              <ShoppingBag className="w-8 h-8 text-neutral-600 mx-auto mb-3" />
              <p className="text-neutral-500 text-xs font-semibold uppercase italic">No orders matches criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-800 text-neutral-500 font-bold uppercase tracking-wider">
                    <th className="pb-3 text-[10px]">Order Number</th>
                    <th className="pb-3 text-[10px]">Customer</th>
                    <th className="pb-3 text-[10px] text-right">Items</th>
                    <th className="pb-3 text-[10px] text-right">Total</th>
                    <th className="pb-3 text-[10px] text-center">Fraud</th>
                    <th className="pb-3 text-[10px] text-center">Status</th>
                    <th className="pb-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/40">
                  {orders.map((ord: any) => (
                    <tr
                      key={ord.id}
                      onClick={() => setSelectedOrder(ord)}
                      className={`hover:bg-[#161616]/50 cursor-pointer transition-colors ${
                        selectedOrder?.id === ord.id ? "bg-[#161616]" : ""
                      }`}
                    >
                      <td className="py-4 font-mono font-bold text-white tracking-wide">
                        {ord.orderNumber}
                      </td>
                      <td className="py-4">
                        <div className="font-bold text-white uppercase">{ord.customerName}</div>
                        <div className="text-[10px] text-neutral-500 font-mono mt-0.5">{ord.customerPhone}</div>
                      </td>
                      <td className="py-4 text-right font-mono text-neutral-300">
                        {ord.items?.length || 0}
                      </td>
                      <td className="py-4 text-right font-bold text-white font-mono">
                        {formatPrice(ord.totalAmount)}
                      </td>
                      <td className="py-4 text-center">
                        <span className={`inline-block font-mono text-[10px] font-black px-1.5 py-0.5 rounded-none border ${getFraudRiskColor(ord.fraudScore)}`}>
                          {ord.fraudScore}%
                        </span>
                      </td>
                      <td className="py-4 text-center">
                        <span className={`inline-block text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-none ${getStatusBadge(ord.status)}`}>
                          {ord.status}
                        </span>
                      </td>
                      <td className="py-4 text-right text-neutral-500">
                        <ChevronRight className="w-4 h-4 ml-auto" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Side: Order Detail Pane */}
        <AnimatePresence>
          {selectedOrder && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="lg:col-span-5 bg-[#111111] border border-neutral-800 p-6 rounded-none flex flex-col gap-6"
            >
              {/* Header */}
              <div className="flex items-start justify-between pb-4 border-b border-neutral-800">
                <div>
                  <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Order Snapshot</span>
                  <h2 className="font-mono font-black text-lg text-white mt-0.5 tracking-wider">{selectedOrder.orderNumber}</h2>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1 text-neutral-500 hover:text-white rounded-none hover:bg-white/5 transition-all text-xs font-bold uppercase tracking-wider"
                >
                  Close
                </button>
              </div>

              {/* Customer Contact */}
              <div className="flex flex-col gap-2.5">
                <h3 className="text-[10px] uppercase font-black text-neutral-400 tracking-wider">Customer & Logistics</h3>
                
                <div className="bg-[#161616] border border-neutral-800 rounded-none p-4 flex flex-col gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-white uppercase">{selectedOrder.customerName}</span>
                  </div>

                  <div className="flex items-center gap-2 text-neutral-400 font-mono text-[11px]">
                    <Phone className="w-3.5 h-3.5 text-neutral-500 flex-shrink-0" />
                    <span>{selectedOrder.customerPhone}</span>
                  </div>

                  {selectedOrder.customerEmail && (
                    <div className="flex items-center gap-2 text-neutral-400 font-mono text-[11px]">
                      <Mail className="w-3.5 h-3.5 text-neutral-500 flex-shrink-0" />
                      <span>{selectedOrder.customerEmail}</span>
                    </div>
                  )}

                  {/* Shipping Address */}
                  <div className="flex items-start gap-2 border-t border-neutral-800/40 pt-3 text-[11px] leading-relaxed text-neutral-400">
                    <MapPin className="w-3.5 h-3.5 text-neutral-500 flex-shrink-0 mt-0.5" />
                    <div>
                      {selectedOrder.shippingAddress?.addressLine1 && (
                        <div>{selectedOrder.shippingAddress.addressLine1}</div>
                      )}
                      {selectedOrder.shippingAddress?.addressLine2 && (
                        <div>{selectedOrder.shippingAddress.addressLine2}</div>
                      )}
                      <div className="uppercase">
                        {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.postalCode}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="flex flex-col gap-2.5">
                <h3 className="text-[10px] uppercase font-black text-neutral-400 tracking-wider">Order Items</h3>
                <div className="bg-[#161616] border border-neutral-800 rounded-none p-4 flex flex-col gap-3 text-xs">
                  {selectedOrder.items?.map((item: any) => (
                    <div key={item.id} className="flex justify-between items-start gap-4">
                      <div>
                        <span className="font-bold text-white uppercase">{item.productName}</span>
                        <div className="text-[10px] text-neutral-500 mt-0.5 uppercase">{item.variantName}</div>
                      </div>
                      <div className="text-right font-mono flex-shrink-0">
                        <span className="text-neutral-400 text-[11px]">{item.quantity} × {formatPrice(item.unitPrice)}</span>
                        <div className="font-bold text-white mt-0.5">{formatPrice(item.totalPrice)}</div>
                      </div>
                    </div>
                  ))}

                  {/* Calculation Details */}
                  <div className="border-t border-neutral-800/40 pt-3 flex flex-col gap-2 font-mono text-[11px]">
                    <div className="flex justify-between text-neutral-400">
                      <span>Subtotal:</span>
                      <span>{formatPrice(selectedOrder.subtotal)}</span>
                    </div>
                    {selectedOrder.discountAmount > 0 && (
                      <div className="flex justify-between text-red-500">
                        <span>Discount ({selectedOrder.couponCode || "Coupon"}):</span>
                        <span>-{formatPrice(selectedOrder.discountAmount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-neutral-400">
                      <span>Shipping Charge:</span>
                      <span>{formatPrice(selectedOrder.shippingAmount)}</span>
                    </div>
                    <div className="flex justify-between text-white font-bold text-sm border-t border-neutral-800/40 pt-2">
                      <span>Final Paid Total:</span>
                      <span>{formatPrice(selectedOrder.totalAmount)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fraud intelligence */}
              <div className="flex flex-col gap-2.5">
                <h3 className="text-[10px] uppercase font-black text-neutral-400 tracking-wider flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-red-500" />
                  Fraud Intelligence
                </h3>
                <div className="bg-[#161616] border border-neutral-800 rounded-none p-4 flex flex-col gap-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-neutral-400">Security Risk Index:</span>
                    <span className={`font-mono font-black text-xs px-2 py-0.5 rounded-none border ${getFraudRiskColor(selectedOrder.fraudScore)}`}>
                      {selectedOrder.fraudScore}% {selectedOrder.fraudScore >= 75 ? "CRITICAL" : selectedOrder.fraudScore >= 45 ? "MEDIUM" : "LOW"}
                    </span>
                  </div>

                  {selectedOrder.fraudFlags && selectedOrder.fraudFlags.length > 0 ? (
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-black text-red-400 uppercase tracking-wide">Risk Indicators Flagged:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedOrder.fraudFlags.map((flag: string, i: number) => (
                          <span key={i} className="text-[9px] font-semibold font-mono text-red-500 bg-red-950/20 border border-red-900/30 px-2 py-0.5 rounded-none">
                            {flag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> No security triggers matched. Safe guest checkout profile.
                    </p>
                  )}

                  {/* Add phone blacklist option */}
                  <div className="border-t border-neutral-800/40 pt-3 flex flex-col gap-2">
                    <label className="text-[10px] font-black text-neutral-400 uppercase tracking-wide">
                      Blacklist Phone Number
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="REASON (E.G. REFUSED COD JAR DELIVERY)"
                        value={blacklistReason}
                        onChange={(e) => setBlacklistReason(e.target.value)}
                        className="flex-1 bg-[#111111] border border-neutral-800 rounded-none px-3 py-1.5 text-[11px] text-white focus:outline-none focus:border-red-600 uppercase"
                      />
                      <button
                        onClick={() => handleBlacklistPhone(selectedOrder.customerPhone)}
                        disabled={blacklisting}
                        className="bg-[#161616] hover:bg-red-950 hover:text-red-500 border border-neutral-800 hover:border-red-600/30 text-neutral-400 text-[10px] font-bold px-3 rounded-none uppercase tracking-wider flex items-center gap-1 transition-all"
                      >
                        <UserX className="w-3.5 h-3.5" /> Block
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Timeline History */}
              <div className="flex flex-col gap-2.5">
                <h3 className="text-[10px] uppercase font-black text-neutral-400 tracking-wider">Ledge History</h3>
                <div className="bg-[#161616] border border-neutral-800 rounded-none p-4 flex flex-col gap-3.5 max-h-48 overflow-y-auto">
                  {selectedOrder.statusHistory?.length === 0 ? (
                    <p className="text-[10px] text-neutral-600 uppercase font-mono">No transit updates recorded.</p>
                  ) : (
                    <div className="flex flex-col gap-3 font-mono text-[10px]">
                      {selectedOrder.statusHistory.map((history: any, i: number) => (
                        <div key={history.id} className="relative pl-4 border-l border-neutral-800 flex flex-col gap-0.5">
                          <div className="absolute left-[-4.5px] top-1 w-2 h-2 bg-red-600 border border-neutral-900" />
                          <div className="flex items-center gap-2">
                            <span className="text-white font-bold">{history.fromStatus || "START"} → {history.toStatus}</span>
                            <span className="text-neutral-500 text-[9px]">({new Date(history.createdAt).toLocaleString("en-IN")})</span>
                          </div>
                          {history.notes && <span className="text-neutral-400 text-[9px] mt-0.5">"{history.notes}"</span>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Change status controls */}
              <div className="border-t border-neutral-800/40 pt-4 flex flex-col gap-3">
                <h3 className="text-[10px] uppercase font-black text-neutral-400 tracking-wider">Transition Logistics State</h3>
                
                <div className="flex flex-col gap-2">
                  <textarea
                    placeholder="PROVIDE TRANSITION REASON OR TRACKING REFERENCE..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-[#161616] border border-neutral-800 rounded-none px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-600 resize-none h-16 uppercase"
                  />

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[9px] uppercase font-black">
                    {["CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"].map((status) => (
                      <button
                        key={status}
                        onClick={() => handleStatusChange(selectedOrder.id, status)}
                        disabled={updating || selectedOrder.status === status}
                        className="py-2.5 bg-[#161616] hover:bg-red-600 disabled:bg-[#111111] border border-neutral-800 hover:border-transparent text-white hover:text-white rounded-none transition-all"
                      >
                        {status}
                      </button>
                    ))}
                    {["CANCELLED", "RETURNED", "RTO"].map((status) => (
                      <button
                        key={status}
                        onClick={() => handleStatusChange(selectedOrder.id, status)}
                        disabled={updating || selectedOrder.status === status}
                        className="py-2.5 bg-[#161616] hover:bg-red-950 hover:text-red-500 disabled:bg-[#111111] border border-neutral-800 hover:border-transparent text-neutral-400 rounded-none transition-all"
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
