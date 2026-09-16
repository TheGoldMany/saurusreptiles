"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  AdaptiveDpr,
  ContactShadows,
  Environment,
  Html,
  Lightformer,
} from "@react-three/drei";
import {
  Bloom,
  ChromaticAberration,
  EffectComposer,
  Noise,
  Vignette,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import type { Lighting, Scape, Tier, Wood } from "@/components/configurator/options";
import VivariumModel from "./VivariumModel";
import LightingRig from "./LightingRig";

export type Pin = {
  id: string;
  title: string;
  text: string;
  /** normalized position within the enclosure, -0.5..0.5 per axis */
  u: number;
  v: number;
  w: number;
};

/**
 * Cinematic camera: eases to a framing that fits the current enclosure, then
 * drifts on a slow sine while leaning gently toward the pointer.
 */
function CameraRig({ radius, reduced }: { radius: number; reduced: boolean }) {
  const target = useMemo(() => new THREE.Vector3(0, 0, 0), []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const drift = reduced ? 0 : 1;
    const px = state.pointer.x;
    const py = state.pointer.y;

    // Gentle enough to read as a slow cinematic drift without skewing the
    // piece into an odd oblique for anyone who glances at a single frame.
    const tx = Math.sin(t * 0.13) * radius * 0.09 * drift + px * radius * 0.08;
    const ty = radius * 0.04 + Math.sin(t * 0.1) * radius * 0.03 * drift + py * radius * 0.06;
    const tz = radius;

    const k = Math.min(1, delta * 1.7);
    state.camera.position.x += (tx - state.camera.position.x) * k;
    state.camera.position.y += (ty - state.camera.position.y) * k;
    state.camera.position.z += (tz - state.camera.position.z) * k;
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
  pin: Pin;
  position: [number, number, number];
  active: boolean;
  onToggle: (id: string | null) => void;
}) {
  return (
    <Html position={position} center zIndexRange={[30, 0]}>
      <div className="relative">
        <button
          type="button"
          onClick={() => onToggle(active ? null : pin.id)}
          aria-label={pin.title}
          aria-expanded={active}
          className="group relative flex h-7 w-7 items-center justify-center"
        >
          <span
            className={`absolute inline-flex h-7 w-7 rounded-full transition-colors ${
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
            className="glass-panel absolute left-1/2 top-9 w-56 -translate-x-1/2 rounded-2xl p-3.5 text-left"
            style={{ animation: "fadeIn 0.22s ease" }}
          >
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#e58a3c]">
              {pin.title}
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-[#c9ced3]">
              {pin.text}
            </p>
          </div>
        )}
      </div>
    </Html>
  );
}

export default function VivariumScene({
  tier,
  wood,
  scape,
  lighting,
  quality,
  pins,
  activePin,
  onPinToggle,
  reduced,
}: {
  tier: Tier;
  wood: Wood;
  scape: Scape;
  lighting: Lighting;
  quality: "high" | "low";
  pins: Pin[];
  activePin: string | null;
  onPinToggle: (id: string | null) => void;
  reduced: boolean;
}) {
  const hq = quality === "high";
  const groupRef = useRef<THREE.Group>(null);

  const W = tier.dims[0] / 100;
  const D = tier.dims[1] / 100;
  const H = tier.dims[2] / 100;

  // Frame the piece: distance grows with whichever dimension dominates, so a
  // 120 cm desert build and a 200 cm furniture wall both fill the viewport.
  const radius = Math.max(W, H) * 1.5 + D * 0.7;

  const aberration = useMemo(() => new THREE.Vector2(0.0006, 0.0004), []);

  return (
    <>
      <CameraRig radius={radius} reduced={reduced} />

      <LightingRig
        lighting={lighting}
        width={W}
        height={H}
        depth={D}
        castShadows={hq}
      />

      {/* Static neutral lightformers give the glass and veneer something to
          reflect. Rendered once (drei defaults to frames={1}), so this costs
          nothing per frame — the colour shift comes from the light rig. */}
      <Environment resolution={128}>
        <Lightformer form="rect" intensity={1.4} color="#ffffff" scale={[6, 3]} position={[0, 4, 2]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={0.7} color="#9fc6e0" scale={[4, 4]} position={[-5, 1, 2]} target={[0, 0, 0]} />
        <Lightformer form="circle" intensity={0.9} color="#e8c9a0" scale={[3, 3]} position={[4, 2, 3]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={0.4} color="#ffffff" scale={[8, 2]} position={[0, -3, 3]} target={[0, 0, 0]} />
      </Environment>

      <group ref={groupRef}>
        <VivariumModel tier={tier} wood={wood} scape={scape} quality={quality} />

        {pins.map((p) => (
          <Hotspot
            key={p.id}
            pin={p}
            position={[p.u * W, p.v * H, p.w * D]}
            active={activePin === p.id}
            onToggle={onPinToggle}
          />
        ))}
      </group>

      {/* Grounds the cabinet in the room */}
      <ContactShadows
        position={[0, -H / 2 - 0.01, 0]}
        opacity={0.62}
        scale={Math.max(W, D) * 3}
        blur={2.6}
        far={2.4}
        resolution={hq ? 512 : 256}
        color="#000000"
        frames={reduced ? 1 : Infinity}
      />

      {hq && (
        <EffectComposer multisampling={0}>
          <Bloom
            intensity={0.42}
            luminanceThreshold={0.62}
            luminanceSmoothing={0.35}
            mipmapBlur
          />
          <ChromaticAberration
            offset={aberration}
            radialModulation={false}
            modulationOffset={0}
            blendFunction={BlendFunction.NORMAL}
          />
          <Noise premultiply opacity={0.16} blendFunction={BlendFunction.OVERLAY} />
          <Vignette offset={0.28} darkness={0.78} eskil={false} />
        </EffectComposer>
      )}

      <AdaptiveDpr pixelated />
    </>
  );
}
