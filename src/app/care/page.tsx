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
      <h1 className="text-3xl font-bold tracking-tight text-stone-900">
        {dict.care.title}
      </h1>
      <p className="mt-2 text-stone-500">{dict.care.subtitle}</p>

      {rows.length === 0 ? (
        <p className="mt-12 text-center text-stone-500">{dict.care.empty}</p>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((a) => (
            <Link
              key={a.id}
              href={`/care/${a.slug}`}
              className="group flex flex-col rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <span className="text-xs font-bold uppercase tracking-wide text-emerald-600">
                {dict.care.categories[a.category] ?? a.category}
              </span>
              <h2 className="mt-2 text-lg font-bold text-stone-800 group-hover:text-emerald-800">
                {loc(locale, a.titleHu, a.titleEn)}
              </h2>
              <p className="mt-2 line-clamp-3 flex-1 text-sm text-stone-500">
                {loc(locale, a.excerptHu, a.excerptEn)}
              </p>
              <div className="mt-4 flex items-center justify-between text-xs text-stone-400">
                <span>{formatDate(a.createdAt, locale)}</span>
                <span className="font-semibold text-brand-700">
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
