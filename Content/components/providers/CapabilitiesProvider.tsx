"use client";

import { useEffect } from "react";
import { useCapsStore } from "@/lib/stores/caps-store";

function detectWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * Runs once on mount: decides whether the WebGL experience is available and
 * whether the device is low-power (→ sections render 2D fallback art).
 * `?force2d=1` in the URL forces the 2D experience for testing.
 */
export default function CapabilitiesProvider() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const force2d = params.get("force2d") === "1";

    const memory = (navigator as unknown as { deviceMemory?: number }).deviceMemory ?? 8;
    const cores = navigator.hardwareConcurrency ?? 8;
    const coarse =
      window.matchMedia?.("(pointer: coarse)").matches && window.innerWidth < 768;
    const lowPower = memory < 4 || cores <= 4 || coarse;

    useCapsStore.setState({
      enabled: !force2d && detectWebGL(),
      lowPower,
    });
  }, []);

  return null;
}
