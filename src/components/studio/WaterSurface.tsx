"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Animated water surface for the paludarium / basin modules.
 *
 * A small custom shader rather than a texture: two crossing sine trains give
 * the ripple, their gradient drives a cheap fake-caustic highlight, and depth
 * is faked by mixing toward a darker tint away from the viewer. Costs one
 * draw call and no image assets.
 */
export default function WaterSurface({
  width,
  depth,
  y,
  tint = "#2e6f7a",
  reduced = false,
}: {
  width: number;
  depth: number;
  y: number;
  tint?: string;
  reduced?: boolean;
}) {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uTint: { value: new THREE.Color(tint) },
      uOpacity: { value: 0.72 },
    }),
    [tint]
  );

  useFrame((_, delta) => {
    if (!matRef.current || reduced) return;
    matRef.current.uniforms.uTime.value += delta;
  });

  return (
    <mesh position={[0, y, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[width, depth, 48, 48]} />
      <shaderMaterial
        ref={matRef}
        transparent
        depthWrite={false}
        uniforms={uniforms}
        vertexShader={/* glsl */ `
          uniform float uTime;
          varying vec2 vUv;
          varying float vWave;

          void main() {
            vUv = uv;
            // Two crossing ripple trains at different speeds.
            float w =
              sin(uv.x * 22.0 + uTime * 1.6) * 0.5 +
              sin(uv.y * 17.0 - uTime * 1.1) * 0.5;
            vWave = w;
            vec3 pos = position;
            pos.z += w * 0.004;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `}
        fragmentShader={/* glsl */ `
          uniform vec3 uTint;
          uniform float uOpacity;
          uniform float uTime;
          varying vec2 vUv;
          varying float vWave;

          void main() {
            // Fake caustics: bright where the two ripple trains reinforce.
            float caustic = pow(max(vWave, 0.0), 3.0) * 0.55;
            float shimmer = pow(
              abs(sin(vUv.x * 40.0 + uTime) * sin(vUv.y * 34.0 - uTime * 0.7)),
              8.0
            ) * 0.5;

            // Deeper toward the back of the basin.
            vec3 deep = uTint * 0.45;
            vec3 col = mix(deep, uTint, smoothstep(0.0, 1.0, vUv.y));
            col += caustic + shimmer;

            gl_FragColor = vec4(col, uOpacity);
          }
        `}
      />
    </mesh>
  );
}
