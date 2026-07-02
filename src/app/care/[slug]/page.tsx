import Link from "next/link";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { getDb } from "@/lib/db";
import { articles } from "@/lib/db/schema";
import { getDict, loc } from "@/lib/i18n";
import { formatDate } from "@/lib/utils";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { dict, locale } = await getDict();
  const db = getDb();

  const [article] = await db
    .select()
    .from(articles)
    .where(eq(articles.slug, slug))
    .limit(1);

  if (!article || !article.published) notFound();

  const content = loc(locale, article.contentHu, article.contentEn);

  return (
    <article className="mx-auto max-w-3xl">
      <Link
        href="/care"
        className="text-sm font-semibold text-emerald-700 hover:underline"
      >
        ← {dict.care.title}
      </Link>
      <span className="mt-6 block text-xs font-bold uppercase tracking-wide text-emerald-600">
        {dict.care.categories[article.category] ?? article.category}
      </span>
      <h1 className="mt-2 text-4xl font-black text-emerald-950">
        {loc(locale, article.titleHu, article.titleEn)}
      </h1>
      <p className="mt-2 text-sm text-stone-400">
        {formatDate(article.createdAt, locale)}
      </p>
      {article.imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={article.imageUrl}
          alt=""
          className="mt-6 w-full rounded-2xl object-cover"
        />
      )}
      <div className="prose prose-stone mt-8 max-w-none whitespace-pre-line text-stone-700">
        {content}
      </div>
    </article>
  );
}
