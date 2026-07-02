import { desc, eq, inArray } from "drizzle-orm";
import { redirect } from "next/navigation";
import { CheckCircle2, Coins } from "lucide-react";
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
        <div className="mb-8 flex items-start gap-3 rounded-xl border border-brand-200 bg-brand-50 p-5">
          <CheckCircle2
            className="mt-0.5 h-6 w-6 shrink-0 text-brand-600"
            strokeWidth={2}
          />
          <div>
            <h2 className="text-lg font-semibold text-brand-900">
              {dict.checkout.success}
            </h2>
            <p className="mt-1 text-sm text-brand-700/80">
              {dict.checkout.successText}
            </p>
          </div>
        </div>
      )}

      <h1 className="text-3xl font-bold tracking-tight text-stone-900">
        {dict.orders.title}
      </h1>

      {myOrders.length === 0 ? (
        <p className="mt-16 text-center text-stone-500">{dict.orders.empty}</p>
      ) : (
        <div className="mt-8 flex flex-col gap-4">
          {myOrders.map((order) => (
            <div
              key={order.id}
              className="rounded-xl border border-stone-200 bg-white p-5"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-semibold text-stone-900">
                  {dict.orders.order} #{order.id}
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_COLORS[order.status] ?? ""}`}
                >
                  {dict.orders.statuses[order.status] ?? order.status}
                </span>
                <span className="text-sm text-stone-400">
                  {formatDate(order.createdAt, locale)}
                </span>
                <span className="ml-auto font-semibold text-stone-900">
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
              <p className="mt-3 flex items-center gap-2 text-xs text-stone-400">
                {dict.orders.payments[order.paymentMethod] ??
                  order.paymentMethod}
                {order.coinsAwarded && (
                  <span className="inline-flex items-center gap-1 text-amber-600">
                    <Coins className="h-3.5 w-3.5" strokeWidth={2} />+
                    {formatHuf(order.totalHuf, locale).replace(" Ft", "")}{" "}
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
