import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { animals, articles, products } from "@/lib/db/schema";
import { getDict, loc } from "@/lib/i18n";
import ProductCard from "@/components/ProductCard";

export default async function HomePage() {
  const { dict, locale } = await getDict();
  const db = getDb();

  const [featured, latestArticles, myAnimals] = await Promise.all([
    db
      .select()
      .from(products)
      .where(eq(products.active, true))
      .orderBy(desc(products.createdAt))
      .limit(4),
    db
      .select()
      .from(articles)
      .where(eq(articles.published, true))
      .orderBy(desc(articles.createdAt))
      .limit(3),
    db
      .select()
      .from(animals)
      .where(eq(animals.visible, true))
      .orderBy(desc(animals.createdAt))
      .limit(3),
  ]);

  return (
    <div className="flex flex-col gap-14">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-800 px-8 py-16 text-white">
        <div className="pointer-events-none absolute -right-8 -top-8 text-[10rem] opacity-20">
          🦎
        </div>
        <div className="pointer-events-none absolute -bottom-6 left-1/3 text-[7rem] opacity-10">
          🌿
        </div>
        <h1 className="max-w-2xl text-4xl font-black sm:text-5xl">
          {dict.home.heroTitle}
        </h1>
        <p className="mt-4 max-w-xl text-lg text-emerald-100">
          {dict.home.heroSubtitle}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/shop"
            className="rounded-xl bg-white px-6 py-3 font-bold text-emerald-800 hover:bg-emerald-50"
          >
            {dict.home.browseShop}
          </Link>
          <Link
            href="/animals"
            className="rounded-xl border-2 border-white/60 px-6 py-3 font-bold text-white hover:bg-white/10"
          >
            {dict.home.meetAnimals}
          </Link>
        </div>
      </section>

      {/* SaurusCoin teaser */}
      <section className="flex flex-col items-start gap-4 rounded-3xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-8 sm:flex-row sm:items-center">
        <span className="text-5xl">🪙</span>
        <div className="flex-1">
          <h2 className="text-xl font-black text-amber-900">
            {dict.home.coinsTeaser}
          </h2>
          <p className="mt-1 text-sm text-amber-800">
            {dict.home.coinsTeaserText}
          </p>
        </div>
        <Link
          href="/packs"
          className="rounded-xl bg-amber-600 px-5 py-3 font-bold text-white hover:bg-amber-700"
        >
          {dict.home.openPacks}
        </Link>
      </section>

      {/* Featured products */}
      {featured.length > 0 && (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-black text-emerald-950">
              {dict.home.featuredProducts}
            </h2>
            <Link
              href="/shop"
              className="text-sm font-semibold text-emerald-700 hover:underline"
            >
              {dict.common.all} →
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} locale={locale} dict={dict} />
            ))}
          </div>
        </section>
      )}

      {/* My animals */}
      {myAnimals.length > 0 && (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-black text-emerald-950">
              {dict.home.myAnimals}
            </h2>
            <Link
              href="/animals"
              className="text-sm font-semibold text-emerald-700 hover:underline"
            >
              {dict.common.all} →
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            {myAnimals.map((a) => (
              <Link
                key={a.id}
                href={`/animals/${a.id}`}
                className="group overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm transition hover:shadow-md"
              >
                <div className="flex h-44 items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50 text-5xl">
                  {a.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={a.imageUrl}
                      alt={loc(locale, a.nameHu, a.nameEn)}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    "🦎"
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-stone-800 group-hover:text-emerald-800">
                    {loc(locale, a.nameHu, a.nameEn)}
                  </h3>
                  <p className="text-sm italic text-stone-500">{a.latinName}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Latest articles */}
      {latestArticles.length > 0 && (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-black text-emerald-950">
              {dict.home.latestArticles}
            </h2>
            <Link
              href="/care"
              className="text-sm font-semibold text-emerald-700 hover:underline"
            >
              {dict.common.all} →
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            {latestArticles.map((a) => (
              <Link
                key={a.id}
                href={`/care/${a.slug}`}
                className="group rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <span className="text-xs font-bold uppercase tracking-wide text-emerald-600">
                  {dict.care.categories[a.category] ?? a.category}
                </span>
                <h3 className="mt-2 font-bold text-stone-800 group-hover:text-emerald-800">
                  {loc(locale, a.titleHu, a.titleEn)}
                </h3>
                <p className="mt-2 line-clamp-3 text-sm text-stone-500">
                  {loc(locale, a.excerptHu, a.excerptEn)}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
