"use client";

import { useActionState } from "react";
import { saveArticle, type AdminFormState } from "@/actions/admin";
import type { Article } from "@/lib/db/schema";
import { useI18n } from "@/lib/i18n/client";

const inputCls =
  "w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500";

export default function ArticleForm({ article }: { article?: Article }) {
  const { dict } = useI18n();
  const [state, action, pending] = useActionState<AdminFormState, FormData>(
    saveArticle,
    null
  );
  const t = dict.admin.article;

  return (
    <form action={action} className="flex max-w-3xl flex-col gap-4">
      {article && <input type="hidden" name="id" value={article.id} />}
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm font-medium">
          {t.titleHu}
          <input
            name="titleHu"
            required
            defaultValue={article?.titleHu}
            className={inputCls}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium">
          {t.titleEn}
          <input
            name="titleEn"
            required
            defaultValue={article?.titleEn}
            className={inputCls}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium">
          {dict.common.category}
          <select
            name="category"
            defaultValue={article?.category ?? "care"}
            className={inputCls}
          >
            <option value="care">Tartás / Husbandry</option>
            <option value="feeding">Etetés / Feeding</option>
            <option value="health">Egészség / Health</option>
            <option value="breeding">Tenyésztés / Breeding</option>
            <option value="news">Hírek / News</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium">
          {dict.admin.product.imageUrl}
          <input
            name="imageUrl"
            defaultValue={article?.imageUrl}
            placeholder="https://..."
            className={inputCls}
          />
        </label>
      </div>
      <label className="flex flex-col gap-1 text-sm font-medium">
        {t.excerptHu}
        <textarea
          name="excerptHu"
          rows={2}
          defaultValue={article?.excerptHu}
          className={inputCls}
        />
      </label>
      <label className="flex flex-col gap-1 text-sm font-medium">
        {t.excerptEn}
        <textarea
          name="excerptEn"
          rows={2}
          defaultValue={article?.excerptEn}
          className={inputCls}
        />
      </label>
      <label className="flex flex-col gap-1 text-sm font-medium">
        {t.contentHu}
        <textarea
          name="contentHu"
          rows={12}
          defaultValue={article?.contentHu}
          className={inputCls}
        />
      </label>
      <label className="flex flex-col gap-1 text-sm font-medium">
        {t.contentEn}
        <textarea
          name="contentEn"
          rows={12}
          defaultValue={article?.contentEn}
          className={inputCls}
        />
      </label>
      <label className="flex items-center gap-2 text-sm font-medium">
        <input
          type="checkbox"
          name="published"
          defaultChecked={article?.published ?? false}
          className="h-4 w-4 accent-emerald-600"
        />
        {t.published}
      </label>
      {state?.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {dict.auth.invalidInput}
        </p>
      )}
      <button
        disabled={pending}
        className="self-start rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
      >
        {dict.common.save}
      </button>
    </form>
  );
}
