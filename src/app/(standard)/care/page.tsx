import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { articles } from "@/lib/db/schema";
import { getDict, loc } from "@/lib/i18n";
import { formatDate } from "@/lib/utils";

export default async function CarePage() {
  const { dict, locale } = await getDict();
  const db = getDb();
  const rows = await db
    .select()
    .from(articles)
    .where(eq(articles.published, true))
    .orderBy(desc(articles.createdAt));

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-ink">
        {dict.care.title}
      </h1>
      <p className="mt-2 text-ink-3">{dict.care.subtitle}</p>

      {rows.length === 0 ? (
        <p className="mt-12 text-center text-ink-3">{dict.care.empty}</p>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((a) => (
            <Link
              key={a.id}
              href={`/care/${a.slug}`}
              className="group flex flex-col rounded-2xl border border-white/10 bg-surface p-6 shadow-sm transition hover:shadow-md"
            >
              <span className="text-xs font-bold uppercase tracking-wide text-emerald-400">
                {dict.care.categories[a.category] ?? a.category}
              </span>
              <h2 className="mt-2 text-lg font-bold text-ink group-hover:text-emerald-300">
                {loc(locale, a.titleHu, a.titleEn)}
              </h2>
              <p className="mt-2 line-clamp-3 flex-1 text-sm text-ink-3">
                {loc(locale, a.excerptHu, a.excerptEn)}
              </p>
              <div className="mt-4 flex items-center justify-between text-xs text-ink-4">
                <span>{formatDate(a.createdAt, locale)}</span>
                <span className="font-semibold text-amber-glow">
                  {dict.care.readMore} →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
