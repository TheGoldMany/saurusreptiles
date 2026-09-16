"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import * as THREE from "three";
import type { Lighting, Scape, Tier, Wood } from "@/components/configurator/options";
import VivariumScene, { type Pin } from "./VivariumScene";

export default function VivariumStage({
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

  return (
    <Canvas
      shadows={hq}
      dpr={hq ? [1, 1.75] : [1, 1.25]}
      camera={{ fov: 32, position: [0, 0, 4], near: 0.1, far: 100 }}
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
        <VivariumScene
          tier={tier}
          wood={wood}
          scape={scape}
          lighting={lighting}
          quality={quality}
          pins={pins}
          activePin={activePin}
          onPinToggle={onPinToggle}
          reduced={reduced}
        />
      </Suspense>
    </Canvas>
  );
}
