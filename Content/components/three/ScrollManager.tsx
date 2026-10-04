"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { scrollState } from "@/lib/scroll-state";
import Croissant from "./models/Croissant";

/**
 * Drives the hero croissant group from the shared scrollState singleton (written by
 * GSAP ScrollTriggers on the DOM side) + cursor pointer, all with damped,
 * frame-rate-independent motion. Zero React re-renders per frame.
 */
export default function ScrollManager() {
  const croissantRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const s = scrollState;
    const narrow = state.viewport.width < 6.5;

    // Hero croissant: cursor parallax tilt, sinks out as you leave the hero
    const croissant = croissantRef.current;
    if (croissant) {
      croissant.position.x = THREE.MathUtils.damp(croissant.position.x, narrow ? 0 : 1.35, 3, delta);
      croissant.position.y = THREE.MathUtils.damp(croissant.position.y, THREE.MathUtils.lerp(0.15, -2.0, s.hero), 3, delta);
      croissant.rotation.y = THREE.MathUtils.damp(croissant.rotation.y, s.hero * Math.PI * 2 + state.pointer.x * 0.35, 3, delta);
      croissant.rotation.x = THREE.MathUtils.damp(croissant.rotation.x, state.pointer.y * 0.12, 3, delta);
      const ts = narrow ? 0.72 : 1.15;
      croissant.scale.setScalar(THREE.MathUtils.damp(croissant.scale.x, ts, 3, delta));
    }
  });

  return (
    <group ref={croissantRef} position={[1.35, 0.15, 0]} rotation={[0.12, 0.4, 0]} scale={1.15}>
      <Croissant />
    </group>
  );
}
