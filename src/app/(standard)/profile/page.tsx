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
      <h1 className="text-3xl font-bold tracking-tight text-stone-900">
        {dict.profile.title}
      </h1>

      <div className="mt-8 grid gap-5 sm:grid-cols-3">
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-6">
          <p className="flex items-center gap-1.5 text-sm font-medium text-amber-800">
            <Coins className="h-4 w-4" strokeWidth={2} />
            {dict.profile.balance}
          </p>
          <p className="mt-2 text-3xl font-bold text-amber-700">
            {formatCoins(user.coins, locale)}
          </p>
          <Link
            href="/packs"
            className="mt-4 inline-block rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-amber-700"
          >
            {dict.home.openPacks}
          </Link>
        </div>
        <div className="rounded-xl border border-stone-200 bg-white p-6">
          <p className="flex items-center gap-1.5 text-sm font-medium text-stone-500">
            <Gem className="h-4 w-4" strokeWidth={2} />
            {dict.profile.collectionProgress}
          </p>
          <p className="mt-2 text-3xl font-bold text-stone-900">
            {collected?.count ?? 0}{" "}
            <span className="text-lg font-medium text-stone-400">
              / {totalSpecies?.count ?? 0}
            </span>
          </p>
          <p className="text-xs text-stone-400">
            {dict.profile.speciesCollected}
          </p>
          <Link
            href="/collection"
            className="mt-4 inline-block rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
          >
            {dict.nav.collection}
          </Link>
        </div>
        <div className="rounded-xl border border-stone-200 bg-white p-6 text-sm">
          <p className="font-semibold text-stone-800">{user.name}</p>
          <p className="text-stone-500">{user.email}</p>
          <p className="mt-3 text-stone-500">
            {dict.profile.role}:{" "}
            <span className="font-semibold text-brand-700">
              {user.role === "admin" ? dict.profile.admin : dict.profile.user}
            </span>
          </p>
          <p className="text-stone-500">
            {dict.profile.memberSince}: {formatDate(user.createdAt, locale)}
          </p>
          <Link
            href="/orders"
            className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-brand-700 hover:text-brand-800"
          >
            {dict.nav.orders}
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
          </Link>
        </div>
      </div>

      <h2 className="mt-12 text-xl font-semibold tracking-tight text-stone-900">
        {dict.profile.transactions}
      </h2>
      {transactions.length === 0 ? (
        <p className="mt-4 text-stone-500">{dict.profile.noTransactions}</p>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-xl border border-stone-200 bg-white">
          <table className="w-full text-sm">
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} className="border-b border-stone-100 last:border-0">
                  <td className="px-4 py-3 text-stone-600">
                    {reasonLabel(tx.reason)}
                  </td>
                  <td className="px-4 py-3 text-stone-400">
                    {formatDate(tx.createdAt, locale)}
                  </td>
                  <td
                    className={`px-4 py-3 text-right font-semibold tabular-nums ${
                      tx.amount > 0 ? "text-brand-600" : "text-red-500"
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
