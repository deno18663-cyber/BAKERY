"use client";

import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";

const FAQS: { q: string; a: string }[] = [
  {
    q: "How far ahead should I order a celebration cake?",
    a: "Custom and molten-centre cakes are baked to order, so give us at least 48 hours — a week for weddings and big events. Tell us the servings, the message, and the colours in your order note.",
  },
  {
    q: "Do you have gluten-free options?",
    a: "Yes — banana loaf, morning muffins, macarons and more, prepared in a dedicated, separately-ventilated kitchen. Look for the gluten-free shelf in the menu.",
  },
  {
    q: "What is the Build-a-Box?",
    a: "Six palm-sized treats you pick yourself for a flat $24 — croissants, cinnamon rolls, brownies and friends. Find it in the “Make it exactly yours” section and fill all six slots.",
  },
  {
    q: "When should I come for the freshest bake?",
    a: "Small batches leave the oven all day and most days sell out by evening. The “Fresh out of the oven” section counts down every batch live — mornings are safest.",
  },
  {
    q: "Where are you, and when are you open?",
    a: "14 Mill Street, Old Town District — a short walk from the old market square. Monday to Friday 7 AM–7 PM, Saturday 8 AM–6 PM, Sunday 8 AM–3 PM.",
  },
  {
    q: "Do you cater offices and events?",
    a: "Happily — Build-a-Boxes travel well and celebration cakes feed 8+. Place one order per box or cake through the cart, or call +1 (555) 014-7766 for anything bigger.",
  },
];

/** FAQ with FAQPage structured data (eligible for Google rich results). */
export default function Faq() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <section id="faq" className="relative bg-cream px-6 py-24 lg:px-16">
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
      <SectionHeading
        eyebrow="Good to know"
        title={["Questions,", "answered"]}
        sub="The things neighbours ask us most — tap one to open it."
      />
      <div className="mx-auto mt-12 max-w-3xl space-y-3">
        {FAQS.map((f, i) => (
          <Reveal key={f.q} delay={i * 0.04}>
            <details className="group rounded-2xl border border-espresso/10 bg-vanilla px-5 py-4 shadow-card transition-colors open:border-golden/60 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg text-espresso">
                {f.q}
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-espresso/15 text-lg text-golden transition-transform duration-300 group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="pt-3 text-[15px] leading-relaxed text-espresso/70">{f.a}</p>
            </details>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
