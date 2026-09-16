import Link from "next/link";
import { desc } from "drizzle-orm";
import { Plus } from "lucide-react";
import { getDb } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { getDict, loc } from "@/lib/i18n";
import { formatHuf } from "@/lib/utils";
import DeleteButton from "@/components/admin/DeleteButton";
import BoolBadge from "@/components/admin/BoolBadge";
import { deleteProduct } from "@/actions/admin";

export default async function AdminProductsPage() {
  const { dict, locale } = await getDict();
  const db = getDb();
  const rows = await db
    .select()
    .from(products)
    .orderBy(desc(products.createdAt));

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-ink">
          {dict.admin.products}
        </h1>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-1.5 rounded-lg bg-amber-glow px-4 py-2.5 text-sm font-semibold text-void transition-colors hover:bg-amber-soft"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          {dict.admin.product.new}
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-white/10 bg-surface">
        <table className="w-full text-sm">
          <thead className="border-b border-white/10 bg-white/[0.03] text-left text-xs font-semibold uppercase tracking-wider text-ink-3">
            <tr>
              <th className="px-4 py-3">{dict.common.name}</th>
              <th className="px-4 py-3">{dict.common.category}</th>
              <th className="px-4 py-3 text-right">{dict.common.price}</th>
              <th className="px-4 py-3 text-right">{dict.common.stock}</th>
              <th className="px-4 py-3">{dict.common.status}</th>
              <th className="px-4 py-3 text-right">{dict.common.actions}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id} className="border-t border-white/[0.06]">
                <td className="px-4 py-3 font-medium text-ink">
                  {loc(locale, p.nameHu, p.nameEn)}
                </td>
                <td className="px-4 py-3 text-ink-3">{p.category}</td>
                <td className="px-4 py-3 text-right font-semibold tabular-nums">
                  {formatHuf(p.priceHuf, locale)}
                </td>
                <td
                  className={`px-4 py-3 text-right font-semibold tabular-nums ${
                    p.stock <= 3 ? "text-orange-400" : "text-ink-2"
                  }`}
                >
                  {p.stock}
                </td>
                <td className="px-4 py-3">
                  <BoolBadge value={p.active} />
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1">
                    <Link
                      href={`/admin/products/${p.id}`}
                      className="rounded-lg px-2 py-1 text-xs font-semibold text-amber-glow hover:bg-amber-glow/10"
                    >
                      {dict.common.edit}
                    </Link>
                    <DeleteButton
                      onDelete={async () => {
                        "use server";
                        await deleteProduct(p.id);
                      }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
