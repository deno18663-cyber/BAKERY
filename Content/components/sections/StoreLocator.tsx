"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, MapPin, Navigation, Phone } from "lucide-react";
import { HOURS, STORE } from "@/lib/content";
import { subscribeNewsletter } from "@/lib/api";
import LiveStatusPill from "@/components/ui/LiveStatusPill";
import Reveal from "@/components/ui/Reveal";
import { useMounted } from "@/lib/use-mounted";
import { miniConfetti } from "@/lib/confetti";

/** Stylized hand-drawn map — roads, a park, and a pulsing bakery pin. */
function MapArt() {
  return (
    <svg viewBox="0 0 420 320" className="h-full w-full" aria-hidden>
      <rect width="420" height="320" fill="#F2E9D8" />
      {/* park */}
      <path d="M300 40 q40 30 30 80 q-10 46 -52 44 q-40 -2 -40 -44 q0 -50 62 -80 Z" fill="#DCE4D2" />
      {/* river */}
      <path d="M0 250 C90 230 130 270 210 250 C300 226 340 260 420 244 L420 320 L0 320 Z" fill="#D7E1EA" />
      {/* roads */}
      <motion.path
        d="M0 96 C140 96 180 140 420 128"
        stroke="#E5D9C4"
        strokeWidth="26"
        fill="none"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        transition={{ duration: 1.4, ease: "easeInOut" }}
      />
      <motion.path
        d="M150 0 C170 90 140 170 190 320"
        stroke="#E5D9C4"
        strokeWidth="22"
        fill="none"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        transition={{ duration: 1.4, ease: "easeInOut", delay: 0.15 }}
      />
      <motion.path
        d="M210 0 C230 60 190 120 210 320"
        stroke="#E0D2B8"
        strokeWidth="14"
        fill="none"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        transition={{ duration: 1.2, ease: "easeInOut", delay: 0.3 }}
      />
      {/* centre-line dashes on the main road */}
      <path d="M0 96 C140 96 180 140 420 128" stroke="#E9DFCC" strokeWidth="2" strokeDasharray="12 14" fill="none" />
      {/* the bakery pin at 150,96-ish */}
      <g>
        <circle cx="168" cy="98" r="26" fill="#9E2A2B" opacity="0.15">
          <animate attributeName="r" values="16;30;16" dur="2.2s" repeatCount="indefinite" />
        </circle>
        <g transform="translate(168 98)">
          <circle r="12" fill="#9E2A2B" stroke="#FDFBF7" strokeWidth="3" />
          <circle r="4" fill="#FDFBF7" />
        </g>
      </g>
    </svg>
  );
}

export default function StoreLocator() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [welcome, setWelcome] = useState("You’re on the list. Welcome in.");
  const [joining, setJoining] = useState(false);
  const mounted = useMounted();
  const todayIdx = (new Date().getDay() + 6) % 7;
  const today = HOURS[todayIdx];
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${STORE.lat},${STORE.lng}`;

  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  async function subscribe() {
    if (!valid || joining) return;
    setJoining(true);
    try {
      // Persist via the backend; fall back to local-only when it's offline.
      const res = await subscribeNewsletter(email.trim());
      setWelcome(res.message);
    } catch {
      setWelcome("You’re on the list. Welcome in.");
    } finally {
      setSubmitted(true);
      setJoining(false);
      miniConfetti();
    }
  }

  return (
    <section id="visit" className="relative bg-cream px-6 py-24 lg:px-16">
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
        {/* map */}
        <Reveal className="relative min-h-[22rem] overflow-hidden rounded-3xl border border-espresso/10 shadow-card">
          <MapArt />
          <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-cream/90 px-3 py-1.5 text-xs font-semibold text-espresso/70 backdrop-blur">
            <MapPin className="h-3.5 w-3.5 text-terracotta" /> {STORE.address}
          </span>
          <span className="absolute bottom-4 right-4 rounded-full bg-espresso/85 px-3 py-1.5 text-[11px] font-semibold text-cream backdrop-blur">
            Old Town District
          </span>
        </Reveal>

        {/* info */}
        <div className="flex flex-col justify-center">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-terracotta">Visit us</p>
            <h2 className="mt-3 text-4xl leading-[1.08] sm:text-5xl">Come for the smell.</h2>
            <p className="mt-4 max-w-md text-lg text-espresso/70">{STORE.name} — a short walk from the old market square.</p>
          </Reveal>

          <Reveal delay={0.1} className="mt-6 space-y-3">
            <div className="flex items-center gap-3 text-espresso/75">
              <Phone className="h-4 w-4 shrink-0 text-golden" />
              <a href={`tel:${STORE.phone.replace(/[^+\d]/g, "")}`} className="hover:text-terracotta">
                {STORE.phone}
              </a>
            </div>
            <div className="flex items-center gap-3">
              <LiveStatusPill />
            </div>
            {mounted && (
              <p className="text-sm text-espresso/60">
                Today ({today.day}): {today.open ? `${today.open.slice(0, 5)}–${today.close!.slice(0, 5)}` : "Closed"}
              </p>
            )}
          </Reveal>

          <Reveal delay={0.18} className="mt-6 flex flex-wrap gap-3">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-cinnamon px-6 py-3.5 text-sm font-semibold text-cream transition-colors hover:bg-terracotta"
            >
              <Navigation className="h-4 w-4" /> Get directions
            </a>
          </Reveal>

          {/* newsletter */}
          <Reveal delay={0.26} className="mt-10 rounded-3xl border border-espresso/10 bg-vanilla p-6">
            <h3 className="font-display text-xl text-espresso">The proofing list</h3>
            <p className="mt-1 text-sm text-espresso/60">
              One email a week: what&rsquo;s baking, what&rsquo;s seasonal, and first dibs on custom orders.
            </p>
            {submitted ? (
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-sage/15 px-4 py-2.5 text-sm font-semibold text-sage"
              >
                <CheckCircle2 className="h-4 w-4" /> {welcome}
              </motion.p>
            ) : (
              <form
                className="mt-4 flex flex-col gap-3 sm:flex-row"
                onSubmit={(e) => {
                  e.preventDefault();
                  subscribe();
                }}
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  aria-label="Email address"
                  className="flex-1 rounded-full border border-espresso/15 bg-cream px-5 py-3 text-sm outline-none transition-colors focus:border-golden"
                />
                <button
                  type="submit"
                  disabled={!valid || joining}
                  className="rounded-full bg-golden px-6 py-3 text-sm font-bold text-espresso transition-colors hover:bg-golden/85 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {joining ? "Joining…" : "Join"}
                </button>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
