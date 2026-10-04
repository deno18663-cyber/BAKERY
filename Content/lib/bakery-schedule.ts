/**
 * Deterministic "Fresh Out of the Oven" simulation.
 * Every product repeats a (bake → cool → idle) loop from midnight, so the
 * status is a pure function of the visitor's local clock — no backend.
 */

import type { ScheduleItem } from "./types";
import { HOURS } from "./content";

export type BakePhase = "oven" | "cooling" | "idle";

export interface BakeStatus {
  phase: BakePhase;
  label: string;
  /** minutes until the current phase ends (next state change) */
  minutesToNext: number;
  /** minutes until the batch is sellable (0 when ready now) */
  minutesUntilReady: number;
  cycleMin: number;
}

function parseHM(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export function fmtClock(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  const hr = h % 12 === 0 ? 12 : h % 12;
  return `${hr}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}

export function cycleStatus(item: ScheduleItem, now: Date): BakeStatus {
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);
  const elapsed = (now.getTime() - startOfDay.getTime()) / 60000;
  const cycleMin = item.bakeMin + item.coolMin + item.idleMin;
  const pos = ((elapsed % cycleMin) + cycleMin) % cycleMin;

  if (pos < item.bakeMin) {
    return {
      phase: "oven",
      label: "In the oven",
      minutesToNext: item.bakeMin - pos,
      minutesUntilReady: item.coolMin + (item.bakeMin - pos),
      cycleMin,
    };
  }
  const coolingEnd = item.bakeMin + item.coolMin;
  if (pos < coolingEnd) {
    return {
      phase: "cooling",
      label: "Fresh out · cooling",
      minutesToNext: coolingEnd - pos,
      minutesUntilReady: 0,
      cycleMin,
    };
  }
  return {
    phase: "idle",
    label: "Next batch",
    minutesToNext: cycleMin - pos,
    minutesUntilReady: cycleMin - pos + item.bakeMin,
    cycleMin,
  };
}

/** Human-readable "14 min" / "1 hr 5 min". */
export function formatMinutes(min: number): string {
  const m = Math.max(0, Math.ceil(min));
  if (m <= 0) return "now";
  const h = Math.floor(m / 60);
  const mm = m % 60;
  if (h === 0) return `${mm} min`;
  if (mm === 0) return `${h} hr`;
  return `${h} hr ${mm} min`;
}

export interface OpenStatus {
  open: boolean;
  label: string;
  closesAt: string | null;
  opensAt: string | null;
}

/** Open/closed status derived from HOURS for a given instant. */
export function openStatus(now: Date): OpenStatus {
  const dayIdx = now.getDay(); // 0 = Sunday
  const idx = (dayIdx + 6) % 7; // re-map to Monday-first HOURS order
  const today = HOURS[idx];
  const cur = now.getHours() * 60 + now.getMinutes();

  if (today.open && today.close) {
    const open = parseHM(today.open);
    const close = parseHM(today.close);
    if (cur >= open && cur < close) {
      const closesAt = fmtClock(today.close);
      return { open: true, label: `Open today until ${closesAt}`, closesAt, opensAt: null };
    }
  }

  // Find the next opening
  for (let i = 1; i <= 7; i++) {
    const d = HOURS[(idx + i) % 7];
    if (d.open) {
      return { open: false, label: `Closed · opens ${fmtClock(d.open)}`, closesAt: null, opensAt: fmtClock(d.open) };
    }
  }
  return { open: false, label: "Closed today", closesAt: null, opensAt: null };
}
