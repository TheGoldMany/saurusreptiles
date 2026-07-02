import Link from "next/link";
import { desc } from "drizzle-orm";
import { Plus } from "lucide-react";
import { getDb } from "@/lib/db";
import { articles } from "@/lib/db/schema";
import { getDict, loc } from "@/lib/i18n";
import { formatDate } from "@/lib/utils";
import DeleteButton from "@/components/admin/DeleteButton";
import BoolBadge from "@/components/admin/BoolBadge";
import { deleteArticle } from "@/actions/admin";

export default async function AdminArticlesPage() {
  const { dict, locale } = await getDict();
  const db = getDb();
  const rows = await db
    .select()
    .from(articles)
    .orderBy(desc(articles.createdAt));

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-stone-900">
          {dict.admin.articles}
        </h1>
        <Link
          href="/admin/articles/new"
          className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          {dict.admin.article.new}
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-stone-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-stone-200 bg-stone-50 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">
            <tr>
              <th className="px-4 py-3">{dict.common.name}</th>
              <th className="px-4 py-3">{dict.common.category}</th>
              <th className="px-4 py-3">{dict.admin.article.published}</th>
              <th className="px-4 py-3">{dict.common.date}</th>
              <th className="px-4 py-3 text-right">{dict.common.actions}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((a) => (
              <tr key={a.id} className="border-t border-stone-100">
                <td className="px-4 py-3 font-medium text-stone-800">
                  {loc(locale, a.titleHu, a.titleEn)}
                </td>
                <td className="px-4 py-3 text-stone-500">
                  {dict.care.categories[a.category] ?? a.category}
                </td>
                <td className="px-4 py-3">
                  <BoolBadge value={a.published} />
                </td>
                <td className="px-4 py-3 text-stone-400">
                  {formatDate(a.createdAt, locale)}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1">
                    <Link
                      href={`/admin/articles/${a.id}`}
                      className="rounded-lg px-2 py-1 text-xs font-semibold text-brand-700 hover:bg-brand-50"
                    >
                      {dict.common.edit}
                    </Link>
                    <DeleteButton
                      onDelete={async () => {
                        "use server";
                        await deleteArticle(a.id);
                      }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
