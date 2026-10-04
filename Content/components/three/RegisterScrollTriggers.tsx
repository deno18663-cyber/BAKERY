"use client";

import { useGSAP } from "@/lib/gsap";
import { ScrollTrigger } from "@/lib/gsap";
import { scrollState } from "@/lib/scroll-state";

/**
 * DOM-side ScrollTriggers that write per-section progress into the shared
 * scrollState singleton consumed by the WebGL ScrollManager.
 */
export default function RegisterScrollTriggers() {
  useGSAP(() => {
    const mk = (selector: string, key: "hero" | "story" | "cake") => {
      const el = document.querySelector(selector);
      if (!el) return;
      ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: "bottom top",
        onUpdate: (self) => {
          scrollState[key] = self.progress;
        },
      });
    };

    mk("#hero", "hero");
    mk("#story", "story");
    mk("#customizer", "cake");

    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  return null;
}
