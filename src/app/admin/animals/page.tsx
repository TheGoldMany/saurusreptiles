import Link from "next/link";
import { desc } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { animals } from "@/lib/db/schema";
import { getDict, loc } from "@/lib/i18n";
import DeleteButton from "@/components/admin/DeleteButton";
import { deleteAnimal } from "@/actions/admin";

export default async function AdminAnimalsPage() {
  const { dict, locale } = await getDict();
  const db = getDb();
  const rows = await db.select().from(animals).orderBy(desc(animals.createdAt));

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-emerald-950">
          {dict.admin.animals}
        </h1>
        <Link
          href="/admin/animals/new"
          className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-700"
        >
          + {dict.admin.animal.new}
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-emerald-100 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-emerald-50 text-left text-xs font-bold uppercase text-emerald-800">
            <tr>
              <th className="px-4 py-3">{dict.common.name}</th>
              <th className="px-4 py-3">{dict.admin.animal.latin}</th>
              <th className="px-4 py-3">{dict.animals.sex}</th>
              <th className="px-4 py-3">{dict.admin.animal.visible}</th>
              <th className="px-4 py-3 text-right">{dict.common.actions}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((a) => (
              <tr key={a.id} className="border-t border-stone-50">
                <td className="px-4 py-3 font-medium text-stone-800">
                  {loc(locale, a.nameHu, a.nameEn)}
                </td>
                <td className="px-4 py-3 italic text-stone-500">
                  {a.latinName}
                </td>
                <td className="px-4 py-3 text-stone-500">
                  {dict.animals.sexes[a.sex] ?? a.sex}
                </td>
                <td className="px-4 py-3">{a.visible ? "✓" : "✕"}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1">
                    <Link
                      href={`/admin/animals/${a.id}`}
                      className="rounded-lg px-2 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
                    >
                      {dict.common.edit}
                    </Link>
                    <DeleteButton
                      onDelete={async () => {
                        "use server";
                        await deleteAnimal(a.id);
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
