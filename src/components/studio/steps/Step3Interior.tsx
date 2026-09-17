"use client";

import { Droplets } from "lucide-react";
import type { Dictionary, Locale } from "@/lib/i18n/dictionaries";
import { useVivarium } from "@/lib/store/vivarium-store";
import { getSpecies } from "@/lib/data/species-database";
import { BIOMES, CLEANUP_CREW, SUBSTRATES, WATER_MODULES } from "@/lib/studio/catalog";
import { cn } from "@/lib/utils/cn";

export default function Step3Interior({
  t,
  locale,
}: {
  t: Dictionary["studio"];
  locale: Locale;
}) {
  const { tiers, selectedUnitId, selectUnit, updateUnit } = useVivarium();
  const L = (b: { hu: string; en: string }) => (locale === "hu" ? b.hu : b.en);

  const units = tiers.flatMap((tr) => tr.units);
  const unit = units.find((u) => u.id === selectedUnitId) ?? units[0] ?? null;
  if (!unit) return null;

  const species = getSpecies(unit.custom.speciesId);
  const arid = species ? species.humidity[1] <= 55 : false;
  const crew = CLEANUP_CREW.filter((c) => (arid ? c.forArid : true));

  const toggleCrew = (id: string) => {
    const has = unit.custom.cleanupCrew.includes(id);
    updateUnit(unit.id, {
      cleanupCrew: has
        ? unit.custom.cleanupCrew.filter((c) => c !== id)
        : [...unit.custom.cleanupCrew, id],
    });
  };

  return (
    <div className="flex flex-col gap-5">
      {/* module picker */}
      <div className="flex flex-wrap gap-2">
        {units.map((u) => {
          const sp = getSpecies(u.custom.speciesId);
          return (
            <button
              key={u.id}
              onClick={() => selectUnit(u.id)}
              className={cn(
                "rounded-xl border px-3 py-2 text-left transition-colors",
                u.id === unit.id
                  ? "border-amber-glow/60 bg-amber-glow/[0.1]"
                  : "border-white/10 bg-white/[0.03] hover:border-white/20"
              )}
            >
              <span className="block font-mono text-[11px] font-semibold text-ink">
                {u.width}×{u.depth}×{u.height}
              </span>
              <span className="block max-w-[140px] truncate text-[10px] text-ink-3">
                {sp ? L({ hu: sp.nameHu, en: sp.nameEn }) : "—"}
              </span>
            </button>
          );
        })}
      </div>

      {/* biome */}
      <section>
        <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-cinematic text-ink-3">
          {t.biome}
        </h3>
        <div className="flex flex-col gap-2">
          {BIOMES.map((b) => (
            <button
              key={b.id}
              onClick={() => updateUnit(unit.id, { biome: b.id })}
              className={cn(
                "flex items-center gap-3 rounded-2xl border p-2.5 text-left transition-colors",
                unit.custom.biome === b.id
                  ? "border-amber-glow/60 bg-amber-glow/[0.08]"
                  : "border-white/10 bg-white/[0.03] hover:border-white/20"
              )}
            >
              <span
                className="h-9 w-12 shrink-0 rounded-lg ring-1 ring-inset ring-white/10"
                style={{
                  background: `linear-gradient(135deg, ${b.rockDark}, ${b.rockMid} 45%, ${b.rockLight} 75%, ${b.accent})`,
                }}
              />
              <span>
                <span className="block text-[13px] font-semibold text-ink">{L(b.name)}</span>
                <span className="block text-[11px] leading-snug text-ink-3">{L(b.detail)}</span>
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* substrate */}
      <section>
        <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-cinematic text-ink-3">
          {t.substrateSystem}
        </h3>
        <div className="grid gap-2 sm:grid-cols-2">
          {SUBSTRATES.map((s) => (
            <button
              key={s.id}
              onClick={() => updateUnit(unit.id, { substrate: s.id })}
              className={cn(
                "rounded-2xl border p-3 text-left transition-colors",
                unit.custom.substrate === s.id
                  ? "border-amber-glow/60 bg-amber-glow/[0.08]"
                  : "border-white/10 bg-white/[0.03] hover:border-white/20"
              )}
            >
              <span className="block text-[13px] font-semibold text-ink">{L(s.name)}</span>
              <span className="mt-0.5 block text-[11px] leading-snug text-ink-3">{L(s.detail)}</span>
            </button>
          ))}
        </div>
      </section>

      {/* clean-up crew */}
      {unit.custom.substrate === "bioactive" && (
        <section>
          <h3 className="mb-1 text-[10px] font-semibold uppercase tracking-cinematic text-ink-3">
            {t.cleanupCrew}
          </h3>
          <p className="mb-2 text-[11px] text-ink-4">{t.cleanupCrewHelp}</p>
          <div className="flex flex-wrap gap-1.5">
            {crew.map((c) => {
              const on = unit.custom.cleanupCrew.includes(c.id);
              return (
                <button
                  key={c.id}
                  onClick={() => toggleCrew(c.id)}
                  className={cn(
                    "rounded-lg border px-2.5 py-1.5 text-[11px] transition-colors",
                    on
                      ? "border-emerald-400/50 bg-emerald-400/10 text-emerald-300"
                      : "border-white/10 text-ink-3 hover:border-white/25"
                  )}
                >
                  {L(c.name)}
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* water */}
      <section>
        <h3 className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-cinematic text-ink-3">
          <Droplets className="h-3 w-3 text-cyan-glow" />
          {t.waterSystem}
        </h3>
        <div className="flex flex-col gap-2">
          {WATER_MODULES.map((w) => (
            <button
              key={w.id}
              onClick={() => updateUnit(unit.id, { water: w.id })}
              className={cn(
                "flex items-start justify-between gap-3 rounded-2xl border p-3 text-left transition-colors",
                unit.custom.water === w.id
                  ? "border-amber-glow/60 bg-amber-glow/[0.08]"
                  : "border-white/10 bg-white/[0.03] hover:border-white/20"
              )}
            >
              <span>
                <span className="block text-[13px] font-semibold text-ink">{L(w.name)}</span>
                <span className="mt-0.5 block text-[11px] leading-snug text-ink-3">{L(w.detail)}</span>
              </span>
              {w.price > 0 && (
                <span className="shrink-0 font-mono text-[11px] text-ink-4">
                  +{new Intl.NumberFormat("hu-HU").format(w.price)}
                </span>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* misting */}
      <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
        <input
          type="checkbox"
          checked={unit.custom.mistingPrep}
          onChange={(e) => updateUnit(unit.id, { mistingPrep: e.target.checked })}
          className="mt-0.5 accent-amber-glow"
        />
        <span>
          <span className="block text-[13px] font-semibold text-ink">{t.mistingPrep}</span>
          <span className="mt-0.5 block text-[11px] leading-snug text-ink-3">
            {t.mistingPrepHelp}
          </span>
        </span>
      </label>
    </div>
  );
}
