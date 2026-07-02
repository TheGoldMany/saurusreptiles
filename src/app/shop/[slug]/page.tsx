import { eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDb } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { getDict, loc } from "@/lib/i18n";
import { formatHuf } from "@/lib/utils";
import AddToCartButton from "@/components/AddToCartButton";

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
        className="text-sm font-semibold text-emerald-700 hover:underline"
      >
        ← {dict.common.back}
      </Link>
      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <div className="flex min-h-72 items-center justify-center overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50 text-8xl">
          {product.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.imageUrl}
              alt={name}
              className="h-full w-full object-cover"
            />
          ) : (
            "🦎"
          )}
        </div>
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-black text-emerald-950">{name}</h1>
          <div className="flex items-center gap-3">
            <span className="text-3xl font-black text-emerald-700">
              {formatHuf(product.priceHuf, locale)}
            </span>
            {product.stock > 0 ? (
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                {dict.common.inStock} ({product.stock} {dict.common.piece})
              </span>
            ) : (
              <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-bold text-stone-500">
                {dict.common.outOfStock}
              </span>
            )}
          </div>
          <p className="text-sm text-amber-700">
            🪙 +{formatHuf(product.priceHuf, locale).replace(" Ft", "")}{" "}
            SaurusCoin
          </p>
          {product.stock > 0 && <AddToCartButton productId={product.id} />}
          {desc && (
            <div className="mt-4">
              <h2 className="mb-2 text-lg font-bold text-emerald-900">
                {dict.shop.description}
              </h2>
              <p className="whitespace-pre-line text-stone-600">{desc}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
