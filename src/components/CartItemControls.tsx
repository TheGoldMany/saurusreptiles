"use client";

import { useTransition } from "react";
import { removeFromCart, setCartQuantity } from "@/actions/cart";
import { useI18n } from "@/lib/i18n/client";

export default function CartItemControls({
  productId,
  quantity,
  maxStock,
}: {
  productId: number;
  quantity: number;
  maxStock: number;
}) {
  const { dict } = useI18n();
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center rounded-full border border-stone-200">
        <button
          disabled={pending}
          onClick={() =>
            startTransition(() => setCartQuantity(productId, quantity - 1))
          }
          className="px-3 py-1 text-stone-600 hover:text-emerald-700 disabled:opacity-50"
        >
          −
        </button>
        <span className="min-w-8 text-center text-sm font-semibold">
          {quantity}
        </span>
        <button
          disabled={pending || quantity >= maxStock}
          onClick={() =>
            startTransition(() => setCartQuantity(productId, quantity + 1))
          }
          className="px-3 py-1 text-stone-600 hover:text-emerald-700 disabled:opacity-50"
        >
          +
        </button>
      </div>
      <button
        disabled={pending}
        onClick={() => startTransition(() => removeFromCart(productId))}
        className="text-xs font-medium text-red-500 hover:underline disabled:opacity-50"
      >
        {dict.cart.remove}
      </button>
    </div>
  );
}
