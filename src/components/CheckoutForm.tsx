"use client";

import { useActionState } from "react";
import { Banknote, CreditCard, Truck } from "lucide-react";
import { placeOrder, type CheckoutState } from "@/actions/checkout";
import { useI18n } from "@/lib/i18n/client";

const inputCls =
  "w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

export default function CheckoutForm({
  defaultName,
  defaultEmail,
}: {
  defaultName: string;
  defaultEmail: string;
}) {
  const { dict } = useI18n();
  const [state, action, pending] = useActionState<CheckoutState, FormData>(
    placeOrder,
    null
  );

  const errorMap: Record<string, string> = {
    loginRequired: dict.checkout.loginRequired,
    stockError: dict.checkout.stockError,
    emptyCart: dict.cart.empty,
    invalidInput: dict.auth.invalidInput,
  };

  return (
    <form action={action} className="flex flex-col gap-6">
      <section>
        <h2 className="mb-3 text-lg font-bold text-emerald-900">
          {dict.checkout.contact}
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm font-medium text-stone-700">
            {dict.auth.name}
            <input
              name="name"
              required
              defaultValue={defaultName}
              className={inputCls}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium text-stone-700">
            {dict.auth.email}
            <input
              name="email"
              type="email"
              required
              defaultValue={defaultEmail}
              className={inputCls}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium text-stone-700">
            {dict.checkout.phone}
            <input name="phone" className={inputCls} />
          </label>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-bold text-emerald-900">
          {dict.checkout.shipping}
        </h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="flex flex-col gap-1 text-sm font-medium text-stone-700">
            {dict.checkout.zip}
            <input name="zip" required className={inputCls} />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium text-stone-700 sm:col-span-2">
            {dict.checkout.city}
            <input name="city" required className={inputCls} />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium text-stone-700 sm:col-span-3">
            {dict.checkout.address}
            <input name="address" required className={inputCls} />
          </label>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-bold text-emerald-900">
          {dict.checkout.payment}
        </h2>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-3 rounded-lg border border-stone-200 px-4 py-3 text-sm font-medium transition-colors has-[:checked]:border-brand-500 has-[:checked]:bg-brand-50">
            <input
              type="radio"
              name="paymentMethod"
              value="transfer"
              defaultChecked
              className="accent-brand-600"
            />
            <Banknote className="h-5 w-5 text-stone-500" strokeWidth={1.75} />
            {dict.checkout.transfer}
          </label>
          <label className="flex items-center gap-3 rounded-lg border border-stone-200 px-4 py-3 text-sm font-medium transition-colors has-[:checked]:border-brand-500 has-[:checked]:bg-brand-50">
            <input
              type="radio"
              name="paymentMethod"
              value="cod"
              className="accent-brand-600"
            />
            <Truck className="h-5 w-5 text-stone-500" strokeWidth={1.75} />
            {dict.checkout.cod}
          </label>
          <label className="flex items-center gap-3 rounded-lg border border-stone-200 px-4 py-3 text-sm font-medium text-stone-400">
            <input type="radio" name="paymentMethod" value="card" disabled />
            <CreditCard className="h-5 w-5" strokeWidth={1.75} />
            {dict.checkout.card}
          </label>
        </div>
      </section>

      {state?.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {errorMap[state.error] ?? dict.common.error}
        </p>
      )}

      <button
        disabled={pending}
        className="rounded-xl bg-emerald-600 px-6 py-4 text-lg font-bold text-white hover:bg-emerald-700 disabled:opacity-60"
      >
        {pending ? dict.common.loading : dict.checkout.placeOrder}
      </button>
    </form>
  );
}
