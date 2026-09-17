"use client";

import { Suspense, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Canvas } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import * as THREE from "three";
import type { GlobalFurnitureConfig, Tier } from "@/lib/store/vivarium-store";
import type { StudioPin } from "./StudioScene";

const StudioScene = dynamic(() => import("./StudioScene"), { ssr: false });

type Quality = "high" | "low" | "none";

function detectQuality(): Quality {
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");
    if (!gl) return "none";
    const cores = navigator.hardwareConcurrency ?? 4;
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
    if (window.matchMedia("(max-width: 767px)").matches || cores < 4 || memory < 4) return "low";
    return "high";
  } catch {
    return "none";
  }
}

function Spinner() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-20 w-20 animate-spin rounded-full border-2 border-white/10 border-t-amber-glow" />
    </div>
  );
}

export default function VivariumCanvas({
  tiers,
  furniture,
  selectedUnitId,
  onSelectUnit,
  pins,
  activePin,
  onPinToggle,
  orbit = false,
  fallbackNote,
}: {
  tiers: Tier[];
  furniture: GlobalFurnitureConfig;
  selectedUnitId: string | null;
  onSelectUnit: (id: string) => void;
  pins: StudioPin[];
  activePin: string | null;
  onPinToggle: (id: string | null) => void;
  orbit?: boolean;
  fallbackNote: string;
}) {
  const [quality, setQuality] = useState<Quality | null>(null);
  const reduced = useReducedMotion() ?? false;

  useEffect(() => {
    setQuality(detectQuality());
  }, []);

  if (quality === null) return <Spinner />;

  if (quality === "none") {
    return (
      <div className="flex h-full w-full items-center justify-center p-8 text-center">
        <p className="max-w-xs text-sm leading-relaxed text-ink-3">{fallbackNote}</p>
      </div>
    );
  }

  const hq = quality === "high";

  return (
    <Canvas
      shadows={hq}
      dpr={hq ? [1, 1.75] : [1, 1.25]}
      camera={{ fov: 34, position: [0, 0, 4], near: 0.05, far: 100 }}
      performance={{ min: 0.5 }}
      gl={{
        antialias: hq,
        powerPreference: "high-performance",
        alpha: true,
        toneMapping: THREE.ACESFilmicToneMapping,
      }}
      style={{ touchAction: "pan-y" }}
    >
      <Suspense fallback={null}>
        <StudioScene
          tiers={tiers}
          furniture={furniture}
          quality={quality}
          reduced={reduced}
          selectedUnitId={selectedUnitId}
          onSelectUnit={onSelectUnit}
          pins={pins}
          activePin={activePin}
          onPinToggle={onPinToggle}
          orbit={orbit}
        />
      </Suspense>
    </Canvas>
  );
}
