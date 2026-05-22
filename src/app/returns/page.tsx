import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import {
  RotateCcw,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Package,
  IndianRupee,
  Mail,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Returns & Refunds",
  description:
    "Komando Labs returns and refund policy. Hassle-free 7-day return window for damaged, defective, or incorrect products.",
};

const eligibleReasons = [
  "Product received is damaged or broken during transit",
  "Incorrect product delivered (different from what was ordered)",
  "Product is expired or past its best-before date upon delivery",
  "Tampered or unsealed packaging (authenticity seal broken)",
  "Manufacturing defect identified upon first use",
];

const ineligibleReasons = [
  "Change of mind after delivery",
  "Product opened, used, or partially consumed (unless defective)",
  "Incorrect flavour or variant selected by the customer at checkout",
  "Products purchased during clearance or flash sales (marked non-returnable)",
  "Damage caused by improper storage after delivery",
];

const refundSteps = [
  {
    step: "01",
    title: "Initiate Return",
    description:
      "Email support@komandolabs.com with your order number, product photos, and a description of the issue within 7 days of delivery.",
  },
  {
    step: "02",
    title: "Review & Approval",
    description:
      "Our team reviews your request within 24–48 hours. If approved, you'll receive return shipping instructions via email.",
  },
  {
    step: "03",
    title: "Ship It Back",
    description:
      "Pack the product securely in its original packaging and ship it back using the provided prepaid label or arrange a pickup.",
  },
  {
    step: "04",
    title: "Refund Processed",
    description:
      "Once we receive and inspect the product, your refund is initiated within 3–5 business days to your original payment method.",
  },
];

export default function ReturnsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0a0a0a]">
        {/* Hero */}
        <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-red-600/[0.07] via-transparent to-transparent" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[70%] h-[1px] bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />
          <div className="container-main relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20">
                <RotateCcw className="w-5 h-5 text-red-500" />
              </div>
              <span className="text-xs font-semibold text-red-400 uppercase tracking-widest">
                Returns & Refunds
              </span>
            </div>
            <h1 className="font-display font-bold text-3xl md:text-5xl text-white leading-tight">
              Returns & Refund Policy
            </h1>
            <p className="mt-4 text-neutral-400 text-base md:text-lg max-w-2xl leading-relaxed">
              Your satisfaction is our priority. If something isn&apos;t right
              with your order, we&apos;re here to make it right — quickly and
              hassle-free.
            </p>
            <p className="mt-3 text-xs text-neutral-500">
              Last updated: 22 May 2026
            </p>
          </div>
        </section>

        {/* Return Window Banner */}
        <section className="pb-12">
          <div className="container-main">
            <div className="flex flex-col sm:flex-row items-center gap-4 p-6 rounded-2xl bg-gradient-to-r from-red-500/[0.1] to-red-600/[0.05] border border-red-500/[0.15]">
              <div className="w-14 h-14 rounded-2xl bg-red-500/20 border border-red-500/30 flex items-center justify-center flex-shrink-0">
                <Clock className="w-7 h-7 text-red-400" />
              </div>
              <div>
                <h3 className="font-display font-bold text-white text-lg">
                  7-Day Return Window
                </h3>
                <p className="text-sm text-neutral-300 mt-0.5">
                  All return requests must be initiated within 7 days of receiving
                  your order. Items must be in their original, unused condition with
                  packaging intact.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Eligible / Ineligible */}
        <section className="pb-16">
          <div className="container-main grid md:grid-cols-2 gap-6">
            {/* Eligible */}
            <div className="p-8 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <div className="flex items-center gap-2.5 mb-5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h2 className="font-display font-bold text-lg text-white">
                  Eligible for Return
                </h2>
              </div>
              <ul className="space-y-3">
                {eligibleReasons.map((reason) => (
                  <li
                    key={reason}
                    className="flex items-start gap-2.5 text-sm text-neutral-300"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-500/60 mt-0.5 flex-shrink-0" />
                    {reason}
                  </li>
                ))}
              </ul>
            </div>

            {/* Ineligible */}
            <div className="p-8 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <div className="flex items-center gap-2.5 mb-5">
                <XCircle className="w-5 h-5 text-red-400" />
                <h2 className="font-display font-bold text-lg text-white">
                  Not Eligible for Return
                </h2>
              </div>
              <ul className="space-y-3">
                {ineligibleReasons.map((reason) => (
                  <li
                    key={reason}
                    className="flex items-start gap-2.5 text-sm text-neutral-300"
                  >
                    <XCircle className="w-4 h-4 text-red-500/50 mt-0.5 flex-shrink-0" />
                    {reason}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Refund Process Steps */}
        <section className="pb-16">
          <div className="container-main">
            <h2 className="font-display font-bold text-2xl text-white mb-8 text-center">
              How the Return Process Works
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {refundSteps.map((item, idx) => (
                <div
                  key={item.step}
                  className="relative p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-red-500/20 transition-all duration-500 group"
                >
                  <span className="font-display font-black text-3xl text-red-500/20 group-hover:text-red-500/40 transition-colors">
                    {item.step}
                  </span>
                  <h3 className="font-display font-semibold text-white text-sm mt-3 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {item.description}
                  </p>
                  {idx < refundSteps.length - 1 && (
                    <ArrowRight className="hidden lg:block absolute top-1/2 -right-3 w-5 h-5 text-neutral-700" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Refund Details */}
        <section className="pb-16">
          <div className="container-main space-y-6">
            {/* Refund Methods */}
            <div className="p-8 md:p-10 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <div className="flex items-center gap-2.5 mb-4">
                <IndianRupee className="w-5 h-5 text-red-500" />
                <h2 className="font-display font-bold text-lg text-white">
                  Refund Methods & Timelines
                </h2>
              </div>
              <div className="space-y-3 text-sm text-neutral-300 leading-relaxed">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <p>
                    <strong className="text-white">UPI / Net Banking:</strong>{" "}
                    Refund credited within 3–5 business days.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <p>
                    <strong className="text-white">Credit / Debit Card:</strong>{" "}
                    Refund credited within 5–7 business days (subject to your bank&apos;s
                    processing time).
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <p>
                    <strong className="text-white">Cash on Delivery orders:</strong>{" "}
                    Refunded via bank transfer (NEFT/IMPS). You&apos;ll be asked to
                    provide your bank details.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <p>
                    <strong className="text-white">Wallet / Store Credit:</strong>{" "}
                    Credited instantly upon return approval. Can be used on your next
                    Komando Labs purchase.
                  </p>
                </div>
              </div>
            </div>

            {/* Exchanges */}
            <div className="p-8 md:p-10 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <div className="flex items-center gap-2.5 mb-4">
                <Package className="w-5 h-5 text-red-500" />
                <h2 className="font-display font-bold text-lg text-white">
                  Exchanges
                </h2>
              </div>
              <div className="text-sm text-neutral-300 leading-relaxed space-y-3">
                <p>
                  We currently do not offer direct product exchanges. If you
                  received the wrong product or a defective item, please initiate a
                  return and place a fresh order for the correct product.
                </p>
                <p>
                  For wrong flavour/variant delivered due to our error, we will ship
                  the correct product at no extra cost after receiving the returned
                  item.
                </p>
              </div>
            </div>

            {/* Cancellation */}
            <div className="p-8 md:p-10 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <div className="flex items-center gap-2.5 mb-4">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <h2 className="font-display font-bold text-lg text-white">
                  Order Cancellation
                </h2>
              </div>
              <div className="text-sm text-neutral-300 leading-relaxed space-y-3">
                <p>
                  Orders can be cancelled free of charge before they are dispatched.
                  Once an order is shipped, it cannot be cancelled and must follow
                  the return process outlined above.
                </p>
                <p>
                  To cancel an order, email us at{" "}
                  <a
                    href="mailto:support@komandolabs.com"
                    className="text-red-400 hover:text-red-300 underline underline-offset-2 transition-colors"
                  >
                    support@komandolabs.com
                  </a>{" "}
                  with your order number as soon as possible.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="pb-20">
          <div className="container-main">
            <div className="p-8 md:p-10 rounded-2xl bg-gradient-to-br from-red-500/[0.08] to-transparent border border-red-500/[0.15]">
              <div className="flex items-center gap-2.5 mb-3">
                <Mail className="w-5 h-5 text-red-400" />
                <h2 className="font-display font-bold text-lg text-white">
                  Have Questions About a Return?
                </h2>
              </div>
              <p className="text-sm text-neutral-300 leading-relaxed mb-4">
                Our support team is available Monday–Saturday, 10:00 AM – 7:00 PM
                IST. We aim to resolve all return requests within 48 hours.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="mailto:support@komandolabs.com"
                  className="btn-primary text-sm !px-5 !py-2.5"
                >
                  Contact Support
                </a>
                <a
                  href="/shipping-policy"
                  className="btn-secondary text-sm !px-5 !py-2.5"
                >
                  Shipping Policy
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
