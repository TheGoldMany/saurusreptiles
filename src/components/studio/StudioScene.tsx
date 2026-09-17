"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  AdaptiveDpr,
  ContactShadows,
  Environment,
  Html,
  Lightformer,
  OrbitControls,
} from "@react-three/drei";
import { Bloom, EffectComposer, Noise, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import type { GlobalFurnitureConfig, Tier } from "@/lib/store/vivarium-store";
import { getFinish, getLighting } from "@/lib/studio/catalog";
import UnitMesh from "./UnitMesh";

const M = 0.01;

export type StudioPin = { id: string; title: string; text: string };

/** Lays the wall out in world space: tiers stack upward, units run left→right. */
export function layoutWall(tiers: Tier[]) {
  // Bottom tier sits on the floor; the array is top-first.
  const ordered = [...tiers].reverse();
  const tierHeights = ordered.map((t) => Math.max(...t.units.map((u) => u.height)) * M);
  const totalH = tierHeights.reduce((a, b) => a + b, 0);
  const maxW = Math.max(...tiers.map((t) => t.units.reduce((s, u) => s + u.width, 0))) * M;

  const placed: { unitId: string; origin: [number, number, number] }[] = [];
  let y = 0;

  ordered.forEach((tier, ti) => {
    const tierH = tierHeights[ti];
    const rowW = tier.units.reduce((s, u) => s + u.width, 0) * M;
    let x = -rowW / 2;
    for (const u of tier.units) {
      const w = u.width * M;
      const h = u.height * M;
      placed.push({
        unitId: u.id,
        // Units in a tier are bottom-aligned within the tier band.
        origin: [x + w / 2, y + h / 2, 0],
      });
      x += w;
    }
    y += tierH;
  });

  return { placed, totalH, maxW };
}

function CameraRig({ radius, reduced }: { radius: number; reduced: boolean }) {
  const target = useMemo(() => new THREE.Vector3(0, 0, 0), []);
  useFrame((state, delta) => {
    if (reduced) return;
    const t = state.clock.elapsedTime;
    const k = Math.min(1, delta * 1.4);
    const tx = Math.sin(t * 0.11) * radius * 0.06 + state.pointer.x * radius * 0.05;
    const ty = Math.sin(t * 0.09) * radius * 0.025 + state.pointer.y * radius * 0.04;
    state.camera.position.x += (tx - state.camera.position.x) * k;
    state.camera.position.y += (ty - state.camera.position.y) * k;
    state.camera.lookAt(target);
  });
  return null;
}

function Hotspot({
  pin,
  position,
  active,
  onToggle,
}: {
  pin: StudioPin;
  position: [number, number, number];
  active: boolean;
  onToggle: (id: string | null) => void;
}) {
  return (
    <Html position={position} center zIndexRange={[30, 0]}>
      <div className="relative">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggle(active ? null : pin.id);
          }}
          aria-label={pin.title}
          aria-expanded={active}
          className="relative flex h-7 w-7 items-center justify-center"
        >
          <span
            className={`absolute inline-flex h-7 w-7 rounded-full ${
              active ? "bg-[#e58a3c]/50" : "animate-ping bg-[#e58a3c]/30"
            }`}
          />
          <span
            className={`relative h-3.5 w-3.5 rounded-full border-2 border-white/90 shadow-lg transition-transform ${
              active ? "scale-125 bg-[#e58a3c]" : "bg-[#e58a3c]/90"
            }`}
          />
        </button>
        {active && (
          <div
            role="tooltip"
            className="glass-panel absolute left-1/2 top-9 w-60 -translate-x-1/2 rounded-2xl p-3.5 text-left"
          >
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#e58a3c]">
              {pin.title}
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-[#c9ced3]">{pin.text}</p>
          </div>
        )}
      </div>
    </Html>
  );
}

export default function StudioScene({
  tiers,
  furniture,
  quality,
  reduced,
  selectedUnitId,
  onSelectUnit,
  pins,
  activePin,
  onPinToggle,
  orbit,
}: {
  tiers: Tier[];
  furniture: GlobalFurnitureConfig;
  quality: "high" | "low";
  reduced: boolean;
  selectedUnitId: string | null;
  onSelectUnit: (id: string) => void;
  pins: StudioPin[];
  activePin: string | null;
  onPinToggle: (id: string | null) => void;
  orbit: boolean;
}) {
  const hq = quality === "high";
  const finish = getFinish(furniture.finish);
  const light = getLighting(furniture.lighting);

  const { placed, totalH, maxW } = useMemo(() => layoutWall(tiers), [tiers]);
  const units = useMemo(() => tiers.flatMap((t) => t.units), [tiers]);

  // Frame the whole wall, then recentre it vertically about the origin.
  const radius = Math.max(maxW, totalH) * 1.55 + 0.9;
  const yOffset = -totalH / 2;

  const keyRef = useRef<THREE.SpotLight>(null);
  const ambientRef = useRef<THREE.AmbientLight>(null);
  const fillRef = useRef<THREE.DirectionalLight>(null);

  const targets = useMemo(
    () => ({
      key: new THREE.Color(light.key),
      fill: new THREE.Color(light.fill),
      ambient: new THREE.Color(light.ambient),
    }),
    [light.key, light.fill, light.ambient]
  );

  useFrame((_, delta) => {
    const k = Math.min(1, delta * 2.6);
    if (keyRef.current) {
      keyRef.current.color.lerp(targets.key, k);
      keyRef.current.intensity += (light.keyIntensity * 3.4 - keyRef.current.intensity) * k;
    }
    if (fillRef.current) {
      fillRef.current.color.lerp(targets.fill, k);
      fillRef.current.intensity += (light.ambientIntensity * 1.5 - fillRef.current.intensity) * k;
    }
    if (ambientRef.current) {
      ambientRef.current.color.lerp(targets.ambient, k);
      ambientRef.current.intensity += (light.ambientIntensity - ambientRef.current.intensity) * k;
    }
  });

  // Anchor the pins to the currently selected unit (or the first one).
  const anchor =
    placed.find((p) => p.unitId === (selectedUnitId ?? units[0]?.id)) ?? placed[0];
  const anchorUnit = units.find((u) => u.id === anchor?.unitId) ?? units[0];

  const pinPositions: [number, number, number][] = anchorUnit && anchor
    ? [
        [anchor.origin[0] - (anchorUnit.width * M) / 2, anchor.origin[1] + yOffset, (anchorUnit.depth * M) / 2],
        [anchor.origin[0], anchor.origin[1] + yOffset + (anchorUnit.height * M) / 2 - 0.05, (anchorUnit.depth * M) / 4],
        [anchor.origin[0] + (anchorUnit.width * M) / 4, anchor.origin[1] + yOffset - (anchorUnit.height * M) / 2 + 0.06, (anchorUnit.depth * M) / 2],
      ]
    : [];

  return (
    <>
      {!orbit && <CameraRig radius={radius} reduced={reduced} />}
      {orbit && (
        <OrbitControls
          makeDefault
          enablePan={false}
          minDistance={radius * 0.45}
          maxDistance={radius * 2}
          maxPolarAngle={Math.PI / 1.9}
          target={[0, 0, 0]}
        />
      )}

      <ambientLight ref={ambientRef} intensity={0.6} />
      <spotLight
        ref={keyRef}
        position={[maxW * 0.4, totalH * 0.75, 1.8]}
        angle={0.7}
        penumbra={1}
        decay={1.3}
        distance={16}
        intensity={6}
        castShadow={hq}
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0015}
      />
      <directionalLight ref={fillRef} position={[-maxW, totalH, 3]} intensity={0.9} />

      {/* Static lightformers for reflections; rendered once (frames=1). */}
      <Environment resolution={128}>
        <Lightformer form="rect" intensity={1.5} color="#ffffff" scale={[8, 4]} position={[0, 5, 3]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={0.7} color="#9fc6e0" scale={[5, 5]} position={[-6, 1, 3]} target={[0, 0, 0]} />
        <Lightformer form="circle" intensity={0.9} color="#e8c9a0" scale={[4, 4]} position={[5, 2, 4]} target={[0, 0, 0]} />
      </Environment>

      <group position={[0, yOffset, 0]}>
        {placed.map((p) => {
          const unit = units.find((u) => u.id === p.unitId);
          if (!unit) return null;
          return (
            <UnitMesh
              key={unit.id}
              unit={unit}
              finish={finish}
              origin={p.origin}
              selected={selectedUnitId === unit.id}
              quality={quality}
              reduced={reduced}
              onSelect={() => onSelectUnit(unit.id)}
            />
          );
        })}
      </group>

      {pins.map((pin, i) =>
        pinPositions[i] ? (
          <Hotspot
            key={pin.id}
            pin={pin}
            position={pinPositions[i]}
            active={activePin === pin.id}
            onToggle={onPinToggle}
          />
        ) : null
      )}

      <ContactShadows
        position={[0, yOffset - 0.005, 0]}
        opacity={0.6}
        scale={Math.max(maxW, 2) * 2.6}
        blur={2.6}
        far={2.5}
        resolution={hq ? 512 : 256}
        color="#000000"
        frames={reduced ? 1 : Infinity}
      />

      {hq && (
        <EffectComposer multisampling={0}>
          <Bloom intensity={0.38} luminanceThreshold={0.65} luminanceSmoothing={0.35} mipmapBlur />
          <Noise premultiply opacity={0.14} blendFunction={BlendFunction.OVERLAY} />
          <Vignette offset={0.3} darkness={0.75} eskil={false} />
        </EffectComposer>
      )}

      <AdaptiveDpr pixelated />
    </>
  );
}
