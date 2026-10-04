"use client";

import { create } from "zustand";

export type CustomizerMode = "cake" | "box";

interface CustomizerState {
  mode: CustomizerMode;
  step: number; // 1..3
  base: string; // choice id
  frosting: string; // choice id
  toppings: string[]; // choice ids
  boxSlots: (string | null)[]; // 6 slots of box product ids
  setMode: (m: CustomizerMode) => void;
  setBase: (id: string) => void;
  setFrosting: (id: string) => void;
  toggleTopping: (id: string) => void;
  setBoxSlot: (index: number, productId: string | null) => void;
  next: () => void;
  back: () => void;
  reset: () => void;
}

export const useCustomizerStore = create<CustomizerState>()((set) => ({
  mode: "cake",
  step: 1,
  base: "vanilla",
  frosting: "vanilla-buttercream",
  toppings: [],
  boxSlots: Array<string | null>(6).fill(null),
  setMode: (mode) => set({ mode, step: 1 }),
  setBase: (base) => set({ base }),
  setFrosting: (frosting) => set({ frosting }),
  toggleTopping: (id) =>
    set((s) => ({
      toppings: s.toppings.includes(id)
        ? s.toppings.filter((t) => t !== id)
        : [...s.toppings, id],
    })),
  setBoxSlot: (index, productId) =>
    set((s) => {
      const boxSlots = [...s.boxSlots];
      boxSlots[index] = productId;
      return { boxSlots };
    }),
  next: () => set((s) => ({ step: Math.min(3, s.step + 1) })),
  back: () => set((s) => ({ step: Math.max(1, s.step - 1) })),
  reset: () =>
    set({
      step: 1,
      base: "vanilla",
      frosting: "vanilla-buttercream",
      toppings: [],
      boxSlots: Array<string | null>(6).fill(null),
    }),
}));
