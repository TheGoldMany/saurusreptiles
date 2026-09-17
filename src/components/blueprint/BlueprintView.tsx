"use client";

import { useMemo, useState } from "react";
import type { Locale } from "@/lib/i18n/dictionaries";
import type { Tier } from "@/lib/store/vivarium-store";
import { getSpecies } from "@/lib/data/species-database";
import { getWater } from "@/lib/studio/catalog";
import { PVC_SHEET } from "@/lib/studio/pricing";
import { nestParts, partsForBuild, ROLE_LABELS } from "@/lib/studio/sheet-optimizer";
import { cn } from "@/lib/utils/cn";

type Tab = "elevation" | "section" | "nesting";

const STROKE = "#7f8b99";
const DIM = "#e58a3c";
const INK = "#c9ced3";

export default function BlueprintView({
  tiers,
  locale,
  labels,
}: {
  tiers: Tier[];
  locale: Locale;
  labels: {
    elevation: string;
    section: string;
    nesting: string;
    sheets: string;
    waste: string;
    kerf: string;
    plumbing: string;
    noPlumbing: string;
    pvcCore: string;
    veneerSkin: string;
    substrateLip: string;
    canopyLip: string;
    ventBaffle: string;
    glassTrack: string;
    bulkhead: string;
    canister: string;
    oversized: string;
  };
}) {
  const [tab, setTab] = useState<Tab>("elevation");
  const L = (hu: string, en: string) => (locale === "hu" ? hu : en);

  const nest = useMemo(() => nestParts(partsForBuild(tiers)), [tiers]);

  const tabs: { id: Tab; label: string }[] = [
    { id: "elevation", label: labels.elevation },
    { id: "section", label: labels.section },
    { id: "nesting", label: labels.nesting },
  ];

  return (
    <div className="rounded-3xl border border-white/10 bg-surface">
      <div className="flex flex-wrap gap-1 border-b border-white/10 p-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "rounded-xl px-3.5 py-2 text-xs font-semibold transition-colors",
              tab === t.id
                ? "bg-amber-glow/15 text-amber-glow"
                : "text-ink-3 hover:bg-white/[0.06] hover:text-ink"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="p-4">
        {tab === "elevation" && <Elevation tiers={tiers} L={L} labels={labels} />}
        {tab === "section" && <CrossSection tiers={tiers} labels={labels} />}
        {tab === "nesting" && <Nesting nest={nest} locale={locale} labels={labels} />}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Front elevation with millimetre dimension lines                     */
/* ------------------------------------------------------------------ */

function Elevation({
  tiers,
  L,
  labels,
}: {
  tiers: Tier[];
  L: (hu: string, en: string) => string;
  labels: { glassTrack: string; canopyLip: string; substrateLip: string };
}) {
  // Work in mm, then scale into the viewBox.
  const ordered = [...tiers].reverse(); // bottom-first for drawing
  const rowWidths = ordered.map((t) => t.units.reduce((s, u) => s + u.width, 0) * 10);
  const rowHeights = ordered.map((t) => Math.max(...t.units.map((u) => u.height)) * 10);
  const wallW = Math.max(...rowWidths);
  const wallH = rowHeights.reduce((a, b) => a + b, 0);

  const PAD = 150;
  const vbW = wallW + PAD * 2;
  const vbH = wallH + PAD * 2;

  let yCursor = wallH; // draw from the bottom up

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${vbW} ${vbH}`} className="h-auto w-full" style={{ minWidth: 520 }}>
        <defs>
          <marker id="arrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
            <path d="M0,1 L6,4 L0,7 z" fill={DIM} />
          </marker>
          <pattern id="hatchPvc" width="6" height="6" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="6" stroke={STROKE} strokeWidth="1.2" />
          </pattern>
        </defs>

        <g transform={`translate(${PAD},${PAD})`}>
          {ordered.map((tier, ti) => {
            const rowH = rowHeights[ti];
            yCursor -= rowH;
            const rowW = rowWidths[ti];
            let x = (wallW - rowW) / 2;
            const y = yCursor;

            return (
              <g key={tier.id}>
                {tier.units.map((u) => {
                  const w = u.width * 10;
                  const h = u.height * 10;
                  const ux = x;
                  const uy = y + (rowH - h); // bottom-aligned in the band
                  x += w;

                  const species = getSpecies(u.custom.speciesId);
                  const bedMm = (species?.behaviours.includes("digging") ? 25 : 12) * 10;

                  return (
                    <g key={u.id}>
                      {/* carcass */}
                      <rect x={ux} y={uy} width={w} height={h} fill="none" stroke={STROKE} strokeWidth="3" />
                      {/* 15 mm shell (10 PVC + 5 veneer) */}
                      <rect x={ux + 15} y={uy + 15} width={w - 30} height={h - 30} fill="none" stroke={STROKE} strokeWidth="1.5" strokeDasharray="8 6" />
                      {/* canopy fascia */}
                      <rect x={ux + 15} y={uy + 15} width={w - 30} height={80} fill="url(#hatchPvc)" opacity="0.5" />
                      {/* substrate bed */}
                      <rect x={ux + 15} y={uy + h - 15 - bedMm} width={w - 30} height={bedMm} fill={DIM} opacity="0.18" />
                      <line x1={ux + 15} y1={uy + h - 15 - bedMm} x2={ux + w - 15} y2={uy + h - 15 - bedMm} stroke={DIM} strokeWidth="2" />
                      {/* sliding glass seam */}
                      <line x1={ux + w / 2} y1={uy + 95} x2={ux + w / 2} y2={uy + h - 15} stroke={STROKE} strokeWidth="1.2" strokeDasharray="4 4" />
                      {/* vent baffles */}
                      {[0.25, 0.75].map((f) => (
                        <rect key={f} x={ux + w * f - 40} y={uy + h - 12} width={80} height={6} fill={STROKE} opacity="0.7" />
                      ))}

                      {/* per-unit width dimension */}
                      <g>
                        <line x1={ux} y1={uy - 30} x2={ux + w} y2={uy - 30} stroke={DIM} strokeWidth="1.5" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
                        <text x={ux + w / 2} y={uy - 40} fill={DIM} fontSize="34" textAnchor="middle" fontFamily="monospace">
                          {u.width * 10}
                        </text>
                      </g>

                      {/* unit label */}
                      <text x={ux + w / 2} y={uy + h / 2} fill={INK} fontSize="34" textAnchor="middle" fontFamily="monospace">
                        {u.width}×{u.depth}×{u.height}
                      </text>
                      <text x={ux + w / 2} y={uy + h / 2 + 40} fill={STROKE} fontSize="28" textAnchor="middle">
                        {species ? species.nameHu : L("nincs faj", "no species")}
                      </text>

                      {/* clear inner width callout */}
                      <text x={ux + w / 2} y={uy + h - 28} fill={STROKE} fontSize="24" textAnchor="middle" fontFamily="monospace">
                        ⌀ {u.width * 10 - 30} × {u.height * 10 - 30}
                      </text>
                    </g>
                  );
                })}
              </g>
            );
          })}

          {/* overall dimensions */}
          <line x1={-60} y1={0} x2={-60} y2={wallH} stroke={DIM} strokeWidth="1.5" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
          <text x={-75} y={wallH / 2} fill={DIM} fontSize="38" textAnchor="middle" fontFamily="monospace" transform={`rotate(-90 -75 ${wallH / 2})`}>
            {wallH}
          </text>
          <line x1={0} y1={wallH + 60} x2={wallW} y2={wallH + 60} stroke={DIM} strokeWidth="1.5" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
          <text x={wallW / 2} y={wallH + 105} fill={DIM} fontSize="38" textAnchor="middle" fontFamily="monospace">
            {wallW}
          </text>
        </g>

        <text x={PAD} y={vbH - 30} fill={STROKE} fontSize="30" fontFamily="monospace">
          {labels.canopyLip} 80 · {labels.glassTrack} 4 mm · {labels.substrateLip}
        </text>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Wall cross-section + plumbing                                       */
/* ------------------------------------------------------------------ */

function CrossSection({
  tiers,
  labels,
}: {
  tiers: Tier[];
  labels: {
    pvcCore: string;
    veneerSkin: string;
    substrateLip: string;
    canopyLip: string;
    ventBaffle: string;
    plumbing: string;
    noPlumbing: string;
    bulkhead: string;
    canister: string;
  };
}) {
  const units = tiers.flatMap((t) => t.units);
  const plumbed = units.filter((u) => getWater(u.custom.water).bulkhead);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* --- layer stack --- */}
      <svg viewBox="0 0 520 420" className="h-auto w-full">
        <defs>
          <pattern id="pvcHatch" width="8" height="8" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="8" stroke="#9aa1a8" strokeWidth="1.4" />
          </pattern>
        </defs>

        {/* veneer skin */}
        <rect x="60" y="60" width="40" height="280" fill="#C19A6B" />
        {/* PVC core */}
        <rect x="100" y="60" width="80" height="280" fill="url(#pvcHatch)" stroke={STROKE} strokeWidth="2" />
        {/* interior */}
        <rect x="180" y="60" width="240" height="280" fill="#111315" stroke={STROKE} strokeWidth="1.5" />

        {/* substrate bed + retaining lip */}
        <rect x="180" y="270" width="240" height="70" fill={DIM} opacity="0.2" />
        <rect x="180" y="250" width="14" height="90" fill={STROKE} opacity="0.85" />
        <text x="205" y="300" fill={INK} fontSize="15">{labels.substrateLip} 250</text>

        {/* canopy lip */}
        <rect x="180" y="60" width="240" height="40" fill="#9aa1a8" opacity="0.28" />
        <text x="205" y="86" fill={INK} fontSize="15">{labels.canopyLip} 80</text>

        {/* vent baffle */}
        <rect x="396" y="100" width="24" height="10" fill={STROKE} />
        <text x="300" y="130" fill={STROKE} fontSize="14">{labels.ventBaffle}</text>

        {/* glass + track */}
        <rect x="414" y="100" width="6" height="240" fill="#7dd3fc" opacity="0.5" />

        {/* callouts */}
        <line x1="80" y1="50" x2="80" y2="26" stroke={DIM} strokeWidth="1.5" />
        <text x="80" y="20" fill={DIM} fontSize="16" textAnchor="middle">{labels.veneerSkin} 5</text>
        <line x1="140" y1="50" x2="140" y2="380" stroke={DIM} strokeWidth="1" strokeDasharray="4 4" />
        <text x="146" y="398" fill={DIM} fontSize="16">{labels.pvcCore} 10</text>

        {/* dimension for total shell */}
        <line x1="60" y1="356" x2="180" y2="356" stroke={DIM} strokeWidth="1.5" />
        <text x="120" y="374" fill={DIM} fontSize="16" textAnchor="middle" fontFamily="monospace">15</text>
      </svg>

      {/* --- plumbing schematic --- */}
      <div>
        <h4 className="mb-3 text-[10px] font-semibold uppercase tracking-cinematic text-ink-3">
          {labels.plumbing}
        </h4>
        {plumbed.length === 0 ? (
          <p className="text-sm text-ink-4">{labels.noPlumbing}</p>
        ) : (
          <svg viewBox="0 0 520 300" className="h-auto w-full">
            {/* basin */}
            <rect x="40" y="40" width="300" height="120" fill="#2e6f7a" opacity="0.32" stroke={STROKE} strokeWidth="2" />
            <text x="190" y="30" fill={INK} fontSize="16" textAnchor="middle">
              {plumbed.length}× {labels.bulkhead}
            </text>
            {/* bulkhead */}
            <circle cx="120" cy="160" r="14" fill="none" stroke={DIM} strokeWidth="3" />
            <text x="120" y="196" fill={DIM} fontSize="15" textAnchor="middle" fontFamily="monospace">⌀25</text>
            {/* drain line to canister */}
            <path d="M120 174 L120 230 L400 230 L400 160" fill="none" stroke={STROKE} strokeWidth="3" />
            {/* canister filter */}
            <rect x="370" y="120" width="60" height="40" rx="6" fill="#1f2429" stroke={STROKE} strokeWidth="2" />
            <text x="400" y="112" fill={INK} fontSize="15" textAnchor="middle">{labels.canister}</text>
            {/* return line */}
            <path d="M400 120 L400 70 L340 70" fill="none" stroke={DIM} strokeWidth="3" strokeDasharray="8 5" />
            <polygon points="340,64 328,70 340,76" fill={DIM} />
          </svg>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* CNC sheet nesting                                                   */
/* ------------------------------------------------------------------ */

function Nesting({
  nest,
  locale,
  labels,
}: {
  nest: ReturnType<typeof nestParts>;
  locale: Locale;
  labels: { sheets: string; waste: string; kerf: string; oversized: string };
}) {
  const SCALE = 0.17; // mm → px in the viewBox

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-x-6 gap-y-1 text-xs">
        <span className="text-ink-3">
          {labels.sheets}:{" "}
          <strong className="font-semibold text-amber-glow">{nest.sheets.length}</strong>{" "}
          <span className="text-ink-4">
            ({PVC_SHEET.width}×{PVC_SHEET.height}×{PVC_SHEET.thicknessMm} mm)
          </span>
        </span>
        <span className="text-ink-3">
          {labels.waste}:{" "}
          <strong className="font-semibold text-ink">{(nest.wasteRatio * 100).toFixed(1)}%</strong>
        </span>
        <span className="text-ink-4">
          {labels.kerf}: {nest.kerfMm} mm
        </span>
      </div>

      {nest.oversized.length > 0 && (
        <p className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
          {labels.oversized}:{" "}
          {nest.oversized.map((p) => `${p.w}×${p.h}`).join(", ")}
        </p>
      )}

      <div className="flex flex-col gap-4">
        {nest.sheets.map((sheet) => (
          <div key={sheet.index}>
            <p className="mb-1.5 font-mono text-[11px] text-ink-4">
              #{sheet.index + 1} — {(sheet.usage * 100).toFixed(1)}%
            </p>
            <svg
              viewBox={`0 0 ${PVC_SHEET.width * SCALE} ${PVC_SHEET.height * SCALE}`}
              className="h-auto w-full rounded-lg border border-white/10 bg-void"
            >
              {sheet.parts.map((p) => {
                const w = (p.rotated ? p.h : p.w) * SCALE;
                const h = (p.rotated ? p.w : p.h) * SCALE;
                const color =
                  p.role === "back"
                    ? "#e58a3c"
                    : p.role === "side"
                    ? "#7dd3fc"
                    : p.role === "floor"
                    ? "#9e472a"
                    : "#6b8e23";
                return (
                  <g key={p.id}>
                    <rect
                      x={p.x * SCALE}
                      y={p.y * SCALE}
                      width={w}
                      height={h}
                      fill={color}
                      fillOpacity="0.22"
                      stroke={color}
                      strokeWidth="1"
                    />
                    {w > 46 && h > 18 && (
                      <text
                        x={p.x * SCALE + w / 2}
                        y={p.y * SCALE + h / 2 + 3}
                        fill={color}
                        fontSize="9"
                        textAnchor="middle"
                        fontFamily="monospace"
                      >
                        {ROLE_LABELS[p.role][locale === "hu" ? "hu" : "en"]} {p.w}×{p.h}
                        {p.rotated ? " ↻" : ""}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
}
