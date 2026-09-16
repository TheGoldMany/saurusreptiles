"use client";

import { useState } from "react";
import type { Wood, Palette, Lighting } from "./options";

type Hotspot = {
  id: string;
  x: number; // percent
  y: number; // percent
  title: string;
  text: string;
};

const T = { transition: "fill 0.7s ease, stop-color 0.7s ease" } as const;

export default function VivariumPreview({
  wood,
  palette,
  lighting,
  hotspots,
  silhouetteLabel,
}: {
  wood: Wood;
  palette: Palette;
  lighting: Lighting["id"];
  hotspots: Hotspot[];
  silhouetteLabel: string;
}) {
  const [active, setActive] = useState<string | null>(null);

  const isOff = lighting === "off";
  const isSunset = lighting === "sunset";

  return (
    <div className="relative select-none">
      <svg
        viewBox="0 0 800 560"
        className="h-auto w-full drop-shadow-2xl"
        role="img"
        aria-label={`${wood.id} / ${palette.id} / ${lighting}`}
      >
        <defs>
          {/* Wood gradient */}
          <linearGradient id="woodGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={wood.light} style={T} />
            <stop offset="0.5" stopColor={wood.base} style={T} />
            <stop offset="1" stopColor={wood.dark} style={T} />
          </linearGradient>
          {/* Scape backdrop */}
          <linearGradient id="scapeGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={palette.rockMid} style={T} />
            <stop offset="0.55" stopColor={palette.bg} style={T} />
            <stop offset="1" stopColor={palette.rockDark} style={T} />
          </linearGradient>
          {/* Glass reflection */}
          <linearGradient id="glassGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.16" />
            <stop offset="0.35" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0.05" />
          </linearGradient>
          {/* Daytime basking spot */}
          <radialGradient id="dayGlow" cx="0.72" cy="0.12" r="0.6">
            <stop offset="0" stopColor="#fff6e0" stopOpacity="0.9" />
            <stop offset="0.4" stopColor="#ffe6b0" stopOpacity="0.28" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
          {/* Sunset wash */}
          <linearGradient id="sunsetGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f59e0b" stopOpacity="0.55" />
            <stop offset="0.5" stopColor="#b45309" stopOpacity="0.28" />
            <stop offset="1" stopColor="#7c2d12" stopOpacity="0.35" />
          </linearGradient>
          <clipPath id="glassClip">
            <rect x="80" y="70" width="640" height="380" rx="10" />
          </clipPath>
        </defs>

        {/* ---- Outer hardwood cabinet ---- */}
        <rect
          x="36"
          y="34"
          width="728"
          height="452"
          rx="26"
          fill="url(#woodGrad)"
        />
        {/* wood grain lines (top & bottom rails) */}
        <g opacity="0.35" stroke={wood.grain} strokeWidth="1.4" fill="none">
          <path d="M60 52 C 260 46, 520 58, 744 50" style={{ transition: "stroke 0.7s ease" }} />
          <path d="M60 60 C 300 66, 540 52, 744 62" style={{ transition: "stroke 0.7s ease" }} />
          <path d="M60 468 C 280 462, 520 474, 744 466" style={{ transition: "stroke 0.7s ease" }} />
          <path d="M60 476 C 320 470, 500 480, 744 474" style={{ transition: "stroke 0.7s ease" }} />
        </g>
        {/* side rail grain */}
        <g opacity="0.3" stroke={wood.grain} strokeWidth="1.2" fill="none">
          <path d="M52 90 C 46 220, 58 340, 52 430" style={{ transition: "stroke 0.7s ease" }} />
          <path d="M748 90 C 754 220, 742 340, 748 430" style={{ transition: "stroke 0.7s ease" }} />
        </g>

        {/* Inner bezel shadow */}
        <rect x="74" y="64" width="652" height="392" rx="14" fill="#000000" opacity="0.28" />

        {/* ---- Scape (clipped to glass) ---- */}
        <g clipPath="url(#glassClip)">
          <rect x="80" y="70" width="640" height="380" fill="url(#scapeGrad)" />

          {/* far background ridge */}
          <path
            d="M80 250 L 180 180 L 280 230 L 380 160 L 500 235 L 620 175 L 720 240 L 720 450 L 80 450 Z"
            fill={palette.rockDark}
            opacity="0.85"
            style={T}
          />
          {/* mid carved rockscape */}
          <path
            d="M80 320 L 170 250 L 250 300 L 330 235 L 430 305 L 540 250 L 640 320 L 720 275 L 720 450 L 80 450 Z"
            fill={palette.rockMid}
            opacity="0.92"
            style={T}
          />
          {/* carved ledges / drybrush highlights */}
          <path
            d="M150 300 L 250 262 L 300 300 L 210 330 Z"
            fill={palette.rockLight}
            opacity="0.5"
            style={T}
          />
          <path
            d="M430 320 L 540 268 L 600 312 L 500 348 Z"
            fill={palette.rockLight}
            opacity="0.45"
            style={T}
          />
          <path
            d="M330 250 L 400 232 L 430 268 L 360 286 Z"
            fill={palette.accent}
            opacity="0.4"
            style={T}
          />

          {/* live moss accents (mossy palette only) */}
          {palette.moss && (
            <g style={{ transition: "opacity 0.7s ease" }}>
              <ellipse cx="230" cy="322" rx="42" ry="14" fill={palette.moss} opacity="0.55" />
              <ellipse cx="520" cy="300" rx="54" ry="16" fill={palette.moss} opacity="0.5" />
              <ellipse cx="380" cy="352" rx="60" ry="15" fill={palette.moss} opacity="0.4" />
            </g>
          )}

          {/* bioactive substrate basin */}
          <rect x="80" y="404" width="640" height="46" fill="#2a1a0e" opacity="0.92" />
          <g fill="#c9b291" opacity="0.5">
            <circle cx="150" cy="426" r="2" />
            <circle cx="240" cy="432" r="1.6" />
            <circle cx="330" cy="424" r="2.2" />
            <circle cx="430" cy="430" r="1.6" />
            <circle cx="520" cy="425" r="2" />
            <circle cx="620" cy="432" r="1.8" />
          </g>

          {/* lighting overlays (cross-fade via opacity) */}
          <rect
            x="80" y="70" width="640" height="380"
            fill="url(#dayGlow)"
            opacity={lighting === "day" ? 1 : 0}
            style={{ transition: "opacity 0.7s ease" }}
          />
          <rect
            x="80" y="70" width="640" height="380"
            fill="url(#sunsetGlow)"
            opacity={isSunset ? 1 : 0}
            style={{ transition: "opacity 0.7s ease" }}
          />
          <rect
            x="80" y="70" width="640" height="380"
            fill="#04070c"
            opacity={isOff ? 0.74 : 0}
            style={{ transition: "opacity 0.7s ease" }}
          />
          {/* rim light when off */}
          <rect
            x="80" y="70" width="640" height="380"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="2"
            opacity={isOff ? 0.25 : 0}
            style={{ transition: "opacity 0.7s ease" }}
          />

          {/* glass reflection sheen */}
          <rect x="80" y="70" width="640" height="380" fill="url(#glassGrad)" />
        </g>

        {/* Glass frame edge */}
        <rect
          x="80" y="70" width="640" height="380" rx="10"
          fill="none" stroke="#000000" strokeOpacity="0.35" strokeWidth="2"
        />
        <rect
          x="80" y="70" width="640" height="380" rx="10"
          fill="none" stroke="#ffffff" strokeOpacity="0.12" strokeWidth="1"
        />

        {/* Hidden canopy / cabinet base detail line */}
        <line x1="60" y1="34" x2="740" y2="34" stroke="#ffffff" strokeOpacity="0.14" strokeWidth="2" />
      </svg>

      {/* ---- Interactive hotspots ---- */}
      {hotspots.map((h) => {
        const isActive = active === h.id;
        return (
          <div
            key={h.id}
            className="absolute"
            style={{ left: `${h.x}%`, top: `${h.y}%`, transform: "translate(-50%,-50%)" }}
          >
            <button
              type="button"
              onClick={() => setActive(isActive ? null : h.id)}
              onMouseEnter={() => setActive(h.id)}
              onMouseLeave={() => setActive((cur) => (cur === h.id ? null : cur))}
              aria-label={h.title}
              className="group relative flex h-6 w-6 items-center justify-center"
            >
              <span
                className={`absolute inline-flex h-6 w-6 rounded-full ${
                  isActive ? "bg-brand-400/60" : "bg-brand-300/40"
                } ${isActive ? "" : "animate-ping"}`}
              />
              <span
                className={`relative h-3 w-3 rounded-full border-2 border-white shadow-md transition-transform ${
                  isActive ? "scale-125 bg-brand-400" : "bg-brand-500"
                }`}
              />
            </button>
            {isActive && (
              <div
                role="tooltip"
                className="absolute left-1/2 top-8 z-10 w-52 -translate-x-1/2 rounded-xl border border-white/10 bg-stone-900/95 p-3 text-left shadow-xl backdrop-blur"
              >
                <p className="text-xs font-semibold text-brand-300">{h.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-stone-300">{h.text}</p>
              </div>
            )}
          </div>
        );
      })}

      {/* Silhouette badge */}
      {isOff && (
        <span className="pointer-events-none absolute bottom-3 right-4 rounded-full bg-black/50 px-3 py-1 text-[10px] font-medium uppercase tracking-widest text-sky-200 backdrop-blur">
          {silhouetteLabel}
        </span>
      )}
    </div>
  );
}
