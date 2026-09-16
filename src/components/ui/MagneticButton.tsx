"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

/**
 * A button that subtly leans toward the cursor while hovered, then springs
 * back to rest. Falls back to a plain button when the viewer prefers
 * reduced motion or is on a coarse pointer (touch).
 */
export default function MagneticButton({
  children,
  onClick,
  href,
  className = "",
  strength = 0.35,
  ariaLabel,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
  /** How far the button follows the cursor (0 = not at all, 1 = fully). */
  strength?: number;
  ariaLabel?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.6 });

  const handleMove = (e: React.PointerEvent) => {
    if (reduced || e.pointerType !== "mouse" || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const motionProps = {
    style: { x: sx, y: sy },
    onPointerMove: handleMove,
    onPointerLeave: reset,
    whileTap: reduced ? undefined : { scale: 0.97 },
    className,
    "aria-label": ariaLabel,
  } as const;

  if (href) {
    return (
      <motion.a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        {...motionProps}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      ref={ref as React.Ref<HTMLButtonElement>}
      type="button"
      onClick={onClick}
      {...motionProps}
    >
      {children}
    </motion.button>
  );
}
