"use client";

import { useRef } from "react";
import { gsap, useGSAP, SplitText } from "@/lib/gsap";

interface SplitHeadingProps {
  lines: string[];
  className?: string;
  as?: "h1" | "h2" | "h3";
}

/**
 * Editorial headline with a character-by-character wipe reveal
 * (GSAP SplitText + ScrollTrigger, once per view).
 */
export default function SplitHeading({ lines, className, as = "h2" }: SplitHeadingProps) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const split = new SplitText(el, { type: "chars", mask: "chars" });
      gsap.from(split.chars, {
        yPercent: 120,
        duration: 0.75,
        stagger: 0.018,
        ease: "power4.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      });
      return () => split.revert();
    },
    { scope: ref },
  );

  const Tag = as as "h1";
  return (
    <Tag ref={ref as never} className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block">
          {line}
        </span>
      ))}
    </Tag>
  );
}
