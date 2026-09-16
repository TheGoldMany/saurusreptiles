"use client";

import { ReactLenis } from "lenis/react";
import { useReducedMotion } from "framer-motion";

/**
 * Lenis smooth scrolling, scoped to the cinematic route. Mounting it as
 * `root` takes over window scrolling while this page is mounted and releases
 * it on navigation, so the rest of the site keeps native scrolling.
 *
 * Viewers who ask for reduced motion get native scrolling untouched.
 */
export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const reduced = useReducedMotion();

  if (reduced) return <>{children}</>;

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.085,
        duration: 1.15,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.6,
      }}
    >
      {children}
    </ReactLenis>
  );
}
