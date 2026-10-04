"use client";

import * as THREE from "three";

/**
 * Centers a loaded GLTF on its bounding box and scales it to a target height,
 * resting the base on y=0. Mutates gltf.scene in place.
 */
export function normalizeModel(scene: THREE.Object3D, targetHeight = 1.6): void {
  const box = new THREE.Box3().setFromObject(scene);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  box.getSize(size);
  box.getCenter(center);
  if (size.y < 1e-5) return;
  const s = targetHeight / size.y;
  scene.scale.setScalar(s);
  // re-center horizontally and sit the base on y=0
  scene.position.x -= center.x * s;
  scene.position.z -= center.z * s;
  scene.position.y -= center.y * s;
}

/**
 * Deep-clones a loaded GLTF scene so mutations (normalization, material
 * swaps) never leak into drei's shared per-URL cache. Mesh geometry stays
 * shared (read-only); materials are cloned per-mesh (array-aware).
 */
export function cloneSceneWithMaterials(scene: THREE.Object3D): THREE.Object3D {
  const clone = scene.clone(true);
  clone.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh) return;
    if (Array.isArray(mesh.material)) mesh.material = mesh.material.map((m) => m.clone());
    else if (mesh.material) mesh.material = mesh.material.clone();
  });
  return clone;
}

/**
 * Upgrades flat-colour baked-good materials (no texture map) to
 * MeshPhysicalMaterial with a soft clearcoat + sheen, so they read as
 * appetizing baked goods instead of flat plastic. Textured materials are left
 * untouched. Returns a map of original material name → material instance.
 */
export function enhanceBakedMaterials(scene: THREE.Object3D): Map<string, THREE.MeshPhysicalMaterial> {
  const byName = new Map<string, THREE.MeshPhysicalMaterial>();
  scene.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh) return;
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    for (const mat of mats) {
      const standard = mat as THREE.MeshStandardMaterial;
      if (standard.map || standard.emissive?.getHex() !== 0) continue; // textured or emissive → keep
      let phys = byName.get(mat.name) as THREE.MeshPhysicalMaterial | undefined;
      if (!phys) {
        phys = new THREE.MeshPhysicalMaterial();
        phys.name = mat.name;
        phys.color.copy(standard.color);
        phys.roughness = standard.roughness;
        phys.metalness = standard.metalness;
        if (standard.normalMap) phys.normalMap = standard.normalMap;
        const lum = 0.2126 * standard.color.r + 0.7152 * standard.color.g + 0.0722 * standard.color.b;
        if (lum > 0.8) {
          // cream / white frosting
          phys.clearcoat = 0.55;
          phys.clearcoatRoughness = 0.35;
          phys.sheen = 0.45;
          phys.sheenColor.set("#fff6e8");
        } else {
          // baked crust tones
          phys.sheen = 0.35;
          phys.sheenRoughness = 0.6;
          phys.clearcoat = 0.18;
          phys.clearcoatRoughness = 0.5;
        }
        byName.set(mat.name, phys);
      }
      if (Array.isArray(mesh.material)) {
        const i = mesh.material.indexOf(mat);
        mesh.material[i] = phys;
      } else {
        mesh.material = phys;
      }
    }
  });
  return byName;
}

/** Points every mesh using `fromName` at `toMat` (unifies same-role materials). */
export function mergeMaterialByName(scene: THREE.Object3D, fromName: string, toMat: THREE.Material): void {
  scene.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh) return;
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    const next = mats.map((m) => (m.name === fromName ? toMat : m));
    if (Array.isArray(mesh.material)) mesh.material = next;
    else mesh.material = next[0];
  });
}
