import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getDict } from "@/lib/i18n";
import { getCurrentUser } from "@/lib/auth";
import ArchitectStudio from "@/components/studio/ArchitectStudio";

export const metadata: Metadata = {
  title: "Vivarium Architect Studio | Saurus Reptiles",
  description:
    "Tervezd meg a saját bútorminőségű terrárium-szekrénysorod: moduláris rács, 170 fajos tartási adatbázis, valós idejű árkalkuláció és CNC vágásterv.",
};

export default async function StudioPage() {
  const { dict, locale } = await getDict();
  const t = dict.studio;
  const user = await getCurrentUser();

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-8 sm:px-6">
      <Link
        href="/bespoke"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-3 transition-colors hover:text-amber-glow"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        {dict.nav.bespoke}
      </Link>

      <header className="mt-4 mb-8 max-w-2xl">
        <p className="text-[10px] font-semibold uppercase tracking-cinematic text-amber-glow">
          {t.eyebrow}
        </p>
        <h1 className="mt-3 font-display text-[clamp(1.75rem,3.4vw,2.8rem)] font-bold leading-tight tracking-tight text-ink">
          {t.title}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-3">{t.subtitle}</p>
      </header>

      <ArchitectStudio
        t={t}
        locale={locale}
        defaultName={user?.name ?? ""}
        defaultEmail={user?.email ?? ""}
      />
    </div>
  );
}
