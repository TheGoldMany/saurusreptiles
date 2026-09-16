import type { Metadata } from "next";
import { getDict } from "@/lib/i18n";
import { getCurrentUser } from "@/lib/auth";
import SmoothScroll from "@/components/cinematic/SmoothScroll";
import ChromeTheme from "@/components/cinematic/ChromeTheme";
import HeroCinematic from "@/components/cinematic/HeroCinematic";
import CraftsmanshipShowcase from "@/components/cinematic/CraftsmanshipShowcase";
import VivariumStudio from "@/components/configurator/VivariumStudio";
import { pick, scapes, woods } from "@/components/configurator/options";

export const metadata: Metadata = {
  title: "Bespoke Vivariums | Saurus Reptiles",
  description:
    "Kézműves, bútorminőségű terráriumok — rothadásmentes PVC mag, nemesfa burkolat, kézzel faragott 3D sziklahátterek. Tervezd meg a sajátodat valós időben.",
};

export default async function BespokePage() {
  const { dict, locale } = await getDict();
  const t = dict.bespoke;
  const user = await getCurrentUser();

  return (
    <SmoothScroll>
      <ChromeTheme />
      <div className="film-grain relative bg-[#08090a] text-[#f3f4f6]">
        {/* 1 — Cinematic hero */}
        <HeroCinematic t={t} />

        {/* 2 — Interactive studio (the centerpiece) */}
        <section className="relative border-t border-white/5 py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-10 max-w-2xl">
              <p className="text-[10px] font-semibold uppercase tracking-cinematic text-[#e58a3c]">
                {t.studioEyebrow}
              </p>
              <h2 className="mt-4 font-display text-[clamp(1.75rem,3.6vw,3rem)] font-bold leading-tight tracking-tight text-[#f3f4f6]">
                {t.studioTitle}
              </h2>
              <p className="mt-4 text-[#889096]">{t.studioSubtitle}</p>
            </div>

            <VivariumStudio
              locale={locale}
              t={t}
              defaultName={user?.name ?? ""}
              defaultEmail={user?.email ?? ""}
            />
          </div>
        </section>

        {/* 3 — The architecture of craftsmanship */}
        <CraftsmanshipShowcase t={t} />

        {/* 4 — Finish swatch gallery */}
        <section className="border-t border-white/5 py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-6">
            <div className="max-w-2xl">
              <h2 className="font-display text-[clamp(1.5rem,3vw,2.4rem)] font-bold tracking-tight text-[#f3f4f6]">
                {t.portfolioTitle}
              </h2>
              <p className="mt-3 text-[#889096]">{t.portfolioSubtitle}</p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {woods.map((w) => (
                <Swatch
                  key={`w-${w.id}`}
                  title={pick(locale, w.name)}
                  sub={pick(locale, w.swatch)}
                  background={`linear-gradient(135deg, ${w.light}, ${w.base} 55%, ${w.dark})`}
                />
              ))}
              {scapes.map((s) => (
                <Swatch
                  key={`s-${s.id}`}
                  title={pick(locale, s.name)}
                  sub={pick(locale, s.swatch)}
                  background={`linear-gradient(135deg, ${s.rockDark}, ${s.bg} 38%, ${s.rockMid} 68%, ${s.rockLight})`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* 5 — Closing lead capture */}
        <section className="relative overflow-hidden border-t border-white/5 py-24 text-center sm:py-32">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_100%_at_50%_0%,rgba(229,138,60,0.16)_0%,transparent_62%)]" />
          <div className="relative mx-auto max-w-2xl px-6">
            <h2 className="font-display text-[clamp(1.75rem,3.6vw,2.8rem)] font-bold tracking-tight text-[#f3f4f6]">
              {t.inquiryTitle}
            </h2>
            <p className="mt-4 text-[#889096]">{t.inquirySubtitle}</p>
            <a
              href="#studio"
              className="mt-9 inline-flex items-center gap-2 rounded-2xl bg-[#e58a3c] px-7 py-4 text-sm font-semibold text-[#1a0f06] shadow-[0_14px_50px_-14px_rgba(229,138,60,0.85)] transition-colors hover:bg-[#f0a05c]"
            >
              {t.requestQuote}
            </a>
          </div>
        </section>
      </div>
    </SmoothScroll>
  );
}

function Swatch({
  title,
  sub,
  background,
}: {
  title: string;
  sub: string;
  background: string;
}) {
  return (
    <figure className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
      <div className="aspect-[4/3] w-full overflow-hidden">
        <div
          className="h-full w-full transition-transform duration-700 group-hover:scale-110"
          style={{ background }}
        />
      </div>
      <figcaption className="p-4">
        <p className="text-[13px] font-semibold text-[#f3f4f6]">{title}</p>
        <p className="mt-0.5 text-[11px] leading-snug text-[#889096]">{sub}</p>
      </figcaption>
    </figure>
  );
}
