"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Lighting } from "@/components/configurator/options";

/**
 * The dynamic lighting engine. Rather than swapping lights when the profile
 * changes, every light lerps its colour and intensity toward the new target
 * each frame — so moving from 6500K daylight to golden hour reads as the
 * room's colour temperature actually shifting.
 */
export default function LightingRig({
  lighting,
  width,
  height,
  depth,
  castShadows,
}: {
  lighting: Lighting;
  width: number;
  height: number;
  depth: number;
  castShadows: boolean;
}) {
  const keyRef = useRef<THREE.SpotLight>(null);
  const fillRef = useRef<THREE.DirectionalLight>(null);
  const ambientRef = useRef<THREE.AmbientLight>(null);
  const beamRef = useRef<THREE.Mesh>(null);

  // Target colours are parsed once per profile change, not per frame.
  const targets = useMemo(
    () => ({
      key: new THREE.Color(lighting.key),
      fill: new THREE.Color(lighting.fill),
      ambient: new THREE.Color(lighting.ambient),
    }),
    [lighting.key, lighting.fill, lighting.ambient]
  );

  // Basking spot sits in the canopy, offset to one side like a real fixture.
  const keyPos = useMemo<[number, number, number]>(
    () => [width * 0.26, height * 0.62, depth * 0.1],
    [width, height, depth]
  );

  useFrame((_, delta) => {
    // Critically damped-ish approach; clamped so a long frame can't overshoot.
    const k = Math.min(1, delta * 2.6);

    if (keyRef.current) {
      keyRef.current.color.lerp(targets.key, k);
      keyRef.current.intensity +=
        (lighting.keyIntensity * width * height - keyRef.current.intensity) * k;
    }
    if (fillRef.current) {
      fillRef.current.color.lerp(targets.fill, k);
      fillRef.current.intensity += (lighting.ambientIntensity * 1.4 - fillRef.current.intensity) * k;
    }
    if (ambientRef.current) {
      ambientRef.current.color.lerp(targets.ambient, k);
      ambientRef.current.intensity +=
        (lighting.ambientIntensity - ambientRef.current.intensity) * k;
    }
    if (beamRef.current) {
      const mat = beamRef.current.material as THREE.MeshBasicMaterial;
      mat.color.lerp(targets.key, k);
      // The volumetric shaft is a hint of haze in the beam, not a solid cone —
      // additive blending builds up fast, so these stay very low.
      const targetOpacity =
        lighting.id === "night" ? 0.006 : lighting.id === "golden" ? 0.05 : 0.032;
      mat.opacity += (targetOpacity - mat.opacity) * k;
    }
  });

  return (
    <>
      <ambientLight ref={ambientRef} intensity={0.6} />

      {/* Basking key light, piercing down through the canopy mesh */}
      <spotLight
        ref={keyRef}
        position={keyPos}
        angle={0.62}
        penumbra={1}
        distance={height * 4}
        decay={1.4}
        intensity={2}
        castShadow={castShadows}
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0015}
      />

      {/* Cool ambient fill from the front-left, keeps the veneer readable */}
      <directionalLight ref={fillRef} position={[-width, height * 0.8, depth * 3]} intensity={0.8} />

      {/* Volumetric shaft under the basking lamp */}
      <mesh
        ref={beamRef}
        position={[keyPos[0], height * 0.06, keyPos[2]]}
        rotation={[Math.PI, 0, 0]}
      >
        <coneGeometry args={[width * 0.17, height * 0.92, 24, 1, true]} />
        <meshBasicMaterial
          transparent
          opacity={0.032}
          depthWrite={false}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </>
  );
}
