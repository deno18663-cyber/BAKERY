"use client";

import { useEffect } from "react";
import { useBakeryStore } from "@/lib/stores/bakery-store";

/** Drives the global 1-second clock that powers live schedule/status UI. */
export default function BakeryProvider() {
  useEffect(() => {
    useBakeryStore.getState().tick();
    const id = setInterval(() => useBakeryStore.getState().tick(), 1000);
    return () => clearInterval(id);
  }, []);
  return null;
}
