"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Moon, Ruler, Sparkles, Sun, Sunset, TreePine } from "lucide-react";
import type { Dictionary, Locale } from "@/lib/i18n/dictionaries";
import { formatHuf } from "@/components/helpers";
import GlassCard from "@/components/ui/GlassCard";
import AnimatedNumber from "@/components/ui/AnimatedNumber";
import MagneticButton from "@/components/ui/MagneticButton";
import VivariumCanvas from "@/components/cinematic/VivariumCanvas";
import type { Pin } from "@/components/cinematic/VivariumScene";
import InquiryDrawer from "./InquiryDrawer";
import { EUR_RATE, lightings, pick, scapes, tiers, woods } from "./options";
import { useConfigurator, useResolved } from "./store";

const lightIcons = { day: Sun, golden: Sunset, night: Moon } as const;

export default function VivariumStudio({
  locale,
  t,
  defaultName = "",
  defaultEmail = "",
}: {
  locale: Locale;
  t: Dictionary["bespoke"];
  defaultName?: string;
  defaultEmail?: string;
}) {
  const {
    tierId, woodId, scapeId, lightingId,
    setTier, setWood, setScape, setLighting,
    activePin, setActivePin,
    inquiryOpen, setInquiryOpen,
  } = useConfigurator();

  const { tier, wood, scape, lighting, price, bom, hours, volumeL } = useResolved();
  const eur = Math.round(price / EUR_RATE);

  const pins = useMemo<Pin[]>(
    () => [
      { id: "core", title: t.pin1Title, text: t.pin1Text, u: -0.42, v: 0.04, w: 0.22 },
      { id: "canopy", title: t.pin2Title, text: t.pin2Text, u: 0.06, v: 0.44, w: 0.18 },
      { id: "rails", title: t.pin3Title, text: t.pin3Text, u: 0.3, v: -0.3, w: 0.5 },
      { id: "substrate", title: t.pin4Title, text: t.pin4Text, u: -0.24, v: -0.42, w: 0.34 },
    ],
    [t]
  );

  const [w, d, h] = tier.dims;
  const dimsText = `${w} × ${d} × ${h} cm`;

  const bomLabels: Record<string, string> = {
    frame: t.bomFrame,
    hardscape: t.bomHardscape,
    tech: t.bomTech,
  };

  const summaryRows = [
    { label: t.sizeGroup, value: pick(locale, tier.name) },
    { label: t.woodGroup, value: pick(locale, wood.name) },
    { label: t.scapeGroup, value: pick(locale, scape.name) },
    { label: t.lightingGroup, value: pick(locale, lighting.name) },
    { label: t.dimensions, value: dimsText },
  ];

  return (
    <div id="studio" className="scroll-mt-20">
      <div className="grid gap-5 lg:grid-cols-[1.15fr_1fr]">
        {/* ---------------- Live viewer ---------------- */}
        <div className="lg:sticky lg:top-20 lg:self-start">
          <GlassCard glow className="overflow-hidden">
            {/* Ambient glow reacts to the selected light profile */}
            <div
              className="pointer-events-none absolute inset-0 transition-[background] duration-700"
              style={{
                background: `radial-gradient(70% 60% at 62% 18%, ${lighting.glow} 0%, transparent 62%)`,
              }}
            />
            <div className="relative aspect-[4/3] w-full sm:aspect-[16/11] lg:h-[62vh] lg:aspect-auto">
              <VivariumCanvas
                tier={tier}
                wood={wood}
                scape={scape}
                lighting={lighting}
                pins={pins}
                activePin={activePin}
                onPinToggle={setActivePin}
                fallbackHotspotLabel={t.hotspotsHint}
              />
            </div>
            <div className="relative flex flex-wrap items-center justify-between gap-2 border-t border-white/10 px-5 py-3">
              <span className="text-[10px] uppercase tracking-cinematic text-[#889096]">
                {t.hotspotsHint}
              </span>
              <span className="text-[11px] font-medium text-[#c9ced3]">
                {pick(locale, wood.name)} · {pick(locale, scape.name)} ·{" "}
                {pick(locale, lighting.name)}
              </span>
            </div>
          </GlassCard>
        </div>

        {/* ---------------- Controls ---------------- */}
        <div className="flex flex-col gap-4">
          <Group icon={<Ruler className="h-3.5 w-3.5" />} label={t.sizeGroup}>
            <div className="flex flex-col gap-2">
              {tiers.map((o) => (
                <Option
                  key={o.id}
                  group="tier"
                  selected={o.id === tierId}
                  onSelect={() => setTier(o.id)}
                  title={pick(locale, o.name)}
                  sub={pick(locale, o.tagline)}
                  meta={`${o.dims[0]} × ${o.dims[1]} × ${o.dims[2]}`}
                  note={o.note ? pick(locale, o.note) : undefined}
                />
              ))}
            </div>
          </Group>

          <Group icon={<TreePine className="h-3.5 w-3.5" />} label={t.woodGroup}>
            <div className="grid grid-cols-2 gap-2">
              {woods.map((o) => (
                <Option
                  key={o.id}
                  group="wood"
                  selected={o.id === woodId}
                  onSelect={() => setWood(o.id)}
                  title={pick(locale, o.name)}
                  sub={pick(locale, o.swatch)}
                  swatch={
                    <span
                      className="block h-7 w-full rounded-lg ring-1 ring-inset ring-white/10"
                      style={{
                        background: `linear-gradient(135deg, ${o.light}, ${o.base} 55%, ${o.dark})`,
                      }}
                    />
                  }
                />
              ))}
            </div>
          </Group>

          <Group icon={<Sparkles className="h-3.5 w-3.5" />} label={t.scapeGroup}>
            <div className="flex flex-col gap-2">
              {scapes.map((o) => (
                <Option
                  key={o.id}
                  group="scape"
                  selected={o.id === scapeId}
                  onSelect={() => setScape(o.id)}
                  title={pick(locale, o.name)}
                  sub={pick(locale, o.swatch)}
                  inlineSwatch={
                    <span
                      className="h-9 w-12 shrink-0 rounded-lg ring-1 ring-inset ring-white/10"
                      style={{
                        background: `linear-gradient(135deg, ${o.rockDark}, ${o.rockMid} 45%, ${o.rockLight} 75%, ${o.accent})`,
                      }}
                    />
                  }
                />
              ))}
            </div>
          </Group>

          <Group icon={<Sun className="h-3.5 w-3.5" />} label={t.lightingGroup}>
            <div className="grid grid-cols-3 gap-2">
              {lightings.map((o) => {
                const Icon = lightIcons[o.id];
                const active = o.id === lightingId;
                return (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => setLighting(o.id)}
                    title={pick(locale, o.swatch)}
                    className={`relative flex flex-col items-center gap-2 rounded-2xl border p-3 text-center transition-colors ${
                      active
                        ? "border-[#e58a3c]/60 bg-[#e58a3c]/10"
                        : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="lighting-glow"
                        className="absolute inset-0 rounded-2xl ring-1 ring-[#e58a3c]/50"
                        transition={{ type: "spring", stiffness: 320, damping: 28 }}
                      />
                    )}
                    <Icon
                      className={`relative h-4 w-4 ${active ? "text-[#e58a3c]" : "text-[#889096]"}`}
                      strokeWidth={2}
                    />
                    <span
                      className={`relative text-[11px] font-medium leading-tight ${
                        active ? "text-[#f3f4f6]" : "text-[#c9ced3]"
                      }`}
                    >
                      {pick(locale, o.name)}
                    </span>
                  </button>
                );
              })}
            </div>
          </Group>

          {/* ---------------- Spec + price ---------------- */}
          <GlassCard className="p-5">
            <h3 className="text-[10px] font-semibold uppercase tracking-cinematic text-[#e58a3c]">
              {t.summaryTitle}
            </h3>
            <dl className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2">
              <Spec label={t.dimensions} value={dimsText} />
              <Spec label={t.volume} value={`~ ${volumeL} L`} />
              <Spec label={t.substrateDepth} value={`${tier.substrateDepth} cm`} />
              <Spec label={t.uvb} value={pick(locale, tier.uvb)} />
              <Spec label={t.bioload} value={pick(locale, tier.bioload)} />
              <Spec label={t.heating} value={pick(locale, tier.heating)} />
            </dl>

            {/* Bill of materials */}
            <h3 className="mt-5 text-[10px] font-semibold uppercase tracking-cinematic text-[#889096]">
              {t.bomTitle}
            </h3>
            <ul className="mt-2 flex flex-col gap-1.5 border-t border-white/[0.07] pt-2.5">
              {bom.map((line) => (
                <li key={line.key} className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="text-[#889096]">
                    {bomLabels[line.key]}
                    {line.key === "hardscape" && (
                      <span className="ml-1.5 text-[11px] text-[#5f676d]">
                        {hours} {t.bomHoursSuffix}
                      </span>
                    )}
                  </span>
                  <AnimatedNumber
                    value={line.amount}
                    format={(n) => formatHuf(n, locale)}
                    className="shrink-0 font-medium tabular-nums text-[#c9ced3]"
                  />
                </li>
              ))}
            </ul>

            <div className="mt-4 flex items-end justify-between gap-4 border-t border-white/10 pt-4">
              <div>
                <p className="text-[10px] uppercase tracking-cinematic text-[#889096]">
                  {t.estPrice}
                </p>
                <AnimatedNumber
                  value={price}
                  format={(n) => formatHuf(n, locale)}
                  className="mt-1 block font-display text-3xl font-bold tracking-tight text-[#f3f4f6]"
                />
                <AnimatedNumber
                  value={eur}
                  format={(n) =>
                    `≈ ${new Intl.NumberFormat(locale === "hu" ? "hu-HU" : "en-US").format(n)} €`
                  }
                  className="block text-xs text-[#889096]"
                />
              </div>
            </div>

            <MagneticButton
              onClick={() => setInquiryOpen(true)}
              className="mt-4 flex w-full items-center justify-center rounded-2xl bg-[#e58a3c] px-6 py-3.5 text-sm font-semibold text-[#1a0f06] shadow-[0_10px_40px_-12px_rgba(229,138,60,0.7)] transition-colors hover:bg-[#f0a05c]"
            >
              {t.requestQuote}
            </MagneticButton>
            <p className="mt-2 text-[11px] leading-relaxed text-[#5f676d]">{t.priceNote}</p>
          </GlassCard>
        </div>
      </div>

      <InquiryDrawer
        open={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
        summary={summaryRows}
        priceLabel={formatHuf(price, locale)}
        defaultName={defaultName}
        defaultEmail={defaultEmail}
        t={t}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Group({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h3 className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-cinematic text-[#889096]">
        <span className="text-[#e58a3c]">{icon}</span>
        {label}
      </h3>
      {children}
    </section>
  );
}

function Option({
  group,
  selected,
  onSelect,
  title,
  sub,
  meta,
  note,
  swatch,
  inlineSwatch,
}: {
  group: string;
  selected: boolean;
  onSelect: () => void;
  title: string;
  sub: string;
  meta?: string;
  note?: string;
  swatch?: React.ReactNode;
  inlineSwatch?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`relative rounded-2xl border p-3 text-left transition-colors ${
        selected
          ? "border-[#e58a3c]/60 bg-[#e58a3c]/[0.08]"
          : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]"
      }`}
    >
      {selected && (
        <motion.span
          layoutId={`${group}-ring`}
          className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-[#e58a3c]/50"
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
        />
      )}
      <span className={`relative ${inlineSwatch ? "flex items-center gap-3" : "block"}`}>
        {inlineSwatch}
        {swatch}
        <span className={swatch ? "mt-2 block" : "block"}>
          <span className="flex items-baseline justify-between gap-2">
            <span
              className={`text-[13px] font-semibold leading-tight ${
                selected ? "text-[#f3f4f6]" : "text-[#c9ced3]"
              }`}
            >
              {title}
            </span>
            {meta && (
              <span className="shrink-0 text-[10px] tabular-nums text-[#5f676d]">{meta}</span>
            )}
          </span>
          <span className="mt-0.5 block text-[11px] leading-snug text-[#889096]">{sub}</span>
          {note && (
            <span className="mt-1 block text-[10px] leading-snug text-[#e58a3c]/80">{note}</span>
          )}
        </span>
      </span>
    </button>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-white/[0.06] pb-1.5">
      <dt className="text-[10px] uppercase tracking-wide text-[#5f676d]">{label}</dt>
      <dd className="mt-0.5 text-[13px] font-medium leading-snug text-[#c9ced3]">{value}</dd>
    </div>
  );
}
