"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Menu, X, Search, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

const navLinks = [
  { href: "/", label: "HOME" },
  { href: "/shop", label: "PRODUCTS" },
  { href: "/verify", label: "VERIFY", icon: ShieldCheck },
  { href: "/blog", label: "BLOG" },
];

import { useCart } from "@/context/cart-context";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const { cartCount } = useCart();
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen || searchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen, searchOpen]);

  // Live search lookup
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const response = await fetch(`/api/products?q=${encodeURIComponent(searchQuery)}`);
        if (response.ok) {
          const data = await response.json();
          setSearchResults(data);
        }
      } catch (err) {
        console.error("Error searching products:", err);
      } finally {
        setSearchLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out",
          scrolled
            ? "bg-[#0A0A0A] border-b border-neutral-900 shadow-2xl py-0"
            : "bg-transparent py-2"
        )}
      >
        <nav className="container-main">
          <div className={cn(
            "flex items-center justify-between transition-all duration-500 ease-out",
            scrolled ? "h-14 lg:h-16" : "h-18 lg:h-22"
          )}>
            {/* Logo */}
            <Link href="/" className="flex items-center group relative z-50 w-[90px] h-full lg:w-[120px]">
              <div className="absolute top-1 w-[90px] h-[130px] lg:top-2 lg:w-[120px] lg:h-[170px]">
                <Image
                  src="/images/logo.png"
                  alt="Komando Labs Logo"
                  fill
                  sizes="(max-width: 768px) 90px, 120px"
                  className="object-contain filter brightness-100 object-top group-hover:scale-105 transition-transform duration-300"
                  priority
                />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-0.5">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                const isVerify = link.href === "/verify";

                if (isVerify && isActive) {
                  return (
                    <motion.div
                      key={link.href}
                      whileHover={{ scale: 1.05 }}
                      className="px-2"
                    >
                      <Link
                        href={link.href}
                        className={cn(
                          "relative inline-flex items-center gap-1.5 px-5 py-2 text-[0.8rem] font-extrabold tracking-widest uppercase rounded-full text-white bg-[#FF1A1A] border border-[#FF5555]/50 transition-all duration-300 shadow-[0_0_20px_rgba(255,26,26,0.5)] hover:shadow-[0_0_30px_rgba(255,26,26,0.8)] hover:border-[#FF1A1A] focus:outline-none",
                          "group"
                        )}
                      >
                        {link.icon && (
                          <link.icon className="w-3.5 h-3.5 text-white transition-colors animate-pulse" />
                        )}
                        {link.label}
                      </Link>
                    </motion.div>
                  );
                }

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "relative px-4 py-2 text-[0.8rem] font-bold tracking-widest uppercase transition-all duration-300 rounded-none",
                      isActive ? "text-red-500 font-extrabold" : "text-neutral-400 hover:text-white",
                      "hover:bg-white/[0.03]",
                      "group"
                    )}
                  >
                    <span className="flex items-center gap-1.5">
                      {link.icon && (
                        <link.icon className={cn("w-3.5 h-3.5 transition-colors", isActive ? "text-red-500" : "text-neutral-500 group-hover:text-red-400")} />
                      )}
                      {link.label}
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-1 relative z-10">
              <button
                onClick={() => setSearchOpen(true)}
                aria-label="Search"
                className="p-2.5 text-neutral-500 hover:text-white transition-colors duration-200 rounded-none hover:bg-white/[0.03]"
              >
                <Search className="w-[18px] h-[18px]" />
              </button>

              <Link
                href="/cart"
                className="relative p-2.5 text-neutral-500 hover:text-white transition-colors duration-200 rounded-none hover:bg-white/[0.03]"
                aria-label="Cart"
              >
                <ShoppingBag className="w-[18px] h-[18px]" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 bg-red-600 text-[9px] font-bold text-white rounded-none flex items-center justify-center ring-2 ring-[#0A0A0A] animate-pulse">
                    {cartCount}
                  </span>
                )}
              </Link>

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2.5 text-neutral-500 hover:text-white transition-colors duration-200 rounded-none hover:bg-white/[0.03] ml-0.5"
                aria-label="Toggle menu"
              >
                <AnimatePresence mode="wait">
                  {mobileOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="w-5 h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Smart Search Modal Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#0A0A0A] flex flex-col pt-20 px-4 md:px-8"
          >
            <div className="max-w-3xl mx-auto w-full flex flex-col h-[80vh]">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-neutral-900 pb-4 mb-6">
                <h3 className="font-display font-black text-lg uppercase tracking-wider text-white">Smart Search</h3>
                <button
                  onClick={() => {
                    setSearchOpen(false);
                    setSearchQuery("");
                    setSearchResults([]);
                  }}
                  className="p-2 text-neutral-400 hover:text-white rounded-none hover:bg-white/5"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Input */}
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                <input
                  type="text"
                  placeholder="SEARCH MASS GAINERS, SUPPLEMENTS..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full bg-[#111111] border border-neutral-800 focus:border-red-600 rounded-none py-3.5 pl-12 pr-4 text-white text-sm uppercase tracking-wider outline-none transition-all"
                />
              </div>

              {/* Results */}
              <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin">
                {searchLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="w-6 h-6 border-2 border-red-650 border-t-transparent rounded-none animate-spin" />
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="grid gap-3">
                    {searchResults.map((prod) => (
                      <Link
                        key={prod.id}
                        href={`/shop/${prod.slug}`}
                        onClick={() => {
                          setSearchOpen(false);
                          setSearchQuery("");
                          setSearchResults([]);
                        }}
                        className="flex items-center gap-4 p-3 bg-[#111111] border border-neutral-850 hover:bg-[#141414] hover:border-red-600 rounded-none transition-all group"
                      >
                        <div className="w-12 h-12 rounded-none bg-neutral-950 flex items-center justify-center border border-neutral-850 relative overflow-hidden flex-shrink-0">
                          <Image
                            src={(() => {
                              const gallery = Array.isArray(prod.gallery) 
                                ? prod.gallery 
                                : typeof prod.gallery === "string" 
                                  ? (() => { try { return JSON.parse(prod.gallery); } catch(e) { return []; } })()
                                  : [];
                              const firstItem = gallery[0];
                              if (!firstItem) return "/images/placeholders/jar-placeholder.png";
                              if (typeof firstItem === "string") return firstItem;
                              if (typeof firstItem === "object" && firstItem.url) return firstItem.url;
                              return "/images/placeholders/jar-placeholder.png";
                            })()}
                            alt={prod.name}
                            fill
                            sizes="48px"
                            className="object-contain p-1"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-sm text-white group-hover:text-red-500 transition-colors uppercase tracking-wider">
                            {prod.name}
                          </h4>
                          <p className="text-xs text-neutral-400 line-clamp-1">{prod.shortDescription}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-white">
                            ₹{prod.variants?.[0]?.salePrice || "Price N/A"}
                          </div>
                          {prod.variants?.[0]?.mrp > prod.variants?.[0]?.salePrice && (
                            <div className="text-[10px] text-neutral-500 line-through">
                              ₹{prod.variants?.[0]?.mrp}
                            </div>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : searchQuery.trim().length >= 2 ? (
                  <p className="text-center py-12 text-sm text-neutral-500 uppercase tracking-widest">No products found for &quot;{searchQuery}&quot;</p>
                ) : (
                  <div className="py-6">
                    <h5 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-3">Popular Searches</h5>
                    <div className="flex flex-wrap gap-2">
                      {["HARD Mass Gainer", "SPARTAN Mass Gainer", "Mass Gainer"].map((term) => (
                        <button
                          key={term}
                          onClick={() => setSearchQuery(term)}
                          className="px-3 py-1.5 bg-[#111111] hover:bg-[#161616] border border-neutral-850 text-xs text-neutral-300 rounded-none transition-all uppercase font-bold tracking-wider"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#0A0A0A]"
              onClick={() => setMobileOpen(false)}
            />

            {/* Menu Content */}
            <nav className="relative flex flex-col justify-center h-full px-8">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="flex flex-col gap-1"
              >
                {navLinks.map((link, i) => {
                  const isActive = pathname === link.href;
                  const isVerify = link.href === "/verify";

                  if (isVerify && isActive) {
                    return (
                      <motion.div
                        key={link.href}
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: 0.15 + i * 0.08,
                          duration: 0.4,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        whileHover={{ scale: 1.03 }}
                        className="my-3 flex justify-center w-full px-4"
                      >
                        <Link
                          href={link.href}
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center justify-center gap-3 w-full max-w-[280px] px-6 py-3.5 text-base font-display font-black uppercase tracking-widest text-white bg-[#FF1A1A] rounded-full border border-[#FF5555]/50 transition-all duration-300 shadow-[0_0_20px_rgba(255,26,26,0.5)] hover:shadow-[0_0_30px_rgba(255,26,26,0.8)] hover:border-[#FF1A1A] text-center"
                        >
                          {link.icon && (
                            <link.icon className="w-5 h-5 text-white animate-pulse" />
                          )}
                          {link.label}
                        </Link>
                      </motion.div>
                    );
                  }

                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.15 + i * 0.08,
                        duration: 0.4,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "flex items-center gap-4 px-4 py-5 text-2xl font-display font-bold uppercase tracking-widest transition-all duration-300 rounded-none group",
                          isActive ? "text-red-500 font-extrabold" : "text-neutral-350 hover:text-white hover:bg-white/[0.02]"
                        )}
                      >
                        {link.icon && (
                          <link.icon className={cn("w-5 h-5 transition-colors", isActive ? "text-red-500" : "text-neutral-500 group-hover:text-red-400")} />
                        )}
                        {link.label}
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* Mobile CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="mt-12 px-4"
              >
                <Link href="/shop" onClick={() => setMobileOpen(false)} className="btn-primary w-full text-center text-base">
                  Shop Now
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
