import Link from "next/link";
import type { Product } from "@/lib/db/schema";
import type { Dictionary, Locale } from "@/lib/i18n/dictionaries";
import { formatHuf, loc } from "./helpers";
import AddToCartButton from "./AddToCartButton";

export default function ProductCard({
  product,
  locale,
  dict,
}: {
  product: Product;
  locale: Locale;
  dict: Dictionary;
}) {
  const name = loc(locale, product.nameHu, product.nameEn);
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm transition hover:shadow-md">
      <Link href={`/shop/${product.slug}`} className="block">
        <div className="flex h-44 items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50 text-5xl">
          {product.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.imageUrl}
              alt={name}
              className="h-full w-full object-cover"
            />
          ) : (
            <span>🦎</span>
          )}
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <Link
          href={`/shop/${product.slug}`}
          className="font-semibold text-stone-800 group-hover:text-emerald-800"
        >
          {name}
        </Link>
        <div className="mt-auto flex items-center justify-between gap-2">
          <span className="text-lg font-black text-emerald-700">
            {formatHuf(product.priceHuf, locale)}
          </span>
          {product.stock > 0 ? (
            <AddToCartButton productId={product.id} compact />
          ) : (
            <span className="rounded-full bg-stone-100 px-2 py-1 text-xs font-semibold text-stone-500">
              {dict.common.outOfStock}
            </span>
          )}
        </div>
        {product.stock > 0 && product.stock <= 3 && (
          <span className="text-xs font-semibold text-orange-600">
            {dict.shop.lowStock}
          </span>
        )}
      </div>
    </div>
  );
}
