"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle, Truck, RotateCcw, ShieldCheck, FlaskConical, Dumbbell, Mail } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  title: string;
  icon: React.ElementType;
  items: FAQItem[];
}

const faqCategories: FAQCategory[] = [
  {
    title: "Shipping & Delivery",
    icon: Truck,
    items: [
      {
        question: "How long does delivery take?",
        answer:
          "Delivery typically takes 2–4 business days for metro cities (Mumbai, Delhi, Bangalore, Chennai, Hyderabad, Kolkata, Pune), 4–6 days for Tier-2 cities, and 6–10 days for remote and North-East regions. Orders placed before 2:00 PM IST on business days are dispatched the same day.",
      },
      {
        question: "Do you offer free shipping?",
        answer:
          "Yes! All prepaid orders above ₹999 ship free across India. Prepaid orders below ₹999 have a flat ₹79 shipping fee. Cash on Delivery orders incur an additional ₹49 COD handling fee.",
      },
      {
        question: "How can I track my order?",
        answer:
          "Once your order is dispatched, you'll receive an SMS and email with a tracking number and courier partner link. You can also track your order in real-time from your Komando Labs account dashboard.",
      },
      {
        question: "Do you ship internationally?",
        answer:
          "Currently, we only ship within India. We're working on expanding to international markets soon. Follow us on social media for updates on international shipping availability.",
      },
      {
        question: "What if my order is delayed?",
        answer:
          "While we strive for on-time delivery, delays may occur due to weather, strikes, or courier-side issues — especially in remote areas. If your order hasn't arrived within the estimated window, contact us at support@komandolabs.com with your order number and we'll resolve it within 24–48 hours.",
      },
    ],
  },
  {
    title: "Returns & Refunds",
    icon: RotateCcw,
    items: [
      {
        question: "What is your return policy?",
        answer:
          "We offer a 7-day return window from the date of delivery. Products must be in their original, unused condition with all packaging intact. Returns are accepted for damaged, defective, expired, or incorrectly delivered products.",
      },
      {
        question: "How do I initiate a return?",
        answer:
          "Email us at support@komandolabs.com with your order number, clear photos of the product and packaging, and a description of the issue. Our team will review and respond within 24–48 hours with return instructions.",
      },
      {
        question: "Can I return a product I've opened or used?",
        answer:
          "Opened or partially consumed products are generally not eligible for return unless there is a confirmed manufacturing defect. If you suspect a defect, please contact us with details and we'll assess on a case-by-case basis.",
      },
      {
        question: "How long do refunds take?",
        answer:
          "Once we receive and inspect the returned product, refunds are processed within 3–5 business days. UPI and net banking refunds are fastest (3–5 days), while credit/debit card refunds may take 5–7 days depending on your bank. COD refunds are processed via NEFT/IMPS to your bank account.",
      },
      {
        question: "Can I exchange a product instead of returning it?",
        answer:
          "We currently don't offer direct exchanges. If you received the wrong product due to our error, we'll ship the correct one at no extra cost once the return is processed. For other cases, please initiate a return and place a new order.",
      },
    ],
  },
  {
    title: "Product Authenticity & Verification",
    icon: ShieldCheck,
    items: [
      {
        question: "How do I verify my Komando Labs product is genuine?",
        answer:
          "Every Komando Labs product has a unique QR code on its packaging. Scan it with your phone camera or visit komandolabs.com/verify and enter the code manually. You'll instantly see whether your product is genuine, along with batch details and manufacturing date.",
      },
      {
        question: "What if my product fails verification?",
        answer:
          "If your product fails authenticity verification, it may be counterfeit. Do not consume it. Contact us immediately at support@komandolabs.com with your order number and verification code. If you purchased from our official website, we'll investigate and replace it at no cost.",
      },
      {
        question: "Where should I buy Komando Labs products to ensure authenticity?",
        answer:
          "For guaranteed authenticity, always purchase directly from komandolabs.com or our authorised retail partners listed on our website. Products from unauthorised third-party sellers may not be genuine and are not eligible for returns, warranty, or support.",
      },
      {
        question: "Are your products FSSAI licensed?",
        answer:
          "Yes, all Komando Labs products are manufactured in FSSAI-licensed facilities and carry valid FSSAI license numbers on their packaging. We adhere to all food safety and quality standards mandated by the Food Safety and Standards Authority of India.",
      },
    ],
  },
  {
    title: "Ingredients & Nutrition",
    icon: FlaskConical,
    items: [
      {
        question: "What are the key ingredients in HARD Mass Gainer?",
        answer:
          "HARD Mass Gainer is formulated with a premium blend of complex carbohydrates, whey protein concentrate, creatine monohydrate, essential vitamins, and minerals. It provides a high-calorie, macro-balanced formula designed for serious mass building. Full nutritional details are listed on the product page and on the packaging.",
      },
      {
        question: "How is SPARTAN Mass Gainer different from HARD Mass Gainer?",
        answer:
          "SPARTAN Mass Gainer is designed for lean gains with a higher protein-to-carb ratio compared to HARD Mass Gainer. It contains added digestive enzymes for better absorption and a carefully calibrated calorie profile for those who want to gain mass without excess fat. Check the product pages for detailed comparisons.",
      },
      {
        question: "Are your products suitable for vegetarians?",
        answer:
          "Our whey protein-based products are vegetarian-friendly (derived from milk). However, they are not vegan. All allergen information including milk, soy, and gluten content is clearly listed on each product label and product page.",
      },
      {
        question: "Do your products contain any banned substances?",
        answer:
          "Absolutely not. All Komando Labs supplements are manufactured in facilities that follow strict quality control protocols. Our products do not contain any WADA-banned substances and are safe for competitive athletes. Each batch is lab-tested for purity and potency.",
      },
      {
        question: "Are there any side effects?",
        answer:
          "Our products are formulated for healthy adults and are generally well-tolerated. However, individual responses may vary. If you have any pre-existing medical conditions, allergies, or are on medication, we strongly recommend consulting a healthcare professional before use. Pregnant and nursing women should not use our products without medical advice.",
      },
    ],
  },
  {
    title: "Usage & Guidance",
    icon: Dumbbell,
    items: [
      {
        question: "How should I take mass gainer supplements?",
        answer:
          "Mix 1–2 scoops (as per the serving size on the label) with 250–400ml of cold water or milk in a shaker or blender. For best results, consume within 30 minutes post-workout. You can also have a serving as a high-calorie snack between meals. Adjust serving size based on your caloric needs and fitness goals.",
      },
      {
        question: "Can I take mass gainer without working out?",
        answer:
          "Mass gainers are designed to supplement a training program by providing additional calories for muscle growth. While you can consume them without exercising, the excess calories without physical activity may lead to unwanted fat gain. We recommend pairing them with a structured workout plan for optimal results.",
      },
      {
        question: "How should I store the product?",
        answer:
          "Store in a cool, dry place away from direct sunlight with the lid tightly sealed. Do not refrigerate unless the label specifies. Always use the provided scoop and keep the product away from moisture to prevent clumping. Use within the best-before date printed on the packaging.",
      },
      {
        question: "Can I mix mass gainer with other supplements?",
        answer:
          "Yes, you can combine mass gainer with creatine, BCAAs, or glutamine for enhanced results. However, avoid stacking with other high-calorie supplements unless guided by a nutritionist, as this may lead to excessive caloric intake. Always follow recommended daily dosages.",
      },
      {
        question: "Is it safe to use long-term?",
        answer:
          "Our supplements are made from food-grade ingredients and are safe for regular use as part of a balanced diet. However, supplements should not replace whole foods. We recommend cycling your supplement intake (e.g., 8–12 weeks on, 2–4 weeks off) and getting periodic health check-ups to monitor your overall wellness.",
      },
    ],
  },
];

function FAQAccordion({
  item,
  isOpen,
  onToggle,
}: {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-white/[0.06] last:border-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 py-5 px-1 text-left group"
      >
        <span
          className={`text-sm font-medium transition-colors duration-200 ${
            isOpen ? "text-white" : "text-neutral-300 group-hover:text-white"
          }`}
        >
          {item.question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="flex-shrink-0"
        >
          <ChevronDown
            className={`w-4 h-4 transition-colors duration-200 ${
              isOpen ? "text-red-500" : "text-neutral-500"
            }`}
          />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="px-1 pb-5 text-sm text-neutral-400 leading-relaxed">
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});
  const [activeCategory, setActiveCategory] = useState<number>(0);

  const toggleItem = (key: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

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
                <HelpCircle className="w-5 h-5 text-red-500" />
              </div>
              <span className="text-xs font-semibold text-red-400 uppercase tracking-widest">
                Help Centre
              </span>
            </div>
            <h1 className="font-display font-bold text-3xl md:text-5xl text-white leading-tight">
              Frequently Asked Questions
            </h1>
            <p className="mt-4 text-neutral-400 text-base md:text-lg max-w-2xl leading-relaxed">
              Find answers to common questions about our products, shipping,
              returns, and more. Can&apos;t find what you&apos;re looking for?
              Reach out to our support team.
            </p>
          </div>
        </section>

        {/* Category Tabs */}
        <section className="pb-4 sticky top-14 lg:top-16 z-30 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/[0.04]">
          <div className="container-main">
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin -mx-4 px-4 sm:mx-0 sm:px-0">
              {faqCategories.map((cat, idx) => (
                <button
                  key={cat.title}
                  onClick={() => setActiveCategory(idx)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-300 ${
                    activeCategory === idx
                      ? "bg-red-500/15 border border-red-500/30 text-red-400"
                      : "bg-white/[0.03] border border-white/[0.06] text-neutral-400 hover:text-white hover:bg-white/[0.06]"
                  }`}
                >
                  <cat.icon className="w-3.5 h-3.5" />
                  {cat.title}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="py-12 pb-20">
          <div className="container-main">
            <div className="max-w-3xl mx-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                >
                  {/* Category Header */}
                  <div className="flex items-center gap-3 mb-6">
                    {(() => {
                      const IconComponent = faqCategories[activeCategory].icon;
                      return (
                        <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                          <IconComponent className="w-5 h-5 text-red-500" />
                        </div>
                      );
                    })()}
                    <div>
                      <h2 className="font-display font-bold text-lg text-white">
                        {faqCategories[activeCategory].title}
                      </h2>
                      <p className="text-xs text-neutral-500">
                        {faqCategories[activeCategory].items.length} questions
                      </p>
                    </div>
                  </div>

                  {/* Questions */}
                  <div className="p-6 md:p-8 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                    {faqCategories[activeCategory].items.map((item, idx) => {
                      const key = `${activeCategory}-${idx}`;
                      return (
                        <FAQAccordion
                          key={key}
                          item={item}
                          isOpen={!!openItems[key]}
                          onToggle={() => toggleItem(key)}
                        />
                      );
                    })}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Contact CTA */}
              <div className="mt-12 p-8 md:p-10 rounded-2xl bg-gradient-to-br from-red-500/[0.08] to-transparent border border-red-500/[0.15] text-center">
                <Mail className="w-8 h-8 text-red-400 mx-auto mb-3" />
                <h3 className="font-display font-bold text-lg text-white mb-2">
                  Still Have Questions?
                </h3>
                <p className="text-sm text-neutral-300 leading-relaxed mb-5 max-w-md mx-auto">
                  Our support team is available Monday–Saturday, 10:00 AM – 7:00
                  PM IST. We typically respond within 4 hours.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <a
                    href="mailto:support@komandolabs.com"
                    className="btn-primary text-sm !px-5 !py-2.5"
                  >
                    Email Support
                  </a>
                  <a
                    href="/shipping-policy"
                    className="btn-secondary text-sm !px-5 !py-2.5"
                  >
                    Shipping Policy
                  </a>
                  <a
                    href="/returns"
                    className="btn-secondary text-sm !px-5 !py-2.5"
                  >
                    Returns Policy
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
