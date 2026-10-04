"use client";

import { useRef, type MouseEvent, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { scrollToTarget } from "@/components/smooth/SmoothScroll";

interface MagneticButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "ghost";
}

/** Tactile button that leans toward the cursor; hash links smooth-scroll. */
export default function MagneticButton({
  children,
  href,
  onClick,
  className,
  variant = "primary",
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.25 });
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.25 });

  function handleMove(e: MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.35);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.35);
  }
  function reset() {
    x.set(0);
    y.set(0);
  }
  function handleClick() {
    if (href?.startsWith("#")) {
      scrollToTarget(href);
      return;
    }
    onClick?.();
  }

  const styles =
    variant === "primary"
      ? "bg-terracotta text-cream hover:bg-cinnamon shadow-golden"
      : "border border-espresso/15 bg-cream/60 text-espresso hover:border-espresso/40";

  return (
    <motion.div
      ref={ref}
      style={{ x: sx, y: sy }}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      className="inline-block"
    >
      {href ? (
        <a
          href={href}
          onClick={(e) => {
            if (href.startsWith("#")) e.preventDefault();
            handleClick();
          }}
          className={`group inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold transition-colors duration-300 ${styles} ${className ?? ""}`}
        >
          {children}
        </a>
      ) : (
        <button
          onClick={handleClick}
          className={`group inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold transition-colors duration-300 ${styles} ${className ?? ""}`}
        >
          {children}
        </button>
      )}
    </motion.div>
  );
}
