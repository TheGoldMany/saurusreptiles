"use server";

import { and, eq, gte, sql } from "drizzle-orm";
import { getDb } from "@/lib/db";
import {
  coinTransactions,
  species,
  users,
  userSpecies,
  type Species,
} from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { getPack, rollRarity } from "@/lib/packs";
import { revalidatePath } from "next/cache";

export type PackResultCard = {
  species: Species;
  isNew: boolean;
};

export type OpenPackResult =
  | { ok: true; cards: PackResultCard[]; balance: number }
  | { ok: false; error: "loginRequired" | "notEnough" | "unknown" };

export async function openPack(packId: string): Promise<OpenPackResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "loginRequired" };

  const pack = getPack(packId);
  if (!pack) return { ok: false, error: "unknown" };

  const db = getDb();

  // Deduct coins atomically; fails when the balance is insufficient.
  const updated = await db
    .update(users)
    .set({ coins: sql`${users.coins} - ${pack.cost}` })
    .where(and(eq(users.id, user.id), gte(users.coins, pack.cost)))
    .returning({ coins: users.coins });
  if (updated.length === 0) return { ok: false, error: "notEnough" };

  await db.insert(coinTransactions).values({
    userId: user.id,
    amount: -pack.cost,
    reason: `pack:${pack.id}`,
  });

  const cards: PackResultCard[] = [];
  for (let i = 0; i < pack.cards; i++) {
    const rarity = rollRarity(pack.weights);
    const [drawn] = await db
      .select()
      .from(species)
      .where(eq(species.rarity, rarity))
      .orderBy(sql`random()`)
      .limit(1);
    if (!drawn) continue;

    const inserted = await db
      .insert(userSpecies)
      .values({ userId: user.id, speciesId: drawn.id })
      .onConflictDoUpdate({
        target: [userSpecies.userId, userSpecies.speciesId],
        set: { count: sql`${userSpecies.count} + 1` },
      })
      .returning({ count: userSpecies.count });

    cards.push({ species: drawn, isNew: (inserted[0]?.count ?? 1) === 1 });
  }

  revalidatePath("/", "layout");
  return { ok: true, cards, balance: updated[0].coins };
}
