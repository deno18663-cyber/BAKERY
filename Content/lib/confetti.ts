"use client";

import confetti from "canvas-confetti";

const COLORS = ["#E09F3E", "#9E2A2B", "#FFF8F0", "#889681", "#540B0E", "#C98A4B"];

/** Medium celebratory burst — used on "added to cart". */
export function burstConfetti(origin?: { x: number; y: number }) {
  confetti({
    particleCount: 90,
    spread: 75,
    origin: origin ?? { x: 0.5, y: 0.5 },
    colors: COLORS,
    disableForReducedMotion: true,
  });
}

/** Small pop — used on quick add buttons. */
export function miniConfetti(origin?: { x: number; y: number }) {
  confetti({
    particleCount: 28,
    spread: 55,
    startVelocity: 24,
    origin: origin ?? { x: 0.5, y: 0.5 },
    colors: COLORS,
    disableForReducedMotion: true,
  });
}

/** Side cannon — used on the customizer "bake it" confirmation. */
export function bigConfetti() {
  const end = Date.now() + 900;
  const frame = () => {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 60,
      origin: { x: 0, y: 0.7 },
      colors: COLORS,
      disableForReducedMotion: true,
    });
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 60,
      origin: { x: 1, y: 0.7 },
      colors: COLORS,
      disableForReducedMotion: true,
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  };
  frame();
}
