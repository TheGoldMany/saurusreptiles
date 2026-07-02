export type Rarity = "common" | "rare" | "epic" | "legendary";

export const RARITY_ORDER: Rarity[] = ["common", "rare", "epic", "legendary"];

export type PackDef = {
  id: string;
  nameHu: string;
  nameEn: string;
  cost: number; // SaurusCoins
  cards: number; // cards per pack
  /** Weights per rarity used for each card roll. */
  weights: Record<Rarity, number>;
  color: string; // tailwind gradient classes for the pack art
};

export const PACKS: PackDef[] = [
  {
    id: "starter",
    nameHu: "Kezdő pack",
    nameEn: "Starter Pack",
    cost: 3000,
    cards: 3,
    weights: { common: 78, rare: 18, epic: 3.5, legendary: 0.5 },
    color: "from-emerald-500 to-teal-600",
  },
  {
    id: "explorer",
    nameHu: "Felfedező pack",
    nameEn: "Explorer Pack",
    cost: 8000,
    cards: 5,
    weights: { common: 62, rare: 28, epic: 8, legendary: 2 },
    color: "from-sky-500 to-indigo-600",
  },
  {
    id: "premium",
    nameHu: "Prémium pack",
    nameEn: "Premium Pack",
    cost: 20000,
    cards: 5,
    weights: { common: 40, rare: 38, epic: 16, legendary: 6 },
    color: "from-violet-500 to-purple-700",
  },
  {
    id: "legend",
    nameHu: "Legenda pack",
    nameEn: "Legend Pack",
    cost: 50000,
    cards: 5,
    weights: { common: 15, rare: 40, epic: 30, legendary: 15 },
    color: "from-amber-400 to-orange-600",
  },
];

export function getPack(id: string): PackDef | undefined {
  return PACKS.find((p) => p.id === id);
}

export function rollRarity(weights: Record<Rarity, number>): Rarity {
  const total = RARITY_ORDER.reduce((s, r) => s + weights[r], 0);
  let roll = Math.random() * total;
  for (const r of RARITY_ORDER) {
    roll -= weights[r];
    if (roll <= 0) return r;
  }
  return "common";
}

export const RARITY_STYLES: Record<
  Rarity,
  { border: string; bg: string; text: string; glow: string }
> = {
  common: {
    border: "border-stone-300",
    bg: "bg-stone-100",
    text: "text-stone-600",
    glow: "",
  },
  rare: {
    border: "border-sky-400",
    bg: "bg-sky-50",
    text: "text-sky-700",
    glow: "shadow-sky-200",
  },
  epic: {
    border: "border-violet-500",
    bg: "bg-violet-50",
    text: "text-violet-700",
    glow: "shadow-violet-200",
  },
  legendary: {
    border: "border-amber-400",
    bg: "bg-amber-50",
    text: "text-amber-700",
    glow: "shadow-amber-200",
  },
};
