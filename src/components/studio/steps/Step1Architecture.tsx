"use client";

import { Columns2, Minus, Plus, Rows3, Trash2 } from "lucide-react";
import type { Dictionary, Locale } from "@/lib/i18n/dictionaries";
import { LIMITS, PRESETS, useVivarium } from "@/lib/store/vivarium-store";
import { getSpecies } from "@/lib/data/species-database";
import { cn } from "@/lib/utils/cn";

export default function Step1Architecture({
  t,
  locale,
}: {
  t: Dictionary["studio"];
  locale: Locale;
}) {
  const {
    tiers, applyPreset, addTier, removeTier, addUnit, removeUnit,
    splitUnit, mergeWithNext, setUnitDim, selectedUnitId, selectUnit,
  } = useVivarium();

  const pick = (b: { hu: string; en: string }) => (locale === "hu" ? b.hu : b.en);
  const selected = tiers.flatMap((tr) => tr.units).find((u) => u.id === selectedUnitId);
  const totalUnits = tiers.reduce((s, tr) => s + tr.units.length, 0);
  const wallW = Math.max(...tiers.map((tr) => tr.units.reduce((s, u) => s + u.width, 0)));
  const wallH = tiers.reduce((s, tr) => s + Math.max(...tr.units.map((u) => u.height)), 0);

  return (
    <div className="flex flex-col gap-6">
      {/* ---- Presets ---- */}
      <section>
        <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-cinematic text-ink-3">
          {t.presets}
        </h3>
        <div className="grid gap-2 sm:grid-cols-2">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => applyPreset(p.id)}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-left transition-colors hover:border-amber-glow/40 hover:bg-amber-glow/[0.06]"
            >
              <span className="block text-[13px] font-semibold text-ink">{pick(p.name)}</span>
              <span className="mt-0.5 block text-[11px] leading-snug text-ink-3">
                {pick(p.detail)}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* ---- Wall summary ---- */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-1 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs">
        <span className="text-ink-3">
          {t.wallSummary}:{" "}
          <strong className="font-mono font-semibold text-ink">{wallW} × {wallH} cm</strong>
        </span>
        <span className="text-ink-3">
          {totalUnits} {t.unitsCount}
        </span>
        <div className="ml-auto flex gap-1.5">
          <button
            onClick={() => addTier("top")}
            className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-2.5 py-1.5 text-[11px] font-medium text-ink-2 transition-colors hover:bg-white/[0.08] hover:text-ink"
          >
            <Rows3 className="h-3 w-3" /> {t.addTierTop}
          </button>
          <button
            onClick={() => addTier("bottom")}
            className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-2.5 py-1.5 text-[11px] font-medium text-ink-2 transition-colors hover:bg-white/[0.08] hover:text-ink"
          >
            <Rows3 className="h-3 w-3" /> {t.addTierBottom}
          </button>
        </div>
      </div>

      {/* ---- Tier / unit editor ---- */}
      <div className="flex flex-col gap-3">
        {tiers.map((tier, ti) => (
          <div key={tier.id} className="rounded-2xl border border-white/10 bg-white/[0.02] p-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-cinematic text-ink-4">
                {t.tier} {ti + 1}
              </span>
              <div className="flex gap-1.5">
                <button
                  onClick={() => addUnit(tier.id)}
                  className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-2 py-1 text-[11px] text-ink-2 transition-colors hover:bg-white/[0.08] hover:text-ink"
                >
                  <Plus className="h-3 w-3" /> {t.addUnit}
                </button>
                {tiers.length > 1 && (
                  <button
                    onClick={() => removeTier(tier.id)}
                    className="rounded-lg border border-white/10 px-2 py-1 text-[11px] text-ink-4 transition-colors hover:border-red-500/40 hover:text-red-400"
                    aria-label={t.removeTier}
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {tier.units.map((u, ui) => {
                const sp = getSpecies(u.custom.speciesId);
                const isSel = selectedUnitId === u.id;
                return (
                  <button
                    key={u.id}
                    onClick={() => selectUnit(u.id)}
                    className={cn(
                      "min-w-[130px] flex-1 rounded-xl border p-2.5 text-left transition-colors",
                      isSel
                        ? "border-amber-glow/60 bg-amber-glow/[0.1]"
                        : "border-white/10 bg-white/[0.03] hover:border-white/20"
                    )}
                  >
                    <span className="block font-mono text-[11px] font-semibold text-ink">
                      {u.width}×{u.depth}×{u.height}
                    </span>
                    <span className="mt-0.5 block truncate text-[10px] text-ink-3">
                      {sp ? (locale === "hu" ? sp.nameHu : sp.nameEn) : "—"}
                    </span>
                    <span className="mt-1.5 flex gap-1">
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={(e) => { e.stopPropagation(); splitUnit(u.id); }}
                        onKeyDown={(e) => { if (e.key === "Enter") { e.stopPropagation(); splitUnit(u.id); } }}
                        title={t.split}
                        className="rounded border border-white/10 px-1 py-0.5 text-[9px] text-ink-4 hover:text-ink"
                      >
                        <Columns2 className="h-2.5 w-2.5" />
                      </span>
                      {ui < tier.units.length - 1 && (
                        <span
                          role="button"
                          tabIndex={0}
                          onClick={(e) => { e.stopPropagation(); mergeWithNext(u.id); }}
                          onKeyDown={(e) => { if (e.key === "Enter") { e.stopPropagation(); mergeWithNext(u.id); } }}
                          title={t.merge}
                          className="rounded border border-white/10 px-1 py-0.5 text-[9px] text-ink-4 hover:text-ink"
                        >
                          <Minus className="h-2.5 w-2.5" />
                        </span>
                      )}
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={(e) => { e.stopPropagation(); removeUnit(u.id); }}
                        onKeyDown={(e) => { if (e.key === "Enter") { e.stopPropagation(); removeUnit(u.id); } }}
                        title={t.removeUnit}
                        className="rounded border border-white/10 px-1 py-0.5 text-[9px] text-ink-4 hover:text-red-400"
                      >
                        <Trash2 className="h-2.5 w-2.5" />
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* ---- Dimension sliders for the selected unit ---- */}
      <section className="rounded-2xl border border-white/10 bg-surface p-4">
        <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-cinematic text-amber-glow">
          {t.selectedUnit}
        </h3>
        {!selected ? (
          <p className="text-xs text-ink-4">{t.selectUnitHint}</p>
        ) : (
          <div className="flex flex-col gap-3">
            {(
              [
                ["width", t.width],
                ["height", t.height],
                ["depth", t.depth],
              ] as const
            ).map(([kind, label]) => (
              <label key={kind} className="block">
                <span className="mb-1 flex justify-between text-[11px] text-ink-3">
                  {label}
                  <strong className="font-mono font-semibold text-ink">
                    {selected[kind]} cm
                  </strong>
                </span>
                <input
                  type="range"
                  min={LIMITS[kind].min}
                  max={LIMITS[kind].max}
                  step={5}
                  value={selected[kind]}
                  onChange={(e) => setUnitDim(selected.id, kind, Number(e.target.value))}
                  className="w-full accent-amber-glow"
                />
                <span className="mt-0.5 flex justify-between font-mono text-[9px] text-ink-4">
                  <span>{LIMITS[kind].min}</span>
                  <span>{LIMITS[kind].max}</span>
                </span>
              </label>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
