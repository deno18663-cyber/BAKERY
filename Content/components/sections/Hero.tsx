"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { HERO } from "@/lib/content";
import { useCapsStore } from "@/lib/stores/caps-store";
import SplitHeading from "@/components/ui/SplitHeading";
import MagneticButton from "@/components/ui/MagneticButton";
import LiveStatusPill from "@/components/ui/LiveStatusPill";
import { HeroArt, FlourDust } from "@/components/three/Fallback2D";
import { scrollToTarget } from "@/components/smooth/SmoothScroll";

export default function Hero() {
  const enabled = useCapsStore((s) => s.enabled);

  return (
    <section id="hero" className="relative flex min-h-screen items-center overflow-hidden px-6 pb-24 pt-28 lg:px-16">
      {!enabled && <FlourDust />}

      <div className="relative z-10 max-w-3xl">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="mb-5 text-sm font-semibold uppercase tracking-[0.24em] text-terracotta"
        >
          {HERO.eyebrow}
        </motion.p>

        <SplitHeading as="h1" lines={HERO.headline} className="text-[2.7rem] leading-[1.02] sm:text-6xl lg:text-7xl" />

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.6 }}
          className="mt-6 max-w-xl text-lg leading-relaxed text-espresso/70"
        >
          {HERO.sub}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="mt-9 flex flex-wrap items-center gap-4"
        >
          <MagneticButton href="#menu">
            {HERO.ctaPrimary.label}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </MagneticButton>
          <MagneticButton href="#products" variant="ghost">
            {HERO.ctaSecondary.label}
          </MagneticButton>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="mt-8"
        >
          <LiveStatusPill />
        </motion.div>
      </div>

      {!enabled && (
        <div className="pointer-events-none absolute bottom-6 right-4 w-52 sm:w-72 lg:right-16">
          <HeroArt />
        </div>
      )}

      {/* scroll cue */}
      <motion.button
        onClick={() => scrollToTarget("#story")}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.8 }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-espresso/40 transition-colors hover:text-terracotta sm:flex"
        aria-label="Scroll to our process"
      >
        <span className="text-[11px] font-semibold uppercase tracking-[0.2em]">Scroll</span>
        <span className="flex h-10 w-6 items-start justify-center rounded-full border border-current p-1.5">
          <motion.span
            animate={{ y: [0, 14, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="h-2 w-1 rounded-full bg-current"
          />
        </span>
      </motion.button>
    </section>
  );
}
