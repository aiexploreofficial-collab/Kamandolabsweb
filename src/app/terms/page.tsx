import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import {
  Scale,
  ShieldCheck,
  UserCheck,
  CreditCard,
  Package,
  AlertTriangle,
  Ban,
  FileText,
  Globe,
  Mail,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms and conditions governing use of the Komando Labs website, purchases, and services. Read our complete terms of service.",
};

export default function TermsPage() {
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
                <Scale className="w-5 h-5 text-red-500" />
              </div>
              <span className="text-xs font-semibold text-red-400 uppercase tracking-widest">
                Legal
              </span>
            </div>
            <h1 className="font-display font-bold text-3xl md:text-5xl text-white leading-tight">
              Terms of Service
            </h1>
            <p className="mt-4 text-neutral-400 text-base md:text-lg max-w-2xl leading-relaxed">
              By accessing or using the Komando Labs website and purchasing our
              products, you agree to be bound by these terms and conditions.
              Please read them carefully.
            </p>
            <p className="mt-3 text-xs text-neutral-500">
              Last updated: 22 May 2026 &nbsp;·&nbsp; Effective from: 1 January
              2026
            </p>
          </div>
        </section>

        {/* Terms Content */}
        <section className="pb-20">
          <div className="container-main space-y-6">
            {/* 1. General */}
            <div className="p-8 md:p-10 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <div className="flex items-center gap-2.5 mb-4">
                <FileText className="w-5 h-5 text-red-500" />
                <h2 className="font-display font-bold text-lg text-white">
                  1. General Terms
                </h2>
              </div>
              <div className="space-y-3 text-sm text-neutral-300 leading-relaxed">
                <p>
                  These Terms of Service (&quot;Terms&quot;) govern your use of the website{" "}
                  <strong className="text-white">www.komandolabs.com</strong>{" "}
                  (&quot;Site&quot;) operated by Komando Labs (&quot;Company&quot;, &quot;we&quot;, &quot;us&quot;,
                  &quot;our&quot;), a company registered in Mumbai, Maharashtra, India.
                </p>
                <p>
                  By accessing this Site, you confirm that you are at least 18 years
                  of age (or the age of legal majority in your jurisdiction) and
                  agree to comply with and be bound by these Terms along with our{" "}
                  <a
                    href="/privacy"
                    className="text-red-400 hover:text-red-300 underline underline-offset-2 transition-colors"
                  >
                    Privacy Policy
                  </a>
                  .
                </p>
                <p>
                  We reserve the right to update or modify these Terms at any time
                  without prior notice. Continued use of the Site following any
                  changes constitutes your acceptance of the revised Terms.
                </p>
              </div>
            </div>

            {/* 2. Account */}
            <div className="p-8 md:p-10 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <div className="flex items-center gap-2.5 mb-4">
                <UserCheck className="w-5 h-5 text-red-500" />
                <h2 className="font-display font-bold text-lg text-white">
                  2. User Accounts
                </h2>
              </div>
              <div className="space-y-3 text-sm text-neutral-300 leading-relaxed">
                <p>
                  You may be required to create an account to access certain
                  features of the Site. You are responsible for maintaining the
                  confidentiality of your account credentials and for all activities
                  that occur under your account.
                </p>
                <p>
                  You agree to provide accurate, complete, and current information
                  during the registration process and to keep your account
                  information updated. Komando Labs reserves the right to suspend or
                  terminate any account that is found to contain false or misleading
                  information.
                </p>
                <p>
                  You must immediately notify us at{" "}
                  <a
                    href="mailto:support@komandolabs.com"
                    className="text-red-400 hover:text-red-300 underline underline-offset-2 transition-colors"
                  >
                    support@komandolabs.com
                  </a>{" "}
                  if you suspect any unauthorised access to your account.
                </p>
              </div>
            </div>

            {/* 3. Products */}
            <div className="p-8 md:p-10 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <div className="flex items-center gap-2.5 mb-4">
                <Package className="w-5 h-5 text-red-500" />
                <h2 className="font-display font-bold text-lg text-white">
                  3. Products & Pricing
                </h2>
              </div>
              <div className="space-y-3 text-sm text-neutral-300 leading-relaxed">
                <p>
                  All products listed on the Site, including but not limited to{" "}
                  <strong className="text-white">HARD Mass Gainer</strong> and{" "}
                  <strong className="text-white">SPARTAN Mass Gainer</strong>, are
                  dietary supplements intended for healthy adults. They are not
                  intended to diagnose, treat, cure, or prevent any disease.
                </p>
                <p>
                  We make every effort to display product details (descriptions,
                  images, pricing, nutritional information) as accurately as
                  possible. However, we do not guarantee that colours, images, or
                  descriptions are 100% accurate due to screen variations.
                </p>
                <p>
                  All prices are listed in Indian Rupees (₹) and are inclusive of
                  applicable GST unless stated otherwise. We reserve the right to
                  modify pricing at any time without prior notice. Price changes will
                  not affect orders already confirmed.
                </p>
                <p>
                  In the event of a pricing error, we reserve the right to cancel the
                  order and issue a full refund.
                </p>
              </div>
            </div>

            {/* 4. Orders & Payments */}
            <div className="p-8 md:p-10 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <div className="flex items-center gap-2.5 mb-4">
                <CreditCard className="w-5 h-5 text-red-500" />
                <h2 className="font-display font-bold text-lg text-white">
                  4. Orders & Payments
                </h2>
              </div>
              <div className="space-y-3 text-sm text-neutral-300 leading-relaxed">
                <p>
                  Placing an order constitutes an offer to purchase. All orders are
                  subject to acceptance by Komando Labs. We may refuse or cancel any
                  order at our discretion, including cases of suspected fraud,
                  product unavailability, or pricing errors.
                </p>
                <p>
                  We accept payments via UPI, credit/debit cards, net banking, and
                  select digital wallets. Cash on Delivery (COD) is available on
                  eligible pin codes. Payment processing is handled by third-party
                  payment gateways; Komando Labs does not store your card details.
                </p>
                <p>
                  You confirm that the payment method used belongs to you or that you
                  have authorisation to use it. Any fraudulent payment activity will
                  be reported to the appropriate authorities.
                </p>
              </div>
            </div>

            {/* 5. Shipping & Returns */}
            <div className="p-8 md:p-10 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <div className="flex items-center gap-2.5 mb-4">
                <Package className="w-5 h-5 text-red-500" />
                <h2 className="font-display font-bold text-lg text-white">
                  5. Shipping & Returns
                </h2>
              </div>
              <div className="space-y-3 text-sm text-neutral-300 leading-relaxed">
                <p>
                  Shipping and delivery are governed by our{" "}
                  <a
                    href="/shipping-policy"
                    className="text-red-400 hover:text-red-300 underline underline-offset-2 transition-colors"
                  >
                    Shipping Policy
                  </a>
                  . Returns and refunds are governed by our{" "}
                  <a
                    href="/returns"
                    className="text-red-400 hover:text-red-300 underline underline-offset-2 transition-colors"
                  >
                    Returns & Refund Policy
                  </a>
                  .
                </p>
                <p>
                  Risk of loss and title for products pass to you upon delivery to
                  the carrier. Komando Labs is not responsible for delays, losses, or
                  damages caused by the courier service after dispatch.
                </p>
              </div>
            </div>

            {/* 6. Authenticity */}
            <div className="p-8 md:p-10 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <div className="flex items-center gap-2.5 mb-4">
                <ShieldCheck className="w-5 h-5 text-red-500" />
                <h2 className="font-display font-bold text-lg text-white">
                  6. Product Authenticity
                </h2>
              </div>
              <div className="space-y-3 text-sm text-neutral-300 leading-relaxed">
                <p>
                  Every Komando Labs product features a unique QR-based authenticity
                  code on its packaging. You can verify your product at{" "}
                  <a
                    href="/verify"
                    className="text-red-400 hover:text-red-300 underline underline-offset-2 transition-colors"
                  >
                    komandolabs.com/verify
                  </a>
                  .
                </p>
                <p>
                  Komando Labs is not responsible for products purchased from
                  unauthorised resellers or third-party marketplaces unless
                  explicitly listed as an authorised seller on our website. Products
                  failing authenticity verification are not eligible for returns,
                  warranty, or any support.
                </p>
              </div>
            </div>

            {/* 7. Prohibited Uses */}
            <div className="p-8 md:p-10 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <div className="flex items-center gap-2.5 mb-4">
                <Ban className="w-5 h-5 text-red-500" />
                <h2 className="font-display font-bold text-lg text-white">
                  7. Prohibited Uses
                </h2>
              </div>
              <div className="space-y-3 text-sm text-neutral-300 leading-relaxed">
                <p>You agree not to:</p>
                <ul className="list-none space-y-2.5 ml-1">
                  {[
                    "Use the Site for any unlawful purpose or in violation of any applicable law",
                    "Attempt to gain unauthorised access to any systems, servers, or databases connected to the Site",
                    "Scrape, crawl, or use any automated means to access the Site without our express written consent",
                    "Reproduce, duplicate, sell, resell, or exploit any portion of the Site without express permission",
                    "Upload or transmit viruses, malware, or any harmful code through the Site",
                    "Impersonate another person, entity, or misrepresent your affiliation with any entity",
                    "Resell Komando Labs products at prices exceeding MRP or misrepresent them as different products",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <Ban className="w-3.5 h-3.5 text-red-500/50 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 8. Intellectual Property */}
            <div className="p-8 md:p-10 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <div className="flex items-center gap-2.5 mb-4">
                <ShieldCheck className="w-5 h-5 text-red-500" />
                <h2 className="font-display font-bold text-lg text-white">
                  8. Intellectual Property
                </h2>
              </div>
              <div className="space-y-3 text-sm text-neutral-300 leading-relaxed">
                <p>
                  All content on this Site — including text, graphics, logos, product
                  names (&quot;HARD Mass Gainer&quot;, &quot;SPARTAN Mass Gainer&quot;), images,
                  videos, and software — is the property of Komando Labs and
                  protected under Indian intellectual property laws.
                </p>
                <p>
                  You may not copy, modify, distribute, display, reproduce, or
                  create derivative works from any content on this Site without our
                  prior written consent. The &quot;Komando Labs&quot; name, logo, and tagline
                  &quot;Command Your Strength&quot; are registered trademarks.
                </p>
              </div>
            </div>

            {/* 9. Limitation of Liability */}
            <div className="p-8 md:p-10 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <div className="flex items-center gap-2.5 mb-4">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <h2 className="font-display font-bold text-lg text-white">
                  9. Limitation of Liability
                </h2>
              </div>
              <div className="space-y-3 text-sm text-neutral-300 leading-relaxed">
                <p>
                  To the maximum extent permitted by applicable law, Komando Labs
                  shall not be liable for any indirect, incidental, special,
                  consequential, or punitive damages arising from your use of the
                  Site or purchase of products.
                </p>
                <p>
                  Our total liability for any claim arising from a purchase shall not
                  exceed the amount paid for the specific product(s) giving rise to
                  the claim.
                </p>
                <p>
                  Komando Labs products are dietary supplements and are not a
                  substitute for a balanced diet or professional medical advice.
                  Consult a healthcare professional before use, especially if you
                  have pre-existing medical conditions, are pregnant, nursing, or
                  under 18 years of age.
                </p>
              </div>
            </div>

            {/* 10. Governing Law */}
            <div className="p-8 md:p-10 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <div className="flex items-center gap-2.5 mb-4">
                <Globe className="w-5 h-5 text-red-500" />
                <h2 className="font-display font-bold text-lg text-white">
                  10. Governing Law & Jurisdiction
                </h2>
              </div>
              <div className="space-y-3 text-sm text-neutral-300 leading-relaxed">
                <p>
                  These Terms shall be governed by and construed in accordance with
                  the laws of India. Any disputes arising out of or in connection
                  with these Terms shall be subject to the exclusive jurisdiction of
                  the courts in Mumbai, Maharashtra, India.
                </p>
                <p>
                  If any provision of these Terms is held to be invalid or
                  unenforceable, the remaining provisions shall continue in full
                  force and effect.
                </p>
              </div>
            </div>

            {/* Contact */}
            <div className="p-8 md:p-10 rounded-2xl bg-gradient-to-br from-red-500/[0.08] to-transparent border border-red-500/[0.15]">
              <div className="flex items-center gap-2.5 mb-3">
                <Mail className="w-5 h-5 text-red-400" />
                <h2 className="font-display font-bold text-lg text-white">
                  Questions About These Terms?
                </h2>
              </div>
              <p className="text-sm text-neutral-300 leading-relaxed mb-1">
                If you have any questions or concerns regarding these Terms of
                Service, please reach out to us:
              </p>
              <div className="mt-3 space-y-1.5 text-sm text-neutral-300">
                <p>
                  <strong className="text-white">Komando Labs</strong>
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
