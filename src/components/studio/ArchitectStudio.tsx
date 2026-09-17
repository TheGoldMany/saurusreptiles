"use client";

import { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Orbit } from "lucide-react";
import { useState } from "react";
import type { Dictionary, Locale } from "@/lib/i18n/dictionaries";
import { useVivarium, type WizardStep } from "@/lib/store/vivarium-store";
import { getLighting } from "@/lib/studio/catalog";
import { quoteBuild } from "@/lib/studio/pricing";
import { formatHuf } from "@/components/helpers";
import VivariumCanvas from "./VivariumCanvas";
import Step1Architecture from "./steps/Step1Architecture";
import Step2Species from "./steps/Step2Species";
import Step3Interior from "./steps/Step3Interior";
import Step4Furniture from "./steps/Step4Furniture";
import Step5Summary from "./steps/Step5Summary";
import { cn } from "@/lib/utils/cn";

export default function ArchitectStudio({
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
  const {
    tiers, furniture, step, setStep, next, prev,
    selectedUnitId, selectUnit, activePin, setActivePin,
  } = useVivarium();
  const [orbit, setOrbit] = useState(false);

  const quote = useMemo(() => quoteBuild(tiers, furniture), [tiers, furniture]);
  const light = getLighting(furniture.lighting);

  const pins = useMemo(
    () => [
      { id: "core", title: t.pin1Title, text: t.pin1Text },
      { id: "canopy", title: t.pin2Title, text: t.pin2Text },
      { id: "basin", title: t.pin3Title, text: t.pin3Text },
    ],
    [t]
  );

  const stepNames = [t.steps.s1, t.steps.s2, t.steps.s3, t.steps.s4, t.steps.s5];

  return (
    <div className="grid gap-5 lg:grid-cols-[1.05fr_1fr]">
      {/* ---------------- Live 3D viewport ---------------- */}
      <div className="lg:sticky lg:top-20 lg:self-start">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-surface to-void">
          <div
            className="pointer-events-none absolute inset-0 transition-[background] duration-700"
            style={{
              background: `radial-gradient(70% 60% at 60% 16%, ${light.glow} 0%, transparent 64%)`,
            }}
          />
          <div className="relative aspect-[4/3] w-full sm:aspect-[16/11] lg:h-[60vh] lg:aspect-auto">
            <VivariumCanvas
              tiers={tiers}
              furniture={furniture}
              selectedUnitId={selectedUnitId}
              onSelectUnit={selectUnit}
              pins={pins}
              activePin={activePin}
              onPinToggle={setActivePin}
              orbit={orbit}
              fallbackNote={t.webglFallback}
            />
          </div>

          <div className="relative flex flex-wrap items-center gap-3 border-t border-white/10 px-4 py-3">
            <button
              onClick={() => setOrbit((o) => !o)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] font-medium transition-colors",
                orbit
                  ? "border-amber-glow/50 bg-amber-glow/10 text-amber-glow"
                  : "border-white/10 text-ink-3 hover:text-ink"
              )}
            >
              <Orbit className="h-3 w-3" /> Orbit
            </button>
            <span className="font-mono text-[11px] text-ink-4">
              {quote.unitCount} × · {Math.round(quote.totalVolumeL)} L
            </span>
            <span className="ml-auto font-mono text-[13px] font-semibold text-amber-glow">
              {formatHuf(quote.total, locale)}
            </span>
          </div>
        </div>
      </div>

      {/* ---------------- Wizard ---------------- */}
      <div className="flex flex-col gap-4">
        {/* step rail */}
        <ol className="flex flex-wrap gap-1.5">
          {stepNames.map((name, i) => {
            const n = (i + 1) as WizardStep;
            const active = step === n;
            const done = step > n;
            return (
              <li key={name} className="flex-1">
                <button
                  onClick={() => setStep(n)}
                  className={cn(
                    "w-full rounded-xl border px-2 py-2 text-left transition-colors",
                    active
                      ? "border-amber-glow/60 bg-amber-glow/[0.1]"
                      : done
                      ? "border-white/10 bg-white/[0.04]"
                      : "border-white/[0.07] bg-transparent"
                  )}
                >
                  <span
                    className={cn(
                      "block font-mono text-[9px]",
                      active ? "text-amber-glow" : "text-ink-4"
                    )}
                  >
                    0{n}
                  </span>
                  <span
                    className={cn(
                      "block text-[10px] font-semibold leading-tight",
                      active ? "text-ink" : done ? "text-ink-2" : "text-ink-4"
                    )}
                  >
                    {name}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        {/* step body */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-4 sm:p-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -18 }}
              transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
            >
              {step === 1 && <Step1Architecture t={t} locale={locale} />}
              {step === 2 && <Step2Species t={t} locale={locale} />}
              {step === 3 && <Step3Interior t={t} locale={locale} />}
              {step === 4 && <Step4Furniture t={t} locale={locale} />}
              {step === 5 && (
                <Step5Summary
                  t={t}
                  locale={locale}
                  defaultName={defaultName}
                  defaultEmail={defaultEmail}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* nav */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={prev}
            disabled={step === 1}
            className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-semibold text-ink-2 transition-colors hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" /> {t.prev}
          </button>
          <span className="font-mono text-[10px] text-ink-4">
            {step} / 5 {t.stepOf}
          </span>
          <button
            onClick={next}
            disabled={step === 5}
            className="inline-flex items-center gap-1.5 rounded-xl bg-amber-glow px-5 py-2.5 text-xs font-semibold text-void transition-colors hover:bg-amber-soft disabled:cursor-not-allowed disabled:opacity-30"
          >
            {t.next} <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
