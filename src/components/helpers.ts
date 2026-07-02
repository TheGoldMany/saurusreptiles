import type { Locale } from "@/lib/i18n/dictionaries";

export function loc<T>(locale: Locale, hu: T, en: T): T {
  return locale === "hu" ? hu : en;
}

export function formatHuf(amount: number, locale: string = "hu"): string {
  return (
    new Intl.NumberFormat(locale === "hu" ? "hu-HU" : "en-US").format(amount) +
    " Ft"
  );
}
