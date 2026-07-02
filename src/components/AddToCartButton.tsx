"use client";

import { useState, useTransition } from "react";
import { addToCart } from "@/actions/cart";
import { useI18n } from "@/lib/i18n/client";

export default function AddToCartButton({
  productId,
  compact = false,
}: {
  productId: number;
  compact?: boolean;
}) {
  const { dict } = useI18n();
  const [pending, startTransition] = useTransition();
  const [added, setAdded] = useState(false);

  const handleClick = () => {
    startTransition(async () => {
      await addToCart(productId, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    });
  };

  return (
    <button
      onClick={handleClick}
      disabled={pending}
      className={`rounded-full font-semibold text-white transition ${
        added ? "bg-teal-500" : "bg-emerald-600 hover:bg-emerald-700"
      } ${compact ? "px-3 py-1.5 text-xs" : "px-6 py-3 text-sm"} disabled:opacity-60`}
    >
      {added ? "✓ " + dict.shop.added : "🛒 " + dict.shop.addToCart}
    </button>
  );
}
