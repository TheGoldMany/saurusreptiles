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
        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-3 transition-colors hover:text-amber-glow"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={2} />
        {dict.common.back}
      </Link>
      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div className="aspect-square overflow-hidden rounded-2xl border border-white/10">
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
          <h1 className="text-3xl font-bold tracking-tight text-ink">
            {name}
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-ink">
              {formatHuf(product.priceHuf, locale)}
            </span>
            {product.stock > 0 ? (
              <span className="rounded-full bg-amber-glow/10 px-3 py-1 text-xs font-semibold text-amber-glow">
                {dict.common.inStock} · {product.stock} {dict.common.piece}
              </span>
            ) : (
              <span className="rounded-full bg-white/[0.06] px-3 py-1 text-xs font-semibold text-ink-3">
                {dict.common.outOfStock}
              </span>
            )}
          </div>
          <p className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-glow">
            <Coins className="h-4 w-4" strokeWidth={2} />+
            {formatHuf(product.priceHuf, locale).replace(" Ft", "")} SaurusCoin
          </p>
          {product.stock > 0 && (
            <div className="mt-2">
              <AddToCartButton productId={product.id} />
            </div>
          )}
          {desc && (
            <div className="mt-4 border-t border-white/10 pt-6">
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-ink-4">
                {dict.shop.description}
              </h2>
              <p className="whitespace-pre-line leading-relaxed text-ink-2">
                {desc}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
