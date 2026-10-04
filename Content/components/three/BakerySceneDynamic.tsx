"use client";

import dynamic from "next/dynamic";

/**
 * Client boundary for the WebGL scene: three.js is excluded from the server
 * bundle entirely. BakeryScene returns null until capabilities are confirmed,
 * so nothing flashes during hydration.
 */
const BakeryScene = dynamic(() => import("@/components/three/BakeryScene"), {
  ssr: false,
});

export default function BakerySceneDynamic() {
  return <BakeryScene />;
}
