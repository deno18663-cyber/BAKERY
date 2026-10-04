"use client";

import { useLayoutEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { gsap, ScrollTrigger } from "@/lib/gsap";

let lenisRef: Lenis | null = null;

/**
 * Smooth inertia scrolling: Lenis drives the native scroll position and is
 * synced into GSAP ScrollTrigger so pinning/scrubbing stay buttery.
 */
export default function SmoothScroll() {
  useLayoutEffect(() => {
    ScrollTrigger.config({ ignoreMobileResize: true });

    const lenis = new Lenis({
      lerp: 0.09,
      wheelMultiplier: 1,
      smoothWheel: true,
    });
    lenisRef = lenis;
    lenis.on("scroll", () => ScrollTrigger.update());

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);

    return () => {
      window.removeEventListener("load", onLoad);
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisRef = null;
    };
  }, []);

  return null;
}

/** Smooth-scroll to a section (used by nav + CTAs). Falls back to native jump. */
export function scrollToTarget(target: string | number | HTMLElement) {
  if (lenisRef) {
    lenisRef.scrollTo(target, { offset: -72, duration: 1.3 });
  } else if (typeof target === "string") {
    document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
  }
}
