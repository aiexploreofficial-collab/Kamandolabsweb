import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import {
  Truck,
  Clock,
  MapPin,
  Package,
  ShieldCheck,
  IndianRupee,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Shipping Policy",
  description:
    "Learn about Komando Labs shipping timelines, delivery partners, and pan-India coverage. Free shipping on orders above ₹999.",
};

const deliveryZones = [
  {
    zone: "Metro Cities",
    cities: "Mumbai, Delhi, Bangalore, Chennai, Hyderabad, Kolkata, Pune",
    timeline: "2–4 business days",
  },
  {
    zone: "Tier-2 Cities",
    cities: "Jaipur, Lucknow, Chandigarh, Ahmedabad, Indore, Nagpur & more",
    timeline: "4–6 business days",
  },
  {
    zone: "Tier-3 & Remote Areas",
    cities: "North-East, J&K, Himachal, Andaman & Nicobar, Lakshadweep",
    timeline: "6–10 business days",
  },
];

const highlights = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "On all prepaid orders above ₹999 across India.",
  },
  {
    icon: ShieldCheck,
    title: "Tamper-Proof Packaging",
    description: "Every order ships in sealed, branded packaging with QR verification.",
  },
  {
    icon: Clock,
    title: "Same-Day Dispatch",
    description: "Orders placed before 2:00 PM IST are dispatched the same business day.",
  },
  {
    icon: Package,
    title: "Real-Time Tracking",
    description: "Track your shipment via SMS, email, and your Komando Labs account.",
  },
];

export default function ShippingPolicyPage() {
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
                <Truck className="w-5 h-5 text-red-500" />
              </div>
              <span className="text-xs font-semibold text-red-400 uppercase tracking-widest">
                Shipping & Delivery
              </span>
            </div>
            <h1 className="font-display font-bold text-3xl md:text-5xl text-white leading-tight">
              Shipping Policy
            </h1>
            <p className="mt-4 text-neutral-400 text-base md:text-lg max-w-2xl leading-relaxed">
              We deliver across India with trusted courier partners. Every
              Komando Labs order is carefully packed, sealed, and dispatched with
              full tracking visibility.
            </p>
            <p className="mt-3 text-xs text-neutral-500">
              Last updated: 22 May 2026
            </p>
          </div>
        </section>

        {/* Highlights Grid */}
        <section className="pb-16">
          <div className="container-main">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {highlights.map((item) => (
                <div
                  key={item.title}
                  className="group p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-red-500/20 transition-all duration-500"
                >
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4 group-hover:bg-red-500/20 transition-colors duration-300">
                    <item.icon className="w-5 h-5 text-red-500" />
                  </div>
                  <h3 className="font-display font-semibold text-white text-sm mb-1.5">
                    {item.title}
                  </h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Delivery Zones */}
        <section className="pb-16">
          <div className="container-main">
            <div className="p-8 md:p-10 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <div className="flex items-center gap-2.5 mb-6">
                <MapPin className="w-5 h-5 text-red-500" />
                <h2 className="font-display font-bold text-xl text-white">
                  Delivery Zones & Timelines
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/[0.08]">
                      <th className="pb-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                        Zone
                      </th>
                      <th className="pb-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                        Coverage
                      </th>
                      <th className="pb-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                        Estimated Delivery
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {deliveryZones.map((zone) => (
                      <tr
                        key={zone.zone}
                        className="border-b border-white/[0.04] last:border-0"
                      >
                        <td className="py-4 pr-4">
                          <span className="font-semibold text-white text-sm">
                            {zone.zone}
                          </span>
                        </td>
                        <td className="py-4 pr-4 text-sm text-neutral-400">
                          {zone.cities}
                        </td>
                        <td className="py-4">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-xs font-semibold text-red-400">
                            <Clock className="w-3 h-3" />
                            {zone.timeline}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Sections */}
        <section className="pb-20">
          <div className="container-main space-y-6">
            {/* Shipping Charges */}
            <div className="p-8 md:p-10 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <div className="flex items-center gap-2.5 mb-4">
                <IndianRupee className="w-5 h-5 text-red-500" />
                <h2 className="font-display font-bold text-lg text-white">
                  Shipping Charges
                </h2>
              </div>
              <div className="space-y-3 text-sm text-neutral-300 leading-relaxed">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <p>
                    <strong className="text-white">Prepaid orders ₹999+:</strong>{" "}
                    Free shipping across India.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <p>
                    <strong className="text-white">Prepaid orders below ₹999:</strong>{" "}
                    Flat ₹79 shipping fee.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <p>
                    <strong className="text-white">Cash on Delivery (COD):</strong>{" "}
                    Available on select pin codes. An additional ₹49 COD handling
                    fee applies.
                  </p>
                </div>
              </div>
            </div>

            {/* Order Processing */}
            <div className="p-8 md:p-10 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <div className="flex items-center gap-2.5 mb-4">
                <Package className="w-5 h-5 text-red-500" />
                <h2 className="font-display font-bold text-lg text-white">
                  Order Processing
                </h2>
              </div>
              <div className="space-y-3 text-sm text-neutral-300 leading-relaxed">
                <p>
                  All orders are processed within <strong className="text-white">1 business day</strong> of
                  receiving your order confirmation. Orders placed after 2:00 PM IST
                  or on weekends/holidays will be processed the next business day.
                </p>
                <p>
                  You will receive an email and SMS with your tracking number once
                  your order has been shipped. You can use this tracking number on
                  the courier partner&apos;s website or on your Komando Labs account
                  dashboard.
                </p>
              </div>
            </div>

            {/* Delays & Issues */}
            <div className="p-8 md:p-10 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <div className="flex items-center gap-2.5 mb-4">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <h2 className="font-display font-bold text-lg text-white">
                  Delays & Delivery Issues
                </h2>
              </div>
              <div className="space-y-3 text-sm text-neutral-300 leading-relaxed">
                <p>
                  While we strive to deliver every order on time, delays may occur
                  due to unforeseen circumstances including natural disasters,
                  strikes, government restrictions, or courier-side delays in remote
                  regions.
                </p>
                <p>
                  If your order has not arrived within the estimated delivery window,
                  please contact us at{" "}
                  <a
                    href="mailto:support@komandolabs.com"
                    className="text-red-400 hover:text-red-300 underline underline-offset-2 transition-colors"
                  >
                    support@komandolabs.com
                  </a>{" "}
                  with your order number. Our team will investigate and resolve the
                  issue within 24–48 hours.
                </p>
                <p>
                  Komando Labs is not liable for delays caused by incorrect or
                  incomplete shipping addresses provided at checkout. Please
                  double-check your delivery details before confirming your order.
                </p>
              </div>
            </div>

            {/* Contact */}
            <div className="p-8 md:p-10 rounded-2xl bg-gradient-to-br from-red-500/[0.08] to-transparent border border-red-500/[0.15]">
              <h2 className="font-display font-bold text-lg text-white mb-3">
                Need Help With Your Shipment?
              </h2>
              <p className="text-sm text-neutral-300 leading-relaxed mb-4">
                Our support team is available Monday–Saturday, 10:00 AM – 7:00 PM
                IST. We typically respond within 4 hours.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="mailto:support@komandolabs.com"
                  className="btn-primary text-sm !px-5 !py-2.5"
                >
                  Email Support
                </a>
                <a href="/faq" className="btn-secondary text-sm !px-5 !py-2.5">
                  View FAQ
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
