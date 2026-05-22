import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#050505",
};

export const metadata: Metadata = {
  title: {
    default: "Komando Labs — Command Your Strength",
    template: "%s | Komando Labs",
  },
  description:
    "India's premium fitness-performance supplement brand. Lab-tested, authenticity-verified protein, creatine, pre-workout & more. Command Your Strength.",
  keywords: [
    "supplements",
    "whey protein",
    "creatine",
    "pre-workout",
    "mass gainer",
    "fitness supplements India",
    "Komando Labs",
    "premium supplements",
    "lab tested supplements",
  ],
  authors: [{ name: "Komando Labs" }],
  creator: "Komando Labs",
  publisher: "Komando Labs",
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: "Komando Labs",
    title: "Komando Labs — Command Your Strength",
    description:
      "India's premium fitness-performance supplement brand. Lab-tested, authenticity-verified.",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Komando Labs — Command Your Strength",
    description:
      "India's premium fitness-performance supplement brand. Lab-tested, authenticity-verified.",
  },
};

import { CartProvider } from "@/context/cart-context";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased bg-[#0A0A0A] text-white selection:bg-red-600 selection:text-white">
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
