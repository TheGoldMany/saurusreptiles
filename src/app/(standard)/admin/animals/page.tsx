import Link from "next/link";
import { desc } from "drizzle-orm";
import { Plus } from "lucide-react";
import { getDb } from "@/lib/db";
import { animals } from "@/lib/db/schema";
import { getDict, loc } from "@/lib/i18n";
import DeleteButton from "@/components/admin/DeleteButton";
import BoolBadge from "@/components/admin/BoolBadge";
import { deleteAnimal } from "@/actions/admin";

export default async function AdminAnimalsPage() {
  const { dict, locale } = await getDict();
  const db = getDb();
  const rows = await db.select().from(animals).orderBy(desc(animals.createdAt));

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-ink">
          {dict.admin.animals}
        </h1>
        <Link
          href="/admin/animals/new"
          className="inline-flex items-center gap-1.5 rounded-lg bg-amber-glow px-4 py-2.5 text-sm font-semibold text-void transition-colors hover:bg-amber-soft"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          {dict.admin.animal.new}
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-white/10 bg-surface">
        <table className="w-full text-sm">
          <thead className="border-b border-white/10 bg-white/[0.03] text-left text-xs font-semibold uppercase tracking-wider text-ink-3">
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
              <tr key={a.id} className="border-t border-white/[0.06]">
                <td className="px-4 py-3 font-medium text-ink">
                  {loc(locale, a.nameHu, a.nameEn)}
                </td>
                <td className="px-4 py-3 italic text-ink-4">
                  {a.latinName}
                </td>
                <td className="px-4 py-3 text-ink-3">
                  {dict.animals.sexes[a.sex] ?? a.sex}
                </td>
                <td className="px-4 py-3">
                  <BoolBadge value={a.visible} />
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1">
                    <Link
                      href={`/admin/animals/${a.id}`}
                      className="rounded-lg px-2 py-1 text-xs font-semibold text-amber-glow hover:bg-amber-glow/10"
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
