"use client";

import { Moon, Sun, Sunset } from "lucide-react";
import type { Dictionary, Locale } from "@/lib/i18n/dictionaries";
import { useVivarium } from "@/lib/store/vivarium-store";
import { ARCADIA_SPEC, getSpecies } from "@/lib/data/species-database";
import { FINISHES, LIGHTING } from "@/lib/studio/catalog";
import { cn } from "@/lib/utils/cn";

const ICONS = { daylight: Sun, sunset: Sunset, nocturnal: Moon } as const;

export default function Step4Furniture({
  t,
  locale,
}: {
  t: Dictionary["studio"];
  locale: Locale;
}) {
  const { tiers, furniture, setFinish, setLighting } = useVivarium();
  const L = (b: { hu: string; en: string }) => (locale === "hu" ? b.hu : b.en);
  const units = tiers.flatMap((tr) => tr.units);

  return (
    <div className="flex flex-col gap-6">
      {/* ---- Hardwood finish ---- */}
      <section>
        <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-cinematic text-ink-3">
          {t.finishes}
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {FINISHES.map((f) => (
            <button
              key={f.id}
              onClick={() => setFinish(f.id)}
              className={cn(
                "rounded-2xl border p-2.5 text-left transition-colors",
                furniture.finish === f.id
                  ? "border-amber-glow/60 bg-amber-glow/[0.08]"
                  : "border-white/10 bg-white/[0.03] hover:border-white/20"
              )}
            >
              <span
                className="block h-8 w-full rounded-lg ring-1 ring-inset ring-white/10"
                style={{
                  background: `linear-gradient(135deg, ${f.light}, ${f.base} 55%, ${f.dark})`,
                }}
              />
              <span className="mt-2 block text-[12px] font-semibold text-ink">{L(f.name)}</span>
              <span className="block text-[10px] leading-snug text-ink-3">{L(f.detail)}</span>
              <span className="mt-1 block font-mono text-[10px] text-ink-4">
                {new Intl.NumberFormat("hu-HU").format(f.pricePerSqm)} Ft/m²
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* ---- Lighting ---- */}
      <section>
        <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-cinematic text-ink-3">
          {t.lightingMode}
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {LIGHTING.map((l) => {
            const Icon = ICONS[l.id];
            const active = furniture.lighting === l.id;
            return (
              <button
                key={l.id}
                onClick={() => setLighting(l.id)}
                title={L(l.detail)}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-2xl border p-3 text-center transition-colors",
                  active
                    ? "border-amber-glow/60 bg-amber-glow/[0.1]"
                    : "border-white/10 bg-white/[0.03] hover:border-white/20"
                )}
              >
                <Icon className={cn("h-4 w-4", active ? "text-amber-glow" : "text-ink-4")} />
                <span className={cn("text-[11px] font-medium leading-tight", active ? "text-ink" : "text-ink-2")}>
                  {L(l.name)}
                </span>
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-[11px] text-ink-4">
          {L(LIGHTING.find((l) => l.id === furniture.lighting)!.detail)}
        </p>
      </section>

      {/* ---- Auto-derived technical spec per module ---- */}
      <section>
        <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-cinematic text-amber-glow">
          {t.autoSpec}
        </h3>
        <div className="overflow-hidden rounded-2xl border border-white/10">
          <table className="w-full text-left text-[11px]">
            <thead className="border-b border-white/10 bg-white/[0.03] text-[9px] uppercase tracking-wide text-ink-4">
              <tr>
                <th className="px-3 py-2">{t.selectedUnit}</th>
                <th className="px-3 py-2">{t.fergusonZone}</th>
                <th className="px-3 py-2">{t.arcadiaTube}</th>
              </tr>
            </thead>
            <tbody>
              {units.map((u) => {
                const sp = getSpecies(u.custom.speciesId);
                return (
                  <tr key={u.id} className="border-t border-white/[0.06]">
                    <td className="px-3 py-2 font-mono text-ink-2">
                      {u.width}×{u.depth}×{u.height}
                      <span className="ml-1.5 text-ink-4">
                        {sp ? L({ hu: sp.nameHu, en: sp.nameEn }) : "—"}
                      </span>
                    </td>
                    <td className="px-3 py-2 font-mono text-ink-3">
                      {sp ? `Z${sp.fergusonZone}` : "—"}
                    </td>
                    <td className="px-3 py-2 text-ink-2">
                      {sp ? ARCADIA_SPEC[sp.fergusonZone].tube : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
