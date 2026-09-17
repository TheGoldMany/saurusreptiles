"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";
import type { EnclosureUnit } from "@/lib/store/vivarium-store";
import { getBiome, type FinishSpec } from "@/lib/studio/catalog";
import { getSpecies } from "@/lib/data/species-database";
import { makeWoodGrainTexture, makeRockTexture, mulberry32 } from "@/components/cinematic/textures";
import WaterSurface from "./WaterSurface";

/** cm → world metres */
const M = 0.01;

type Slab = { x: number; y: number; z: number; w: number; h: number; d: number; rot: number; tone: 0 | 1 | 2 };
type Branch = { x: number; y: number; z: number; len: number; r: number; rx: number; rz: number };

export default function UnitMesh({
  unit,
  finish,
  origin,
  selected,
  quality,
  reduced,
  onSelect,
}: {
  unit: EnclosureUnit;
  finish: FinishSpec;
  /** world-space centre of this unit */
  origin: [number, number, number];
  selected: boolean;
  quality: "high" | "low";
  reduced: boolean;
  onSelect: () => void;
}) {
  const hq = quality === "high";
  const W = unit.width * M;
  const H = unit.height * M;
  const D = unit.depth * M;
  const t = 0.01; // 10 mm PVC core
  const veneer = 0.005; // 5 mm hardwood skin
  const shell = t + veneer;

  const biome = getBiome(unit.custom.biome);
  const species = getSpecies(unit.custom.speciesId);
  const bedCm = species?.behaviours.includes("digging") ? 25 : 12;
  const bedH = Math.min(bedCm * M, H * 0.45);

  const grain = useMemo(() => (hq ? makeWoodGrainTexture() : null), [hq]);
  const rockMap = useMemo(() => (hq ? makeRockTexture() : null), [hq]);

  // ---- Materials -----------------------------------------------------------
  const woodMat = useMemo(() => {
    const m = new THREE.MeshStandardMaterial({
      color: new THREE.Color(finish.base),
      roughness: finish.roughness,
      metalness: 0.05,
      map: grain,
    });
    if (m.map) m.map.repeat.set(2, 1);
    return m;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grain]);

  const pvcMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: new THREE.Color("#e8e8e6"), roughness: 0.85 }),
    []
  );

  const rockMats = useMemo(
    () =>
      [biome.rockDark, biome.rockMid, biome.rockLight].map(
        (c) =>
          new THREE.MeshStandardMaterial({
            color: new THREE.Color(c),
            roughness: 0.96,
            flatShading: true,
            roughnessMap: rockMap,
          })
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rockMap]
  );

  const substrateMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: new THREE.Color(biome.substrateColor), roughness: 1 }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const woodBranchMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: new THREE.Color("#5a4632"), roughness: 0.95, flatShading: true }),
    []
  );

  const mossMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(biome.moss ?? "#4d7c0f"),
        roughness: 1,
        transparent: true,
        opacity: biome.moss ? 1 : 0,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // Ease materials toward the selected finish / biome instead of snapping.
  const targets = useMemo(
    () => ({
      wood: new THREE.Color(finish.base),
      rocks: [
        new THREE.Color(biome.rockDark),
        new THREE.Color(biome.rockMid),
        new THREE.Color(biome.rockLight),
      ],
      substrate: new THREE.Color(biome.substrateColor),
      moss: new THREE.Color(biome.moss ?? "#4d7c0f"),
    }),
    [finish.base, biome.rockDark, biome.rockMid, biome.rockLight, biome.substrateColor, biome.moss]
  );

  useFrame((_, delta) => {
    const k = Math.min(1, delta * 3);
    woodMat.color.lerp(targets.wood, k);
    woodMat.roughness += (finish.roughness - woodMat.roughness) * k;
    rockMats.forEach((m, i) => m.color.lerp(targets.rocks[i], k));
    substrateMat.color.lerp(targets.substrate, k);
    mossMat.color.lerp(targets.moss, k);
    mossMat.opacity += ((biome.moss ? 1 : 0) - mossMat.opacity) * k;
  });

  // ---- Hand-chiselled stacked slate --------------------------------------
  const slabs = useMemo<Slab[]>(() => {
    const rand = mulberry32(unit.id.length * 977 + 41);
    const out: Slab[] = [];
    const rows = hq ? 11 : 6;
    const innerW = W - shell * 2;
    const innerH = H - shell * 2;
    const rowH = innerH / rows;

    for (let row = 0; row < rows; row++) {
      const y = -innerH / 2 + rowH * (row + 0.5);
      let x = -innerW / 2;
      while (x < innerW / 2) {
        const w = innerW * (0.11 + rand() * 0.2);
        const clamped = Math.min(w, innerW / 2 - x);
        if (clamped <= 0.01) break;
        out.push({
          x: x + clamped / 2,
          y: y + (rand() - 0.5) * rowH * 0.3,
          z: rand() * D * 0.14,
          w: clamped * 0.97,
          h: rowH * (0.68 + rand() * 0.44),
          d: D * (0.05 + rand() * 0.1),
          rot: (rand() - 0.5) * 0.08,
          tone: (rand() < 0.42 ? 0 : rand() < 0.75 ? 1 : 2) as 0 | 1 | 2,
        });
        x += clamped;
      }
    }
    return out;
  }, [W, H, D, hq, shell, unit.id]);

  /** Gnarled cantilever branches, denser for climbers. */
  const branches = useMemo<Branch[]>(() => {
    const rand = mulberry32(unit.id.length * 313 + 7);
    const climbing = species?.behaviours.includes("climbing") ?? false;
    const n = climbing ? (hq ? 5 : 3) : hq ? 2 : 1;
    return Array.from({ length: n }, () => ({
      x: (rand() - 0.5) * (W - shell * 4),
      y: -H / 2 + bedH + (0.15 + rand() * 0.6) * (H - bedH - shell * 2),
      z: -D * 0.1 + rand() * D * 0.3,
      len: (0.35 + rand() * 0.45) * W,
      r: 0.008 + rand() * 0.008,
      rx: (rand() - 0.5) * 0.5,
      rz: (rand() - 0.5) * 1.1,
    }));
  }, [W, H, D, bedH, hq, shell, species, unit.id]);

  const water = unit.custom.water;
  const hasWater = water !== "none";
  const waterY = -H / 2 + shell + (water === "built_in_acrylic_paludarium" ? H * 0.22 : bedH * 0.75);

  const groupRef = useRef<THREE.Group>(null);

  return (
    <group ref={groupRef} position={origin} onClick={(e) => { e.stopPropagation(); onSelect(); }}>
      {/* ---------- Cabinet carcass: PVC core with a veneer skin ---------- */}
      {/* back */}
      <mesh position={[0, 0, -D / 2 + shell / 2]} castShadow={hq} receiveShadow={hq}>
        <boxGeometry args={[W, H, shell]} />
        <primitive object={woodMat} attach="material" />
      </mesh>
      {/* top / canopy fascia (80 mm glare shield) */}
      <mesh position={[0, H / 2 - shell / 2, 0]} castShadow={hq}>
        <boxGeometry args={[W, shell, D]} />
        <primitive object={woodMat} attach="material" />
      </mesh>
      <mesh position={[0, H / 2 - 0.045, D / 2 - 0.004]}>
        <boxGeometry args={[W - shell * 2, 0.08, 0.008]} />
        <primitive object={woodMat} attach="material" />
      </mesh>
      {/* floor */}
      <mesh position={[0, -H / 2 + shell / 2, 0]} castShadow={hq} receiveShadow={hq}>
        <boxGeometry args={[W, shell, D]} />
        <primitive object={woodMat} attach="material" />
      </mesh>
      {/* sides */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[(s * (W - shell)) / 2, 0, 0]} castShadow={hq}>
          <boxGeometry args={[shell, H, D]} />
          <primitive object={woodMat} attach="material" />
        </mesh>
      ))}

      {/* Exposed PVC core edge on the left stile — shows the 10 mm inner box */}
      <mesh position={[-W / 2 + veneer + t / 2, 0, D / 2 - 0.001]}>
        <boxGeometry args={[t, H - shell * 2, 0.002]} />
        <primitive object={pvcMat} attach="material" />
      </mesh>

      {/* ---------- Interior rockscape ---------- */}
      <group position={[0, 0, -D / 2 + shell]}>
        {slabs.map((s, i) => (
          <mesh
            key={i}
            position={[s.x, s.y, s.z]}
            rotation={[0, 0, s.rot]}
            castShadow={hq}
            receiveShadow={hq}
          >
            <boxGeometry args={[s.w, s.h, s.d]} />
            <primitive object={rockMats[s.tone]} attach="material" />
          </mesh>
        ))}
      </group>

      {/* moss accents — faded out unless the biome carries moss */}
      {[0, 1, 2].map((i) => (
        <mesh
          key={i}
          position={[(i - 1) * W * 0.28, -H * 0.1 + i * H * 0.16, -D * 0.2]}
          scale={[W * 0.1, H * 0.03, D * 0.06]}
        >
          <sphereGeometry args={[1, 10, 8]} />
          <primitive object={mossMat} attach="material" />
        </mesh>
      ))}

      {/* ---------- Substrate bed ---------- */}
      <mesh position={[0, -H / 2 + shell + bedH / 2, 0]} receiveShadow={hq}>
        <boxGeometry args={[W - shell * 2, bedH, D - shell * 2]} />
        <primitive object={substrateMat} attach="material" />
      </mesh>

      {/* ---------- Water module ---------- */}
      {hasWater && (
        <WaterSurface
          width={(W - shell * 2) * (water === "built_in_acrylic_paludarium" ? 0.98 : 0.42)}
          depth={(D - shell * 2) * (water === "built_in_acrylic_paludarium" ? 0.98 : 0.5)}
          y={waterY}
          tint={unit.custom.biome === "mangrove_estuary" ? "#3d5c3a" : "#2e6f7a"}
          reduced={reduced}
        />
      )}

      {/* ---------- Driftwood cantilever branches ---------- */}
      {branches.map((b, i) => (
        <mesh
          key={i}
          position={[b.x, b.y, b.z]}
          rotation={[b.rx, 0, Math.PI / 2 + b.rz]}
          castShadow={hq}
        >
          <cylinderGeometry args={[b.r * 0.7, b.r, b.len, 6]} />
          <primitive object={woodBranchMat} attach="material" />
        </mesh>
      ))}

      {/* ---------- Arcadia ProT5 fixture under the canopy ---------- */}
      {/* Cylinders extrude along Y, so the tube is rotated to run across the
          width of the enclosure rather than standing on end. */}
      <mesh
        position={[0, H / 2 - shell - 0.02, -D * 0.1]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <cylinderGeometry args={[0.008, 0.008, (W - shell * 2) * 0.86, 8]} />
        <meshStandardMaterial
          color="#f2f6ff"
          emissive="#dce9ff"
          emissiveIntensity={unit.custom.speciesId ? 1.2 : 0.4}
          roughness={0.3}
        />
      </mesh>
      {/* reflector housing */}
      <mesh position={[0, H / 2 - shell - 0.008, -D * 0.1]}>
        <boxGeometry args={[(W - shell * 2) * 0.9, 0.012, 0.05]} />
        <meshStandardMaterial color="#b9bec4" metalness={0.7} roughness={0.35} />
      </mesh>
      {/* ceramic basking spot, offset to one end */}
      <mesh position={[W * 0.28, H / 2 - shell - 0.03, D * 0.05]}>
        <cylinderGeometry args={[0.028, 0.034, 0.045, 12]} />
        <meshStandardMaterial color="#d9d4cc" roughness={0.6} />
      </mesh>

      {/* ---------- Front glass: two sliding panes in an aluminium track ---------- */}
      {hq ? (
        <mesh position={[0, 0, D / 2 - 0.006]}>
          <boxGeometry args={[W - shell * 2, H - shell * 2 - 0.09, 0.004]} />
          <MeshTransmissionMaterial
            transmission={0.95}
            thickness={0.004}
            roughness={0.05}
            ior={1.52}
            chromaticAberration={0.02}
            anisotropicBlur={0.1}
            distortion={0}
            samples={4}
            resolution={256}
            transmissionSampler
            attenuationColor="#dff1fb"
            attenuationDistance={2}
          />
        </mesh>
      ) : (
        <mesh position={[0, 0, D / 2 - 0.006]}>
          <boxGeometry args={[W - shell * 2, H - shell * 2 - 0.09, 0.004]} />
          <meshPhysicalMaterial
            color="#dff1fb"
            transparent
            opacity={0.12}
            roughness={0.06}
            metalness={0}
            envMapIntensity={1.4}
          />
        </mesh>
      )}
      {/* aluminium sliding tracks, top and bottom */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[0, (s * (H - shell * 2 - 0.09)) / 2, D / 2 - 0.006]}>
          <boxGeometry args={[W - shell * 2, 0.012, 0.016]} />
          <meshStandardMaterial color="#9aa1a8" metalness={0.85} roughness={0.28} />
        </mesh>
      ))}
      {/* glass seam where the two panes overlap */}
      <mesh position={[0, 0, D / 2 - 0.004]}>
        <boxGeometry args={[0.003, H - shell * 2 - 0.09, 0.004]} />
        <meshStandardMaterial color="#cfd6dc" metalness={0.5} roughness={0.3} />
      </mesh>

      {/* Selection indicator — a thin frame around the opening, not a filled
          panel, so it never veils the interior it is highlighting. */}
      {selected && (
        <group position={[0, 0, D / 2 + 0.004]}>
          {([
            [0, H / 2, W + 0.01, 0.006],
            [0, -H / 2, W + 0.01, 0.006],
            [-W / 2, 0, 0.006, H + 0.01],
            [W / 2, 0, 0.006, H + 0.01],
          ] as const).map(([x, y, bw, bh], i) => (
            <mesh key={i} position={[x, y, 0]}>
              <planeGeometry args={[bw, bh]} />
              <meshBasicMaterial color="#e58a3c" transparent opacity={0.95} />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
}
