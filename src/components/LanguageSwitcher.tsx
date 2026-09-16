"use client";

import { usePathname } from "next/navigation";
import { useTransition } from "react";
import { setLocale } from "@/actions/auth";
import { useI18n } from "@/lib/i18n/client";

export default function LanguageSwitcher() {
  const { locale } = useI18n();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  const switchTo = (target: "hu" | "en") => {
    if (target === locale) return;
    startTransition(() => setLocale(target, pathname));
  };

  return (
    <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-1 py-0.5 text-xs font-semibold">
      {(["hu", "en"] as const).map((l) => (
        <button
          key={l}
          onClick={() => switchTo(l)}
          disabled={pending}
          className={`rounded-full px-2 py-1 uppercase transition ${
            locale === l
              ? "bg-amber-glow text-void"
              : "text-ink-3 hover:bg-white/[0.08] hover:text-ink"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
