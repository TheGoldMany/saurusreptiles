"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Layer = {
  id: string;
  title: string;
  text: string;
  /** colours for the exploded-anatomy diagram */
  fill: string;
  stroke: string;
};

/**
 * Scrollytelling anatomy of a build. A sticky exploded diagram on the left
 * highlights whichever layer's copy is currently centred in the viewport.
 */
export default function CraftsmanshipShowcase({ t }: { t: Dictionary["bespoke"] }) {
  const [active, setActive] = useState(0);

  const layers: Layer[] = [
    { id: "core", title: t.craft1Title, text: t.craft1Text, fill: "#3f4650", stroke: "#7dd3fc" },
    { id: "rock", title: t.craft2Title, text: t.craft2Text, fill: "#5b4128", stroke: "#9e472a" },
    { id: "skin", title: t.craft3Title, text: t.craft3Text, fill: "#c69a5f", stroke: "#e58a3c" },
    { id: "bio", title: t.craft4Title, text: t.craft4Text, fill: "#3d2e1d", stroke: "#6b8e23" },
  ];

  return (
    <section id="craft" className="scroll-mt-20 bg-[#08090a] py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <p className="text-[10px] font-semibold uppercase tracking-cinematic text-[#e58a3c]">
            {t.craftEyebrow}
          </p>
          <h2 className="mt-4 font-display text-[clamp(1.75rem,3.6vw,3rem)] font-bold leading-tight tracking-tight text-[#f3f4f6]">
            {t.craftTitle}
          </h2>
          <p className="mt-4 text-[#889096]">{t.craftSubtitle}</p>
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* ---- Sticky exploded diagram ---- */}
          <div className="hidden lg:block">
            <div className="sticky top-28">
              <svg viewBox="0 0 400 420" className="h-auto w-full" aria-hidden>
                <defs>
                  <linearGradient id="craftGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#e58a3c" stopOpacity="0.25" />
                    <stop offset="1" stopColor="#e58a3c" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {layers.map((l, i) => {
                  const isActive = active === i;
                  // Each layer is a parallelogram slab in an exploded stack.
                  const y = 70 + i * 86;
                  return (
                    <motion.g
                      key={l.id}
                      animate={{
                        x: isActive ? 26 : 0,
                        opacity: isActive ? 1 : 0.34,
                      }}
                      transition={{ type: "spring", stiffness: 220, damping: 26 }}
                    >
                      <path
                        d={`M60 ${y} L300 ${y - 34} L340 ${y - 6} L100 ${y + 28} Z`}
                        fill={l.fill}
                        stroke={isActive ? l.stroke : "transparent"}
                        strokeWidth="2"
                      />
                      <path
                        d={`M60 ${y} L100 ${y + 28} L100 ${y + 46} L60 ${y + 18} Z`}
                        fill={l.fill}
                        opacity="0.65"
                      />
                      <path
                        d={`M100 ${y + 28} L340 ${y - 6} L340 ${y + 12} L100 ${y + 46} Z`}
                        fill={l.fill}
                        opacity="0.45"
                      />
                      {isActive && (
                        <motion.circle
                          cx="46"
                          cy={y + 8}
                          r="5"
                          fill={l.stroke}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                        />
                      )}
                    </motion.g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* ---- Scrolling copy ---- */}
          <ol className="flex flex-col">
            {layers.map((l, i) => (
              <Step
                key={l.id}
                index={i}
                total={layers.length}
                layer={l}
                setActive={setActive}
              />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function Step({
  index,
  total,
  layer,
  setActive,
}: {
  index: number;
  total: number;
  layer: Layer;
  setActive: (i: number) => void;
}) {
  const ref = useRef<HTMLLIElement>(null);
  // A tight band around the viewport centre decides which layer is "current".
  const inView = useInView(ref, { margin: "-45% 0px -45% 0px" });

  useEffect(() => {
    if (inView) setActive(index);
  }, [inView, index, setActive]);

  return (
    <li
      ref={ref}
      className="border-l border-white/10 py-10 pl-8 first:pt-0 lg:py-16"
      style={{ borderColor: inView ? layer.stroke : undefined }}
    >
      <motion.div
        animate={{ opacity: inView ? 1 : 0.42 }}
        transition={{ duration: 0.4 }}
      >
        <span className="text-[10px] font-semibold uppercase tracking-cinematic text-[#5f676d]">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
        <h3
          className="mt-3 font-display text-xl font-bold tracking-tight text-[#f3f4f6] sm:text-2xl"
          style={{ color: inView ? undefined : "#c9ced3" }}
        >
          {layer.title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-[#889096]">{layer.text}</p>
      </motion.div>
    </li>
  );
}
