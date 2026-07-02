import Link from "next/link";
import { inArray } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { readCart } from "@/lib/cart";
import { getDict, loc } from "@/lib/i18n";
import { formatCoins, formatHuf } from "@/lib/utils";
import CartItemControls from "@/components/CartItemControls";

export default async function CartPage() {
  const { dict, locale } = await getDict();
  const cart = await readCart();

  if (cart.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-5xl">🛒</p>
        <h1 className="mt-4 text-2xl font-black text-emerald-950">
          {dict.cart.empty}
        </h1>
        <Link
          href="/shop"
          className="mt-6 inline-block rounded-xl bg-emerald-600 px-6 py-3 font-bold text-white hover:bg-emerald-700"
        >
          {dict.cart.goShopping}
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
      <h1 className="text-3xl font-black text-emerald-950">
        {dict.cart.title}
      </h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          {items.map(({ product, quantity }) => (
            <div
              key={product.id}
              className="flex items-center gap-4 rounded-2xl border border-emerald-100 bg-white p-4"
            >
              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-emerald-50 text-2xl">
                {product.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={product.imageUrl}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  "🦎"
                )}
              </div>
              <div className="min-w-0 flex-1">
                <Link
                  href={`/shop/${product.slug}`}
                  className="font-semibold text-stone-800 hover:text-emerald-800"
                >
                  {loc(locale, product.nameHu, product.nameEn)}
                </Link>
                <p className="text-sm font-bold text-emerald-700">
                  {formatHuf(product.priceHuf, locale)}
                </p>
              </div>
              <CartItemControls
                productId={product.id}
                quantity={quantity}
                maxStock={product.stock}
              />
              <span className="w-24 text-right font-black text-stone-800">
                {formatHuf(product.priceHuf * quantity, locale)}
              </span>
            </div>
          ))}
        </div>

        <div className="h-fit rounded-2xl border border-emerald-100 bg-white p-6">
          <div className="flex items-center justify-between text-lg">
            <span className="font-semibold text-stone-600">
              {dict.common.total}
            </span>
            <span className="font-black text-emerald-800">
              {formatHuf(total, locale)}
            </span>
          </div>
          <p className="mt-2 text-sm text-amber-700">
            {dict.cart.coinsEarn} 🪙 {formatCoins(total, locale)}
          </p>
          <Link
            href="/checkout"
            className="mt-6 block rounded-xl bg-emerald-600 px-6 py-3 text-center font-bold text-white hover:bg-emerald-700"
          >
            {dict.cart.checkout}
          </Link>
        </div>
      </div>
    </div>
  );
}
