import { and, desc, eq, ilike, or } from "drizzle-orm";
import Link from "next/link";
import { Search } from "lucide-react";
import { getDb } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { getDict } from "@/lib/i18n";
import ProductCard from "@/components/ProductCard";

const CATEGORIES = [
  "terrarium",
  "food",
  "equipment",
  "substrate",
  "decor",
  "animal",
  "other",
];

const CATEGORY_LABELS: Record<string, { hu: string; en: string }> = {
  terrarium: { hu: "Terrárium", en: "Terrarium" },
  food: { hu: "Táp", en: "Food" },
  equipment: { hu: "Felszerelés", en: "Equipment" },
  substrate: { hu: "Talaj", en: "Substrate" },
  decor: { hu: "Dekoráció", en: "Decor" },
  animal: { hu: "Állat", en: "Animal" },
  other: { hu: "Egyéb", en: "Other" },
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { q, category } = await searchParams;
  const { dict, locale } = await getDict();
  const db = getDb();

  const conditions = [eq(products.active, true)];
  if (category && CATEGORIES.includes(category)) {
    conditions.push(eq(products.category, category));
  }
  const searchCondition =
    q && q.trim()
      ? or(
          ilike(products.nameHu, `%${q.trim()}%`),
          ilike(products.nameEn, `%${q.trim()}%`)
        )
      : undefined;

  const rows = await db
    .select()
    .from(products)
    .where(
      searchCondition ? and(...conditions, searchCondition) : and(...conditions)
    )
    .orderBy(desc(products.createdAt));

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-stone-900">
        {dict.shop.title}
      </h1>

      <form className="mt-6 flex flex-wrap items-center gap-2" action="/shop">
        <div className="relative w-full max-w-xs">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400"
            strokeWidth={2}
          />
          <input
            name="q"
            defaultValue={q ?? ""}
            placeholder={dict.common.search + "..."}
            className="w-full rounded-lg border border-stone-200 bg-white py-2.5 pl-9 pr-4 text-sm outline-none transition-colors focus:border-brand-500"
          />
        </div>
        {category && <input type="hidden" name="category" value={category} />}
        <button className="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700">
          {dict.common.search}
        </button>
      </form>

      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href="/shop"
          className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
            !category
              ? "border-brand-600 bg-brand-600 text-white"
              : "border-stone-200 bg-white text-stone-600 hover:border-stone-300"
          }`}
        >
          {dict.common.all}
        </Link>
        {CATEGORIES.map((c) => (
          <Link
            key={c}
            href={`/shop?category=${c}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
            className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
              category === c
                ? "border-brand-600 bg-brand-600 text-white"
                : "border-stone-200 bg-white text-stone-600 hover:border-stone-300"
            }`}
          >
            {CATEGORY_LABELS[c][locale]}
          </Link>
        ))}
      </div>

      {rows.length === 0 ? (
        <p className="mt-16 text-center text-stone-500">
          {dict.shop.noProducts}
        </p>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {rows.map((p) => (
            <ProductCard key={p.id} product={p} locale={locale} dict={dict} />
          ))}
        </div>
      )}
    </div>
  );
}
