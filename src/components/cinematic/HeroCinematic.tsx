"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown, Play, X } from "lucide-react";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import MagneticButton from "@/components/ui/MagneticButton";

/**
 * The opening frame: a stacked-slate cavern with a volumetric basking shaft.
 *
 * Built from layered SVG/CSS rather than a second WebGL context — the hero is
 * the LCP element, so it paints immediately instead of waiting on a ~600 KB
 * three.js chunk, and the page only ever runs one canvas (the configurator).
 * Each layer parallaxes at its own rate against scroll for real depth.
 */
export default function HeroCinematic({ t }: { t: Dictionary["bespoke"] }) {
  const ref = useRef<HTMLElement>(null);
  const [filmOpen, setFilmOpen] = useState(false);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Farther layers move least — classic parallax depth cueing.
  const yFar = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const yMid = useTransform(scrollYProgress, [0, 1], ["0%", "26%"]);
  const yNear = useTransform(scrollYProgress, [0, 1], ["0%", "44%"]);
  const yCopy = useTransform(scrollYProgress, [0, 1], ["0%", "60%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const beamOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0.2]);

  const metrics = [t.metric1, t.metric2, t.metric3];

  return (
    <section
      ref={ref}
      className="relative flex min-h-[92vh] w-full items-center justify-center overflow-hidden bg-[#08090a]"
    >
      {/* ---- Cavern backdrop ---- */}
      <motion.div style={{ y: yFar }} className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(70%_55%_at_52%_8%,#2a1a10_0%,#0d0a07_45%,#08090a_75%)]" />
      </motion.div>

      {/* volumetric shafts piercing the canopy mesh */}
      <motion.div
        style={{ opacity: beamOpacity }}
        className="pointer-events-none absolute inset-0"
        aria-hidden
      >
        <div className="absolute left-[46%] top-[-18%] h-[105%] w-[26vw] -translate-x-1/2 rotate-[9deg] bg-[linear-gradient(to_bottom,rgba(229,138,60,0.30),rgba(229,138,60,0.07)_45%,transparent_78%)] blur-2xl" />
        <div className="absolute left-[63%] top-[-14%] h-[95%] w-[13vw] -translate-x-1/2 rotate-[15deg] bg-[linear-gradient(to_bottom,rgba(255,214,150,0.22),transparent_72%)] blur-xl" />
        <div className="absolute left-[30%] top-[-12%] h-[85%] w-[9vw] -translate-x-1/2 rotate-[-7deg] bg-[linear-gradient(to_bottom,rgba(125,211,252,0.12),transparent_68%)] blur-xl" />
      </motion.div>

      {/* ---- Rock silhouette layers ---- */}
      <motion.svg
        style={{ y: yMid }}
        className="absolute inset-x-0 bottom-0 h-[62%] w-full"
        viewBox="0 0 1440 500"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          d="M0 260 L120 180 L250 236 L360 150 L500 232 L640 160 L760 240 L900 170 L1040 246 L1180 178 L1320 244 L1440 190 L1440 500 L0 500 Z"
          fill="#2a1c12"
          opacity="0.9"
        />
      </motion.svg>

      <motion.svg
        style={{ y: yNear }}
        className="absolute inset-x-0 bottom-0 h-[48%] w-full"
        viewBox="0 0 1440 400"
        preserveAspectRatio="none"
        aria-hidden
      >
        {/* stacked slate courses in the foreground */}
        <path
          d="M0 200 L160 140 L300 196 L430 128 L580 200 L720 136 L880 208 L1020 146 L1180 210 L1320 150 L1440 206 L1440 400 L0 400 Z"
          fill="#150e09"
        />
        <g opacity="0.5" fill="#3b2a1c">
          <rect x="60" y="250" width="240" height="14" rx="3" />
          <rect x="340" y="286" width="300" height="12" rx="3" />
          <rect x="700" y="252" width="270" height="15" rx="3" />
          <rect x="1010" y="292" width="320" height="12" rx="3" />
        </g>
      </motion.svg>

      {/* floor haze */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-[#08090a] via-[#08090a]/80 to-transparent" />

      {/* ---- Copy ---- */}
      <motion.div
        style={{ y: yCopy, opacity }}
        className="relative z-10 mx-auto max-w-4xl px-6 text-center"
      >
        <motion.span
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="inline-block rounded-full border border-[#e58a3c]/25 bg-[#e58a3c]/10 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-cinematic text-[#e58a3c]"
        >
          {t.eyebrow}
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.14 }}
          className="mt-7 font-display text-[clamp(2rem,5.4vw,4.2rem)] font-bold leading-[1.04] tracking-tight text-[#f3f4f6]"
        >
          {t.heroTitle}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.26 }}
          className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-[#889096] sm:text-base"
        >
          {t.heroSubtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.38 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <MagneticButton
            href="#studio"
            className="inline-flex items-center gap-2 rounded-2xl bg-[#e58a3c] px-7 py-4 text-sm font-semibold text-[#1a0f06] shadow-[0_14px_50px_-14px_rgba(229,138,60,0.85)] transition-colors hover:bg-[#f0a05c]"
          >
            {t.ctaPrimary}
          </MagneticButton>
          <MagneticButton
            onClick={() => setFilmOpen(true)}
            className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-7 py-4 text-sm font-semibold text-[#f3f4f6] backdrop-blur transition-colors hover:bg-white/10"
          >
            <Play className="h-4 w-4" strokeWidth={2} />
            {t.ctaSecondary}
          </MagneticButton>
        </motion.div>

        {/* floating live metrics */}
        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.55 }}
          className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3"
        >
          {metrics.map((m) => (
            <li
              key={m}
              className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-cinematic text-[#889096]"
            >
              <span className="h-1 w-1 rounded-full bg-[#e58a3c]" />
              {m}
            </li>
          ))}
        </motion.ul>
      </motion.div>

      {/* scroll cue */}
      <motion.div
        style={{ opacity }}
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1.5 text-[9px] uppercase tracking-cinematic text-[#5f676d]"
      >
        {t.scrollHint}
        <ChevronDown
          className="h-4 w-4"
          strokeWidth={2}
          style={{ animation: "scrollHint 1.9s ease-in-out infinite" }}
        />
      </motion.div>

      {/* ---- The Serpa method film modal ---- */}
      <AnimatePresence>
        {filmOpen && (
          <div
            className="fixed inset-0 z-[80] flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label={t.filmTitle}
          >
            <motion.button
              aria-label={t.close}
              onClick={() => setFilmOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              className="glass-panel relative w-full max-w-2xl rounded-3xl p-8"
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ type: "spring", stiffness: 280, damping: 28 }}
            >
              <button
                onClick={() => setFilmOpen(false)}
                aria-label={t.close}
                className="absolute right-4 top-4 rounded-lg p-2 text-[#889096] transition-colors hover:bg-white/5 hover:text-white"
              >
                <X className="h-5 w-5" strokeWidth={1.75} />
              </button>
              <p className="text-[10px] font-semibold uppercase tracking-cinematic text-[#e58a3c]">
                {t.craftEyebrow}
              </p>
              <h3 className="mt-3 font-display text-2xl font-bold text-[#f3f4f6]">
                {t.filmTitle}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-[#889096]">{t.filmText}</p>
              <a
                href="#craft"
                onClick={() => setFilmOpen(false)}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#e58a3c] px-5 py-3 text-sm font-semibold text-[#1a0f06] transition-colors hover:bg-[#f0a05c]"
              >
                {t.filmCta}
              </a>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
