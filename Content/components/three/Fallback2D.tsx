"use client";

import { motion } from "framer-motion";
import { CUSTOMIZER } from "@/lib/content";
import { useCustomizerStore } from "@/lib/stores/customizer-store";
import type { ReactNode } from "react";

/** Layered 2D/SVG stand-ins shown when WebGL is unavailable or forced off. */

export function HeroArt({ className }: { className?: string }) {
  return (
    <div className={`relative ${className ?? ""}`}>
      <svg viewBox="0 0 260 220" className="w-full animate-float" aria-hidden>
        <defs>
          <linearGradient id="hero-croissant-g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#E8C069" />
            <stop offset="100%" stopColor="#C98A4B" />
          </linearGradient>
        </defs>
        <path
          d="M26 154 C54 66 138 26 220 68 C244 82 250 98 244 110 C230 78 196 74 168 94 C136 116 92 132 60 162 C34 182 14 172 26 154 Z"
          fill="url(#hero-croissant-g)"
        />
        <path d="M72 134 C100 96 142 82 178 94" stroke="#9E2A2B" strokeWidth="4" fill="none" opacity="0.55" strokeLinecap="round" />
        <path d="M60 176 C52 196 36 198 28 188" stroke="#C98A4B" strokeWidth="3" fill="none" opacity="0.7" strokeLinecap="round" />
      </svg>
      <div className="absolute left-1/2 top-0 -translate-x-1/2">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="mx-auto block h-8 w-2 rounded-full bg-espresso/10 animate-steam"
            style={{ animationDelay: `${i * 0.7}s`, marginTop: i === 0 ? 0 : -4 }}
          />
        ))}
      </div>
    </div>
  );
}

export function SourdoughArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 160" className={className} aria-hidden>
      <defs>
        <linearGradient id="sourdough-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D9A441" />
          <stop offset="100%" stopColor="#9E5A2B" />
        </linearGradient>
      </defs>
      <ellipse cx="110" cy="95" rx="92" ry="52" fill="url(#sourdough-g)" />
      <path d="M40 120 q70 24 140 0" stroke="#7A3B1E" strokeWidth="4" fill="none" opacity="0.5" />
      <path d="M78 62 C96 52 118 50 140 58" stroke="#7A3B1E" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.8" />
      <path d="M98 58 C112 50 130 50 146 56" stroke="#FDFBF7" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.5" />
    </svg>
  );
}

type RGB = [number, number, number];

function hexToRgb(hex: string): RGB {
  const h = hex.replace("#", "");
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** Lighten (positive) or darken (negative) a hex color toward white/black. */
function shade(hex: string, amt: number): string {
  const [r, g, b] = hexToRgb(hex);
  const t = amt < 0 ? 0 : 255;
  const p = Math.abs(amt);
  const f = (c: number) => Math.round(c + (t - c) * p);
  return `rgb(${f(r)}, ${f(g)}, ${f(b)})`;
}

interface Drip {
  x: number;
  len: number;
}

/** Frosting band outline: flat top/sides, rounded-drip bottom edge. */
function dripBand(x0: number, x1: number, top: number, base: number, drips: Drip[]): string {
  const ds = drips.filter((d) => d.x > x0 + 3 && d.x < x1 - 3).sort((a, b) => b.x - a.x);
  let d = `M ${x0} ${top} L ${x1} ${top} L ${x1} ${base}`;
  let cx = x1;
  for (const dr of ds) {
    if (dr.x >= cx) continue;
    const w = cx - dr.x;
    d += ` C ${cx - w * 0.22} ${base + dr.len}, ${dr.x + w * 0.22} ${base + dr.len}, ${dr.x} ${base}`;
    cx = dr.x;
  }
  return `${d} L ${x0} ${base} Z`;
}

/** Row of upward piping bumps along a line (piped frosting edge). */
function scallops(x0: number, x1: number, y: number, step = 8, h = 5): string {
  let d = `M ${x0} ${y}`;
  let x = x0;
  while (x < x1 - step) {
    d += ` q ${step / 2} -${h} ${step} 0`;
    x += step;
  }
  return d;
}

/** Four-point sparkle path centered at (cx, cy). */
function sparkle(cx: number, cy: number, r: number): string {
  const s = r * 0.28;
  return `M ${cx} ${cy - r} L ${cx + s} ${cy - s} L ${cx + r} ${cy} L ${cx + s} ${cy + s} L ${cx} ${cy + r} L ${cx - s} ${cy + s} L ${cx - r} ${cy} L ${cx - s} ${cy - s} Z`;
}

/** One cake tier: sponge block + side shading + gloss + dripping frosting band + piped edge. */
function Tier({
  x,
  w,
  top,
  h,
  drips,
  frost,
}: {
  x: number;
  w: number;
  top: number;
  h: number;
  drips: Drip[];
  frost: string;
}) {
  const bandTop = top - 6;
  const bandBase = top + 18;
  return (
    <g>
      <rect x={x} y={top} width={w} height={h} rx={12} fill="url(#cakeart-base)" />
      <rect x={x} y={top} width={w} height={h} rx={12} fill="url(#cakeart-side)" />
      <rect x={x + 7} y={top + 6} width={8} height={h - 12} rx={4} fill="#ffffff" opacity={0.16} />
      <path d={dripBand(x, x + w, bandTop, bandBase, drips)} fill="url(#cakeart-frost)" />
      <path
        d={scallops(x + 6, x + w - 6, bandTop + 1, 8, 5)}
        fill="none"
        stroke={shade(frost, 0.25)}
        strokeWidth={3}
        strokeLinecap="round"
      />
      <rect x={x + 10} y={bandTop + 1} width={w - 20} height={2.5} rx={1.25} fill="#ffffff" opacity={0.35} />
    </g>
  );
}

type Choice = { id: string; label: string; color: string };

/** A plump berry: gradient body, glossy highlight, tiny leaf. */
function Berry({ x, y, r, id }: { x: number; y: number; r: number; id: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={`url(#${id})`} />
      <circle cx={x - r * 0.38} cy={y - r * 0.45} r={r * 0.24} fill="#ffffff" opacity={0.85} />
      <ellipse
        cx={x + r * 0.55}
        cy={y - r * 0.78}
        rx={r * 0.5}
        ry={r * 0.24}
        fill="#6E8F4A"
        transform={`rotate(-35 ${x + r * 0.55} ${y - r * 0.78})`}
      />
    </g>
  );
}

/** Points along an outward spiral, joined into an SVG path string. */
function spiralPath(cx: number, cy: number, innerR: number, outerR: number, turns: number): string {
  const steps = 42;
  const pts: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const r = innerR + (outerR - innerR) * t;
    const a = t * turns * Math.PI * 2;
    pts.push(`${(cx + Math.cos(a) * r).toFixed(2)} ${(cy + Math.sin(a) * r).toFixed(2)}`);
  }
  return pts.join(" L ");
}

/** A rolled chocolate shaving: spiral ribbon with a lighter cut edge catching the light. */
function ChocolateCurl({ x, y, s, rot, tone }: { x: number; y: number; s: number; rot: number; tone: string }) {
  return (
    <g transform={`rotate(${rot} ${x} ${y})`}>
      <path
        d={`M ${spiralPath(x, y, s * 1.4, s * 6.5, 1.3)}`}
        fill="none"
        stroke={tone}
        strokeWidth={s * 3.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={`M ${spiralPath(x, y, s * 1.4, s * 4, 0.85)}`}
        fill="none"
        stroke={shade(tone, 0.3)}
        strokeWidth={s * 1.4}
        strokeLinecap="round"
        opacity={0.9}
      />
    </g>
  );
}

/** A thin angular shard of gold leaf, catching the light. */
function GoldFlake({ x, y, rot }: { x: number; y: number; rot: number }) {
  return (
    <g transform={`rotate(${rot} ${x} ${y})`} opacity={0.95}>
      <path
        d={`M ${x} ${y - 4.2} L ${x + 2.4} ${y - 1.2} L ${x + 5.2} ${y + 1.6} L ${x + 2} ${y + 4.2} L ${x - 1.6} ${y + 3.6} L ${x - 4.8} ${y + 1} L ${x - 3.2} ${y - 2.6} Z`}
        fill="url(#tb-gold)"
      />
      <path
        d={`M ${x - 2.2} ${y - 1.8} L ${x + 1.6} ${y + 0.6}`}
        stroke="#FFF6DF"
        strokeWidth={0.8}
        opacity={0.5}
        strokeLinecap="round"
      />
    </g>
  );
}

/** A five-petal bloom with alternating petal tones and a darker center. */
function Flower({ x, y, rot, color }: { x: number; y: number; rot: number; color: string }) {
  const petals: ReactNode[] = [];
  for (let k = 0; k < 5; k++) {
    const a = (k / 5) * Math.PI * 2 + (rot * Math.PI) / 180;
    const px = x + Math.cos(a) * 4.4;
    const py = y + Math.sin(a) * 4.4;
    petals.push(
      <ellipse
        key={k}
        cx={px}
        cy={py}
        rx={3.1}
        ry={4.2}
        fill={k % 2 ? shade(color, 0.14) : color}
        transform={`rotate(${(a * 180) / Math.PI} ${px} ${py})`}
      />
    );
  }
  return (
    <g>
      {petals}
      <circle cx={x} cy={y} r={2.1} fill={shade(color, -0.3)} />
      <circle cx={x - 0.6} cy={y - 0.7} r={0.9} fill="#F6DCA4" />
    </g>
  );
}

/** One small irregular crumble fleck. */
function Fleck({ x, y, flip, tone }: { x: number; y: number; flip: number; tone: string }) {
  return <path d={`M ${x} ${y} l ${flip * 1.8} ${-2.2} l 2.6 ${0.9} l -0.8 ${2.4} z`} fill={tone} />;
}

/** Decorations placed from the selected toppings, each rendered as its real form. */
function CakeToppings({ selected }: { selected: Choice[] }) {
  const items: ReactNode[] = [];
  const pick = (id: string) => selected.find((t) => t.id === id);

  // ── Fresh Berries ── a glossy cluster on the dome, spilling onto the top tier
  const berries = pick("berries");
  if (berries) {
    const c = berries.color;
    const gid = `tb-berry-${c.replace("#", "")}`;
    items.push(
      <defs key="def-berry">
        <radialGradient id={gid} cx="0.35" cy="0.3" r="0.95">
          <stop offset="0%" stopColor={shade(c, 0.5)} />
          <stop offset="55%" stopColor={c} />
          <stop offset="100%" stopColor={shade(c, -0.4)} />
        </radialGradient>
      </defs>
    );
    for (const [x, y, r] of [
      [108, 36, 5.2], [126, 28, 6.2], [142, 34, 5.4],
      [118, 46, 5.8], [134, 50, 5.4], [150, 44, 4.8],
    ] as const) {
      items.push(<Berry key={`b${x}${y}`} x={x} y={y} r={r} id={gid} />);
    }
  }

  // ── Shaved Chocolate ── a small ring of curls beside the cherry on the dome
  const shavings = pick("shavings");
  if (shavings) {
    const c = shavings.color;
    for (const [x, y, s, rot] of [
      [114, 22, 0.85, -35], [146, 22, 0.85, 35], [108, 31, 0.95, 15],
      [152, 31, 0.95, -15], [124, 35, 1.0, 25], [138, 35, 1.0, -25],
    ] as const) {
      const tone = (x + y) % 2 === 0 ? c : shade(c, 0.2);
      items.push(<ChocolateCurl key={`sh${x}${y}`} x={x} y={y} s={s} rot={rot} tone={tone} />);
    }
  }

  // ── Caramel Drizzle ── a glossy band across the top tier with dripping streams
  const caramel = pick("caramel");
  if (caramel) {
    const c = caramel.color;
    items.push(
      <defs key="def-caramel">
        <linearGradient id="tb-caramel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={shade(c, 0.3)} />
          <stop offset="45%" stopColor={c} />
          <stop offset="100%" stopColor={shade(c, -0.22)} />
        </linearGradient>
      </defs>
    );

    // pooled band across the top tier, with drips hanging below it
    items.push(
      <path
        key="cb-band"
        d={dripBand(97, 163, 44, 50, [
          { x: 104, len: 26 }, { x: 118, len: 16 }, { x: 134, len: 30 },
          { x: 150, len: 22 }, { x: 158, len: 13 },
        ])}
        fill="url(#tb-caramel)"
        opacity={0.95}
      />,
      <path
        key="cb-sheen"
        d="M 99 46.5 L 161 46.5"
        stroke="#F6DCA4"
        strokeWidth={1.4}
        opacity={0.4}
        fill="none"
        strokeLinecap="round"
      />
    );
  }

  // ── Pistachio Crumble ── dense flecks over the dome and top tier
  const pistachio = pick("pistachio");
  if (pistachio) {
    const c = pistachio.color;
    const tones = [c, shade(c, 0.16), shade(c, -0.15)];
    const spots: Array<[number, number]> = [
      [102, 40], [112, 30], [124, 24], [138, 26], [150, 32], [158, 42],
      [110, 46], [126, 38], [142, 44], [154, 50], [98, 58], [116, 56],
      [132, 54], [148, 60], [160, 58], [106, 70], [122, 68], [138, 66],
      [152, 72], [116, 80], [136, 78],
    ];
    for (let i = 0; i < spots.length; i++) {
      const [x, y] = spots[i];
      items.push(<Fleck key={`pi${x}${y}`} x={x} y={y} flip={i % 2 ? 1 : -1} tone={tones[i % 3]} />);
    }
  }

  // ── Gold Leaf ── angular metallic flakes on the dome and top tier
  const gold = pick("gold");
  if (gold) {
    items.push(
      <defs key="def-gold">
        <linearGradient id="tb-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F7D083" />
          <stop offset="45%" stopColor="#E3B85C" />
          <stop offset="100%" stopColor="#C18A2E" />
        </linearGradient>
      </defs>
    );
    for (const [x, y, r] of [
      [110, 32, 20], [136, 27, -15], [148, 40, 55], [122, 45, -25], [155, 30, 15],
    ] as const) {
      items.push(<GoldFlake key={`g${x}${y}`} x={x} y={y} rot={r} />);
    }
    items.push(
      <path key="gs1" d="M 102 54 l 2.2 -3 l 2.6 1.2 l -1 3 z" fill="#E3B85C" />,
      <path key="gs2" d="M 160 50 l 2 -2.4 l 2.4 1 l -1 2.8 z" fill="#F0C86E" />
    );
  }

  // ── Edible Flowers ── petal-shaped blooms resting on the top
  const flowers = pick("flowers");
  if (flowers) {
    const c = flowers.color;
    for (const [x, y, r] of [
      [104, 34, 0], [132, 26, 30], [150, 38, 50], [120, 56, 12], [142, 60, 0], [156, 50, 0],
    ] as const) {
      items.push(<Flower key={`f${x}${y}`} x={x} y={y} rot={r} color={c} />);
    }
  }

  return <>{items}</>;
}

export function CakeArt({ className }: { className?: string }) {
  const base = useCustomizerStore((s) => s.base);
  const frosting = useCustomizerStore((s) => s.frosting);
  const toppings = useCustomizerStore((s) => s.toppings);

  const baseColor = CUSTOMIZER.bases.find((b) => b.id === base)?.color ?? "#D9A86A";
  const frostingColor = CUSTOMIZER.frostings.find((f) => f.id === frosting)?.color ?? "#FFF8F0";
  const selected = toppings
    .map((id) => CUSTOMIZER.toppings.find((t) => t.id === id))
    .filter((t): t is Choice => Boolean(t));

  return (
    <svg viewBox="0 0 260 300" className={className} aria-hidden>
      <defs>
        <linearGradient id="cakeart-base" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={shade(baseColor, 0.22)} />
          <stop offset="55%" stopColor={baseColor} />
          <stop offset="100%" stopColor={shade(baseColor, -0.32)} />
        </linearGradient>
        <linearGradient id="cakeart-side" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#3a2413" stopOpacity={0.16} />
          <stop offset="18%" stopColor="#3a2413" stopOpacity={0} />
          <stop offset="82%" stopColor="#3a2413" stopOpacity={0} />
          <stop offset="100%" stopColor="#3a2413" stopOpacity={0.12} />
        </linearGradient>
        <linearGradient id="cakeart-frost" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={shade(frostingColor, 0.32)} />
          <stop offset="100%" stopColor={shade(frostingColor, -0.12)} />
        </linearGradient>
        <linearGradient id="cakeart-dome" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={shade(frostingColor, 0.42)} />
          <stop offset="100%" stopColor={shade(frostingColor, -0.06)} />
        </linearGradient>
        <linearGradient id="cakeart-plate" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#EDE1C8" />
        </linearGradient>
        <linearGradient id="cakeart-dish" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E7D5B4" />
          <stop offset="100%" stopColor="#F8F1E0" />
        </linearGradient>
        <linearGradient id="cakeart-foot" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#EFE4CC" />
          <stop offset="100%" stopColor="#C8B489" />
        </linearGradient>
        <radialGradient id="cakeart-cherry" cx="0.35" cy="0.3" r="0.9">
          <stop offset="0%" stopColor="#F6686B" />
          <stop offset="55%" stopColor="#D63946" />
          <stop offset="100%" stopColor="#A11F31" />
        </radialGradient>
      </defs>

      {/* warm ambient glow */}
      <ellipse cx="130" cy="205" rx="118" ry="92" fill="#FFE9C4" opacity="0.12" />

      {/* soft ground shadows */}
      <ellipse cx="130" cy="258" rx="104" ry="13" fill="#3a2413" opacity="0.1" />
      <ellipse cx="130" cy="257" rx="78" ry="9" fill="#3a2413" opacity="0.12" />

      {/* pedestal plate */}
      <rect x="112" y="238" width="36" height="16" rx="8" fill="url(#cakeart-foot)" />
      <ellipse cx="130" cy="254" rx="20" ry="4" fill="#C2AE84" />
      <ellipse cx="130" cy="234" rx="92" ry="16" fill="url(#cakeart-plate)" />
      <ellipse cx="130" cy="233" rx="85" ry="14" fill="none" stroke="#ffffff" strokeWidth="1.5" opacity="0.5" />
      <ellipse cx="130" cy="235" rx="68" ry="10" fill="url(#cakeart-dish)" opacity="0.5" />

      {/* tiers */}
      <Tier
        x={52}
        w={156}
        top={170}
        h={58}
        frost={frostingColor}
        drips={[
          { x: 200, len: 13 }, { x: 184, len: 9 }, { x: 168, len: 16 }, { x: 152, len: 11 },
          { x: 136, len: 15 }, { x: 120, len: 10 }, { x: 104, len: 17 }, { x: 88, len: 12 },
          { x: 72, len: 10 }, { x: 58, len: 14 },
        ]}
      />
      <Tier
        x={72}
        w={116}
        top={108}
        h={62}
        frost={frostingColor}
        drips={[
          { x: 178, len: 12 }, { x: 162, len: 15 }, { x: 146, len: 9 }, { x: 130, len: 14 },
          { x: 116, len: 11 }, { x: 102, len: 16 }, { x: 88, len: 10 }, { x: 78, len: 12 },
        ]}
      />
      <Tier
        x={92}
        w={76}
        top={48}
        h={60}
        frost={frostingColor}
        drips={[
          { x: 156, len: 10 }, { x: 142, len: 13 }, { x: 128, len: 11 },
          { x: 114, len: 15 }, { x: 102, len: 10 }, { x: 96, len: 12 },
        ]}
      />

      {/* domed top with piped swirl */}
      <path d="M 94 46 Q 94 14 130 14 Q 166 14 166 46 Z" fill="url(#cakeart-dome)" />
      <path
        d="M 128 42 C 120 38 118 26 128 20 C 138 14 150 22 146 32 C 143 40 132 44 126 37"
        fill="none"
        stroke={shade(frostingColor, -0.15)}
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* cherry on top */}
      <g>
        <path d="M 130 8 C 130 4 133 2 138 2" stroke="#5B3A26" strokeWidth="2" fill="none" strokeLinecap="round" />
        <circle cx="130" cy="15" r="6.5" fill="url(#cakeart-cherry)" />
        <circle cx="128" cy="13" r="1.8" fill="#ffffff" opacity="0.8" />
      </g>

      {/* selected toppings (animate as they appear) */}
      <g>
        {selected.length ? (
          <motion.g
            key={selected.map((t) => t.id).join(",")}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 340, damping: 22, delay: 0.05 }}
          >
            <CakeToppings selected={selected} />
          </motion.g>
        ) : null}
      </g>

      {/* sparkles */}
      <path d={sparkle(46, 64, 8)} fill="#E09F3E" opacity="0.85" />
      <path d={sparkle(216, 108, 7)} fill="#E09F3E" opacity="0.7" />
      <path d={sparkle(176, 24, 5)} fill="#E09F3E" opacity="0.8" />
    </svg>
  );
}

/** 2x3 grid of treat icons that animate in as slots fill. */
const SLOT_CENTERS: Array<[number, number]> = [
  [88, 116], [120, 116], [152, 116],
  [88, 152], [120, 152], [152, 152],
];

export function BoxArt({ className }: { className?: string }) {
  const slots = useCustomizerStore((s) => s.boxSlots);

  return (
    <svg viewBox="0 0 240 220" className={className} aria-hidden>
      {/* kraft takeaway box — taller, wider, with a scored flap lid */}
      <rect x="30" y="80" width="180" height="96" rx="10" fill="#D9A441" />
      <rect x="40" y="100" width="160" height="12" rx="4" fill="#FFF8F0" />
      <path
        d="M 20 68 L 220 68 L 200 80 L 40 80 Z"
        fill="#9E5A2B"
        stroke="#7A4A27"
        strokeWidth="1"
      />
      <path d="M 20 74 L 220 74" stroke="#FFF8F0" strokeWidth="0.8" opacity="0.35" />

      {slots.map((id, i) => {
        const product = id ? CUSTOMIZER.boxSlots.find((b) => b.id === id) : undefined;
        const [cx, cy] = SLOT_CENTERS[i];
        if (!product) return null;
        return (
          <motion.g
            key={id}
            initial={{ opacity: 0, scale: 0, rotate: -90 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 360, damping: 20, delay: i * 0.06 }}
          >
            <circle cx={cx} cy={cy} r="17" fill={product.color} />
            <text
              x={cx}
              y={cy + 6}
              textAnchor="middle"
              fontSize="17"
              aria-hidden="true"
              style={{ pointerEvents: "none" }}
            >
              {product.emoji}
            </text>
          </motion.g>
        );
      })}
    </svg>
  );
}

/** Ambient floating flour dust (DOM, used in the 2D hero). */
export function FlourDust({ count = 16 }: { count?: number }) {
  const dots = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: (i * 61) % 100,
    top: (i * 37) % 100,
    size: 2 + (i % 3) * 2,
    delay: (i % 5) * 0.8,
    duration: 5 + (i % 4),
  }));
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {dots.map((d) => (
        <span
          key={d.id}
          className="absolute rounded-full bg-golden/30 animate-float"
          style={{
            left: `${d.left}%`,
            top: `${d.top}%`,
            width: d.size,
            height: d.size,
            animationDelay: `${d.delay}s`,
            animationDuration: `${d.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
