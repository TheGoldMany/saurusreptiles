import { desc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { products, stockMovements } from "@/lib/db/schema";
import { getDict, loc } from "@/lib/i18n";
import { formatDate } from "@/lib/utils";
import StockForm from "@/components/admin/StockForm";

export default async function AdminStockPage() {
  const { dict, locale } = await getDict();
  const db = getDb();

  const [allProducts, movements] = await Promise.all([
    db.select().from(products).orderBy(products.nameHu),
    db
      .select({
        movement: stockMovements,
        productNameHu: products.nameHu,
        productNameEn: products.nameEn,
      })
      .from(stockMovements)
      .innerJoin(products, eq(stockMovements.productId, products.id))
      .orderBy(desc(stockMovements.createdAt))
      .limit(100),
  ]);

  const t = dict.admin.stockPage;

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-ink">{t.title}</h1>

      <div className="mt-6">
        <StockForm
          products={allProducts.map((p) => ({
            id: p.id,
            name: loc(locale, p.nameHu, p.nameEn),
            stock: p.stock,
          }))}
        />
      </div>

      <h2 className="mt-10 text-lg font-semibold text-ink">
        {t.history}
      </h2>
      <div className="mt-4 overflow-x-auto rounded-2xl border border-white/10 bg-surface">
        <table className="w-full text-sm">
          <thead className="border-b border-white/10 bg-white/[0.03] text-left text-xs font-semibold uppercase tracking-wider text-ink-3">
            <tr>
              <th className="px-4 py-3">{t.product}</th>
              <th className="px-4 py-3 text-right">+/−</th>
              <th className="px-4 py-3">{dict.common.status}</th>
              <th className="px-4 py-3">{t.note}</th>
              <th className="px-4 py-3">{dict.common.date}</th>
            </tr>
          </thead>
          <tbody>
            {movements.map(({ movement, productNameHu, productNameEn }) => (
              <tr key={movement.id} className="border-t border-white/[0.06]">
                <td className="px-4 py-3 font-medium text-ink">
                  {loc(locale, productNameHu, productNameEn)}
                </td>
                <td
                  className={`px-4 py-3 text-right font-bold ${
                    movement.change > 0 ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {movement.change > 0 ? "+" : ""}
                  {movement.change}
                </td>
                <td className="px-4 py-3 text-ink-3">
                  {t.types[movement.type] ?? movement.type}
                </td>
                <td className="px-4 py-3 text-ink-3">{movement.note}</td>
                <td className="px-4 py-3 text-ink-4">
                  {formatDate(movement.createdAt, locale)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
