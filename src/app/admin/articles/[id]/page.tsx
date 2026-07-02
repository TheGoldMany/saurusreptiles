import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { getDb } from "@/lib/db";
import { articles } from "@/lib/db/schema";
import { getDict } from "@/lib/i18n";
import ArticleForm from "@/components/admin/ArticleForm";

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { dict } = await getDict();
  const articleId = Number(id);
  if (!Number.isInteger(articleId)) notFound();

  const db = getDb();
  const [article] = await db
    .select()
    .from(articles)
    .where(eq(articles.id, articleId))
    .limit(1);
  if (!article) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold tracking-tight text-stone-900">
        {dict.admin.article.edit}
      </h1>
      <ArticleForm article={article} />
    </div>
  );
}
