"use client";

import { useActionState } from "react";
import { saveProduct, type AdminFormState } from "@/actions/admin";
import type { Product } from "@/lib/db/schema";
import { useI18n } from "@/lib/i18n/client";

const inputCls =
  "w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500";

export default function ProductForm({ product }: { product?: Product }) {
  const { dict } = useI18n();
  const [state, action, pending] = useActionState<AdminFormState, FormData>(
    saveProduct,
    null
  );
  const t = dict.admin.product;

  return (
    <form action={action} className="flex max-w-3xl flex-col gap-4">
      {product && <input type="hidden" name="id" value={product.id} />}
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm font-medium">
          {t.nameHu}
          <input
            name="nameHu"
            required
            defaultValue={product?.nameHu}
            className={inputCls}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium">
          {t.nameEn}
          <input
            name="nameEn"
            required
            defaultValue={product?.nameEn}
            className={inputCls}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium">
          {t.price}
          <input
            name="priceHuf"
            type="number"
            min={0}
            required
            defaultValue={product?.priceHuf}
            className={inputCls}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium">
          {t.stock}
          <input
            name="stock"
            type="number"
            min={0}
            defaultValue={product?.stock ?? 0}
            className={inputCls}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium">
          {t.category}
          <select
            name="category"
            defaultValue={product?.category ?? "other"}
            className={inputCls}
          >
            <option value="terrarium">Terrarium</option>
            <option value="food">Food / Táp</option>
            <option value="equipment">Equipment / Felszerelés</option>
            <option value="substrate">Substrate / Talaj</option>
            <option value="decor">Decor / Dekoráció</option>
            <option value="animal">Animal / Állat</option>
            <option value="other">Other / Egyéb</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium">
          {t.imageUrl}
          <input
            name="imageUrl"
            defaultValue={product?.imageUrl}
            placeholder="https://..."
            className={inputCls}
          />
        </label>
      </div>
      <label className="flex flex-col gap-1 text-sm font-medium">
        {t.descHu}
        <textarea
          name="descHu"
          rows={4}
          defaultValue={product?.descHu}
          className={inputCls}
        />
      </label>
      <label className="flex flex-col gap-1 text-sm font-medium">
        {t.descEn}
        <textarea
          name="descEn"
          rows={4}
          defaultValue={product?.descEn}
          className={inputCls}
        />
      </label>
      <label className="flex items-center gap-2 text-sm font-medium">
        <input
          type="checkbox"
          name="active"
          defaultChecked={product?.active ?? true}
          className="h-4 w-4 accent-emerald-600"
        />
        {t.active}
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
