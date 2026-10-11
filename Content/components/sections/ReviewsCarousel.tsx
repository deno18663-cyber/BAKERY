"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { REVIEWS } from "@/lib/content";
import type { Review } from "@/lib/types";
import { fetchReviews } from "@/lib/api";
import SectionHeading from "@/components/ui/SectionHeading";

export default function ReviewsCarousel() {
  // Live reviews from the backend, falling back to the static set offline.
  const [reviews, setReviews] = useState<Review[]>(REVIEWS);
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [max, setMax] = useState(0);
  const x = useMotionValue(0);

  useEffect(() => {
    let alive = true;
    fetchReviews()
      .then((r) => {
        if (alive && r.length > 0) setReviews(r);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const stepWidth = useCallback(() => {
    const card = trackRef.current?.querySelector<HTMLElement>("[data-card]");
    return card ? card.offsetWidth + 24 : 440;
  }, []);

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    setMax(Math.max(0, Math.round((track.scrollWidth - track.offsetWidth) / stepWidth())));
  }, [stepWidth]);

  useEffect(() => {
    measure();
    setIndex(0);
    x.set(0);
  }, [measure, reviews.length, x]);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  const goTo = useCallback(
    (i: number) => {
      const m = max;
      const next = Math.min(Math.max(0, i), m);
      setIndex(next);
      animate(x, -next * stepWidth(), { type: "spring", stiffness: 300, damping: 32 });
    },
    [max, stepWidth, x],
  );

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => goTo(index >= max ? 0 : index + 1), 4500);
    return () => clearInterval(id);
  }, [paused, index, max, goTo]);

  const handleDragEnd = useCallback(() => {
    const i = Math.round(-x.get() / stepWidth());
    goTo(i);
  }, [x, stepWidth, goTo]);

  return (
    <section id="reviews" className="relative bg-vanilla px-6 py-24 lg:px-16">
      <SectionHeading
        eyebrow="Kind words"
        title={["Loved by", "neighbours"]}
        sub="Drag the cards, or let them stroll by on their own."
      />

      <div
        className="relative mt-12"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
      >
        <div className="overflow-hidden">
          <motion.div
            ref={trackRef}
            className="flex gap-6"
            style={{ x }}
            drag="x"
            dragConstraints={{ left: -max * stepWidth(), right: 0 }}
            dragElastic={0.08}
            onDragEnd={handleDragEnd}
          >
            {reviews.map((r) => (
              <article
                key={r.id}
                data-card
                className="relative w-[80%] shrink-0 rounded-3xl border border-espresso/10 bg-cream p-7 shadow-card sm:w-[420px]"
              >
                <Quote className="absolute right-6 top-6 h-8 w-8 text-golden/20" />
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-11 w-11 items-center justify-center rounded-full font-display text-sm text-cream"
                    style={{ background: r.color }}
                  >
                    {r.initials}
                  </span>
                  <div>
                    <p className="font-display text-base text-espresso">{r.name}</p>
                    <p className="text-xs text-espresso/45">{r.date}</p>
                  </div>
                </div>
                <div className="mt-4 flex gap-0.5">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < r.rating ? "fill-golden text-golden" : "fill-espresso/10 text-espresso/10"}`}
                    />
                  ))}
                </div>
                <p className="mt-4 text-[15px] leading-relaxed text-espresso/75">&ldquo;{r.text}&rdquo;</p>
              </article>
            ))}
          </motion.div>
        </div>

        {/* arrows */}
        <button
          onClick={() => goTo(index - 1)}
          disabled={index === 0}
          className="absolute -left-3 top-1/2 -translate-y-1/2 rounded-full border border-espresso/12 bg-cream p-3 shadow-soft transition-colors hover:text-terracotta disabled:opacity-40"
          aria-label="Previous review"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={() => goTo(index + 1)}
          disabled={index >= max}
          className="absolute -right-3 top-1/2 -translate-y-1/2 rounded-full border border-espresso/12 bg-cream p-3 shadow-soft transition-colors hover:text-terracotta disabled:opacity-40"
          aria-label="Next review"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* dots */}
      <div className="mt-8 flex items-center justify-center gap-2">
        {reviews.map((r, i) => (
          <button
            key={r.id}
            onClick={() => goTo(i)}
            aria-label={`Go to review ${i + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${i === index ? "w-8 bg-terracotta" : "w-2 bg-espresso/20 hover:bg-espresso/40"}`}
          />
        ))}
      </div>
    </section>
  );
}
