import { desc } from "drizzle-orm";
import { Coins } from "lucide-react";
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
      <h1 className="text-2xl font-bold tracking-tight text-ink">
        {dict.admin.users}
      </h1>
      <div className="mt-6 overflow-x-auto rounded-xl border border-white/10 bg-surface">
        <table className="w-full text-sm">
          <thead className="border-b border-white/10 bg-white/[0.03] text-left text-xs font-semibold uppercase tracking-wider text-ink-3">
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
              <tr key={u.id} className="border-t border-white/[0.06]">
                <td className="px-4 py-3 font-medium text-ink">
                  {u.name}
                </td>
                <td className="px-4 py-3 text-ink-3">{u.email}</td>
                <td className="px-4 py-3">
                  {u.role === "admin" ? (
                    <span className="rounded-full bg-amber-glow/15 px-2 py-0.5 text-xs font-semibold text-amber-glow">
                      {dict.profile.admin}
                    </span>
                  ) : (
                    <span className="text-ink-3">{dict.profile.user}</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right font-semibold text-amber-glow">
                  <span className="inline-flex items-center gap-1">
                    <Coins className="h-3.5 w-3.5" strokeWidth={2} />
                    {formatCoins(u.coins, locale)}
                  </span>
                </td>
                <td className="px-4 py-3 text-ink-4">
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
