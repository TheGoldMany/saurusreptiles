"use client";

import type { Lighting, Scape, Tier, Wood } from "./options";
import type { Pin } from "@/components/cinematic/VivariumScene";

const T = { transition: "fill 0.7s ease, stop-color 0.7s ease" } as const;

/**
 * Layered-SVG build of the enclosure, used wherever WebGL is unavailable.
 * It mirrors the 3D scene's material logic — same veneer, same rockscape
 * palette, same lighting profile — so the configurator stays fully usable.
 */
export default function VivariumFallback({
  tier,
  wood,
  scape,
  lighting,
  pins,
  activePin,
  onPinToggle,
  hotspotLabel,
}: {
  tier: Tier;
  wood: Wood;
  scape: Scape;
  lighting: Lighting;
  pins: Pin[];
  activePin: string | null;
  onPinToggle: (id: string | null) => void;
  hotspotLabel: string;
}) {
  const isNight = lighting.id === "night";
  const isGolden = lighting.id === "golden";

  // Keep the drawn proportions faithful to the selected tier.
  const [w, , h] = tier.dims;
  const ratio = w / h;
  const boxW = Math.min(640, 420 * ratio);
  const boxH = boxW / ratio;
  const x = (800 - boxW) / 2;
  const y = (560 - boxH) / 2;

  return (
    <div className="relative flex h-full w-full select-none items-center justify-center">
      <svg
        viewBox="0 0 800 560"
        className="h-auto w-full"
        role="img"
        aria-label={`${wood.id} / ${scape.id} / ${lighting.id}`}
      >
        <defs>
          <linearGradient id="fbWood" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={wood.light} style={T} />
            <stop offset="0.5" stopColor={wood.base} style={T} />
            <stop offset="1" stopColor={wood.dark} style={T} />
          </linearGradient>
          <linearGradient id="fbScape" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={scape.rockMid} style={T} />
            <stop offset="0.55" stopColor={scape.bg} style={T} />
            <stop offset="1" stopColor={scape.rockDark} style={T} />
          </linearGradient>
          <linearGradient id="fbGlass" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.15" />
            <stop offset="0.4" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0.05" />
          </linearGradient>
          <radialGradient id="fbDay" cx="0.7" cy="0.1" r="0.62">
            <stop offset="0" stopColor="#fff6e0" stopOpacity="0.85" />
            <stop offset="0.45" stopColor="#ffe6b0" stopOpacity="0.25" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="fbGolden" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#e58a3c" stopOpacity="0.55" />
            <stop offset="0.55" stopColor="#9e472a" stopOpacity="0.3" />
            <stop offset="1" stopColor="#5b1e0c" stopOpacity="0.35" />
          </linearGradient>
          <clipPath id="fbClip">
            <rect x={x + 16} y={y + 14} width={boxW - 32} height={boxH - 28} rx="6" />
          </clipPath>
        </defs>

        {/* cabinet */}
        <rect x={x} y={y} width={boxW} height={boxH} rx="18" fill="url(#fbWood)" />
        <g opacity="0.32" stroke={wood.grain} strokeWidth="1.3" fill="none">
          <path d={`M${x + 14} ${y + 8} H${x + boxW - 14}`} />
          <path d={`M${x + 14} ${y + boxH - 8} H${x + boxW - 14}`} />
        </g>

        {/* interior */}
        <g clipPath="url(#fbClip)">
          <rect x={x + 16} y={y + 14} width={boxW - 32} height={boxH - 28} fill="url(#fbScape)" />

          {/* stacked slate courses */}
          {Array.from({ length: 9 }).map((_, r) => {
            const rowH = (boxH - 28) / 9;
            const ry = y + 14 + r * rowH;
            return (
              <g key={r}>
                <rect
                  x={x + 16}
                  y={ry}
                  width={boxW - 32}
                  height={rowH * 0.82}
                  fill={r % 3 === 0 ? scape.rockDark : r % 3 === 1 ? scape.rockMid : scape.rockLight}
                  opacity={0.55 + (r % 3) * 0.12}
                  style={T}
                />
                <rect
                  x={x + 16 + ((r * 53) % (boxW - 160))}
                  y={ry + rowH * 0.1}
                  width={90}
                  height={rowH * 0.6}
                  fill={scape.rockLight}
                  opacity="0.3"
                  style={T}
                />
              </g>
            );
          })}

          {scape.moss && (
            <g>
              <ellipse cx={x + boxW * 0.3} cy={y + boxH * 0.55} rx="46" ry="13" fill={scape.moss} opacity="0.5" />
              <ellipse cx={x + boxW * 0.66} cy={y + boxH * 0.42} rx="52" ry="15" fill={scape.moss} opacity="0.45" />
            </g>
          )}

          {/* substrate bed */}
          <rect
            x={x + 16}
            y={y + boxH - 14 - (tier.substrateDepth / tier.dims[2]) * (boxH - 28)}
            width={boxW - 32}
            height={(tier.substrateDepth / tier.dims[2]) * (boxH - 28)}
            fill={scape.substrate}
            opacity="0.95"
            style={T}
          />

          {/* lighting profile overlays */}
          <rect
            x={x + 16} y={y + 14} width={boxW - 32} height={boxH - 28}
            fill="url(#fbDay)"
            opacity={lighting.id === "day" ? 1 : 0}
            style={{ transition: "opacity 0.7s ease" }}
          />
          <rect
            x={x + 16} y={y + 14} width={boxW - 32} height={boxH - 28}
            fill="url(#fbGolden)"
            opacity={isGolden ? 1 : 0}
            style={{ transition: "opacity 0.7s ease" }}
          />
          <rect
            x={x + 16} y={y + 14} width={boxW - 32} height={boxH - 28}
            fill="#070b16"
            opacity={isNight ? 0.76 : 0}
            style={{ transition: "opacity 0.7s ease" }}
          />

          <rect x={x + 16} y={y + 14} width={boxW - 32} height={boxH - 28} fill="url(#fbGlass)" />
        </g>

        <rect
          x={x + 16} y={y + 14} width={boxW - 32} height={boxH - 28} rx="6"
          fill="none" stroke="#000" strokeOpacity="0.4" strokeWidth="2"
        />
      </svg>

      {/* hotspot pins mapped from the shared 3D coordinates */}
      {pins.map((p) => {
        const left = ((x + boxW * (0.5 + p.u)) / 800) * 100;
        const top = ((y + boxH * (0.5 - p.v)) / 560) * 100;
        const active = activePin === p.id;
        return (
          <div
            key={p.id}
            className="absolute"
            style={{ left: `${left}%`, top: `${top}%`, transform: "translate(-50%,-50%)" }}
          >
            <button
              type="button"
              onClick={() => onPinToggle(active ? null : p.id)}
              aria-label={p.title}
              aria-expanded={active}
              className="relative flex h-7 w-7 items-center justify-center"
            >
              <span
                className={`absolute inline-flex h-7 w-7 rounded-full ${
                  active ? "bg-[#e58a3c]/50" : "animate-ping bg-[#e58a3c]/30"
                }`}
              />
              <span
                className={`relative h-3.5 w-3.5 rounded-full border-2 border-white/90 shadow-lg transition-transform ${
                  active ? "scale-125 bg-[#e58a3c]" : "bg-[#e58a3c]/90"
                }`}
              />
            </button>
            {active && (
              <div
                role="tooltip"
                className="glass-panel absolute left-1/2 top-9 z-10 w-56 -translate-x-1/2 rounded-2xl p-3.5 text-left"
              >
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#e58a3c]">
                  {p.title}
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-[#c9ced3]">{p.text}</p>
              </div>
            )}
          </div>
        );
      })}

      <span className="pointer-events-none absolute bottom-2 right-3 text-[10px] uppercase tracking-cinematic text-[#889096]">
        {hotspotLabel}
      </span>
    </div>
  );
}
