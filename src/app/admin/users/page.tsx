import { desc } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { getDict } from "@/lib/i18n";
import { formatCoins, formatDate } from "@/lib/utils";
import RoleToggle from "@/components/admin/RoleToggle";

export default async function AdminUsersPage() {
  const { dict, locale } = await getDict();
  const me = await getCurrentUser();
  const db = getDb();
  const rows = await db.select().from(users).orderBy(desc(users.createdAt));

  return (
    <div>
      <h1 className="text-2xl font-black text-emerald-950">
        {dict.admin.users}
      </h1>
      <div className="mt-6 overflow-x-auto rounded-2xl border border-emerald-100 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-emerald-50 text-left text-xs font-bold uppercase text-emerald-800">
            <tr>
              <th className="px-4 py-3">{dict.common.name}</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">{dict.profile.role}</th>
              <th className="px-4 py-3 text-right">{dict.admin.user.coins}</th>
              <th className="px-4 py-3">{dict.common.date}</th>
              <th className="px-4 py-3 text-right">{dict.common.actions}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((u) => (
              <tr key={u.id} className="border-t border-stone-50">
                <td className="px-4 py-3 font-medium text-stone-800">
                  {u.name}
                </td>
                <td className="px-4 py-3 text-stone-500">{u.email}</td>
                <td className="px-4 py-3">
                  {u.role === "admin" ? (
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800">
                      {dict.profile.admin}
                    </span>
                  ) : (
                    <span className="text-stone-500">{dict.profile.user}</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right font-semibold text-amber-700">
                  🪙 {formatCoins(u.coins, locale)}
                </td>
                <td className="px-4 py-3 text-stone-400">
                  {formatDate(u.createdAt, locale)}
                </td>
                <td className="px-4 py-3 text-right">
                  <RoleToggle
                    userId={u.id}
                    role={u.role}
                    isSelf={u.id === me?.id}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
