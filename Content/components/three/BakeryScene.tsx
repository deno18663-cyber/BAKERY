"use client";

import { Suspense, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { AdaptiveDpr, Environment, Lightformer } from "@react-three/drei";
import { useCapsStore } from "@/lib/stores/caps-store";
import ScrollManager from "./ScrollManager";
import Particles from "./Particles";

/** Pauses the render loop while the tab is hidden (saves battery). */
function FrameloopController() {
  const setFrameloop = useThree((s) => s.setFrameloop);
  useEffect(() => {
    const onVis = () => setFrameloop(document.hidden ? "never" : "always");
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [setFrameloop]);
  return null;
}

/** Appetizing lighting with zero network — Lightformers render a local env map. */
function Lights() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <hemisphereLight args={["#fff4e0", "#3a2413", 0.5]} />
      <directionalLight position={[4, 6, 5]} intensity={2.2} color="#fff1dc" />
      <directionalLight position={[-5, 2, -4]} intensity={1.2} color="#FFC27A" />
      <Environment resolution={256} frames={1}>
        <Lightformer intensity={2} color="#FFE9C4" position={[0, 3, 5]} scale={[8, 3, 1]} form="rect" />
        <Lightformer intensity={1.4} color="#ffffff" position={[-4, 1, 2]} scale={[3, 2, 1]} form="rect" />
        <Lightformer intensity={2.4} color="#E09F3E" position={[4, 2, -3]} scale={[4, 4, 1]} form="ring" />
      </Environment>
    </>
  );
}

/**
 * One persistent, full-viewport, pointer-transparent WebGL canvas layered
 * between the page background (z-0) and the content (z-20). Models ghost
 * through semi-transparent sections and transform as the user scrolls.
 * Dynamically imported with ssr:false and gated by useCapsStore.
 */
export default function BakeryScene() {
  const enabled = useCapsStore((s) => s.enabled);

  // Only ever rendered on the client (ssr:false + capability-gated).
  // Listening on body keeps pointer data flowing even though the canvas
  // wrapper is pointer-events:none.
  const eventSource = typeof document !== "undefined" ? document.body : undefined;

  if (!enabled) return null;

  return (
    <div className="fixed inset-0 z-10 pointer-events-none" aria-hidden>
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, powerPreference: "high-performance", alpha: true }}
        camera={{ position: [0, 0, 5], fov: 42 }}
        eventSource={eventSource as HTMLElement}
        eventPrefix="client"
      >
        <Suspense fallback={null}>
          <FrameloopController />
          <Lights />
          <Particles />
          <ScrollManager />
          <AdaptiveDpr pixelated />
        </Suspense>
      </Canvas>
    </div>
  );
}
