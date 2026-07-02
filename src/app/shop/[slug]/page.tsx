import { eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Coins } from "lucide-react";
import { getDb } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { getDict, loc } from "@/lib/i18n";
import { formatHuf } from "@/lib/utils";
import AddToCartButton from "@/components/AddToCartButton";
import { ImagePlaceholder } from "@/components/Placeholder";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { dict, locale } = await getDict();
  const db = getDb();

  const [product] = await db
    .select()
    .from(products)
    .where(eq(products.slug, slug))
    .limit(1);

  if (!product || !product.active) notFound();

  const name = loc(locale, product.nameHu, product.nameEn);
  const desc = loc(locale, product.descHu, product.descEn);

  return (
    <div>
      <Link
        href="/shop"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-500 transition-colors hover:text-brand-700"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={2} />
        {dict.common.back}
      </Link>
      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div className="aspect-square overflow-hidden rounded-2xl border border-stone-200">
          {product.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.imageUrl}
              alt={name}
              className="h-full w-full object-cover"
            />
          ) : (
            <ImagePlaceholder className="h-full w-full" iconClassName="h-16 w-16" />
          )}
        </div>
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold tracking-tight text-stone-900">
            {name}
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-stone-900">
              {formatHuf(product.priceHuf, locale)}
            </span>
            {product.stock > 0 ? (
              <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
                {dict.common.inStock} · {product.stock} {dict.common.piece}
              </span>
            ) : (
              <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-500">
                {dict.common.outOfStock}
              </span>
            )}
          </div>
          <p className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-700">
            <Coins className="h-4 w-4" strokeWidth={2} />+
            {formatHuf(product.priceHuf, locale).replace(" Ft", "")} SaurusCoin
          </p>
          {product.stock > 0 && (
            <div className="mt-2">
              <AddToCartButton productId={product.id} />
            </div>
          )}
          {desc && (
            <div className="mt-4 border-t border-stone-200 pt-6">
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-stone-400">
                {dict.shop.description}
              </h2>
              <p className="whitespace-pre-line leading-relaxed text-stone-600">
                {desc}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
