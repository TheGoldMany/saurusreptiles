import Link from "next/link";
import { inArray } from "drizzle-orm";
import { ArrowRight, Coins, ShoppingCart } from "lucide-react";
import { getDb } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { readCart } from "@/lib/cart";
import { getDict, loc } from "@/lib/i18n";
import { formatCoins, formatHuf } from "@/lib/utils";
import CartItemControls from "@/components/CartItemControls";
import { ImagePlaceholder } from "@/components/Placeholder";

export default async function CartPage() {
  const { dict, locale } = await getDict();
  const cart = await readCart();

  if (cart.length === 0) {
    return (
      <div className="py-20 text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-stone-100 text-stone-400">
          <ShoppingCart className="h-8 w-8" strokeWidth={1.5} />
        </span>
        <h1 className="mt-5 text-2xl font-semibold tracking-tight text-stone-900">
          {dict.cart.empty}
        </h1>
        <Link
          href="/shop"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-700"
        >
          {dict.cart.goShopping}
          <ArrowRight className="h-4 w-4" strokeWidth={2} />
        </Link>
      </div>
    );
  }

  const db = getDb();
  const rows = await db
    .select()
    .from(products)
    .where(
      inArray(
        products.id,
        cart.map((i) => i.productId)
      )
    );

  const items = cart
    .map((ci) => {
      const product = rows.find((p) => p.id === ci.productId && p.active);
      return product ? { product, quantity: ci.quantity } : null;
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  const total = items.reduce(
    (sum, { product, quantity }) => sum + product.priceHuf * quantity,
    0
  );

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-stone-900">
        {dict.cart.title}
      </h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="flex flex-col gap-3 lg:col-span-2">
          {items.map(({ product, quantity }) => (
            <div
              key={product.id}
              className="flex items-center gap-4 rounded-xl border border-stone-200 bg-white p-4"
            >
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg">
                {product.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={product.imageUrl}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <ImagePlaceholder
                    className="h-full w-full"
                    iconClassName="h-6 w-6"
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <Link
                  href={`/shop/${product.slug}`}
                  className="font-medium text-stone-800 transition-colors hover:text-brand-700"
                >
                  {loc(locale, product.nameHu, product.nameEn)}
                </Link>
                <p className="text-sm font-semibold text-stone-500">
                  {formatHuf(product.priceHuf, locale)}
                </p>
              </div>
              <CartItemControls
                productId={product.id}
                quantity={quantity}
                maxStock={product.stock}
              />
              <span className="w-24 text-right font-semibold text-stone-900">
                {formatHuf(product.priceHuf * quantity, locale)}
              </span>
            </div>
          ))}
        </div>

        <div className="h-fit rounded-xl border border-stone-200 bg-white p-6">
          <div className="flex items-center justify-between text-lg">
            <span className="font-medium text-stone-500">
              {dict.common.total}
            </span>
            <span className="font-bold text-stone-900">
              {formatHuf(total, locale)}
            </span>
          </div>
          <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-amber-700">
            <Coins className="h-4 w-4" strokeWidth={2} />
            {dict.cart.coinsEarn} {formatCoins(total, locale)}
          </p>
          <Link
            href="/checkout"
            className="mt-6 flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-6 py-3 text-center font-semibold text-white transition-colors hover:bg-brand-700"
          >
            {dict.cart.checkout}
            <ArrowRight className="h-4 w-4" strokeWidth={2} />
          </Link>
        </div>
      </div>
    </div>
  );
}
