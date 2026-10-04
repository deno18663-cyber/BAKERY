"use client";

import Reveal from "./Reveal";
import SplitHeading from "./SplitHeading";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string[];
  sub?: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
  className?: string;
}

export default function SectionHeading({
  eyebrow,
  title,
  sub,
  align = "center",
  tone = "light",
  className,
}: SectionHeadingProps) {
  const alignCls = align === "center" ? "mx-auto text-center" : "text-left";
  const eyebrowCls = tone === "dark" ? "text-golden" : "text-terracotta";
  const subCls = tone === "dark" ? "text-cream/60" : "text-espresso/60";
  return (
    <Reveal className={`max-w-2xl ${alignCls} ${className ?? ""}`}>
      {eyebrow && (
        <p className={`text-sm font-semibold uppercase tracking-[0.24em] ${eyebrowCls}`}>
          {eyebrow}
        </p>
      )}
      <SplitHeading as="h2" lines={title} className="mt-3 text-4xl leading-[1.08] sm:text-5xl" />
      {sub && <p className={`mt-4 text-lg ${subCls}`}>{sub}</p>}
    </Reveal>
  );
}
