"use client";

import { useMemo, useState } from "react";
import { Moon, Ruler, Sparkles, Sun, Sunset, TreePine } from "lucide-react";
import type { Dictionary, Locale } from "@/lib/i18n/dictionaries";
import { formatHuf } from "@/components/helpers";
import {
  EUR_RATE,
  defaultSelection,
  lightings,
  palettes,
  pick,
  resolve,
  tiers,
  woods,
  type Selection,
} from "./options";
import VivariumPreview from "./VivariumPreview";
import PriceCounter from "./PriceCounter";
import InquiryDrawer from "./InquiryDrawer";

const lightIcons = {
  day: Sun,
  sunset: Sunset,
  off: Moon,
} as const;

export default function VivariumConfigurator({
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
  const [sel, setSel] = useState<Selection>(defaultSelection);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { tier, wood, palette, lighting, price, volumeL } = useMemo(
    () => resolve(sel),
    [sel]
  );

  const eur = Math.round(price / EUR_RATE);
  const [w, d, h] = tier.dims;
  const dimsText = `${w} × ${d} × ${h} cm`;

  const hotspots = [
    { id: "pvc", x: 18, y: 68, title: t.hs1Title, text: t.hs1Text },
    { id: "xps", x: 48, y: 42, title: t.hs2Title, text: t.hs2Text },
    { id: "canopy", x: 82, y: 16, title: t.hs3Title, text: t.hs3Text },
    { id: "basin", x: 62, y: 82, title: t.hs4Title, text: t.hs4Text },
  ];

  const summaryRows = [
    { label: t.sizeGroup, value: pick(locale, tier.name) },
    { label: t.woodGroup, value: pick(locale, wood.name) },
    { label: t.paletteGroup, value: pick(locale, palette.name) },
    { label: t.lightingGroup, value: pick(locale, lighting.name) },
    { label: t.dimensions, value: dimsText },
  ];

  return (
    <div id="configurator" className="scroll-mt-24">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* ---- Preview panel ---- */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-stone-900 to-stone-950 p-4 sm:p-6">
            <VivariumPreview
              wood={wood}
              palette={palette}
              lighting={lighting.id}
              hotspots={hotspots}
              silhouetteLabel={t.previewNight}
            />
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-400">
              <span className="inline-flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-brand-400" strokeWidth={2} />
                {t.hotspotsTitle}
              </span>
              <span className="text-stone-600">
                {pick(locale, wood.name)} · {pick(locale, palette.name)} ·{" "}
                {pick(locale, lighting.name)}
              </span>
            </div>
          </div>
        </div>

        {/* ---- Controls ---- */}
        <div className="flex flex-col gap-8">
          {/* Size / tier */}
          <Group icon={<Ruler className="h-4 w-4" strokeWidth={2} />} label={t.sizeGroup}>
            <div className="flex flex-col gap-2.5">
              {tiers.map((o) => (
                <OptionRow
                  key={o.id}
                  selected={o.id === sel.tierId}
                  onClick={() => setSel({ ...sel, tierId: o.id })}
                  title={pick(locale, o.name)}
                  sub={pick(locale, o.tagline)}
                  meta={`${o.dims[0]} × ${o.dims[1]} × ${o.dims[2]} cm`}
                />
              ))}
            </div>
          </Group>

          {/* Wood */}
          <Group icon={<TreePine className="h-4 w-4" strokeWidth={2} />} label={t.woodGroup}>
            <div className="grid grid-cols-2 gap-2.5">
              {woods.map((o) => (
                <SwatchCard
                  key={o.id}
                  selected={o.id === sel.woodId}
                  onClick={() => setSel({ ...sel, woodId: o.id })}
                  title={pick(locale, o.name)}
                  sub={pick(locale, o.swatch)}
                  swatch={
                    <span
                      className="block h-8 w-full rounded-lg"
                      style={{
                        background: `linear-gradient(135deg, ${o.light}, ${o.base} 55%, ${o.dark})`,
                      }}
                    />
                  }
                />
              ))}
            </div>
          </Group>

          {/* Palette */}
          <Group icon={<Sparkles className="h-4 w-4" strokeWidth={2} />} label={t.paletteGroup}>
            <div className="flex flex-col gap-2.5">
              {palettes.map((o) => (
                <SwatchCard
                  key={o.id}
                  wide
                  selected={o.id === sel.paletteId}
                  onClick={() => setSel({ ...sel, paletteId: o.id })}
                  title={pick(locale, o.name)}
                  sub={pick(locale, o.swatch)}
                  swatch={
                    <span
                      className="block h-8 w-14 shrink-0 rounded-lg"
                      style={{
                        background: `linear-gradient(135deg, ${o.rockDark}, ${o.rockMid} 45%, ${o.rockLight} 75%, ${o.accent})`,
                      }}
                    />
                  }
                />
              ))}
            </div>
          </Group>

          {/* Lighting */}
          <Group icon={<Sun className="h-4 w-4" strokeWidth={2} />} label={t.lightingGroup}>
            <div className="grid grid-cols-3 gap-2.5">
              {lightings.map((o) => {
                const Icon = lightIcons[o.id];
                const active = o.id === sel.lightingId;
                return (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => setSel({ ...sel, lightingId: o.id })}
                    className={`flex flex-col items-center gap-2 rounded-2xl border p-3 text-center transition-all ${
                      active
                        ? "border-brand-500 bg-brand-500/10 ring-1 ring-brand-500/40"
                        : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]"
                    }`}
                  >
                    <Icon
                      className={`h-5 w-5 ${active ? "text-brand-300" : "text-stone-400"}`}
                      strokeWidth={2}
                    />
                    <span className={`text-xs font-medium ${active ? "text-white" : "text-stone-300"}`}>
                      {pick(locale, o.name)}
                    </span>
                  </button>
                );
              })}
            </div>
          </Group>
        </div>
      </div>

      {/* ---- Summary / price bar ---- */}
      <div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-stone-900 via-stone-900 to-stone-950">
        <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-300">
              {t.summaryTitle}
            </h3>
            <dl className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2">
              <SpecRow label={t.dimensions} value={dimsText} />
              <SpecRow label={t.volume} value={`~ ${volumeL} L`} />
              <SpecRow label={t.bioload} value={pick(locale, tier.bioload)} />
              <SpecRow label={t.uvb} value={pick(locale, tier.uvb)} />
              <SpecRow label={t.heating} value={pick(locale, tier.heating)} />
              {tier.stacked && (
                <SpecRow label="+" value={pick(locale, tier.stacked)} />
              )}
            </dl>
          </div>

          <div className="flex flex-col justify-between gap-4 border-t border-white/10 pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-stone-400">
                {t.estPrice}
              </p>
              <PriceCounter
                value={price}
                format={(n) => formatHuf(n, locale)}
                className="mt-1 block text-3xl font-bold tracking-tight text-white"
              />
              <PriceCounter
                value={eur}
                format={(n) => `≈ ${new Intl.NumberFormat(locale === "hu" ? "hu-HU" : "en-US").format(n)} €`}
                className="mt-0.5 block text-sm font-medium text-stone-400"
              />
            </div>
            <div>
              <button
                onClick={() => setDrawerOpen(true)}
                className="w-full rounded-2xl bg-brand-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-900/30 transition-all hover:bg-brand-500 hover:shadow-brand-800/40"
              >
                {t.requestQuote}
              </button>
              <p className="mt-2 text-[11px] leading-relaxed text-stone-500">
                {t.priceNote}
              </p>
            </div>
          </div>
        </div>
      </div>

      <InquiryDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        summary={summaryRows}
        priceLabel={formatHuf(price, locale)}
        defaultName={defaultName}
        defaultEmail={defaultEmail}
        labels={{
          inquiryTitle: t.inquiryTitle,
          inquirySubtitle: t.inquirySubtitle,
          stepContact: t.stepContact,
          stepReview: t.stepReview,
          formName: t.formName,
          formEmail: t.formEmail,
          formPhone: t.formPhone,
          formMessage: t.formMessage,
          formConfig: t.formConfig,
          next: t.next,
          prev: t.prev,
          submit: t.submit,
          successTitle: t.successTitle,
          successText: t.successText,
          close: t.close,
        }}
      />
    </div>
  );
}

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
      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-stone-200">
        <span className="text-brand-400">{icon}</span>
        {label}
      </h3>
      {children}
    </section>
  );
}

function OptionRow({
  selected,
  onClick,
  title,
  sub,
  meta,
}: {
  selected: boolean;
  onClick: () => void;
  title: string;
  sub: string;
  meta: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left transition-all ${
        selected
          ? "border-brand-500 bg-brand-500/10 ring-1 ring-brand-500/40"
          : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]"
      }`}
    >
      <span>
        <span className={`block text-sm font-semibold ${selected ? "text-white" : "text-stone-200"}`}>
          {title}
        </span>
        <span className="mt-0.5 block text-xs text-stone-400">{sub}</span>
      </span>
      <span className="shrink-0 text-xs font-medium text-stone-400">{meta}</span>
    </button>
  );
}

function SwatchCard({
  selected,
  onClick,
  title,
  sub,
  swatch,
  wide = false,
}: {
  selected: boolean;
  onClick: () => void;
  title: string;
  sub: string;
  swatch: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border p-2.5 text-left transition-all ${
        wide ? "flex items-center gap-3" : ""
      } ${
        selected
          ? "border-brand-500 bg-brand-500/10 ring-1 ring-brand-500/40"
          : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]"
      }`}
    >
      {swatch}
      <span className={wide ? "" : "mt-2 block"}>
        <span className={`block text-xs font-semibold ${selected ? "text-white" : "text-stone-200"}`}>
          {title}
        </span>
        <span className="mt-0.5 block text-[11px] leading-tight text-stone-400">
          {sub}
        </span>
      </span>
    </button>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-white/[0.06] pb-2">
      <dt className="text-[11px] font-medium uppercase tracking-wide text-stone-500">
        {label}
      </dt>
      <dd className="text-sm font-medium text-stone-100">{value}</dd>
    </div>
  );
}
