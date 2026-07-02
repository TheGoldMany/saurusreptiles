import { desc, eq, inArray } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { orderItems, orders, users } from "@/lib/db/schema";
import { getDict, loc } from "@/lib/i18n";
import { formatDate, formatHuf } from "@/lib/utils";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";

export default async function AdminOrdersPage() {
  const { dict, locale } = await getDict();
  const db = getDb();

  const rows = await db
    .select({
      order: orders,
      userName: users.name,
    })
    .from(orders)
    .innerJoin(users, eq(orders.userId, users.id))
    .orderBy(desc(orders.createdAt))
    .limit(200);

  const items =
    rows.length > 0
      ? await db
          .select()
          .from(orderItems)
          .where(
            inArray(
              orderItems.orderId,
              rows.map((r) => r.order.id)
            )
          )
      : [];

  return (
    <div>
      <h1 className="text-2xl font-black text-emerald-950">
        {dict.admin.orders}
      </h1>
      <div className="mt-6 flex flex-col gap-4">
        {rows.map(({ order, userName }) => (
          <div
            key={order.id}
            className="rounded-2xl border border-emerald-100 bg-white p-5"
          >
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-black text-emerald-900">#{order.id}</span>
              <span className="text-sm text-stone-500">
                {formatDate(order.createdAt, locale)}
              </span>
              <span className="ml-auto font-black text-emerald-800">
                {formatHuf(order.totalHuf, locale)}
              </span>
              <OrderStatusSelect orderId={order.id} current={order.status} />
            </div>
            <div className="mt-3 grid gap-4 text-sm sm:grid-cols-2">
              <div>
                <p className="font-bold text-stone-700">
                  {dict.admin.order.customer}: {userName}
                </p>
                <p className="text-stone-500">{order.customerName}</p>
                <p className="text-stone-500">{order.email}</p>
                {order.phone && <p className="text-stone-500">{order.phone}</p>}
                <p className="text-stone-500">
                  {order.zip} {order.city}, {order.address}
                </p>
                <p className="mt-1 text-xs font-semibold text-stone-400">
                  {dict.orders.payments[order.paymentMethod] ??
                    order.paymentMethod}{" "}
                  ·{" "}
                  {order.coinsAwarded
                    ? `🪙 ${dict.admin.order.awarded}`
                    : dict.admin.order.notAwarded}
                </p>
              </div>
              <ul className="flex flex-col gap-1 text-stone-600">
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
            </div>
          </div>
        ))}
        {rows.length === 0 && (
          <p className="text-center text-stone-500">{dict.orders.empty}</p>
        )}
      </div>
    </div>
  );
}
