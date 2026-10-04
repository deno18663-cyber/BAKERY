"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/** Desktop-only custom cursor: golden dot + trailing ring that grows on hovers. */
export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 320, damping: 34, mass: 0.4 });
  const ringY = useSpring(y, { stiffness: 320, damping: 34, mass: 0.4 });

  useEffect(() => {
    if (!window.matchMedia?.("(pointer: fine)").matches) return;
    setEnabled(true);

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      setHovering(!!t?.closest("[data-cursor='hover'], a, button, [role='button']"));
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[120]"
        style={{ x, y }}
        aria-hidden
      >
        <div className="h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-golden" />
      </motion.div>
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[110]"
        style={{ x: ringX, y: ringY }}
        aria-hidden
      >
        <div
          className={`-translate-x-1/2 -translate-y-1/2 rounded-full border border-golden/60 transition-all duration-200 ${
            hovering ? "h-14 w-14 opacity-40" : "h-8 w-8 opacity-100"
          }`}
        />
      </motion.div>
    </>
  );
}
