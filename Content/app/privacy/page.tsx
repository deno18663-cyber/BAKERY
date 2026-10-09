import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/footer/Footer";
import { STORE } from "@/lib/content";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Oven & Artisan handles your data: what we collect when you order, join the newsletter, or leave a review — and your rights.",
  robots: { index: true, follow: true },
};

const SECTIONS: { heading: string; body: string[] }[] = [
  {
    heading: "What we collect",
    body: [
      "Orders: your name, an optional phone number, and what you ordered — so we can have it warm and ready for pickup.",
      "Newsletter (“the proofing list”): just your email address, so we can send one email a week about what's baking.",
      "Reviews: the name, rating, and text you choose to share publicly on the site.",
      "Analytics: only if enabled — anonymous, aggregated visit statistics (see Cookies below). We never run ads and never sell data.",
    ],
  },
  {
    heading: "How we use it",
    body: [
      "To fulfil your order, answer you, and — if you joined the list — to send the weekly email. Nothing else. No profiling, no third-party marketing, no data brokers.",
    ],
  },
  {
    heading: "Storage",
    body: [
      "Order, review, and subscriber records live on our own backend server. Like fresh bread, nothing is kept longer than useful: pickup details serve the day's bake, and you can ask us to delete anything tied to you at any time.",
    ],
  },
  {
    heading: "Cookies",
    body: [
      "The site itself needs no cookies to browse. Your cart is kept in your own browser's local storage and never sent anywhere until you check out.",
      "If website analytics is switched on, Google Analytics sets its own cookies to count visits in aggregate. You can block them with any content blocker and the site keeps working fully.",
    ],
  },
  {
    heading: "Your rights",
    body: [
      "Ask us what we hold about you, correct it, unsubscribe from the newsletter, or request deletion — email hello and we'll sort it within a reasonable time.",
    ],
  },
  {
    heading: "Contact",
    body: [`Questions about privacy? Write to ${STORE.socials.email} or call ${STORE.phone}.`],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <section className="mx-auto max-w-3xl px-6 pb-20 pt-32 lg:pt-36">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-terracotta">The fine print</p>
        <h1 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">Privacy Policy</h1>
        <p className="mt-4 text-lg text-espresso/70">
          Short version: we collect the minimum needed to bake for you, and never sell or share it.
        </p>
        <div className="mt-10 space-y-8">
          {SECTIONS.map((s) => (
            <article key={s.heading} className="rounded-3xl border border-espresso/10 bg-vanilla p-6 shadow-card sm:p-8">
              <h2 className="font-display text-2xl">{s.heading}</h2>
              {s.body.map((p, i) => (
                <p key={i} className="mt-3 leading-relaxed text-espresso/70">
                  {p}
                </p>
              ))}
            </article>
          ))}
        </div>
        <p className="mt-8 text-sm text-espresso/50">
          Last updated October 2026. <Link href="/" className="font-semibold text-terracotta hover:underline">Back to the bakery</Link>
        </p>
      </section>
      <Footer />
    </>
  );
}
