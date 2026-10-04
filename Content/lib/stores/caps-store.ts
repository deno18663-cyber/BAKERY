"use client";

import { create } from "zustand";

interface CapsState {
  /** WebGL available and not force-disabled (set once on mount by provider). */
  enabled: boolean;
  /** weak device → prefer lower-fidelity experience. */
  lowPower: boolean;
}

export const useCapsStore = create<CapsState>(() => ({
  enabled: false,
  lowPower: false,
}));
