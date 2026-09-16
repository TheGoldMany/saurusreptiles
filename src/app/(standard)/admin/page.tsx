import { eq, inArray, lte, sql, and } from "drizzle-orm";
import {
  AlertTriangle,
  Boxes,
  Receipt,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";
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

  const stats: { label: string; value: string; Icon: LucideIcon; accent: string }[] =
    [
      {
        label: dict.admin.stats.revenue,
        value: formatHuf(revenue?.sum ?? 0, locale),
        Icon: TrendingUp,
        accent: "text-amber-glow bg-amber-glow/10",
      },
      {
        label: dict.admin.stats.pendingOrders,
        value: String(pendingCount?.count ?? 0),
        Icon: Receipt,
        accent: "text-sky-400 bg-sky-400/10",
      },
      {
        label: dict.admin.stats.products,
        value: String(productCount?.count ?? 0),
        Icon: Boxes,
        accent: "text-violet-600 bg-violet-400/10",
      },
      {
        label: dict.admin.stats.users,
        value: String(userCount?.count ?? 0),
        Icon: Users,
        accent: "text-amber-glow bg-amber-glow/10",
      },
      {
        label: dict.admin.stats.lowStock,
        value: String(lowStock?.count ?? 0),
        Icon: AlertTriangle,
        accent: "text-orange-400 bg-orange-400/10",
      },
    ];

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-ink">
        {dict.admin.dashboard}
      </h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map(({ label, value, Icon, accent }) => (
          <div
            key={label}
            className="rounded-xl border border-white/10 bg-surface p-5"
          >
            <div className="flex items-center gap-3">
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-lg ${accent}`}
              >
                <Icon className="h-5 w-5" strokeWidth={2} />
              </span>
              <p className="text-sm font-medium text-ink-3">{label}</p>
            </div>
            <p className="mt-3 text-2xl font-bold text-ink">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
