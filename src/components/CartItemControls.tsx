"use client";

import { useTransition } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
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
      <div className="flex items-center rounded-lg border border-stone-200">
        <button
          disabled={pending}
          onClick={() =>
            startTransition(() => setCartQuantity(productId, quantity - 1))
          }
          aria-label="−"
          className="p-2 text-stone-500 hover:text-brand-700 disabled:opacity-40"
        >
          <Minus className="h-3.5 w-3.5" strokeWidth={2.5} />
        </button>
        <span className="min-w-8 text-center text-sm font-semibold tabular-nums">
          {quantity}
        </span>
        <button
          disabled={pending || quantity >= maxStock}
          onClick={() =>
            startTransition(() => setCartQuantity(productId, quantity + 1))
          }
          aria-label="+"
          className="p-2 text-stone-500 hover:text-brand-700 disabled:opacity-40"
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
        </button>
      </div>
      <button
        disabled={pending}
        onClick={() => startTransition(() => removeFromCart(productId))}
        aria-label={dict.cart.remove}
        className="rounded-lg p-2 text-stone-400 transition-colors hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
      >
        <Trash2 className="h-4 w-4" strokeWidth={1.75} />
      </button>
    </div>
  );
}
