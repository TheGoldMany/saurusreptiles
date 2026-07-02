import Link from "next/link";
import { inArray } from "drizzle-orm";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { readCart } from "@/lib/cart";
import { getCurrentUser } from "@/lib/auth";
import { getDict, loc } from "@/lib/i18n";
import { formatHuf } from "@/lib/utils";
import CheckoutForm from "@/components/CheckoutForm";

export default async function CheckoutPage() {
  const { dict, locale } = await getDict();
  const user = await getCurrentUser();
  if (!user) redirect("/login?redirectTo=/checkout");

  const cart = await readCart();
  if (cart.length === 0) redirect("/cart");

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
      <Link
        href="/cart"
        className="text-sm font-semibold text-emerald-700 hover:underline"
      >
        ← {dict.cart.title}
      </Link>
      <h1 className="mt-2 text-3xl font-black text-emerald-950">
        {dict.checkout.title}
      </h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CheckoutForm defaultName={user.name} defaultEmail={user.email} />
        </div>
        <div className="h-fit rounded-2xl border border-emerald-100 bg-white p-6">
          <h2 className="mb-4 font-bold text-emerald-900">
            {dict.orders.items}
          </h2>
          <ul className="flex flex-col gap-2 text-sm">
            {items.map(({ product, quantity }) => (
              <li key={product.id} className="flex justify-between gap-2">
                <span className="text-stone-600">
                  {quantity}× {loc(locale, product.nameHu, product.nameEn)}
                </span>
                <span className="font-semibold">
                  {formatHuf(product.priceHuf * quantity, locale)}
                </span>
              </li>
            ))}
          </ul>
          <hr className="my-4 border-emerald-100" />
          <div className="flex justify-between text-lg font-black text-emerald-800">
            <span>{dict.common.total}</span>
            <span>{formatHuf(total, locale)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
