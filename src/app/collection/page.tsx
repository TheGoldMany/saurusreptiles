import { asc, eq, sql } from "drizzle-orm";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Gem, Star } from "lucide-react";
import { getDb } from "@/lib/db";
import { species, userSpecies } from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { getDict, loc } from "@/lib/i18n";
import { RARITY_ORDER, RARITY_STYLES, type Rarity } from "@/lib/packs";

export default async function CollectionPage({
  searchParams,
}: {
  searchParams: Promise<{ rarity?: string; category?: string }>;
}) {
  const { rarity, category } = await searchParams;
  const { dict, locale } = await getDict();
  const user = await getCurrentUser();
  if (!user) redirect("/login?redirectTo=/collection");

  const db = getDb();
  const [owned, [totalCount]] = await Promise.all([
    db
      .select({
        species: species,
        count: userSpecies.count,
      })
      .from(userSpecies)
      .innerJoin(species, eq(userSpecies.speciesId, species.id))
      .where(eq(userSpecies.userId, user.id))
      .orderBy(asc(species.rarity), asc(species.nameEn)),
    db.select({ count: sql<number>`count(*)::int` }).from(species),
  ]);

  const filtered = owned.filter(
    (o) =>
      (!rarity || o.species.rarity === rarity) &&
      (!category || o.species.category === category)
  );

  const categories = [...new Set(owned.map((o) => o.species.category))];

  // Order: legendary first for showing off
  const rarityRank = (r: string) =>
    RARITY_ORDER.length - RARITY_ORDER.indexOf(r as Rarity);
  filtered.sort(
    (a, b) =>
      rarityRank(a.species.rarity) - rarityRank(b.species.rarity) ||
      b.species.rating - a.species.rating
  );

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-stone-900">
        {dict.collection.title}
      </h1>
      <p className="mt-2 text-stone-500">{dict.collection.subtitle}</p>

      <div className="mt-6 rounded-xl border border-stone-200 bg-white p-5">
        <div className="flex items-center justify-between text-sm font-medium text-stone-600">
          <span>{dict.collection.progress}</span>
          <span className="tabular-nums">
            {owned.length} / {totalCount?.count ?? 0}
          </span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-stone-100">
          <div
            className="h-full rounded-full bg-brand-500"
            style={{
              width: `${totalCount?.count ? Math.round((owned.length / totalCount.count) * 100) : 0}%`,
            }}
          />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          href="/collection"
          className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
            !rarity && !category
              ? "border-brand-600 bg-brand-600 text-white"
              : "border-stone-200 bg-white text-stone-600 hover:border-stone-300"
          }`}
        >
          {dict.common.all}
        </Link>
        {RARITY_ORDER.map((r) => (
          <Link
            key={r}
            href={`/collection?rarity=${r}`}
            className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
              rarity === r
                ? "border-brand-600 bg-brand-600 text-white"
                : `bg-white ${RARITY_STYLES[r].text} ${RARITY_STYLES[r].border}`
            }`}
          >
            {dict.rarity[r]}
          </Link>
        ))}
        {categories.map((c) => (
          <Link
            key={c}
            href={`/collection?category=${c}`}
            className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
              category === c
                ? "border-brand-600 bg-brand-600 text-white"
                : "border-stone-200 bg-white text-stone-600 hover:border-stone-300"
            }`}
          >
            {dict.speciesCategories[c] ?? c}
          </Link>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="text-stone-500">{dict.collection.empty}</p>
          <Link
            href="/packs"
            className="mt-4 inline-block rounded-lg bg-brand-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-700"
          >
            {dict.nav.packs}
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {filtered.map(({ species: sp, count }) => {
            const styles = RARITY_STYLES[sp.rarity as Rarity];
            return (
              <div
                key={sp.id}
                className={`flex flex-col items-center gap-1.5 rounded-xl border p-4 text-center ${styles.border} ${styles.bg}`}
              >
                <Gem className={`h-7 w-7 ${styles.text}`} strokeWidth={1.5} />
                <span className="text-sm font-semibold leading-tight text-stone-800">
                  {loc(locale, sp.nameHu, sp.nameEn)}
                </span>
                <span className="text-[10px] italic text-stone-400">
                  {sp.latinName}
                </span>
                <span
                  className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase ${styles.border} ${styles.text}`}
                >
                  {dict.rarity[sp.rarity]}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-stone-600">
                  <Star
                    className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                    strokeWidth={2}
                  />
                  {sp.rating}
                </span>
                {count > 1 && (
                  <span className="text-[10px] font-medium text-stone-400">
                    ×{count}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
