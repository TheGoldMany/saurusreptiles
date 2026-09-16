"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useReducedMotion } from "framer-motion";
import type { Lighting, Scape, Tier, Wood } from "@/components/configurator/options";
import type { Pin } from "./VivariumScene";
import VivariumFallback from "@/components/configurator/VivariumFallback";

/** Three.js is ~600 KB — it only ever loads on this route, after mount. */
const VivariumStage = dynamic(() => import("./VivariumStage"), {
  ssr: false,
  loading: () => <StageSkeleton />,
});

type Quality = "high" | "low" | "none";

/**
 * Picks a render tier from the device's actual capabilities. Anything
 * without WebGL — or too weak to hold a frame rate — gets the layered SVG
 * build instead of a stuttering canvas.
 */
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
    const coarse = window.matchMedia("(max-width: 767px)").matches;

    if (coarse || cores < 4 || memory < 4) return "low";
    return "high";
  } catch {
    return "none";
  }
}

function StageSkeleton() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-24 w-24 animate-spin rounded-full border-2 border-white/10 border-t-[#e58a3c]" />
    </div>
  );
}

export default function VivariumCanvas({
  tier,
  wood,
  scape,
  lighting,
  pins,
  activePin,
  onPinToggle,
  fallbackHotspotLabel,
}: {
  tier: Tier;
  wood: Wood;
  scape: Scape;
  lighting: Lighting;
  pins: Pin[];
  activePin: string | null;
  onPinToggle: (id: string | null) => void;
  fallbackHotspotLabel: string;
}) {
  const [quality, setQuality] = useState<Quality | null>(null);
  const reduced = useReducedMotion() ?? false;

  useEffect(() => {
    setQuality(detectQuality());
  }, []);

  // Before detection resolves, hold the exact aspect box so nothing shifts.
  if (quality === null) return <StageSkeleton />;

  if (quality === "none") {
    return (
      <VivariumFallback
        tier={tier}
        wood={wood}
        scape={scape}
        lighting={lighting}
        pins={pins}
        activePin={activePin}
        onPinToggle={onPinToggle}
        hotspotLabel={fallbackHotspotLabel}
      />
    );
  }

  return (
    <VivariumStage
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
  );
}
