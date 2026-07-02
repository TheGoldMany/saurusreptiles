"use client";

import { useActionState } from "react";
import { saveAnimal, type AdminFormState } from "@/actions/admin";
import type { Animal } from "@/lib/db/schema";
import { useI18n } from "@/lib/i18n/client";

const inputCls =
  "w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500";

export default function AnimalForm({ animal }: { animal?: Animal }) {
  const { dict } = useI18n();
  const [state, action, pending] = useActionState<AdminFormState, FormData>(
    saveAnimal,
    null
  );

  return (
    <form action={action} className="flex max-w-3xl flex-col gap-4">
      {animal && <input type="hidden" name="id" value={animal.id} />}
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm font-medium">
          {dict.admin.product.nameHu}
          <input
            name="nameHu"
            required
            defaultValue={animal?.nameHu}
            className={inputCls}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium">
          {dict.admin.product.nameEn}
          <input
            name="nameEn"
            required
            defaultValue={animal?.nameEn}
            className={inputCls}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium">
          {dict.admin.animal.latin}
          <input
            name="latinName"
            defaultValue={animal?.latinName}
            className={inputCls}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium">
          {dict.animals.sex}
          <select
            name="sex"
            defaultValue={animal?.sex ?? "unknown"}
            className={inputCls}
          >
            <option value="male">{dict.animals.sexes.male}</option>
            <option value="female">{dict.animals.sexes.female}</option>
            <option value="unknown">{dict.animals.sexes.unknown}</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium">
          {dict.animals.birthYear}
          <input
            name="birthYear"
            type="number"
            min={1990}
            max={2100}
            defaultValue={animal?.birthYear ?? undefined}
            className={inputCls}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium">
          {dict.admin.product.imageUrl}
          <input
            name="imageUrl"
            defaultValue={animal?.imageUrl}
            placeholder="https://..."
            className={inputCls}
          />
        </label>
      </div>
      <label className="flex flex-col gap-1 text-sm font-medium">
        {dict.admin.product.descHu}
        <textarea
          name="descHu"
          rows={4}
          defaultValue={animal?.descHu}
          className={inputCls}
        />
      </label>
      <label className="flex flex-col gap-1 text-sm font-medium">
        {dict.admin.product.descEn}
        <textarea
          name="descEn"
          rows={4}
          defaultValue={animal?.descEn}
          className={inputCls}
        />
      </label>
      <label className="flex items-center gap-2 text-sm font-medium">
        <input
          type="checkbox"
          name="visible"
          defaultChecked={animal?.visible ?? true}
          className="h-4 w-4 accent-emerald-600"
        />
        {dict.admin.animal.visible}
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
