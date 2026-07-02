import "server-only";
import { cookies } from "next/headers";
import { dictionaries, isLocale, type Locale } from "./dictionaries";

export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  const value = store.get("locale")?.value;
  return isLocale(value) ? value : "hu";
}

export async function getDict() {
  const locale = await getLocale();
  return { locale, dict: dictionaries[locale] };
}

/** Pick the localized variant of a bilingual DB record field pair. */
export function loc<T extends string>(locale: Locale, hu: T, en: T): T {
  return locale === "hu" ? hu : en;
}
