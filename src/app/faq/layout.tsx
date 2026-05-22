import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Find answers to frequently asked questions about Komando Labs products, shipping, returns, product authenticity, ingredients, and usage guidance.",
};

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
