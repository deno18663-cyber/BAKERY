/**
 * Scroll progress state shared between GSAP ScrollTriggers (DOM side)
 * and the R3F useFrame loop (WebGL side).
 *
 * This is a plain mutable module singleton — deliberately NOT React state,
 * so writing it every scroll frame causes zero React re-renders.
 */

export interface Keyframe {
  t: number; // 0..1
  v: [number, number, number]; // x, y, z
}

export const scrollState = {
  hero: 0, // progress through the hero section (0 → 1)
  story: 0, // progress through the story section
  cake: 0, // progress through the customizer section
};

/** Linear-interpolate a keyframe list at time t (clamped at the ends). */
export function keyframe(kfs: Keyframe[], t: number): [number, number, number] {
  if (kfs.length === 0) return [0, 0, 0];
  if (t <= kfs[0].t) return kfs[0].v;
  const last = kfs[kfs.length - 1];
  if (t >= last.t) return last.v;
  for (let i = 0; i < kfs.length - 1; i++) {
    const a = kfs[i];
    const b = kfs[i + 1];
    if (t >= a.t && t <= b.t) {
      const p = (t - a.t) / (b.t - a.t || 1);
      return [
        a.v[0] + (b.v[0] - a.v[0]) * p,
        a.v[1] + (b.v[1] - a.v[1]) * p,
        a.v[2] + (b.v[2] - a.v[2]) * p,
      ];
    }
  }
  return last.v;
}
