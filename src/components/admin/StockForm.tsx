"use client";

import { useActionState } from "react";
import { recordStockMovement, type AdminFormState } from "@/actions/admin";
import { useI18n } from "@/lib/i18n/client";

const inputCls =
  "w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500";

export default function StockForm({
  products,
}: {
  products: { id: number; name: string; stock: number }[];
}) {
  const { dict } = useI18n();
  const [state, action, pending] = useActionState<AdminFormState, FormData>(
    recordStockMovement,
    null
  );
  const t = dict.admin.stockPage;

  return (
    <form
      action={action}
      className="flex max-w-xl flex-col gap-4 rounded-2xl border border-stone-200 bg-white p-5"
    >
      <label className="flex flex-col gap-1 text-sm font-medium">
        {t.product}
        <select name="productId" required className={inputCls}>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.stock} db)
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-sm font-medium">
        {t.change}
        <input
          name="change"
          type="number"
          required
          placeholder="+10 / -2"
          className={inputCls}
        />
      </label>
      <label className="flex flex-col gap-1 text-sm font-medium">
        {t.note}
        <input name="note" className={inputCls} />
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
        {t.submit}
      </button>
    </form>
  );
}
