"use client";

import { motion } from "framer-motion";
import { Cake, ChevronLeft, ChevronRight, Package, Plus, Sparkles } from "lucide-react";
import { CUSTOMIZER } from "@/lib/content";
import { useCustomizerStore } from "@/lib/stores/customizer-store";
import { useCartStore } from "@/lib/stores/cart-store";
import { bigConfetti } from "@/lib/confetti";
import { BoxArt, CakeArt } from "@/components/three/Fallback2D";
import SectionHeading from "@/components/ui/SectionHeading";

const STEPS = ["Base", "Frosting", "Toppings"];

export default function BuildCustomizer() {
  const st = useCustomizerStore();
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  const baseChoice = CUSTOMIZER.bases.find((b) => b.id === st.base);
  const frostChoice = CUSTOMIZER.frostings.find((f) => f.id === st.frosting);
  const selectedToppings = st.toppings
    .map((id) => CUSTOMIZER.toppings.find((t) => t.id === id))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));
  const filledSlots = st.boxSlots.filter(Boolean).length;

  function addToCart() {
    if (st.mode === "cake") {
      addItem({
        id: "custom-cake",
        name: "Custom Celebration Cake",
        price: 54,
        emoji: "🎂",
        options: `${baseChoice?.label ?? ""} · ${frostChoice?.label ?? ""}${
          selectedToppings.length ? ` + ${selectedToppings.map((t) => t.label).join(", ")}` : ""
        }`,
      });
    } else {
      const names = st.boxSlots
        .filter(Boolean)
        .map((id) => CUSTOMIZER.boxSlots.find((b) => b.id === id)?.name ?? "")
        .join(", ");
      addItem({
        id: "custom-box",
        name: "Build-Your-Box · 6 treats",
        price: CUSTOMIZER.boxPrice,
        emoji: "📦",
        options: names || "Pick 6 treats",
      });
    }
    bigConfetti();
    st.reset();
    openCart();
  }

  const canBake = st.mode === "cake" || filledSlots === 6;

  return (
    <section id="customizer" className="relative bg-transparent px-6 py-24 lg:px-16">
      <SectionHeading
        eyebrow="Build your own"
        title={["Make it", "exactly yours"]}
        sub="Pick a cake and watch it come together live — or fill a six-slot bake box for a morning worth remembering."
      />

      <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-14">
        {/* ── Preview (2D SVG art; the 3D cake/box models were removed) ── */}
        <div className="relative flex min-h-[22rem] items-center justify-center rounded-3xl border border-dashed border-espresso/10 bg-cream/35 lg:min-h-full">
          <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-espresso/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-espresso/50">
            <Sparkles className="h-3 w-3 text-golden" /> Live preview
          </span>
          <div className="w-56 sm:w-64">
            {st.mode === "cake" ? <CakeArt className="w-full" /> : <BoxArt className="w-full" />}
          </div>
        </div>

        {/* ── Options panel ── */}
        <div className="rounded-3xl border border-espresso/10 bg-vanilla p-6 shadow-card sm:p-8">
          {/* mode toggle */}
          <div className="flex items-center gap-2 rounded-full bg-espresso/5 p-1.5">
            {[
              { key: "cake" as const, label: "Celebration Cake", icon: <Cake className="h-4 w-4" /> },
              { key: "box" as const, label: "Bake Box", icon: <Package className="h-4 w-4" /> },
            ].map((m) => (
              <button
                key={m.key}
                onClick={() => st.setMode(m.key)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-300 ${
                  st.mode === m.key ? "bg-espresso text-cream shadow-soft" : "text-espresso/60 hover:text-espresso"
                }`}
              >
                {m.icon} {m.label}
              </button>
            ))}
          </div>

          {st.mode === "cake" ? (
            <>
              {/* step indicator */}
              <div className="mt-6 flex items-center gap-2">
                {STEPS.map((label, i) => {
                  const n = i + 1;
                  const active = st.step === n;
                  const done = st.step > n;
                  return (
                    <div key={label} className="flex flex-1 flex-col gap-1.5">
                      <div className={`h-1 rounded-full transition-colors duration-300 ${active ? "bg-golden" : done ? "bg-sage" : "bg-espresso/10"}`} />
                      <span className={`text-[10px] font-semibold uppercase tracking-wide ${active ? "text-espresso" : "text-espresso/40"}`}>
                        {n}. {label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* step content */}
              <div className="mt-6 min-h-[15rem]">
                {st.step === 1 && (
                  <ChoiceGrid
                    items={CUSTOMIZER.bases.map((b) => ({ id: b.id, label: b.label, color: b.color }))}
                    selected={st.base}
                    onSelect={st.setBase}
                  />
                )}
                {st.step === 2 && (
                  <ChoiceGrid
                    items={CUSTOMIZER.frostings.map((f) => ({ id: f.id, label: f.label, color: f.color }))}
                    selected={st.frosting}
                    onSelect={st.setFrosting}
                  />
                )}
                {st.step === 3 && (
                  <div className="flex flex-wrap gap-2.5">
                    {CUSTOMIZER.toppings.map((t) => {
                      const on = st.toppings.includes(t.id);
                      return (
                        <button
                          key={t.id}
                          onClick={() => st.toggleTopping(t.id)}
                          className={`flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                            on ? "border-terracotta bg-terracotta text-cream" : "border-espresso/15 bg-cream text-espresso/70 hover:border-espresso/35"
                          }`}
                        >
                          <span className="h-3 w-3 rounded-full border border-current" style={{ background: t.color }} />
                          {t.label}
                        </button>
                      );
                    })}
                    <p className="mt-2 w-full text-xs text-espresso/45">Pick as many as you like — they appear on the cake.</p>
                  </div>
                )}
              </div>

              {/* nav */}
              <div className="mt-6 flex items-center gap-3">
                {st.step > 1 && (
                  <button onClick={st.back} className="inline-flex items-center gap-1.5 rounded-full border border-espresso/15 px-5 py-3 text-sm font-semibold text-espresso/70 transition-colors hover:border-espresso/40">
                    <ChevronLeft className="h-4 w-4" /> Back
                  </button>
                )}
                {st.step < 3 ? (
                  <button onClick={st.next} className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-golden px-6 py-3 text-sm font-bold text-espresso transition-colors hover:bg-golden/85">
                    Next <ChevronRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button onClick={addToCart} className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-terracotta px-6 py-3 text-sm font-bold text-cream transition-colors hover:bg-cinnamon">
                    Bake it · $54.00
                  </button>
                )}
              </div>
            </>
          ) : (
            <>
              {/* box mode */}
              <p className="mt-6 text-sm text-espresso/60">
                Fill all six slots with the morning lineup.
              </p>
              <div className="mt-4 grid grid-cols-3 gap-2.5">
                {st.boxSlots.map((slot, i) => {
                  const product = slot ? CUSTOMIZER.boxSlots.find((b) => b.id === slot) : undefined;
                  return (
                    <button
                      key={i}
                      onClick={() => st.setBoxSlot(i, null)}
                      className={`flex aspect-square flex-col items-center justify-center rounded-2xl border-2 border-dashed text-3xl transition-all duration-200 ${
                        product ? "border-golden bg-golden/10" : "border-espresso/15 bg-cream"
                      }`}
                      aria-label={product ? `Slot ${i + 1}: ${product.name} — tap to clear` : `Slot ${i + 1} empty`}
                    >
                      {product ? product.emoji : <Plus className="h-6 w-6 text-espresso/25" />}
                    </button>
                  );
                })}
              </div>
              <div className="mt-5 grid grid-cols-2 gap-2.5">
                {CUSTOMIZER.boxSlots.map((b) => {
                  const used = st.boxSlots.includes(b.id);
                  const full = filledSlots >= 6;
                  return (
                    <button
                      key={b.id}
                      onClick={() => {
                        if (used) return;
                        if (full) return;
                        const idx = st.boxSlots.findIndex((s) => s === null);
                        if (idx >= 0) st.setBoxSlot(idx, b.id);
                      }}
                      className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-sm font-semibold transition-all duration-200 ${
                        used ? "border-golden bg-golden/15 text-espresso" : "border-espresso/12 bg-cream text-espresso/70 hover:border-espresso/35"
                      }`}
                    >
                      <span className="text-xl" aria-hidden="true">{b.emoji}</span>
                      <span className="leading-tight">{b.name}</span>
                      {used && <span className="ml-auto text-golden">✓</span>}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={addToCart}
                disabled={!canBake}
                className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition-colors ${
                  canBake ? "bg-terracotta text-cream hover:bg-cinnamon" : "cursor-not-allowed bg-espresso/10 text-espresso/40"
                }`}
              >
                {canBake ? `Add the box · $${CUSTOMIZER.boxPrice.toFixed(2)}` : `Add treats — ${filledSlots}/6`}
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

interface ChoiceGridItem {
  id: string;
  label: string;
  color: string;
}

function ChoiceGrid({
  items,
  selected,
  onSelect,
}: {
  items: ChoiceGridItem[];
  selected: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {items.map((item) => {
        const on = selected === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className={`flex items-center gap-3 rounded-2xl border-2 p-3 text-left transition-all duration-200 ${
              on ? "border-golden bg-golden/10" : "border-espresso/10 bg-cream hover:border-espresso/25"
            }`}
          >
            <motion.span
              layout
              className="h-8 w-8 shrink-0 rounded-full border border-espresso/10 shadow-inner"
              style={{ background: item.color }}
            />
            <span className="text-sm font-semibold text-espresso">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
