"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  ShoppingBag,
  Dumbbell,
  Tag,
  MessageSquare,
  ShieldAlert,
  BookOpen,
  LogOut,
  Menu,
  X,
} from "lucide-react";

interface SidebarLink {
  href: string;
  label: string;
  icon: React.ComponentType<any>;
}

const links: SidebarLink[] = [
  { href: "/admin/dashboard", label: "DASHBOARD", icon: LayoutDashboard },
  { href: "/admin/orders", label: "ORDERS", icon: ShoppingBag },
  { href: "/admin/products", label: "PRODUCTS", icon: Dumbbell },
  { href: "/admin/coupons", label: "COUPONS", icon: Tag },
  { href: "/admin/reviews", label: "REVIEWS", icon: MessageSquare },
  { href: "/admin/verifications", label: "VERIFICATION CODES", icon: ShieldAlert },
  { href: "/admin/blogs", label: "AI BLOGS", icon: BookOpen },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/admin/login");
  };

  return (
    <>
      {/* Mobile Header Bar */}
      <header className="md:hidden bg-[#0A0A0A] border-b border-neutral-850 p-4 flex items-center justify-between z-30 w-full">
        <Link href="/admin/dashboard" className="font-display font-black text-sm tracking-widest text-red-600 uppercase italic">
          KOMANDO SYSTEM CONTROL
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-neutral-400 hover:text-white transition-colors"
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 bottom-0 z-20 w-64 bg-[#0F0F0F] border-r border-neutral-850 p-6 flex flex-col justify-between transform transition-transform duration-300 md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } h-screen`}
      >
        <div className="flex flex-col gap-8">
          {/* Logo */}
          <div className="hidden md:block">
            <div className="font-display font-black text-lg tracking-tight text-white uppercase italic">
              KOMANDO <span className="text-red-650 text-base font-normal tracking-widest font-mono">// CONTROL</span>
            </div>
            <div className="text-[9px] font-mono tracking-widest text-neutral-500 mt-1 uppercase">
              SYSTEM LEVEL: ADMIN // ROOT
            </div>
          </div>

          {/* Links */}
          <nav className="flex flex-col gap-1">
            {links.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`group relative flex items-center gap-3.5 px-4 py-3 rounded-none text-[10px] font-mono tracking-widest font-bold transition-all border border-transparent ${
                    isActive
                      ? "bg-[#161616] text-white border-neutral-850"
                      : "text-neutral-400 hover:text-white hover:bg-[#111111]"
                  }`}
                >
                  {/* Left accent bar on active link */}
                  {isActive && (
                    <div className="absolute left-0 top-0 w-[3px] h-full bg-red-600" />
                  )}
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-red-600" : "text-neutral-500 group-hover:text-neutral-300"}`} />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="pt-6 border-t border-neutral-850">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3.5 px-4 py-3 rounded-none text-[10px] font-mono tracking-widest font-bold text-neutral-400 hover:text-red-500 hover:bg-[#1A1A1A] border border-transparent hover:border-neutral-850 transition-all"
          >
            <LogOut className="w-4 h-4 flex-shrink-0 text-neutral-500" />
            SIGN OUT
          </button>
        </div>
      </aside>

      {/* Background shadow overlay on mobile when sidebar open */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/80 z-10 md:hidden"
        />
      )}
    </>
  );
}
