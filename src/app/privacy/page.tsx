import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import {
  ShieldCheck,
  Eye,
  Database,
  Cookie,
  Share2,
  Lock,
  UserCheck,
  Baby,
  Globe,
  Mail,
  Fingerprint,
  Bell,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how Komando Labs collects, uses, protects, and stores your personal data. We are committed to your privacy and data security.",
};

export default function PrivacyPage() {
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
                <ShieldCheck className="w-5 h-5 text-red-500" />
              </div>
              <span className="text-xs font-semibold text-red-400 uppercase tracking-widest">
                Privacy & Data
              </span>
            </div>
            <h1 className="font-display font-bold text-3xl md:text-5xl text-white leading-tight">
              Privacy Policy
            </h1>
            <p className="mt-4 text-neutral-400 text-base md:text-lg max-w-2xl leading-relaxed">
              At Komando Labs, we respect your privacy and are committed to
              protecting the personal information you share with us. This policy
              explains what we collect, why, and how we safeguard it.
            </p>
            <p className="mt-3 text-xs text-neutral-500">
              Last updated: 22 May 2026 &nbsp;·&nbsp; Effective from: 1 January
              2026
            </p>
          </div>
        </section>

        {/* Privacy Highlights */}
        <section className="pb-12">
          <div className="container-main">
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                {
                  icon: Lock,
                  title: "Encrypted & Secure",
                  desc: "All data is transmitted over SSL/TLS. Payments are PCI-DSS compliant.",
                },
                {
                  icon: Eye,
                  title: "No Selling Data",
                  desc: "We never sell your personal information to third parties, period.",
                },
                {
                  icon: Fingerprint,
                  title: "Your Control",
                  desc: "Access, update, or delete your data at any time by contacting us.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-red-500/20 transition-all duration-500 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4 group-hover:bg-red-500/20 transition-colors duration-300">
                    <item.icon className="w-5 h-5 text-red-500" />
                  </div>
                  <h3 className="font-display font-semibold text-white text-sm mb-1.5">
                    {item.title}
                  </h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Policy Content */}
        <section className="pb-20">
          <div className="container-main space-y-6">
            {/* 1. Information We Collect */}
            <div className="p-8 md:p-10 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <div className="flex items-center gap-2.5 mb-4">
                <Database className="w-5 h-5 text-red-500" />
                <h2 className="font-display font-bold text-lg text-white">
                  1. Information We Collect
                </h2>
              </div>
              <div className="space-y-4 text-sm text-neutral-300 leading-relaxed">
                <div>
                  <h3 className="font-semibold text-white mb-1.5">
                    Personal Information
                  </h3>
                  <p>
                    When you create an account, place an order, or contact us, we
                    may collect your name, email address, phone number, shipping
                    address, billing address, and payment-related information (processed
                    securely by third-party gateways — we do not store card numbers).
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1.5">
                    Automatically Collected Data
                  </h3>
                  <p>
                    When you visit our Site, we automatically collect certain
                    information including your IP address, browser type, device
                    information, operating system, referring URLs, pages viewed,
                    time spent on pages, and clickstream data. This is collected
                    via cookies and similar tracking technologies.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1.5">
                    Product Verification Data
                  </h3>
                  <p>
                    When you use our product verification feature at{" "}
                    <a
                      href="/verify"
                      className="text-red-400 hover:text-red-300 underline underline-offset-2 transition-colors"
                    >
                      /verify
                    </a>
                    , we may collect the QR code or batch number scanned, device
                    information, and geolocation (city level) to detect
                    counterfeits and protect our customers.
                  </p>
                </div>
              </div>
            </div>

            {/* 2. How We Use Information */}
            <div className="p-8 md:p-10 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <div className="flex items-center gap-2.5 mb-4">
                <Eye className="w-5 h-5 text-red-500" />
                <h2 className="font-display font-bold text-lg text-white">
                  2. How We Use Your Information
                </h2>
              </div>
              <div className="text-sm text-neutral-300 leading-relaxed">
                <p className="mb-3">
                  We use the information we collect for the following purposes:
                </p>
                <ul className="space-y-2.5 ml-1">
                  {[
                    "Process and fulfil your orders, including shipping and delivery",
                    "Send order confirmations, shipping updates, and delivery notifications",
                    "Respond to your inquiries and provide customer support",
                    "Verify product authenticity and detect counterfeit products",
                    "Improve our website, products, and services based on usage patterns",
                    "Send promotional emails, newsletters, and offers (only with your consent — you can unsubscribe at any time)",
                    "Prevent fraud, detect security threats, and enforce our terms",
                    "Comply with legal and regulatory obligations under Indian law",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500/60 mt-2 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 3. Cookies */}
            <div className="p-8 md:p-10 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <div className="flex items-center gap-2.5 mb-4">
                <Cookie className="w-5 h-5 text-red-500" />
                <h2 className="font-display font-bold text-lg text-white">
                  3. Cookies & Tracking
                </h2>
              </div>
              <div className="space-y-3 text-sm text-neutral-300 leading-relaxed">
                <p>Our Site uses the following types of cookies:</p>
                <div className="grid sm:grid-cols-2 gap-3 mt-3">
                  {[
                    {
                      type: "Essential Cookies",
                      desc: "Required for the Site to function (cart, authentication, security). Cannot be disabled.",
                    },
                    {
                      type: "Analytics Cookies",
                      desc: "Help us understand how visitors interact with the Site (e.g., Google Analytics).",
                    },
                    {
                      type: "Marketing Cookies",
                      desc: "Used to deliver relevant ads and track campaign effectiveness across platforms.",
                    },
                    {
                      type: "Preference Cookies",
                      desc: "Remember your settings, language preferences, and previously viewed products.",
                    },
                  ].map((cookie) => (
                    <div
                      key={cookie.type}
                      className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.04]"
                    >
                      <h4 className="font-semibold text-white text-xs mb-1">
                        {cookie.type}
                      </h4>
                      <p className="text-xs text-neutral-400">{cookie.desc}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-2">
                  You can manage cookie preferences through your browser settings.
                  Disabling certain cookies may affect the functionality of the
                  Site.
                </p>
              </div>
            </div>

            {/* 4. Data Sharing */}
            <div className="p-8 md:p-10 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <div className="flex items-center gap-2.5 mb-4">
                <Share2 className="w-5 h-5 text-red-500" />
                <h2 className="font-display font-bold text-lg text-white">
                  4. Data Sharing & Third Parties
                </h2>
              </div>
              <div className="space-y-3 text-sm text-neutral-300 leading-relaxed">
                <p>
                  We do <strong className="text-white">not sell</strong> your
                  personal data. We may share your information with:
                </p>
                <ul className="space-y-2.5 ml-1">
                  {[
                    "Payment processors (Razorpay, etc.) to securely process transactions",
                    "Courier and logistics partners to deliver your orders",
                    "Analytics providers (Google Analytics) to improve our services",
                    "Marketing platforms (Meta, Google Ads) for retargeting with your consent",
                    "Legal and regulatory authorities when required by law or to protect our rights",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500/60 mt-2 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p>
                  All third-party service providers are contractually obligated to
                  protect your data and use it only for the purposes specified.
                </p>
              </div>
            </div>

            {/* 5. Data Security */}
            <div className="p-8 md:p-10 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <div className="flex items-center gap-2.5 mb-4">
                <Lock className="w-5 h-5 text-red-500" />
                <h2 className="font-display font-bold text-lg text-white">
                  5. Data Security
                </h2>
              </div>
              <div className="space-y-3 text-sm text-neutral-300 leading-relaxed">
                <p>
                  We implement industry-standard security measures to protect your
                  personal data, including:
                </p>
                <ul className="space-y-2.5 ml-1">
                  {[
                    "256-bit SSL/TLS encryption for all data in transit",
                    "PCI-DSS compliant payment processing",
                    "Regular security audits and vulnerability assessments",
                    "Restricted access to personal data (need-to-know basis only)",
                    "Secure server infrastructure with automated backups",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/60 mt-2 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p>
                  While we strive to protect your personal data, no method of
                  transmission over the Internet or electronic storage is 100%
                  secure. We cannot guarantee absolute security.
                </p>
              </div>
            </div>

            {/* 6. Your Rights */}
            <div className="p-8 md:p-10 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <div className="flex items-center gap-2.5 mb-4">
                <UserCheck className="w-5 h-5 text-red-500" />
                <h2 className="font-display font-bold text-lg text-white">
                  6. Your Rights
                </h2>
              </div>
              <div className="space-y-3 text-sm text-neutral-300 leading-relaxed">
                <p>
                  Under applicable Indian data protection laws and the Digital
                  Personal Data Protection Act, 2023 (DPDPA), you have the right
                  to:
                </p>
                <ul className="space-y-2.5 ml-1">
                  {[
                    "Access the personal data we hold about you",
                    "Request correction of inaccurate or incomplete data",
                    "Request deletion of your personal data (subject to legal obligations)",
                    "Withdraw consent for marketing communications at any time",
                    "Nominate a person to exercise your data rights on your behalf",
                    "Lodge a grievance with the Data Protection Board of India",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500/60 mt-2 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p>
                  To exercise any of these rights, email us at{" "}
                  <a
                    href="mailto:support@komandolabs.com"
                    className="text-red-400 hover:text-red-300 underline underline-offset-2 transition-colors"
                  >
                    support@komandolabs.com
                  </a>{" "}
                  with the subject &quot;Data Privacy Request&quot;. We will respond within
                  30 days.
                </p>
              </div>
            </div>

            {/* 7. Data Retention */}
            <div className="p-8 md:p-10 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <div className="flex items-center gap-2.5 mb-4">
                <Database className="w-5 h-5 text-red-500" />
                <h2 className="font-display font-bold text-lg text-white">
                  7. Data Retention
                </h2>
              </div>
              <div className="space-y-3 text-sm text-neutral-300 leading-relaxed">
                <p>
                  We retain your personal data only for as long as necessary to
                  fulfil the purposes for which it was collected, unless a longer
                  retention period is required by law:
                </p>
                <ul className="space-y-2.5 ml-1">
                  {[
                    "Order and transaction data: 8 years (as required by Indian tax and accounting regulations)",
                    "Account data: Until you request deletion or close your account",
                    "Marketing preferences: Until you unsubscribe",
                    "Analytics data: 26 months from collection",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500/60 mt-2 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 8. Children */}
            <div className="p-8 md:p-10 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <div className="flex items-center gap-2.5 mb-4">
                <Baby className="w-5 h-5 text-red-500" />
                <h2 className="font-display font-bold text-lg text-white">
                  8. Children&apos;s Privacy
                </h2>
              </div>
              <div className="text-sm text-neutral-300 leading-relaxed">
                <p>
                  Our Site and products are not intended for individuals under the
                  age of 18. We do not knowingly collect personal information from
                  minors. If we become aware that a child under 18 has provided us
                  with personal information, we will take steps to delete such
                  information from our servers.
                </p>
              </div>
            </div>

            {/* 9. Changes & Notifications */}
            <div className="p-8 md:p-10 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <div className="flex items-center gap-2.5 mb-4">
                <Bell className="w-5 h-5 text-red-500" />
                <h2 className="font-display font-bold text-lg text-white">
                  9. Changes to This Policy
                </h2>
              </div>
              <div className="text-sm text-neutral-300 leading-relaxed space-y-3">
                <p>
                  We may update this Privacy Policy from time to time to reflect
                  changes in our practices, legal requirements, or operational
                  needs. When we make material changes, we will notify you by
                  updating the &quot;Last updated&quot; date at the top of this page and, if
                  appropriate, via email notification.
                </p>
                <p>
                  We encourage you to review this Privacy Policy periodically to
                  stay informed about how we protect your information.
                </p>
              </div>
            </div>

            {/* 10. Governing Law */}
            <div className="p-8 md:p-10 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <div className="flex items-center gap-2.5 mb-4">
                <Globe className="w-5 h-5 text-red-500" />
                <h2 className="font-display font-bold text-lg text-white">
                  10. Governing Law
                </h2>
              </div>
              <div className="text-sm text-neutral-300 leading-relaxed">
                <p>
                  This Privacy Policy is governed by and construed in accordance
                  with the laws of India, including the Information Technology Act,
                  2000 and the Digital Personal Data Protection Act, 2023. Any
                  disputes shall be subject to the exclusive jurisdiction of the
                  courts in Mumbai, Maharashtra, India.
                </p>
              </div>
            </div>

            {/* Contact */}
            <div className="p-8 md:p-10 rounded-2xl bg-gradient-to-br from-red-500/[0.08] to-transparent border border-red-500/[0.15]">
              <div className="flex items-center gap-2.5 mb-3">
                <Mail className="w-5 h-5 text-red-400" />
                <h2 className="font-display font-bold text-lg text-white">
                  Data Protection Contact
                </h2>
              </div>
              <p className="text-sm text-neutral-300 leading-relaxed mb-1">
                For any questions, concerns, or data-related requests, please
                contact our Data Protection Officer:
              </p>
              <div className="mt-3 space-y-1.5 text-sm text-neutral-300">
                <p>
                  <strong className="text-white">Komando Labs — Data Protection</strong>
                </p>
                <p>Mumbai, Maharashtra, India</p>
                <p>
                  Email:{" "}
                  <a
                    href="mailto:support@komandolabs.com"
                    className="text-red-400 hover:text-red-300 underline underline-offset-2 transition-colors"
                  >
                    support@komandolabs.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
