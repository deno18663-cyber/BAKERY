"use client";

import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { cloneSceneWithMaterials, normalizeModel } from "@/lib/gltf";
import type { ModelProps } from "./types";

const FILE = "/models/croissant.glb";

/**
 * The Sketchfab croissant renders black + dull because its baked occlusion
 * darkens crevices and its roughness map is near-1. This upgrades the material
 * to MeshPhysicalMaterial with a warm-golden brighten, softened occlusion,
 * lower roughness, and a fresh clearcoat/sheen so it reads as a golden,
 * freshly-baked croissant.
 */
function brightenCroissant(scene: THREE.Object3D): void {
  scene.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh) return;
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    for (const mat of mats) {
      const std = mat as THREE.MeshStandardMaterial;
      if (!std.map) continue; // only the textured croissant

      const phys = new THREE.MeshPhysicalMaterial();
      phys.name = std.name;
      phys.map = std.map;
      phys.normalMap = std.normalMap;
      phys.normalScale.copy(std.normalScale);
      phys.aoMap = std.aoMap;
      phys.aoMapIntensity = 0.5; // soften baked crevices so it isn't pitch black
      phys.roughnessMap = std.roughnessMap;
      phys.metalnessMap = std.metalnessMap;
      phys.color.setRGB(1.3, 1.15, 0.95); // warm golden brighten
      phys.roughness = 0.45; // fresh sheen instead of dull matte
      phys.metalness = 0;
      phys.clearcoat = 0.35;
      phys.clearcoatRoughness = 0.5;
      phys.sheen = 0.4;
      phys.sheenColor.set("#fff2dc");
      phys.sheenRoughness = 0.6;
      phys.envMapIntensity = 1.25; // catch the lightformers' highlights

      if (Array.isArray(mesh.material)) {
        mesh.material = mesh.material.map((m) => (m === mat ? phys : m));
      } else {
        mesh.material = phys;
      }
      std.dispose();
    }
  });
}

/**
 * Hero croissant — the user's high-detail Sketchfab croissant (Downloads),
 * brightened + freshened on load, normalized to a consistent height.
 */
export default function Croissant({ position, rotation, scale }: ModelProps) {
  const { scene } = useGLTF(FILE);

  const clone = useMemo(() => {
    const c = cloneSceneWithMaterials(scene);
    normalizeModel(c, 1.0);
    brightenCroissant(c);
    return c;
  }, [scene]);

  useEffect(() => {
    return () => {
      clone.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (mesh.isMesh) {
          if (Array.isArray(mesh.material)) mesh.material.forEach((m) => m.dispose());
          else mesh.material?.dispose();
        }
      });
    };
  }, [clone]);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <primitive object={clone} />
    </group>
  );
}
