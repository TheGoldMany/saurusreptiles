"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, Check, Download, Info, Printer, Send } from "lucide-react";
import type { Dictionary, Locale } from "@/lib/i18n/dictionaries";
import { useVivarium } from "@/lib/store/vivarium-store";
import { getSpecies } from "@/lib/data/species-database";
import { getBiome, getFinish, getLighting, getWater } from "@/lib/studio/catalog";
import { quoteBuild, validateBuild, EUR_RATE } from "@/lib/studio/pricing";
import { nestParts, partsForBuild } from "@/lib/studio/sheet-optimizer";
import { formatHuf } from "@/components/helpers";
import BlueprintView from "@/components/blueprint/BlueprintView";
import AnimatedNumber from "@/components/ui/AnimatedNumber";
import { cn } from "@/lib/utils/cn";

export default function Step5Summary({
  t,
  locale,
  defaultName = "",
  defaultEmail = "",
}: {
  t: Dictionary["studio"];
  locale: Locale;
  defaultName?: string;
  defaultEmail?: string;
}) {
  const { tiers, furniture } = useVivarium();
  const L = (b: { hu: string; en: string }) => (locale === "hu" ? b.hu : b.en);

  const quote = useMemo(() => quoteBuild(tiers, furniture), [tiers, furniture]);
  const nest = useMemo(() => nestParts(partsForBuild(tiers)), [tiers]);
  const issues = useMemo(() => validateBuild(tiers), [tiers]);

  const allIssues = [...issues.values()].flat();
  const errors = allIssues.filter((i) => i.level === "error");
  const warnings = allIssues.filter((i) => i.level === "warning");

  const [form, setForm] = useState({ name: defaultName, email: defaultEmail, phone: "", message: "" });
  const [sent, setSent] = useState(false);

  /** Machine-readable spec — what actually goes to the workshop. */
  const spec = useMemo(
    () => ({
      generatedAt: new Date().toISOString(),
      furniture: {
        finish: furniture.finish,
        finishName: getFinish(furniture.finish).name.en,
        lighting: furniture.lighting,
        lightingName: getLighting(furniture.lighting).name.en,
      },
      wall: tiers.map((tier, ti) => ({
        tier: ti + 1,
        units: tier.units.map((u) => {
          const sp = getSpecies(u.custom.speciesId);
          return {
            id: u.id,
            dimensionsCm: { width: u.width, height: u.height, depth: u.depth },
            volumeL: Math.round((u.width * u.depth * u.height) / 1000),
            species: sp
              ? {
                  id: sp.id,
                  latinName: sp.latinName,
                  fergusonZone: sp.fergusonZone,
                  baskingC: sp.temps.baskingC,
                  humidity: sp.humidity,
                }
              : null,
            biome: getBiome(u.custom.biome).name.en,
            substrate: u.custom.substrate,
            cleanupCrew: u.custom.cleanupCrew,
            water: u.custom.water,
            waterName: getWater(u.custom.water).name.en,
            mistingPrep: u.custom.mistingPrep,
          };
        }),
      })),
      billOfMaterials: quote.lines.map((l) => ({
        key: l.key,
        label: l.label.en,
        qty: l.qty,
        amountHuf: l.amount,
      })),
      totals: {
        netHuf: quote.total,
        approxEur: quote.eur,
        eurRate: EUR_RATE,
        unitCount: quote.unitCount,
        totalVolumeL: Math.round(quote.totalVolumeL),
        pvcSqm: Number(quote.pvcSqm.toFixed(2)),
        chiselHours: quote.chiselHours,
      },
      sheetPlan: {
        board: "3050×1560×10 mm foamed PVC",
        boardsRequired: nest.sheets.length,
        wastePercent: Number((nest.wasteRatio * 100).toFixed(1)),
        kerfMm: nest.kerfMm,
        sheets: nest.sheets.map((s) => ({
          index: s.index + 1,
          usagePercent: Number((s.usage * 100).toFixed(1)),
          parts: s.parts.map((p) => ({
            unitId: p.unitId,
            role: p.role,
            widthMm: p.w,
            heightMm: p.h,
            xMm: p.x,
            yMm: p.y,
            rotated: p.rotated,
          })),
        })),
      },
      validation: {
        errors: errors.map((e) => e.message.en),
        warnings: warnings.map((w) => w.message.en),
      },
      disclaimer:
        "Husbandry figures are indicative and require specialist review. Prices are an indicative net estimate.",
    }),
    [tiers, furniture, quote, nest, errors, warnings]
  );

  const downloadJson = () => {
    const blob = new Blob([JSON.stringify(spec, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `saurus-vivarium-spec-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const canSend = form.name.trim() !== "" && /.+@.+\..+/.test(form.email);

  return (
    <div className="flex flex-col gap-6">
      {/* ---- Validation banner ---- */}
      {errors.length > 0 ? (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-red-400">
            <AlertTriangle className="h-4 w-4" />
            {t.blocked} ({errors.length})
          </p>
          <p className="mt-1.5 text-[11px] leading-relaxed text-ink-3">{t.blockedText}</p>
          <ul className="mt-2 flex flex-col gap-1">
            {errors.map((e, i) => (
              <li key={i} className="text-[11px] text-red-400">
                • {L(e.message)}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-3 text-[12px] text-emerald-300">
          <Check className="h-4 w-4 shrink-0" />
          {t.noIssues}
        </div>
      )}

      {warnings.length > 0 && (
        <ul className="flex flex-col gap-1.5">
          {warnings.map((w, i) => (
            <li
              key={i}
              className="flex items-start gap-2 rounded-xl border border-amber-glow/30 bg-amber-glow/10 p-2.5 text-[11px] text-amber-glow"
            >
              <Info className="mt-0.5 h-3 w-3 shrink-0" />
              {L(w.message)}
            </li>
          ))}
        </ul>
      )}

      {/* ---- Bill of materials ---- */}
      <section>
        <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-cinematic text-amber-glow">
          {t.bom}
        </h3>
        <div className="overflow-hidden rounded-2xl border border-white/10">
          <table className="w-full text-left text-[12px]">
            <thead className="border-b border-white/10 bg-white/[0.03] text-[9px] uppercase tracking-wide text-ink-4">
              <tr>
                <th className="px-3 py-2">{t.bom}</th>
                <th className="px-3 py-2">{t.qty}</th>
                <th className="px-3 py-2 text-right">{t.amount}</th>
              </tr>
            </thead>
            <tbody>
              {quote.lines.map((l) => (
                <tr key={l.key} className="border-t border-white/[0.06]">
                  <td className="px-3 py-2 text-ink-2">{L(l.label)}</td>
                  <td className="px-3 py-2 font-mono text-[11px] text-ink-4">{l.qty}</td>
                  <td className="px-3 py-2 text-right font-mono text-ink">
                    {formatHuf(l.amount, locale)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-3 flex flex-wrap items-end justify-between gap-4 rounded-2xl border border-white/10 bg-surface p-4">
          <div>
            <p className="text-[10px] uppercase tracking-cinematic text-ink-4">{t.totalNet}</p>
            <AnimatedNumber
              value={quote.total}
              format={(n) => formatHuf(n, locale)}
              className="mt-1 block font-display text-3xl font-bold tracking-tight text-ink"
            />
            <AnimatedNumber
              value={quote.eur}
              format={(n) => `≈ ${new Intl.NumberFormat(locale === "hu" ? "hu-HU" : "en-US").format(n)} €`}
              className="block text-xs text-ink-3"
            />
          </div>
          <dl className="flex flex-wrap gap-x-6 gap-y-1 text-[11px]">
            <div>
              <dt className="text-ink-4">{t.unitsCount}</dt>
              <dd className="font-mono text-ink-2">{quote.unitCount}</dd>
            </div>
            <div>
              <dt className="text-ink-4">{t.bpSheets}</dt>
              <dd className="font-mono text-ink-2">{nest.sheets.length}</dd>
            </div>
            <div>
              <dt className="text-ink-4">{t.bpWaste}</dt>
              <dd className="font-mono text-ink-2">{(nest.wasteRatio * 100).toFixed(1)}%</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* ---- Blueprint ---- */}
      <section>
        <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-cinematic text-ink-3">
          {t.blueprint}
        </h3>
        <BlueprintView
          tiers={tiers}
          locale={locale}
          labels={{
            elevation: t.bpElevation,
            section: t.bpSection,
            nesting: t.bpNesting,
            sheets: t.bpSheets,
            waste: t.bpWaste,
            kerf: t.bpKerf,
            plumbing: t.bpPlumbing,
            noPlumbing: t.bpNoPlumbing,
            pvcCore: t.bpPvcCore,
            veneerSkin: t.bpVeneerSkin,
            substrateLip: t.bpSubstrateLip,
            canopyLip: t.bpCanopyLip,
            ventBaffle: t.bpVentBaffle,
            glassTrack: t.bpGlassTrack,
            bulkhead: t.bpBulkhead,
            canister: t.bpCanister,
            oversized: t.bpOversized,
          }}
        />
      </section>

      {/* ---- Export ---- */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={downloadJson}
          className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-4 py-2.5 text-xs font-semibold text-ink transition-colors hover:bg-white/[0.08]"
        >
          <Download className="h-3.5 w-3.5" /> {t.exportJson}
        </button>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-4 py-2.5 text-xs font-semibold text-ink transition-colors hover:bg-white/[0.08]"
        >
          <Printer className="h-3.5 w-3.5" /> {t.exportPrint}
        </button>
      </div>

      {/* ---- Lead capture ---- */}
      <section className="rounded-2xl border border-white/10 bg-surface p-4">
        {sent ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-glow/15 text-amber-glow">
              <Check className="h-7 w-7" strokeWidth={2.5} />
            </span>
            <h4 className="font-display text-lg font-semibold text-ink">{t.sentTitle}</h4>
            <p className="max-w-sm text-[12px] leading-relaxed text-ink-3">{t.sentText}</p>
          </div>
        ) : (
          <>
            <h3 className="text-sm font-semibold text-ink">{t.leadTitle}</h3>
            <p className="mt-0.5 text-[11px] text-ink-3">{t.leadSubtitle}</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <Field label={t.formName}>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={FIELD}
                />
              </Field>
              <Field label={t.formEmail}>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={FIELD}
                />
              </Field>
              <Field label={t.formPhone}>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className={FIELD}
                />
              </Field>
              <Field label={t.formMessage}>
                <input
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className={FIELD}
                />
              </Field>
            </div>
            <button
              disabled={!canSend || errors.length > 0}
              onClick={() => setSent(true)}
              className={cn(
                "mt-4 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-xs font-semibold transition-colors",
                canSend && errors.length === 0
                  ? "bg-amber-glow text-void hover:bg-amber-soft"
                  : "cursor-not-allowed bg-white/[0.06] text-ink-4"
              )}
            >
              <Send className="h-3.5 w-3.5" /> {t.send}
            </button>
          </>
        )}
      </section>
    </div>
  );
}

const FIELD =
  "w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-[13px] text-ink placeholder-ink-4 outline-none transition-colors focus:border-amber-glow/60";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1 text-[10px] font-medium uppercase tracking-wide text-ink-4">
      {label}
      {children}
    </label>
  );
}
