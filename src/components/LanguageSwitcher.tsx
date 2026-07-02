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
    <div className="flex items-center gap-1 rounded-full border border-emerald-200 bg-white/70 px-1 py-0.5 text-xs font-semibold">
      {(["hu", "en"] as const).map((l) => (
        <button
          key={l}
          onClick={() => switchTo(l)}
          disabled={pending}
          className={`rounded-full px-2 py-1 uppercase transition ${
            locale === l
              ? "bg-emerald-600 text-white"
              : "text-emerald-700 hover:bg-emerald-100"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
