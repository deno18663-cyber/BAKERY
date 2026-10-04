"use client";

import { create } from "zustand";

interface BakeryState {
  /** epoch ms — ticked once per second by <BakeryProvider/> */
  now: number;
  tick: () => void;
}

export const useBakeryStore = create<BakeryState>((set) => ({
  now: Date.now(),
  tick: () => set({ now: Date.now() }),
}));
