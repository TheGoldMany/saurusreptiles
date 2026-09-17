"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, Check, Info, Search, X } from "lucide-react";
import type { Dictionary, Locale } from "@/lib/i18n/dictionaries";
import { useVivarium } from "@/lib/store/vivarium-store";
import {
  ARCADIA_SPEC,
  BEHAVIOUR_LABELS,
  CATEGORY_LABELS,
  DIET_LABELS,
  SPECIES_DB,
  floraFor,
  getSpecies,
  type SpeciesCategory,
} from "@/lib/data/species-database";
import { exceedsSystem, fitsUnit, validateUnit } from "@/lib/studio/pricing";
import { cn } from "@/lib/utils/cn";

export default function Step2Species({
  t,
  locale,
}: {
  t: Dictionary["studio"];
  locale: Locale;
}) {
  const { tiers, selectedUnitId, selectUnit, updateUnit } = useVivarium();
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<SpeciesCategory | "all">("all");
  const [onlyFitting, setOnlyFitting] = useState(false);

  const L = (b: { hu: string; en: string }) => (locale === "hu" ? b.hu : b.en);
  const units = tiers.flatMap((tr) => tr.units);
  const unit = units.find((u) => u.id === selectedUnitId) ?? units[0] ?? null;

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SPECIES_DB.filter((s) => {
      if (cat !== "all" && s.category !== cat) return false;
      if (onlyFitting && unit && !fitsUnit(s, unit)) return false;
      if (!q) return true;
      return (
        s.nameHu.toLowerCase().includes(q) ||
        s.nameEn.toLowerCase().includes(q) ||
        s.latinName.toLowerCase().includes(q)
      );
    });
  }, [query, cat, onlyFitting, unit]);

  const assigned = getSpecies(unit?.custom.speciesId);
  const issues = unit ? validateUnit(unit) : [];

  return (
    <div className="flex flex-col gap-5">
      {/* ---- Which module are we filling? ---- */}
      <div className="flex flex-wrap gap-2">
        {units.map((u) => {
          const sp = getSpecies(u.custom.speciesId);
          const errs = validateUnit(u).filter((i) => i.level === "error").length;
          return (
            <button
              key={u.id}
              onClick={() => selectUnit(u.id)}
              className={cn(
                "relative rounded-xl border px-3 py-2 text-left transition-colors",
                u.id === unit?.id
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
              {errs > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                  {errs}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ---- Filters ---- */}
      <div className="flex flex-col gap-2">
        <label className="relative block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-4" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.searchSpecies}
            className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-2.5 pl-10 pr-3 text-sm text-ink placeholder-ink-4 outline-none transition-colors focus:border-amber-glow/60"
          />
        </label>
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setCat("all")}
            className={cn(
              "rounded-lg px-2.5 py-1 text-[11px] font-medium transition-colors",
              cat === "all" ? "bg-amber-glow/15 text-amber-glow" : "text-ink-3 hover:bg-white/[0.06]"
            )}
          >
            {t.allCategories}
          </button>
          {(Object.keys(CATEGORY_LABELS) as SpeciesCategory[]).map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={cn(
                "rounded-lg px-2.5 py-1 text-[11px] font-medium transition-colors",
                cat === c ? "bg-amber-glow/15 text-amber-glow" : "text-ink-3 hover:bg-white/[0.06]"
              )}
            >
              {L(CATEGORY_LABELS[c])}
            </button>
          ))}
          {unit && (
            <label className="ml-auto flex cursor-pointer items-center gap-1.5 text-[11px] text-ink-3">
              <input
                type="checkbox"
                checked={onlyFitting}
                onChange={(e) => setOnlyFitting(e.target.checked)}
                className="accent-amber-glow"
              />
              {t.onlyFitting}
            </label>
          )}
        </div>
      </div>

      {/* ---- Species list ---- */}
      <div className="max-h-[360px] overflow-y-auto rounded-2xl border border-white/10">
        {list.length === 0 ? (
          <p className="p-6 text-center text-xs text-ink-4">{t.noSpeciesMatch}</p>
        ) : (
          <ul className="divide-y divide-white/[0.06]">
            {list.map((s) => {
              const fits = unit ? fitsUnit(s, unit) : true;
              const tooBig = exceedsSystem(s);
              const isAssigned = assigned?.id === s.id;
              return (
                <li key={s.id}>
                  <button
                    disabled={!unit}
                    onClick={() => unit && updateUnit(unit.id, { speciesId: s.id })}
                    className={cn(
                      "flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors",
                      isAssigned ? "bg-amber-glow/[0.08]" : "hover:bg-white/[0.04]"
                    )}
                  >
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="truncate text-[13px] font-semibold text-ink">
                          {L({ hu: s.nameHu, en: s.nameEn })}
                        </span>
                        {tooBig ? (
                          <span className="shrink-0 rounded border border-red-500/40 px-1.5 py-0.5 text-[9px] font-semibold text-red-400">
                            {t.tooLargeBadge}
                          </span>
                        ) : !fits ? (
                          <AlertTriangle className="h-3 w-3 shrink-0 text-amber-glow" />
                        ) : null}
                        {isAssigned && <Check className="h-3.5 w-3.5 shrink-0 text-amber-glow" />}
                      </span>
                      <span className="block truncate text-[11px] italic text-ink-4">
                        {s.latinName}
                      </span>
                    </span>
                    <span className="shrink-0 text-right">
                      <span className="block font-mono text-[10px] text-ink-3">
                        Z{s.fergusonZone} · {s.minVolumeL} L
                      </span>
                      <span className="block font-mono text-[10px] text-ink-4">
                        {s.minFootprintCm[0]}×{s.minFootprintCm[1]}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* ---- Assigned species detail + validation ---- */}
      {assigned && unit && (
        <section className="rounded-2xl border border-white/10 bg-surface p-4">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-ink">
                {L({ hu: assigned.nameHu, en: assigned.nameEn })}
              </h3>
              <p className="text-[11px] italic text-ink-4">{assigned.latinName}</p>
            </div>
            <button
              onClick={() => updateUnit(unit.id, { speciesId: null })}
              className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-2 py-1 text-[10px] text-ink-4 transition-colors hover:text-red-400"
            >
              <X className="h-3 w-3" /> {t.clearSpecies}
            </button>
          </div>

          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3">
            <Spec label={t.fergusonZone} value={`${assigned.fergusonZone} (${assigned.uviRange[0]}–${assigned.uviRange[1]} UVI)`} />
            <Spec label={t.basking} value={`${assigned.temps.baskingC} °C`} />
            <Spec label={t.coolEnd} value={`${assigned.temps.coolC} °C`} />
            <Spec label={t.nightDrop} value={`${assigned.temps.nightC} °C`} />
            <Spec label={t.humidity} value={`${assigned.humidity[0]}–${assigned.humidity[1]}%`} />
            <Spec label={t.diet} value={L(DIET_LABELS[assigned.diet])} />
            <Spec label={t.minVolume} value={`${assigned.minVolumeL} L`} />
            <Spec label={t.minFootprint} value={`${assigned.minFootprintCm[0]}×${assigned.minFootprintCm[1]} cm`} />
            <Spec
              label={t.behaviours}
              value={assigned.behaviours.map((b) => L(BEHAVIOUR_LABELS[b])).join(", ") || "—"}
            />
          </dl>

          <p className="mt-3 rounded-xl border border-amber-glow/25 bg-amber-glow/[0.07] p-2.5 text-[11px] text-amber-glow">
            {t.arcadiaTube}: {ARCADIA_SPEC[assigned.fergusonZone].tube}
            <span className="mt-0.5 block text-ink-3">
              {L(ARCADIA_SPEC[assigned.fergusonZone].note)}
            </span>
          </p>

          {/* flora */}
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <FloraList title={t.safeFlora} items={floraFor(assigned.floraSet).safe} tone="safe" />
            <FloraList title={t.toxicFlora} items={floraFor(assigned.floraSet).toxic} tone="toxic" />
          </div>

          {/* validation */}
          {issues.length > 0 && (
            <ul className="mt-3 flex flex-col gap-1.5">
              {issues.map((i) => (
                <li
                  key={i.code}
                  className={cn(
                    "flex items-start gap-2 rounded-xl border p-2.5 text-[11px] leading-relaxed",
                    i.level === "error"
                      ? "border-red-500/30 bg-red-500/10 text-red-400"
                      : i.level === "warning"
                      ? "border-amber-glow/30 bg-amber-glow/10 text-amber-glow"
                      : "border-white/10 bg-white/[0.03] text-ink-3"
                  )}
                >
                  {i.level === "info" ? (
                    <Info className="mt-0.5 h-3 w-3 shrink-0" />
                  ) : (
                    <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />
                  )}
                  {L(i.message)}
                </li>
              ))}
            </ul>
          )}

          <p className="mt-3 text-[10px] leading-relaxed text-ink-4">{t.reviewNote}</p>
        </section>
      )}
    </div>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[9px] uppercase tracking-wide text-ink-4">{label}</dt>
      <dd className="font-mono text-[11px] text-ink-2">{value}</dd>
    </div>
  );
}

function FloraList({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "safe" | "toxic";
}) {
  if (items.length === 0) return null;
  return (
    <div>
      <p
        className={cn(
          "mb-1 text-[9px] font-semibold uppercase tracking-wide",
          tone === "safe" ? "text-emerald-400" : "text-red-400"
        )}
      >
        {title}
      </p>
      <ul className="flex flex-col gap-0.5">
        {items.map((f) => (
          <li key={f} className="text-[10px] italic leading-snug text-ink-3">
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}
