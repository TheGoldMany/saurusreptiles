"use client";

import { useState, useTransition } from "react";
import { Check, ShoppingCart } from "lucide-react";
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

  if (compact) {
    return (
      <button
        onClick={handleClick}
        disabled={pending}
        aria-label={dict.shop.addToCart}
        className={`flex items-center justify-center rounded-lg p-2 transition-colors disabled:opacity-60 ${
          added
            ? "bg-amber-glow/15 text-amber-glow"
            : "bg-white/[0.06] text-ink-2 hover:bg-amber-glow hover:text-void"
        }`}
      >
        {added ? (
          <Check className="h-4 w-4" strokeWidth={2.5} />
        ) : (
          <ShoppingCart className="h-4 w-4" strokeWidth={2} />
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={pending}
      className={`flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-void transition-colors disabled:opacity-60 ${
        added ? "bg-amber-glow" : "bg-amber-glow hover:bg-amber-soft"
      }`}
    >
      {added ? (
        <>
          <Check className="h-4 w-4" strokeWidth={2.5} />
          {dict.shop.added}
        </>
      ) : (
        <>
          <ShoppingCart className="h-4 w-4" strokeWidth={2} />
          {dict.shop.addToCart}
        </>
      )}
    </button>
  );
}
