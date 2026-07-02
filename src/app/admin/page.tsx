import { eq, inArray, lte, sql, and } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { orders, products, users } from "@/lib/db/schema";
import { getDict } from "@/lib/i18n";
import { formatHuf } from "@/lib/utils";

export default async function AdminDashboard() {
  const { dict, locale } = await getDict();
  const db = getDb();

  const [[revenue], [pendingCount], [productCount], [userCount], [lowStock]] =
    await Promise.all([
      db
        .select({ sum: sql<number>`coalesce(sum(${orders.totalHuf}), 0)::int` })
        .from(orders)
        .where(inArray(orders.status, ["paid", "shipped", "delivered"])),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(orders)
        .where(eq(orders.status, "pending")),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(products)
        .where(eq(products.active, true)),
      db.select({ count: sql<number>`count(*)::int` }).from(users),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(products)
        .where(and(eq(products.active, true), lte(products.stock, 3))),
    ]);

  const stats = [
    {
      label: dict.admin.stats.revenue,
      value: formatHuf(revenue?.sum ?? 0, locale),
      icon: "💰",
    },
    {
      label: dict.admin.stats.pendingOrders,
      value: String(pendingCount?.count ?? 0),
      icon: "🧾",
    },
    {
      label: dict.admin.stats.products,
      value: String(productCount?.count ?? 0),
      icon: "📦",
    },
    {
      label: dict.admin.stats.users,
      value: String(userCount?.count ?? 0),
      icon: "👥",
    },
    {
      label: dict.admin.stats.lowStock,
      value: String(lowStock?.count ?? 0),
      icon: "⚠️",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-black text-emerald-950">
        {dict.admin.dashboard}
      </h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-emerald-100 bg-white p-5"
          >
            <p className="text-sm font-semibold text-stone-500">
              {s.icon} {s.label}
            </p>
            <p className="mt-2 text-2xl font-black text-emerald-800">
              {s.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
