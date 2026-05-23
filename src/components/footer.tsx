"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Instagram,
  Youtube,
  MessageCircle,
  Mail,
  MapPin,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";

const footerLinks = {
  shop: [
    { label: "All Products", href: "/shop" },
    { label: "Mass Gainers", href: "/category/mass-gainer" },
  ],
  company: [
    { label: "Blog", href: "/blog" },
    { label: "Verify Product", href: "/verify" },
  ],
  support: [
    { label: "Shipping Policy", href: "/shipping-policy" },
    { label: "Returns & Refunds", href: "/returns" },
    { label: "FAQ", href: "/faq" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
  ],
};

const socials = [
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Youtube, href: "#", label: "YouTube" },
  { icon: MessageCircle, href: "#", label: "WhatsApp" },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-neutral-900 overflow-hidden bg-[#0A0A0A]">
      <div className="container-main pt-16 pb-8 relative z-10">
        {/* Main Footer Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 lg:gap-8"
        >
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-2 lg:pr-8">
            {/* Logo */}
            <Link href="/" className="inline-flex items-center group">
              <div className="relative w-[100px] h-[140px] lg:w-[130px] lg:h-[180px]">
                <Image
                  src="/images/logo.png"
                  alt="Komando Labs Logo"
                  fill
                  sizes="(max-width: 768px) 100px, 130px"
                  className="object-contain filter brightness-100 object-left"
                />
              </div>
            </Link>

            <p className="mt-4 text-sm text-neutral-400 leading-relaxed max-w-xs uppercase font-bold tracking-tight text-[11px]">
              India&apos;s premium fitness-performance supplement brand. Lab-tested,
              authenticity-verified, and engineered for results.
            </p>

            <div className="mt-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-none bg-red-600/10 border border-red-600/20">
              <ShieldCheck className="w-3.5 h-3.5 text-red-500" />
              <span className="text-[10px] font-black text-red-500 tracking-widest uppercase">
                FSSAI Licensed
              </span>
            </div>

            {/* Contact Info */}
            <div className="mt-6 space-y-2.5">
              <a
                href="mailto:support@komandolabs.com"
                className="flex items-center gap-2.5 text-xs text-neutral-450 hover:text-red-500 transition-colors uppercase font-bold tracking-wider group"
              >
                <Mail className="w-3.5 h-3.5 text-neutral-500 group-hover:text-red-500 transition-colors" />
                support@komandolabs.com
              </a>
              <div className="flex items-center gap-2.5 text-xs text-neutral-455 uppercase font-bold tracking-wider">
                <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                Mumbai, India
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-6 flex items-center gap-2">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-none bg-[#111111] border border-neutral-850 text-neutral-300 hover:text-white hover:bg-neutral-800 hover:border-red-600 transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="font-display font-black text-xs text-white uppercase tracking-widest mb-4 border-b border-neutral-900 pb-2">
              Shop
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-red-500 transition-colors duration-200 inline-flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-0.5 translate-x-0.5 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-200" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-display font-black text-xs text-white uppercase tracking-widest mb-4 border-b border-neutral-900 pb-2">
              Company
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-red-500 transition-colors duration-200 inline-flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-0.5 translate-x-0.5 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-200" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-display font-black text-xs text-white uppercase tracking-widest mb-4 border-b border-neutral-900 pb-2">
              Support
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-red-500 transition-colors duration-200 inline-flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-0.5 translate-x-0.5 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-200" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Divider */}
        <div className="mt-12 h-[1px] bg-neutral-900" />

        {/* Bottom Bar */}
        <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">
            © {new Date().getFullYear()} Komando Labs. All rights reserved.
          </p>

          <span className="text-xs font-bold uppercase tracking-widest text-neutral-500">
            Made with precision in India 🇮🇳
          </span>
        </div>
      </div>
    </footer>
  );
}
