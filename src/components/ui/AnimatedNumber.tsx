"use client";

import { useEffect, useState } from "react";
import {
  useMotionValue,
  useSpring,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";

/**
 * A spring-driven ticking counter. Used for the live price readout so the
 * number rolls to its new value instead of snapping.
 */
export default function AnimatedNumber({
  value,
  format,
  className = "",
}: {
  value: number;
  format: (n: number) => string;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const mv = useMotionValue(value);
  const spring = useSpring(mv, { stiffness: 90, damping: 20, mass: 0.8 });
  const [shown, setShown] = useState(value);

  useEffect(() => {
    if (reduced) {
      setShown(value);
      return;
    }
    mv.set(value);
  }, [value, mv, reduced]);

  useMotionValueEvent(spring, "change", (latest) => {
    setShown(Math.round(latest));
  });

  return (
    <span className={className} aria-live="polite">
      {format(reduced ? value : shown)}
    </span>
  );
}
