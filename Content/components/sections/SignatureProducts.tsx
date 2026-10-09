"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { PRODUCTS } from "@/lib/content";
import type { ProductCategory } from "@/lib/types";
import { useCartStore } from "@/lib/stores/cart-store";
import { miniConfetti } from "@/lib/confetti";
import SectionHeading from "@/components/ui/SectionHeading";

const FILTERS: { key: ProductCategory | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pastries", label: "Pastries" },
  { key: "breads", label: "Breads" },
  { key: "cakes", label: "Cakes" },
  { key: "gluten-free", label: "Gluten-Free" },
];

export default function SignatureProducts() {
  const [filter, setFilter] = useState<ProductCategory | "all">("all");
  const addItem = useCartStore((s) => s.addItem);
  const items = filter === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.category === filter);

  return (
    <section id="products" className="relative bg-cream px-6 py-24 lg:px-16">
      <SectionHeading
        eyebrow="Signature bakes"
        title={["The counter,", "every morning"]}
        sub="A rotating line-up of the bakes we&rsquo;re proudest of. Add any to your order — it&rsquo;ll be boxed the moment it cools."
      />

      <div className="mt-12 flex flex-wrap items-center justify-center gap-2.5">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition-all duration-300 ${
              filter === f.key
                ? "bg-golden text-espresso shadow-golden"
                : "border border-espresso/12 bg-vanilla text-espresso/70 hover:border-espresso/30"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <motion.div layout className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {items.map((p) => (
            <motion.article
              key={p.id}
              layout
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="group relative flex flex-col rounded-3xl border border-espresso/10 bg-vanilla p-6 shadow-card transition-shadow duration-300 hover:shadow-soft"
            >
              {p.badge && (
                <span className="absolute right-4 top-4 rounded-full bg-golden/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-cinnamon">
                  {p.badge}
                </span>
              )}
              <span className="text-6xl transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3" aria-hidden="true">
                {p.emoji}
              </span>
              <h3 className="mt-4 font-display text-xl text-espresso">{p.name}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-espresso/60">{p.desc}</p>
              <div className="mt-5 flex items-center justify-between">
                <span className="font-display text-lg text-terracotta">${p.price.toFixed(2)}</span>
                <button
                  onClick={(e) => {
                    addItem({ id: p.id, name: p.name, price: p.price, emoji: p.emoji });
                    miniConfetti({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full bg-terracotta px-4 py-2 text-xs font-bold text-cream transition-colors hover:bg-cinnamon"
                >
                  <Plus className="h-3.5 w-3.5" /> Add
                </button>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
