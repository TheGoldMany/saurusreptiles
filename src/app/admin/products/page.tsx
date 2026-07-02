import Link from "next/link";
import { desc } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { getDict, loc } from "@/lib/i18n";
import { formatHuf } from "@/lib/utils";
import DeleteButton from "@/components/admin/DeleteButton";
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
        <h1 className="text-2xl font-black text-emerald-950">
          {dict.admin.products}
        </h1>
        <Link
          href="/admin/products/new"
          className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-700"
        >
          + {dict.admin.product.new}
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-emerald-100 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-emerald-50 text-left text-xs font-bold uppercase text-emerald-800">
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
              <tr key={p.id} className="border-t border-stone-50">
                <td className="px-4 py-3 font-medium text-stone-800">
                  {loc(locale, p.nameHu, p.nameEn)}
                </td>
                <td className="px-4 py-3 text-stone-500">{p.category}</td>
                <td className="px-4 py-3 text-right font-semibold">
                  {formatHuf(p.priceHuf, locale)}
                </td>
                <td
                  className={`px-4 py-3 text-right font-bold ${
                    p.stock <= 3 ? "text-orange-600" : "text-stone-700"
                  }`}
                >
                  {p.stock}
                </td>
                <td className="px-4 py-3">
                  {p.active ? (
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800">
                      ✓
                    </span>
                  ) : (
                    <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs font-bold text-stone-400">
                      ✕
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1">
                    <Link
                      href={`/admin/products/${p.id}`}
                      className="rounded-lg px-2 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
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
