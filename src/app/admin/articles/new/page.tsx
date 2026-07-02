import { getDict } from "@/lib/i18n";
import ArticleForm from "@/components/admin/ArticleForm";

export default async function NewArticlePage() {
  const { dict } = await getDict();
  return (
    <div>
      <h1 className="mb-6 text-2xl font-black text-emerald-950">
        {dict.admin.article.new}
      </h1>
      <ArticleForm />
    </div>
  );
}
