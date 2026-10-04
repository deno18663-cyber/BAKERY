"use client";

import { useRef } from "react";
import { STORY_STEPS } from "@/lib/content";
import { gsap, useGSAP } from "@/lib/gsap";
import { SourdoughArt } from "@/components/three/Fallback2D";
import { useCapsStore } from "@/lib/stores/caps-store";

function StepCard({ step }: { step: (typeof STORY_STEPS)[number] }) {
  return (
    <article className="group relative h-[19rem] w-[78vw] max-w-sm shrink-0 overflow-hidden rounded-3xl border border-cream/10 bg-cream/5 p-8 backdrop-blur-sm transition-colors duration-300 hover:border-golden/50">
      <span className="absolute -right-4 -top-6 font-display text-[7rem] leading-none text-cream/5 transition-colors duration-300 group-hover:text-golden/10">
        {step.number}
      </span>
      <span className="text-5xl">{step.icon}</span>
      <p className="mt-5 font-display text-sm text-golden">{step.number}</p>
      <h3 className="mt-1 text-2xl text-cream">{step.title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-cream/70">{step.body}</p>
    </article>
  );
}

/**
 * The 48-hour process: a GSAP-pinned horizontal scrub on desktop,
 * a plain vertical list on mobile.
 */
export default function StoryProcess() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const enabled = useCapsStore((s) => s.enabled);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        const track = trackRef.current;
        const section = sectionRef.current;
        if (!track || !section) return;
        const amt = () => track.scrollWidth - window.innerWidth;
        gsap.to(track, {
          x: () => -amt(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => "+=" + amt(),
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });
      });
      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section id="story" ref={sectionRef} className="relative overflow-hidden bg-espresso/95 text-cream">
      <div className="px-6 pb-10 pt-24 lg:px-16">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-golden">Our process · 48 hours</p>
        <h2 className="mt-3 max-w-2xl text-4xl leading-[1.08] sm:text-5xl lg:text-6xl">
          Slow bread, <em className="text-golden">step by step</em>
        </h2>
        <p className="mt-4 max-w-xl text-cream/60">
          Drag or scroll sideways — this is what a loaf does in the two days before it reaches your hands.
        </p>
      </div>

      {/* desktop: pinned horizontal track */}
      <div className="hidden overflow-hidden md:block">
        <div ref={trackRef} className="flex w-max gap-6 px-6 pb-28 lg:px-16">
          {STORY_STEPS.map((step) => (
            <StepCard key={step.number} step={step} />
          ))}
          <div className="flex w-56 shrink-0 flex-col items-center justify-center gap-4 rounded-3xl border border-golden/40 bg-golden/10 p-8 text-center">
            <span className="text-5xl">🍞</span>
            <p className="font-display text-xl text-golden">Ready to eat.</p>
            <p className="text-sm text-cream/70">Fresh out of the oven — see what&rsquo;s baking now below.</p>
          </div>
        </div>
      </div>

      {/* mobile: vertical list */}
      <div className="space-y-5 px-6 pb-24 md:hidden">
        {STORY_STEPS.map((step) => (
          <StepCard key={step.number} step={step} />
        ))}
      </div>

      {!enabled && (
        <div className="pointer-events-none absolute -right-10 bottom-24 hidden w-72 opacity-40 lg:block" aria-hidden>
          <SourdoughArt />
        </div>
      )}
    </section>
  );
}
