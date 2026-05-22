"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, Copy, Download, RefreshCw, Eye, EyeOff, CheckCircle, AlertTriangle, XCircle, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminVerificationsPage() {
  const [attempts, setAttempts] = useState<any[]>([]);
  const [counts, setCounts] = useState<any>({ total: 0, used: 0, unused: 0 });
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [selectedVariantId, setSelectedVariantId] = useState("");
  const [codeCount, setCodeCount] = useState(50);
  const [batchName, setBatchName] = useState("");

  // Result state
  const [generatedCodes, setGeneratedCodes] = useState<string[]>([]);
  const [showCodesModal, setShowCodesModal] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const loadData = async () => {
    try {
      const res = await fetch("/api/admin/verifications");
      if (res.ok) {
        const json = await res.json();
        setAttempts(json.attempts || []);
        
        // Calculate counts
        let total = 0;
        let used = 0;
        let unused = 0;
        if (json.counts && Array.isArray(json.counts)) {
          json.counts.forEach((c: any) => {
            const count = c._count?._all || 0;
            total += count;
            if (c.isUsed) {
              used += count;
            } else {
              unused += count;
            }
          });
        }
        setCounts({ total, used, unused });
      }

      // Load products and variants
      const prodRes = await fetch("/api/products");
      if (prodRes.ok) {
        const prodJson = await prodRes.json();
        setProducts(prodJson || []);
        if (prodJson.length > 0 && prodJson[0].variants?.length > 0) {
          setSelectedVariantId(prodJson[0].variants[0].id);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVariantId) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/verifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          variantId: selectedVariantId,
          count: Number(codeCount),
          batchName: batchName || undefined,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        setGeneratedCodes(json.plainCodes || []);
        setShowCodesModal(true);
        setBatchName("");
        loadData();
      } else {
        const json = await res.json();
        alert(json.error || "Failed to generate codes");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyAll = () => {
    const text = generatedCodes.join("\n");
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleCopySingle = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const handleDownload = () => {
    const text = generatedCodes.join("\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${batchName || "scratch-codes"}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Extract all variants from products list
  const allVariants = products.flatMap((p: any) =>
    (p.variants || []).map((v: any) => ({
      ...v,
      productName: p.name,
    }))
  );

  return (
    <div className="flex flex-col gap-8">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-800 gap-4">
        <div>
          <h1 className="font-display font-black text-2xl tracking-tight uppercase italic">Authenticity verification</h1>
          <p className="text-xs text-neutral-500 mt-1 uppercase tracking-wider">Generate product authenticity codes and monitor verification logs.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#111111] border border-neutral-800 p-5 rounded-none border-t-2 border-t-red-650">
          <p className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">Total Scratch Codes</p>
          <p className="text-2xl font-black mt-1 text-white font-mono">{counts.total}</p>
        </div>
        <div className="bg-[#111111] border border-neutral-800 p-5 rounded-none border-t-2 border-t-emerald-650">
          <p className="text-[10px] uppercase font-bold text-emerald-500 tracking-wider">Verified Genuine</p>
          <p className="text-2xl font-black mt-1 text-emerald-400 font-mono">{counts.used}</p>
        </div>
        <div className="bg-[#111111] border border-neutral-800 p-5 rounded-none border-t-2 border-t-neutral-700">
          <p className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Unused Codes</p>
          <p className="text-2xl font-black mt-1 text-neutral-300 font-mono">{counts.unused}</p>
        </div>
      </div>

      {/* Content Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Form: Code Generator */}
        <div className="lg:col-span-1 bg-[#111111] border border-neutral-800 p-6 rounded-none flex flex-col gap-5">
          <div>
            <h2 className="font-display font-black text-sm uppercase text-white italic">Generate Code Batch</h2>
            <p className="text-[11px] text-neutral-500 mt-1 uppercase tracking-wider">
              Create secure SHA-256 verification scratch codes to print on product labels.
            </p>
          </div>

          <form onSubmit={handleGenerate} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-black tracking-wider text-neutral-400">
                Product Variant
              </label>
              <select
                value={selectedVariantId}
                onChange={(e) => setSelectedVariantId(e.target.value)}
                className="w-full bg-[#0A0A0A] border border-neutral-800 rounded-none px-4 py-3 text-xs text-white focus:outline-none focus:border-red-650"
                required
              >
                <option value="" disabled>Select Product Variant</option>
                {allVariants.map((variant) => (
                  <option key={variant.id} value={variant.id}>
                    {variant.productName} - {variant.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-black tracking-wider text-neutral-400">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={codeCount}
                  onChange={(e) => setCodeCount(Math.min(500, Math.max(1, Number(e.target.value))))}
                  className="w-full bg-[#0A0A0A] border border-neutral-800 rounded-none px-4 py-3 text-xs text-white font-mono focus:outline-none focus:border-red-650"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-black tracking-wider text-neutral-400">
                  Batch Tag
                </label>
                <input
                  type="text"
                  placeholder="e.g. BATCH-01"
                  value={batchName}
                  onChange={(e) => setBatchName(e.target.value)}
                  className="w-full bg-[#0A0A0A] border border-neutral-800 rounded-none px-4 py-3 text-xs text-white focus:outline-none focus:border-red-650"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || !selectedVariantId}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-neutral-800 disabled:text-neutral-500 font-bold uppercase tracking-wider text-xs py-3.5 rounded-none transition-all flex items-center justify-center gap-2 mt-2"
            >
              {submitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  Generate Codes
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Table: Attempts Logs */}
        <div className="lg:col-span-2 bg-[#111111] border border-neutral-800 p-6 rounded-none flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display font-black text-sm uppercase text-white italic">Recent Verification Attempts</h2>
              <p className="text-[11px] text-neutral-500 mt-1 uppercase tracking-wider">Logs of checking codes by customers.</p>
            </div>
            <button
              onClick={loadData}
              className="p-2 text-neutral-400 hover:text-white hover:bg-[#0A0A0A] border border-neutral-800 rounded-none transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {loading ? (
            <div className="py-16 text-center">
              <div className="w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-neutral-500 text-[10px] uppercase tracking-wider">Retrieving safety logs...</p>
            </div>
          ) : attempts.length === 0 ? (
            <div className="py-12 text-center border border-dashed border-neutral-800 rounded-none">
              <AlertTriangle className="w-6 h-6 text-neutral-600 mx-auto mb-2" />
              <p className="text-neutral-500 text-[11px] uppercase tracking-wider">No verification requests logged yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-neutral-800">
                    <th className="pb-3 text-[10px] font-black uppercase text-neutral-500 tracking-wider">Timestamp</th>
                    <th className="pb-3 text-[10px] font-black uppercase text-neutral-500 tracking-wider">Entered Code</th>
                    <th className="pb-3 text-[10px] font-black uppercase text-neutral-500 tracking-wider">Result</th>
                    <th className="pb-3 text-[10px] font-black uppercase text-neutral-500 tracking-wider">IP / Phone</th>
                    <th className="pb-3 text-[10px] font-black uppercase text-neutral-500 tracking-wider">Product Variant</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800 text-xs">
                  {attempts.map((att: any) => {
                    const variant = att.verificationCode?.productVariant;
                    const prodName = variant?.product?.name ? `${variant.product.name} - ${variant.name}` : "N/A";
                    
                    return (
                      <tr key={att.id} className="hover:bg-[#0A0A0A]/50 transition-colors">
                        <td className="py-3 text-[10px] font-mono text-neutral-500 uppercase">
                          {new Date(att.createdAt).toLocaleString("en-IN")}
                        </td>
                        <td className="py-3 font-mono font-bold text-white tracking-wider">
                          {att.codeInput}
                        </td>
                        <td className="py-3">
                          <span className={`inline-flex items-center gap-1 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-none ${
                            att.status === "VALID"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : att.status === "ALREADY_USED"
                              ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                              : "bg-red-600/10 text-red-500 border border-red-600/20"
                          }`}>
                            {att.status === "VALID" && <CheckCircle className="w-2.5 h-2.5" />}
                            {att.status === "ALREADY_USED" && <AlertTriangle className="w-2.5 h-2.5" />}
                            {att.status === "INVALID" && <XCircle className="w-2.5 h-2.5" />}
                            {att.status}
                          </span>
                        </td>
                        <td className="py-3 text-[10px] text-neutral-400">
                          <div className="font-mono">{att.ipAddress}</div>
                          {att.phone && <div className="text-[9px] text-neutral-500 font-mono mt-0.5">{att.phone}</div>}
                        </td>
                        <td className="py-3 text-[10px] text-neutral-400 max-w-[150px] truncate uppercase font-mono" title={prodName}>
                          {prodName}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Code Display Modal */}
      <AnimatePresence>
        {showCodesModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCodesModal(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-[#111111] border border-neutral-800 rounded-none p-6 md:p-8 max-w-xl w-full relative z-10 flex flex-col gap-6"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-display font-black text-lg uppercase tracking-tight text-white italic">
                    Generated Scratch Codes
                  </h3>
                  <p className="text-[11px] text-amber-500 font-semibold mt-1 flex items-center gap-1.5 uppercase">
                    <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                    Copy or download these codes now. They cannot be retrieved in plain-text again.
                  </p>
                </div>
                <button
                  onClick={() => setShowCodesModal(false)}
                  className="p-1 text-neutral-500 hover:text-white"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2">
                <button
                  onClick={handleCopyAll}
                  className="flex-1 bg-white hover:bg-neutral-200 text-black font-bold uppercase tracking-wider text-[10px] py-3 rounded-none transition-all flex items-center justify-center gap-2"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copySuccess ? "Copied All!" : "Copy All Codes"}
                </button>
                <button
                  onClick={handleDownload}
                  className="flex-1 bg-[#0A0A0A] hover:bg-[#141414] text-white border border-neutral-800 font-bold uppercase tracking-wider text-[10px] py-3 rounded-none transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download TXT
                </button>
              </div>

              {/* Code List Box */}
              <div className="bg-[#0A0A0A] border border-neutral-800 rounded-none max-h-60 overflow-y-auto p-4 flex flex-col gap-1.5 font-mono text-xs select-all">
                {generatedCodes.map((code, idx) => (
                  <div key={idx} className="flex items-center justify-between py-1 border-b border-neutral-850 last:border-0 hover:bg-[#111111]/50 px-2 rounded-none">
                    <span className="text-neutral-500 select-none text-[10px]">{idx + 1}.</span>
                    <span className="text-white tracking-widest font-black select-text">{code}</span>
                    <button
                      onClick={() => handleCopySingle(code, idx)}
                      className="text-neutral-500 hover:text-red-500 p-0.5 select-none transition-colors"
                    >
                      {copiedIndex === idx ? (
                        <span className="text-[9px] font-bold text-emerald-400">Copied</span>
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowCodesModal(false)}
                className="w-full bg-[#0A0A0A] hover:bg-[#141414] border border-neutral-800 text-white font-bold uppercase tracking-wider text-xs py-3.5 rounded-none transition-all"
              >
                Close and Lock Batch
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
