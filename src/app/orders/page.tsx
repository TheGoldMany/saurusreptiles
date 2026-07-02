import { desc, eq, inArray } from "drizzle-orm";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { orderItems, orders } from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { getDict, loc } from "@/lib/i18n";
import { formatDate, formatHuf } from "@/lib/utils";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  paid: "bg-emerald-100 text-emerald-800",
  shipped: "bg-sky-100 text-sky-800",
  delivered: "bg-teal-100 text-teal-800",
  cancelled: "bg-stone-100 text-stone-500",
};

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const { success } = await searchParams;
  const { dict, locale } = await getDict();
  const user = await getCurrentUser();
  if (!user) redirect("/login?redirectTo=/orders");

  const db = getDb();
  const myOrders = await db
    .select()
    .from(orders)
    .where(eq(orders.userId, user.id))
    .orderBy(desc(orders.createdAt));

  const items =
    myOrders.length > 0
      ? await db
          .select()
          .from(orderItems)
          .where(
            inArray(
              orderItems.orderId,
              myOrders.map((o) => o.id)
            )
          )
      : [];

  return (
    <div>
      {success && (
        <div className="mb-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
          <p className="text-4xl">🎉</p>
          <h2 className="mt-2 text-xl font-black text-emerald-900">
            {dict.checkout.success}
          </h2>
          <p className="mt-1 text-sm text-emerald-700">
            {dict.checkout.successText}
          </p>
        </div>
      )}

      <h1 className="text-3xl font-black text-emerald-950">
        {dict.orders.title}
      </h1>

      {myOrders.length === 0 ? (
        <p className="mt-12 text-center text-stone-500">{dict.orders.empty}</p>
      ) : (
        <div className="mt-8 flex flex-col gap-4">
          {myOrders.map((order) => (
            <div
              key={order.id}
              className="rounded-2xl border border-emerald-100 bg-white p-5"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-black text-emerald-900">
                  {dict.orders.order} #{order.id}
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${STATUS_COLORS[order.status] ?? ""}`}
                >
                  {dict.orders.statuses[order.status] ?? order.status}
                </span>
                <span className="text-sm text-stone-400">
                  {formatDate(order.createdAt, locale)}
                </span>
                <span className="ml-auto font-black text-emerald-800">
                  {formatHuf(order.totalHuf, locale)}
                </span>
              </div>
              <ul className="mt-3 flex flex-col gap-1 text-sm text-stone-600">
                {items
                  .filter((i) => i.orderId === order.id)
                  .map((i) => (
                    <li key={i.id} className="flex justify-between">
                      <span>
                        {i.quantity}× {loc(locale, i.nameHu, i.nameEn)}
                      </span>
                      <span>{formatHuf(i.priceHuf * i.quantity, locale)}</span>
                    </li>
                  ))}
              </ul>
              <p className="mt-2 text-xs text-stone-400">
                {dict.orders.payments[order.paymentMethod] ??
                  order.paymentMethod}
                {order.coinsAwarded && (
                  <span className="ml-2 text-amber-600">
                    🪙 +{formatHuf(order.totalHuf, locale).replace(" Ft", "")}{" "}
                    SaurusCoin
                  </span>
                )}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
