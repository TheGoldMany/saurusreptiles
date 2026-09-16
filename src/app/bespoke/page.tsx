import Link from "next/link";
import { ArrowRight, ChevronDown, Layers, Paintbrush, ShieldCheck } from "lucide-react";
import { getDict } from "@/lib/i18n";
import { getCurrentUser } from "@/lib/auth";
import VivariumConfigurator from "@/components/configurator/VivariumConfigurator";
import { palettes, pick, woods } from "@/components/configurator/options";

export const metadata = {
  title: "Bespoke Vivariums | Saurus Reptiles",
  description:
    "Handcrafted, furniture-grade vivariums with a waterproof PVC core, real hardwood exterior and hand-carved 3D rockscapes. Design yours in real time.",
};

export default async function BespokePage() {
  const { dict, locale } = await getDict();
  const t = dict.bespoke;
  const user = await getCurrentUser();

  const craft = [
    { icon: ShieldCheck, title: t.craft1Title, text: t.craft1Text },
    { icon: Layers, title: t.craft2Title, text: t.craft2Text },
    { icon: Paintbrush, title: t.craft3Title, text: t.craft3Text },
  ];

  return (
    <div className="flex flex-col gap-16 sm:gap-24">
      {/* ---- Hero ---- */}
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-stone-950 px-6 py-20 text-center sm:px-12 sm:py-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_120%_at_50%_-10%,rgba(16,185,129,0.22)_0%,transparent_55%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_80%_at_85%_110%,rgba(180,83,9,0.18)_0%,transparent_60%)]" />
        <div className="relative mx-auto max-w-3xl">
          <span
            className="inline-flex items-center gap-1.5 rounded-full border border-brand-400/30 bg-brand-400/10 px-3.5 py-1.5 text-xs font-medium uppercase tracking-widest text-brand-300 animate-fade-up"
            style={{ animationDelay: "0ms" }}
          >
            {t.eyebrow}
          </span>
          <h1
            className="mt-6 text-4xl font-bold leading-[1.05] tracking-tight text-white animate-fade-up sm:text-6xl"
            style={{ animationDelay: "80ms" }}
          >
            {t.heroTitle}
          </h1>
          <p
            className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-stone-300 animate-fade-up sm:text-lg"
            style={{ animationDelay: "160ms" }}
          >
            {t.heroSubtitle}
          </p>
          <div
            className="mt-9 flex flex-wrap items-center justify-center gap-3 animate-fade-up"
            style={{ animationDelay: "240ms" }}
          >
            <Link
              href="#configurator"
              className="inline-flex items-center gap-2 rounded-2xl bg-brand-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-900/40 transition-all hover:bg-brand-500"
            >
              {t.heroCta}
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </Link>
            <Link
              href="#craft"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-stone-100 transition-colors hover:bg-white/10"
            >
              {t.heroSecondary}
            </Link>
          </div>
          <div className="mt-14 flex flex-col items-center gap-1 text-xs font-medium uppercase tracking-widest text-stone-500">
            {t.scrollHint}
            <ChevronDown
              className="h-4 w-4"
              strokeWidth={2}
              style={{ animation: "scrollHint 1.8s ease-in-out infinite" }}
            />
          </div>
        </div>
      </section>

      {/* ---- Configurator ---- */}
      <section>
        <div className="mb-8 max-w-2xl">
          <h2 className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
            {t.configuratorTitle}
          </h2>
          <p className="mt-2 text-stone-500">{t.configuratorSubtitle}</p>
        </div>
        <VivariumConfigurator
          locale={locale}
          t={t}
          defaultName={user?.name ?? ""}
          defaultEmail={user?.email ?? ""}
        />
      </section>

      {/* ---- Craftsmanship ---- */}
      <section id="craft" className="scroll-mt-24">
        <div className="mb-8 max-w-2xl">
          <h2 className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
            {t.craftTitle}
          </h2>
          <p className="mt-2 text-stone-500">{t.craftSubtitle}</p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {craft.map((c, i) => (
            <div
              key={c.title}
              className="relative overflow-hidden rounded-3xl border border-stone-200 bg-white p-7 transition-shadow hover:shadow-md"
            >
              <span className="absolute right-5 top-4 text-5xl font-bold text-stone-100">
                0{i + 1}
              </span>
              <span className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                <c.icon className="h-5 w-5" strokeWidth={2} />
              </span>
              <h3 className="relative mt-4 text-lg font-semibold text-stone-900">
                {c.title}
              </h3>
              <p className="relative mt-2 text-sm leading-relaxed text-stone-500">
                {c.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ---- Portfolio / swatch gallery ---- */}
      <section>
        <div className="mb-8 max-w-2xl">
          <h2 className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
            {t.portfolioTitle}
          </h2>
          <p className="mt-2 text-stone-500">{t.portfolioSubtitle}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {palettes.map((p) => (
            <div
              key={`p-${p.id}`}
              className="group overflow-hidden rounded-3xl border border-stone-200 bg-white"
            >
              <div
                className="aspect-[4/3] w-full transition-transform duration-500 group-hover:scale-105"
                style={{
                  background: `linear-gradient(135deg, ${p.rockDark}, ${p.bg} 40%, ${p.rockMid} 70%, ${p.rockLight})`,
                }}
              />
              <div className="p-4">
                <p className="text-sm font-semibold text-stone-900">
                  {pick(locale, p.name)}
                </p>
                <p className="mt-0.5 text-xs text-stone-500">
                  {pick(locale, p.swatch)}
                </p>
              </div>
            </div>
          ))}
          {woods.map((w) => (
            <div
              key={`w-${w.id}`}
              className="group overflow-hidden rounded-3xl border border-stone-200 bg-white"
            >
              <div
                className="aspect-[4/3] w-full transition-transform duration-500 group-hover:scale-105"
                style={{
                  background: `linear-gradient(135deg, ${w.light}, ${w.base} 55%, ${w.dark})`,
                }}
              />
              <div className="p-4">
                <p className="text-sm font-semibold text-stone-900">
                  {pick(locale, w.name)}
                </p>
                <p className="mt-0.5 text-xs text-stone-500">
                  {pick(locale, w.swatch)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---- Closing CTA ---- */}
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-stone-900 to-stone-950 px-8 py-14 text-center">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_120%_at_50%_0%,rgba(16,185,129,0.16)_0%,transparent_60%)]" />
        <div className="relative mx-auto max-w-xl">
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {t.inquiryTitle}
          </h2>
          <p className="mt-3 text-stone-300">{t.inquirySubtitle}</p>
          <Link
            href="#configurator"
            className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-brand-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-900/40 transition-all hover:bg-brand-500"
          >
            {t.requestQuote}
            <ArrowRight className="h-4 w-4" strokeWidth={2} />
          </Link>
        </div>
      </section>
    </div>
  );
}
