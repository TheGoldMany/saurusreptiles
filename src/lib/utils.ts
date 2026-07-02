export function formatHuf(amount: number, locale: string = "hu"): string {
  return (
    new Intl.NumberFormat(locale === "hu" ? "hu-HU" : "en-US").format(amount) +
    " Ft"
  );
}

export function formatCoins(amount: number, locale: string = "hu"): string {
  return new Intl.NumberFormat(locale === "hu" ? "hu-HU" : "en-US").format(
    amount
  );
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 150);
}

export function formatDate(date: Date, locale: string = "hu"): string {
  return new Intl.DateTimeFormat(locale === "hu" ? "hu-HU" : "en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}
