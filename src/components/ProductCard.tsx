import Link from "next/link";
import type { Product } from "@/lib/db/schema";
import type { Dictionary, Locale } from "@/lib/i18n/dictionaries";
import { formatHuf, loc } from "./helpers";
import AddToCartButton from "./AddToCartButton";
import { ImagePlaceholder } from "./Placeholder";

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
    <div className="group flex flex-col overflow-hidden rounded-xl border border-white/10 bg-surface transition-all hover:border-white/15 hover:shadow-sm">
      <Link href={`/shop/${product.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden">
          {product.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.imageUrl}
              alt={name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <ImagePlaceholder className="h-full w-full" />
          )}
          {product.stock > 0 && product.stock <= 3 && (
            <span className="absolute left-2 top-2 rounded-full bg-orange-500 px-2 py-0.5 text-[10px] font-semibold text-white">
              {dict.shop.lowStock}
            </span>
          )}
          {product.stock === 0 && (
            <span className="absolute left-2 top-2 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-white">
              {dict.common.outOfStock}
            </span>
          )}
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <Link
          href={`/shop/${product.slug}`}
          className="line-clamp-2 text-sm font-medium text-ink transition-colors group-hover:text-amber-glow"
        >
          {name}
        </Link>
        <div className="mt-auto flex items-center justify-between gap-2">
          <span className="text-base font-semibold text-ink">
            {formatHuf(product.priceHuf, locale)}
          </span>
          {product.stock > 0 && <AddToCartButton productId={product.id} compact />}
        </div>
      </div>
    </div>
  );
}
