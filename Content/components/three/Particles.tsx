"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";

/** Soft, rising steam points (custom shader, additive blend). */
function Steam({ count = 36 }: { count?: number }) {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: { uTime: { value: 0 } },
        vertexShader: /* glsl */ `
          uniform float uTime;
          varying float vA;
          void main() {
            vec3 p = position;
            p.y += mod(uTime * 0.07 + position.y, 1.8);
            p.x += sin(uTime * 0.5 + position.x * 3.0) * 0.15;
            vA = 0.5 - length(p.xz) * 0.35;
            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            gl_PointSize = 60.0 * (1.0 / -mv.z);
            gl_Position = projectionMatrix * mv;
          }
        `,
        fragmentShader: /* glsl */ `
          varying float vA;
          void main() {
            vec2 c = gl_PointCoord - 0.5;
            float d = length(c);
            float alpha = smoothstep(0.5, 0.05, d) * vA * 0.35;
            gl_FragColor = vec4(vec3(1.0), alpha);
          }
        `,
      }),
    [],
  );

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 2.4;
      positions[i * 3 + 1] = Math.random() * 1.8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 1.2;
    }
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [count]);

  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return <points geometry={geometry} material={material} />;
}

/** Ambient flour dust + steam drifting around the hero models. */
export default function Particles() {
  return (
    <>
      <Sparkles count={70} scale={[7, 4, 3]} size={3} speed={0.3} opacity={0.35} color="#889681" position={[0, 0, -1]} />
      <Steam count={36} />
    </>
  );
}
