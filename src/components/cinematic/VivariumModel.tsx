"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Scape, Tier, Wood } from "@/components/configurator/options";
import { makeRockTexture, makeWoodGrainTexture, mulberry32 } from "./textures";

/** Shared unit-cube geometry — every panel is a scaled instance of this. */
function useUnitBox() {
  return useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
}

/**
 * A box whose position and scale ease toward their targets. Because the
 * geometry stays a unit cube and only the transform animates, switching
 * between a 120 cm desert build and a 200 cm furniture wall morphs smoothly
 * instead of popping a new mesh into place.
 */
function AnimatedBox({
  px,
  py,
  pz,
  sx,
  sy,
  sz,
  geometry,
  material,
  castShadow,
  receiveShadow,
}: {
  px: number;
  py: number;
  pz: number;
  sx: number;
  sy: number;
  sz: number;
  geometry: THREE.BufferGeometry;
  material: THREE.Material;
  castShadow?: boolean;
  receiveShadow?: boolean;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    const m = ref.current;
    if (!m) return;
    const k = Math.min(1, delta * 4);
    m.position.x += (px - m.position.x) * k;
    m.position.y += (py - m.position.y) * k;
    m.position.z += (pz - m.position.z) * k;
    m.scale.x += (sx - m.scale.x) * k;
    m.scale.y += (sy - m.scale.y) * k;
    m.scale.z += (sz - m.scale.z) * k;
  });

  return (
    <mesh
      ref={ref}
      geometry={geometry}
      material={material}
      position={[px, py, pz]}
      scale={[sx, sy, sz]}
      castShadow={castShadow}
      receiveShadow={receiveShadow}
    />
  );
}

type Slab = {
  x: number;
  y: number;
  z: number;
  w: number;
  h: number;
  d: number;
  rot: number;
  tone: 0 | 1 | 2;
};

export default function VivariumModel({
  tier,
  wood,
  scape,
  quality,
}: {
  tier: Tier;
  wood: Wood;
  scape: Scape;
  quality: "high" | "low";
}) {
  const unit = useUnitBox();
  const hq = quality === "high";

  // cm → metres
  const W = tier.dims[0] / 100;
  const D = tier.dims[1] / 100;
  const H = tier.dims[2] / 100;
  const t = 0.058; // rail thickness — thick enough to read as cabinetry
  const substrateH = (tier.substrateDepth / 100) * 0.9;

  const grain = useMemo(() => makeWoodGrainTexture(), []);
  const rockMap = useMemo(() => makeRockTexture(), []);

  // ---- Materials (created once, colours lerped every frame) ----
  const woodMat = useMemo(() => {
    const m = new THREE.MeshStandardMaterial({
      color: new THREE.Color(wood.base),
      roughness: wood.roughness,
      metalness: 0.04,
      map: hq ? grain : null,
    });
    if (hq && m.map) m.map.repeat.set(2, 2);
    return m;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grain, hq]);

  const rockMats = useMemo(
    () =>
      ([scape.rockDark, scape.rockMid, scape.rockLight] as const).map(
        (c) =>
          new THREE.MeshStandardMaterial({
            color: new THREE.Color(c),
            roughness: 0.96,
            metalness: 0,
            flatShading: true,
            roughnessMap: hq ? rockMap : null,
          })
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rockMap, hq]
  );

  const substrateMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(scape.substrate),
        roughness: 1,
        metalness: 0,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const mossMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(scape.moss ?? "#4d7c0f"),
        roughness: 1,
        transparent: true,
        opacity: scape.moss ? 1 : 0,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const glassMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#dff1fb"),
        transparent: true,
        // Just enough to read as glass — any more and it veils the rockscape.
        opacity: 0.055,
        roughness: 0.04,
        metalness: 0,
        envMapIntensity: 1.5,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    []
  );

  // Ease every material toward the currently selected finish.
  const targets = useMemo(
    () => ({
      wood: new THREE.Color(wood.base),
      rocks: [
        new THREE.Color(scape.rockDark),
        new THREE.Color(scape.rockMid),
        new THREE.Color(scape.rockLight),
      ],
      substrate: new THREE.Color(scape.substrate),
      moss: new THREE.Color(scape.moss ?? "#4d7c0f"),
    }),
    [wood.base, scape.rockDark, scape.rockMid, scape.rockLight, scape.substrate, scape.moss]
  );

  useFrame((_, delta) => {
    const k = Math.min(1, delta * 3);
    woodMat.color.lerp(targets.wood, k);
    woodMat.roughness += (wood.roughness - woodMat.roughness) * k;
    rockMats.forEach((m, i) => m.color.lerp(targets.rocks[i], k));
    substrateMat.color.lerp(targets.substrate, k);
    mossMat.color.lerp(targets.moss, k);
    mossMat.opacity += ((scape.moss ? 1 : 0) - mossMat.opacity) * k;
  });

  // ---- Hand-carved stacked-slate back wall ----
  // Positions are generated from a fixed seed so the rockscape is stable:
  // changing the palette re-tints the same carved wall rather than
  // reshuffling it into a different rock formation.
  const slabs = useMemo<Slab[]>(() => {
    const rand = mulberry32(4821);
    const out: Slab[] = [];
    const rows = hq ? 13 : 8;
    const innerW = W - t * 2;
    const innerH = H - t * 2;
    const rowH = innerH / rows;

    for (let r = 0; r < rows; r++) {
      const y = -innerH / 2 + rowH * (r + 0.5);
      let x = -innerW / 2;
      while (x < innerW / 2) {
        const w = innerW * (0.1 + rand() * 0.2);
        const clamped = Math.min(w, innerW / 2 - x);
        if (clamped <= 0.01) break;
        out.push({
          x: x + clamped / 2,
          y: y + (rand() - 0.5) * rowH * 0.25,
          z: rand() * D * 0.16,
          w: clamped * 0.97,
          h: rowH * (0.7 + rand() * 0.42),
          d: D * (0.06 + rand() * 0.12),
          rot: (rand() - 0.5) * 0.07,
          tone: (rand() < 0.42 ? 0 : rand() < 0.75 ? 1 : 2) as 0 | 1 | 2,
        });
        x += clamped;
      }
    }
    return out;
  }, [W, H, D, hq, t]);

  const mossPatches = useMemo(() => {
    const rand = mulberry32(991);
    return Array.from({ length: hq ? 7 : 4 }, () => ({
      x: (rand() - 0.5) * (W - t * 4),
      y: (rand() - 0.5) * (H - t * 4) * 0.7,
      z: -D * 0.18 + rand() * D * 0.2,
      s: 0.05 + rand() * 0.09,
    }));
  }, [W, H, D, hq, t]);

  const isApex = tier.id === "apex";
  const backZ = -D / 2 + t;

  return (
    <group>
      {/* ---------- Hardwood cabinet ---------- */}
      {/* top rail / hidden canopy */}
      <AnimatedBox
        px={0} py={H / 2 - t / 2} pz={0}
        sx={W} sy={t} sz={D}
        geometry={unit} material={woodMat} castShadow={hq}
      />
      {/* plinth */}
      <AnimatedBox
        px={0} py={-H / 2 + t * 0.8} pz={0}
        sx={W} sy={t * 1.6} sz={D}
        geometry={unit} material={woodMat} castShadow={hq} receiveShadow={hq}
      />
      {/* left / right stiles */}
      <AnimatedBox
        px={-W / 2 + t / 2} py={0} pz={0}
        sx={t} sy={H} sz={D}
        geometry={unit} material={woodMat} castShadow={hq}
      />
      <AnimatedBox
        px={W / 2 - t / 2} py={0} pz={0}
        sx={t} sy={H} sz={D}
        geometry={unit} material={woodMat} castShadow={hq}
      />
      {/* back panel */}
      <AnimatedBox
        px={0} py={0} pz={-D / 2 + t * 0.3}
        sx={W} sy={H} sz={t * 0.6}
        geometry={unit} material={woodMat}
      />

      {/* Apex only: the horizontal divider between the tegu base and the
          twin agamid modules above, plus the vertical split up top.
          Collapsed to near-zero scale on other tiers so it eases away. */}
      <AnimatedBox
        px={0} py={isApex ? -H * 0.06 : 0} pz={0}
        sx={isApex ? W : 0.001} sy={isApex ? t : 0.001} sz={isApex ? D : 0.001}
        geometry={unit} material={woodMat}
      />
      <AnimatedBox
        px={0} py={isApex ? H * 0.28 : 0} pz={0}
        sx={isApex ? t : 0.001} sy={isApex ? H * 0.62 : 0.001} sz={isApex ? D : 0.001}
        geometry={unit} material={woodMat}
      />

      {/* ---------- Hand-carved rockscape ---------- */}
      <group position={[0, 0, backZ]}>
        {slabs.map((s, i) => (
          <mesh
            key={i}
            geometry={unit}
            material={rockMats[s.tone]}
            position={[s.x, s.y, s.z]}
            scale={[s.w, s.h, s.d]}
            rotation={[0, 0, s.rot]}
            castShadow={hq}
            receiveShadow={hq}
          />
        ))}
      </group>

      {/* moss accents — faded out entirely unless the scape carries moss */}
      {mossPatches.map((m, i) => (
        <mesh
          key={i}
          material={mossMat}
          position={[m.x, m.y, backZ + D * 0.2 + m.z]}
          scale={[m.s * 1.8, m.s * 0.5, m.s]}
        >
          <sphereGeometry args={[1, 10, 8]} />
        </mesh>
      ))}

      {/* ---------- Bioactive substrate bed ---------- */}
      <AnimatedBox
        px={0}
        py={-H / 2 + t * 1.6 + substrateH / 2}
        pz={0}
        sx={W - t * 2}
        sy={substrateH}
        sz={D - t * 2}
        geometry={unit}
        material={substrateMat}
        receiveShadow={hq}
      />

      {/* ---------- Front glass ---------- */}
      <AnimatedBox
        px={0} py={0} pz={D / 2 - t * 0.35}
        sx={W - t * 2} sy={H - t * 2} sz={0.006}
        geometry={unit} material={glassMat}
      />
    </group>
  );
}
