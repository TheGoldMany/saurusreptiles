import Link from "next/link";
import { desc, eq, sql } from "drizzle-orm";
import { redirect } from "next/navigation";
import { ArrowRight, Coins, Gem } from "lucide-react";
import { getDb } from "@/lib/db";
import { coinTransactions, species, userSpecies } from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { getDict } from "@/lib/i18n";
import { formatCoins, formatDate } from "@/lib/utils";

export default async function ProfilePage() {
  const { dict, locale } = await getDict();
  const user = await getCurrentUser();
  if (!user) redirect("/login?redirectTo=/profile");

  const db = getDb();
  const [transactions, [collected], [totalSpecies]] = await Promise.all([
    db
      .select()
      .from(coinTransactions)
      .where(eq(coinTransactions.userId, user.id))
      .orderBy(desc(coinTransactions.createdAt))
      .limit(30),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(userSpecies)
      .where(eq(userSpecies.userId, user.id)),
    db.select({ count: sql<number>`count(*)::int` }).from(species),
  ]);

  const reasonLabel = (reason: string) => {
    if (reason.startsWith("order:")) {
      return `${dict.profile.reasons.order} (#${reason.slice(6)})`;
    }
    if (reason.startsWith("pack:")) {
      return `${dict.profile.reasons.pack} (${reason.slice(5)})`;
    }
    return reason;
  };

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-ink">
        {dict.profile.title}
      </h1>

      <div className="mt-8 grid gap-5 sm:grid-cols-3">
        <div className="rounded-xl border border-amber-glow/30 bg-amber-glow/10 p-6">
          <p className="flex items-center gap-1.5 text-sm font-medium text-amber-glow">
            <Coins className="h-4 w-4" strokeWidth={2} />
            {dict.profile.balance}
          </p>
          <p className="mt-2 text-3xl font-bold text-amber-glow">
            {formatCoins(user.coins, locale)}
          </p>
          <Link
            href="/packs"
            className="mt-4 inline-block rounded-lg bg-amber-glow px-4 py-2 text-sm font-semibold text-void transition-colors hover:bg-amber-soft"
          >
            {dict.home.openPacks}
          </Link>
        </div>
        <div className="rounded-xl border border-white/10 bg-surface p-6">
          <p className="flex items-center gap-1.5 text-sm font-medium text-ink-3">
            <Gem className="h-4 w-4" strokeWidth={2} />
            {dict.profile.collectionProgress}
          </p>
          <p className="mt-2 text-3xl font-bold text-ink">
            {collected?.count ?? 0}{" "}
            <span className="text-lg font-medium text-ink-4">
              / {totalSpecies?.count ?? 0}
            </span>
          </p>
          <p className="text-xs text-ink-4">
            {dict.profile.speciesCollected}
          </p>
          <Link
            href="/collection"
            className="mt-4 inline-block rounded-lg bg-amber-glow px-4 py-2 text-sm font-semibold text-void transition-colors hover:bg-amber-soft"
          >
            {dict.nav.collection}
          </Link>
        </div>
        <div className="rounded-xl border border-white/10 bg-surface p-6 text-sm">
          <p className="font-semibold text-ink">{user.name}</p>
          <p className="text-ink-3">{user.email}</p>
          <p className="mt-3 text-ink-3">
            {dict.profile.role}:{" "}
            <span className="font-semibold text-amber-glow">
              {user.role === "admin" ? dict.profile.admin : dict.profile.user}
            </span>
          </p>
          <p className="text-ink-3">
            {dict.profile.memberSince}: {formatDate(user.createdAt, locale)}
          </p>
          <Link
            href="/orders"
            className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-amber-glow hover:text-amber-glow"
          >
            {dict.nav.orders}
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
          </Link>
        </div>
      </div>

      <h2 className="mt-12 text-xl font-semibold tracking-tight text-ink">
        {dict.profile.transactions}
      </h2>
      {transactions.length === 0 ? (
        <p className="mt-4 text-ink-3">{dict.profile.noTransactions}</p>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-xl border border-white/10 bg-surface">
          <table className="w-full text-sm">
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} className="border-b border-white/[0.06] last:border-0">
                  <td className="px-4 py-3 text-ink-2">
                    {reasonLabel(tx.reason)}
                  </td>
                  <td className="px-4 py-3 text-ink-4">
                    {formatDate(tx.createdAt, locale)}
                  </td>
                  <td
                    className={`px-4 py-3 text-right font-semibold tabular-nums ${
                      tx.amount > 0 ? "text-amber-glow" : "text-red-400"
                    }`}
                  >
                    {tx.amount > 0 ? "+" : ""}
                    {formatCoins(tx.amount, locale)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
