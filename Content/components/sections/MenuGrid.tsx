"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Plus } from "lucide-react";
import { MENU } from "@/lib/content";
import type { ProductCategory } from "@/lib/types";
import { useCartStore } from "@/lib/stores/cart-store";
import { miniConfetti } from "@/lib/confetti";
import SectionHeading from "@/components/ui/SectionHeading";

const CATEGORIES: { key: ProductCategory; label: string; emoji: string }[] = [
  { key: "pastries", label: "Pastries", emoji: "🥐" },
  { key: "breads", label: "Breads", emoji: "🍞" },
  { key: "cakes", label: "Cakes", emoji: "🎂" },
  { key: "gluten-free", label: "Gluten-Free", emoji: "🌾" },
];

export default function MenuGrid() {
  const [category, setCategory] = useState<ProductCategory>("pastries");
  const [openId, setOpenId] = useState<string | null>(null);
  const addItem = useCartStore((s) => s.addItem);
  const items = MENU.filter((m) => m.category === category);

  return (
    <section id="menu" className="relative bg-vanilla px-6 py-24 lg:px-16">
      <SectionHeading
        eyebrow="Full menu"
        title={["Everything", "we bake"]}
        sub="Hover a card to peek inside. Every item is made in small batches and sells out fast."
      />

      <div className="mt-12 flex flex-wrap items-center justify-center gap-2.5">
        {CATEGORIES.map((c) => (
          <button
            key={c.key}
            onClick={() => {
              setCategory(c.key);
              setOpenId(null);
            }}
            className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
              category === c.key
                ? "bg-golden text-espresso shadow-golden"
                : "border border-espresso/12 bg-cream text-espresso/70 hover:border-espresso/30"
            }`}
          >
            <span aria-hidden="true">{c.emoji}</span> {c.label}
          </button>
        ))}
      </div>

      <div className="mx-auto mt-10 max-w-3xl space-y-3">
        <AnimatePresence mode="popLayout">
          {items.map((m) => {
            const open = openId === m.id;
            return (
              <motion.article
                key={m.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                onMouseEnter={() => setOpenId(m.id)}
                onMouseLeave={() => setOpenId(null)}
                onClick={() => setOpenId(open ? null : m.id)}
                className="cursor-pointer rounded-2xl border border-espresso/10 bg-cream px-5 py-4 shadow-card transition-colors duration-300 hover:border-golden/60"
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl" aria-hidden="true">{m.emoji}</span>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-3">
                      <h3 className="font-display text-lg text-espresso">{m.name}</h3>
                      <span className="hidden text-[11px] font-semibold uppercase tracking-wide text-sage sm:inline">
                        {m.tags.join(" · ")}
                      </span>
                    </div>
                    <p className="mt-1 font-display text-terracotta">${m.price.toFixed(2)}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenId(open ? null : m.id);
                    }}
                    aria-label={open ? `Hide ${m.name} details` : `Show ${m.name} details`}
                    aria-expanded={open}
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-colors ${
                      open
                        ? "border-golden/60 bg-golden/10 text-golden"
                        : "border-espresso/12 text-espresso/40 hover:border-golden/50 hover:text-golden"
                    }`}
                  >
                    <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }} className="block">
                      <ChevronDown className="h-4 w-4" />
                    </motion.span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addItem({ id: m.id, name: m.name, price: m.price, emoji: m.emoji });
                      miniConfetti({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
                    }}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-terracotta text-cream transition-colors hover:bg-cinnamon"
                    aria-label={`Add ${m.name} to cart`}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <p className="pt-3 text-sm leading-relaxed text-espresso/60">{m.desc}</p>
                      <p className="pt-2 text-[11px] font-semibold uppercase tracking-wide text-sage sm:hidden">
                        {m.tags.join(" · ")}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.article>
            );
          })}
        </AnimatePresence>
      </div>

      <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-dashed border-sage/50 bg-sage/5 px-6 py-4 text-center text-sm text-espresso/60">
        <Check className="mr-1 inline h-4 w-4 text-sage" />
        All gluten-free bakes are prepared in a dedicated, separately-ventilated kitchen.
      </div>
    </section>
  );
}
