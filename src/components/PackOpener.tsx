"use client";

import { useState, useTransition } from "react";
import { Coins, Gem, Sparkles, Star } from "lucide-react";
import { openPack, type OpenPackResult } from "@/actions/packs";
import type { PackDef, Rarity } from "@/lib/packs";
import { RARITY_STYLES } from "@/lib/packs";
import { useI18n } from "@/lib/i18n/client";

export default function PackOpener({
  packs,
  balance,
  isLoggedIn,
}: {
  packs: PackDef[];
  balance: number;
  isLoggedIn: boolean;
}) {
  const { dict, locale } = useI18n();
  const [pending, startTransition] = useTransition();
  const [openingId, setOpeningId] = useState<string | null>(null);
  const [result, setResult] = useState<OpenPackResult | null>(null);
  const [revealed, setRevealed] = useState<number>(0);
  const [currentBalance, setCurrentBalance] = useState(balance);

  const handleOpen = (pack: PackDef) => {
    setOpeningId(pack.id);
    setResult(null);
    setRevealed(0);
    startTransition(async () => {
      const res = await openPack(pack.id);
      setResult(res);
      if (res.ok) {
        setCurrentBalance(res.balance);
        // Staggered card reveal
        res.cards.forEach((_, i) => {
          setTimeout(() => setRevealed((r) => Math.max(r, i + 1)), 350 * (i + 1));
        });
      }
      setOpeningId(null);
    });
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
        <span className="font-medium text-amber-900">
          {dict.profile.balance}
        </span>
        <span className="inline-flex items-center gap-2 text-2xl font-bold text-amber-700">
          <Coins className="h-6 w-6" strokeWidth={2} />
          {new Intl.NumberFormat(locale === "hu" ? "hu-HU" : "en-US").format(
            currentBalance
          )}
        </span>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {packs.map((pack) => {
          const affordable = currentBalance >= pack.cost;
          return (
            <div
              key={pack.id}
              className="flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm"
            >
              <div
                className={`flex h-32 items-center justify-center bg-gradient-to-br ${pack.color} text-white`}
              >
                <Sparkles className="h-12 w-12" strokeWidth={1.25} />
              </div>
              <div className="flex flex-1 flex-col gap-2 p-4">
                <h3 className="font-semibold text-stone-800">
                  {locale === "hu" ? pack.nameHu : pack.nameEn}
                </h3>
                <p className="text-sm text-stone-500">
                  {dict.packs.contains.replace("{n}", String(pack.cards))}
                </p>
                <div className="flex flex-wrap gap-1 text-[10px] font-semibold">
                  {(Object.entries(pack.weights) as [Rarity, number][]).map(
                    ([r, w]) => (
                      <span
                        key={r}
                        className={`rounded-full border px-1.5 py-0.5 ${RARITY_STYLES[r].border} ${RARITY_STYLES[r].text}`}
                      >
                        {dict.rarity[r]} {w}%
                      </span>
                    )
                  )}
                </div>
                <div className="mt-auto flex items-center justify-between pt-2">
                  <span className="inline-flex items-center gap-1 font-semibold text-amber-700">
                    <Coins className="h-4 w-4" strokeWidth={2} />
                    {new Intl.NumberFormat(
                      locale === "hu" ? "hu-HU" : "en-US"
                    ).format(pack.cost)}
                  </span>
                  <button
                    disabled={!isLoggedIn || !affordable || pending}
                    onClick={() => handleOpen(pack)}
                    className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {openingId === pack.id ? "..." : dict.packs.open}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {!isLoggedIn && (
        <p className="rounded-xl bg-sky-50 px-4 py-3 text-center text-sm font-medium text-sky-800">
          {dict.packs.loginRequired}
        </p>
      )}

      {result && !result.ok && result.error === "notEnough" && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-600">
          {dict.packs.notEnough}
        </p>
      )}

      {result?.ok && (
        <div className="rounded-2xl border border-stone-200 bg-stone-50 p-6">
          <h2 className="mb-5 text-center text-lg font-semibold text-stone-900">
            {dict.packs.youGot}
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {result.cards.map((card, i) => {
              const styles = RARITY_STYLES[card.species.rarity as Rarity];
              const shown = i < revealed;
              return (
                <div
                  key={i}
                  className={`relative flex w-40 flex-col items-center gap-1.5 rounded-xl border p-4 text-center shadow-sm transition-all duration-500 ${
                    shown
                      ? `${styles.border} ${styles.bg} scale-100 opacity-100`
                      : "scale-90 border-stone-200 bg-white opacity-0"
                  }`}
                >
                  {card.isNew && shown && (
                    <span className="absolute -right-2 -top-2 rounded-full bg-brand-600 px-2 py-0.5 text-[10px] font-bold text-white">
                      {dict.packs.newBadge}
                    </span>
                  )}
                  <Gem className={`h-8 w-8 ${styles.text}`} strokeWidth={1.5} />
                  <span className="text-sm font-semibold leading-tight text-stone-800">
                    {locale === "hu" ? card.species.nameHu : card.species.nameEn}
                  </span>
                  <span className="text-[10px] italic text-stone-400">
                    {card.species.latinName}
                  </span>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase ${styles.border} ${styles.text}`}
                  >
                    {dict.rarity[card.species.rarity]}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-stone-600">
                    <Star
                      className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                      strokeWidth={2}
                    />
                    {card.species.rating}
                  </span>
                  {!card.isNew && shown && (
                    <span className="text-[10px] text-stone-400">
                      ({dict.packs.duplicate})
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
