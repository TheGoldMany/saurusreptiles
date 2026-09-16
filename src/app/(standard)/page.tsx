import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { ArrowRight, Coins, PawPrint, ShoppingBag, Sparkles } from "lucide-react";
import { getDb } from "@/lib/db";
import { animals, articles, products } from "@/lib/db/schema";
import { getDict, loc } from "@/lib/i18n";
import ProductCard from "@/components/ProductCard";
import { ImagePlaceholder } from "@/components/Placeholder";

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
    <div className="flex flex-col gap-20">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-surface px-8 py-16 sm:px-12 sm:py-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_120%_at_100%_0%,rgba(229,138,60,0.18)_0%,transparent_62%)]" />
        <div className="relative max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-glow/30 bg-amber-glow/10 px-3 py-1 text-xs font-medium text-amber-glow">
            <Sparkles className="h-3.5 w-3.5" strokeWidth={2} />
            {dict.home.coinsTeaser}
          </span>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-ink sm:text-5xl">
            {dict.home.heroTitle}
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink-3">
            {dict.home.heroSubtitle}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/bespoke"
              className="inline-flex items-center gap-2 rounded-lg bg-amber-glow px-5 py-3 text-sm font-semibold text-void transition-colors hover:bg-amber-soft"
            >
              <Sparkles className="h-4 w-4" strokeWidth={2} />
              {dict.nav.bespoke}
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-ink transition-colors hover:bg-white/[0.08]"
            >
              <ShoppingBag className="h-4 w-4" strokeWidth={2} />
              {dict.home.browseShop}
            </Link>
            <Link
              href="/animals"
              className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-ink transition-colors hover:bg-white/[0.08]"
            >
              <PawPrint className="h-4 w-4" strokeWidth={2} />
              {dict.home.meetAnimals}
            </Link>
          </div>
        </div>
      </section>

      {/* SaurusCoin teaser */}
      <section className="flex flex-col items-start gap-5 rounded-2xl border border-amber-glow/30 bg-amber-glow/10 p-8 sm:flex-row sm:items-center">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-glow/15 text-amber-glow">
          <Coins className="h-6 w-6" strokeWidth={2} />
        </span>
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-ink">
            {dict.home.coinsTeaser}
          </h2>
          <p className="mt-1 text-sm text-amber-glow/80">
            {dict.home.coinsTeaserText}
          </p>
        </div>
        <Link
          href="/packs"
          className="inline-flex items-center gap-2 rounded-lg bg-amber-glow px-5 py-2.5 text-sm font-semibold text-void transition-colors hover:bg-amber-soft"
        >
          {dict.home.openPacks}
          <ArrowRight className="h-4 w-4" strokeWidth={2} />
        </Link>
      </section>

      {/* Featured products */}
      {featured.length > 0 && (
        <Section
          title={dict.home.featuredProducts}
          href="/shop"
          moreLabel={dict.common.all}
        >
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} locale={locale} dict={dict} />
            ))}
          </div>
        </Section>
      )}

      {/* My animals */}
      {myAnimals.length > 0 && (
        <Section
          title={dict.home.myAnimals}
          href="/animals"
          moreLabel={dict.common.all}
        >
          <div className="grid gap-5 sm:grid-cols-3">
            {myAnimals.map((a) => (
              <Link
                key={a.id}
                href={`/animals/${a.id}`}
                className="group overflow-hidden rounded-xl border border-white/10 bg-surface transition-all hover:border-white/15 hover:shadow-sm"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  {a.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={a.imageUrl}
                      alt={loc(locale, a.nameHu, a.nameEn)}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <ImagePlaceholder className="h-full w-full" />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-ink transition-colors group-hover:text-amber-glow">
                    {loc(locale, a.nameHu, a.nameEn)}
                  </h3>
                  <p className="text-sm italic text-ink-4">{a.latinName}</p>
                </div>
              </Link>
            ))}
          </div>
        </Section>
      )}

      {/* Latest articles */}
      {latestArticles.length > 0 && (
        <Section
          title={dict.home.latestArticles}
          href="/care"
          moreLabel={dict.common.all}
        >
          <div className="grid gap-5 sm:grid-cols-3">
            {latestArticles.map((a) => (
              <Link
                key={a.id}
                href={`/care/${a.slug}`}
                className="group flex flex-col rounded-xl border border-white/10 bg-surface p-5 transition-all hover:border-white/15 hover:shadow-sm"
              >
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-glow">
                  {dict.care.categories[a.category] ?? a.category}
                </span>
                <h3 className="mt-2 font-medium text-ink transition-colors group-hover:text-amber-glow">
                  {loc(locale, a.titleHu, a.titleEn)}
                </h3>
                <p className="mt-2 line-clamp-3 text-sm text-ink-3">
                  {loc(locale, a.excerptHu, a.excerptEn)}
                </p>
              </Link>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}

function Section({
  title,
  href,
  moreLabel,
  children,
}: {
  title: string;
  href: string;
  moreLabel: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight text-ink">
          {title}
        </h2>
        <Link
          href={href}
          className="inline-flex items-center gap-1 text-sm font-medium text-amber-glow transition-colors hover:text-amber-glow"
        >
          {moreLabel}
          <ArrowRight className="h-4 w-4" strokeWidth={2} />
        </Link>
      </div>
      {children}
    </section>
  );
}
