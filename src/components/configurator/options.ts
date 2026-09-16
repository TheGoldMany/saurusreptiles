import type { Locale } from "@/lib/i18n/dictionaries";

/** A bilingual string. */
export type Bi = { hu: string; en: string };

/** Client-safe localized picker (no server-only import). */
export function pick(locale: Locale, b: Bi): string {
  return locale === "hu" ? b.hu : b.en;
}

/** Approximate HUF → EUR conversion used only for indicative pricing. */
export const EUR_RATE = 395;

// ---------------------------------------------------------------------------
// Enclosure size / tier
// ---------------------------------------------------------------------------

export type Tier = {
  id: string;
  name: Bi;
  tagline: Bi;
  /** width × depth × height in cm */
  dims: [number, number, number];
  basePrice: number;
  bioload: Bi;
  uvb: Bi;
  heating: Bi;
  stacked?: Bi;
};

export const tiers: Tier[] = [
  {
    id: "standard",
    name: { hu: "Standard Desert / Agáma", en: "Standard Desert / Agamid" },
    tagline: {
      hu: "Sivatagi és szárazságkedvelő fajoknak",
      en: "For desert and arid-dwelling species",
    },
    dims: [120, 60, 60],
    basePrice: 420000,
    bioload: {
      hu: "Közepes — agámák, tüskésfarkúak",
      en: "Medium — agamas, uromastyx",
    },
    uvb: { hu: "Arcadia ProT5 6% Desert", en: "Arcadia ProT5 6% Desert" },
    heating: {
      hu: "60W kerámia + digitális termosztát",
      en: "60W ceramic + digital thermostat",
    },
  },
  {
    id: "arboreal",
    name: { hu: "Arboreal / Canopy", en: "Arboreal / Canopy" },
    tagline: {
      hu: "Fán lakó gyíkoknak és kaméleonoknak",
      en: "For arboreal lizards and chameleons",
    },
    dims: [90, 45, 90],
    basePrice: 460000,
    bioload: {
      hu: "Magas — fán lakó fajok, páratűrő",
      en: "High — arboreal, humidity-loving species",
    },
    uvb: { hu: "Arcadia ShadeDweller ProT5 6%", en: "Arcadia ShadeDweller ProT5 6%" },
    heating: {
      hu: "50W basking spot + dimmer termosztát",
      en: "50W basking spot + dimming thermostat",
    },
  },
  {
    id: "apex",
    name: { hu: "Apex / Varánusz & Tegu fal", en: "Apex / Monitor & Tegu Wall" },
    tagline: {
      hu: "Nagytestű fajoknak, stackelhető modulokkal",
      en: "For large species, with stackable modules",
    },
    dims: [200, 80, 100],
    basePrice: 980000,
    bioload: {
      hu: "Kiemelkedő — varánuszok, teguk, nagytestűek",
      en: "Exceptional — monitors, tegus, large species",
    },
    uvb: { hu: "Arcadia D3+ 12% T5 dupla soros", en: "Arcadia D3+ 12% T5 dual array" },
    heating: {
      hu: "2× 100W Deep Heat Projector + halogén",
      en: "2× 100W Deep Heat Projector + halogen",
    },
    stacked: {
      hu: "Stackelhető: +1 modul kérhető",
      en: "Stackable: +1 module available",
    },
  },
];

// ---------------------------------------------------------------------------
// Exterior hardwood finish
// ---------------------------------------------------------------------------

export type Wood = {
  id: string;
  name: Bi;
  swatch: Bi;
  addPrice: number;
  /** colors used by the animated preview */
  base: string;
  light: string;
  dark: string;
  grain: string;
};

export const woods: Wood[] = [
  {
    id: "oak",
    name: { hu: "Natúr fehér tölgy", en: "Natural White Oak" },
    swatch: { hu: "Meleg bézs–arany erezet", en: "Warm beige-gold grain" },
    addPrice: 0,
    base: "#c69a5f",
    light: "#e6cd9a",
    dark: "#9a7238",
    grain: "#8a6530",
  },
  {
    id: "walnut",
    name: { hu: "Füstölt dió", en: "Smoked Walnut" },
    swatch: { hu: "Mély csokoládébarna", en: "Deep chocolate brown" },
    addPrice: 120000,
    base: "#4b2f1e",
    light: "#7a5334",
    dark: "#2f1c11",
    grain: "#23140b",
  },
  {
    id: "ash",
    name: { hu: "Rusztikus fekete kőris", en: "Rustic Black Ash" },
    swatch: { hu: "Matt faszén szürke", en: "Matte charcoal" },
    addPrice: 90000,
    base: "#35302b",
    light: "#4d463d",
    dark: "#201d19",
    grain: "#16130f",
  },
  {
    id: "birch",
    name: { hu: "Minimál nordikus nyír", en: "Minimal Nordic Birch" },
    swatch: { hu: "Világos, hűvös fatónus", en: "Pale, cool timber tone" },
    addPrice: 60000,
    base: "#e4d5b7",
    light: "#f4ecd7",
    dark: "#c3ad86",
    grain: "#b39a6f",
  },
];

// ---------------------------------------------------------------------------
// 3D scape texture & palette
// ---------------------------------------------------------------------------

export type Palette = {
  id: string;
  name: Bi;
  swatch: Bi;
  addPrice: number;
  bg: string;
  rockDark: string;
  rockMid: string;
  rockLight: string;
  accent: string;
  /** optional live-moss accent colour */
  moss?: string;
};

export const palettes: Palette[] = [
  {
    id: "outback",
    name: { hu: "Vörös Outback pala", en: "Red Outback Slate" },
    swatch: { hu: "Ausztrál terrakotta, sienna, homokkő", en: "Australian terracotta, sienna, sandstone" },
    addPrice: 0,
    bg: "#5b1e0c",
    rockDark: "#7c2d12",
    rockMid: "#b45309",
    rockLight: "#e0955a",
    accent: "#ea7317",
  },
  {
    id: "canyon",
    name: { hu: "Canyon gránit", en: "Canyon Granite" },
    swatch: { hu: "Vulkáni bazalt, faszén pala, hideg szürke", en: "Volcanic basalt, charcoal slate, cold gray" },
    addPrice: 80000,
    bg: "#0f172a",
    rockDark: "#1e293b",
    rockMid: "#3c4a5e",
    rockLight: "#7c8ba1",
    accent: "#a9b6c7",
  },
  {
    id: "mossy",
    name: { hu: "Szubtrópusi mohás bazalt", en: "Subtropical Mossy Basalt" },
    swatch: { hu: "Mély barna szikla, élő moha akcentek", en: "Deep brown rock, lush moss accents" },
    addPrice: 140000,
    bg: "#241609",
    rockDark: "#3f2d20",
    rockMid: "#5b4128",
    rockLight: "#836039",
    accent: "#6b8e23",
    moss: "#4d7c0f",
  },
];

// ---------------------------------------------------------------------------
// Lighting & ambiance
// ---------------------------------------------------------------------------

export type Lighting = {
  id: "day" | "sunset" | "off";
  name: Bi;
  swatch: Bi;
  addPrice: number;
};

export const lightings: Lighting[] = [
  {
    id: "day",
    name: { hu: "Nappali mód", en: "Daytime Mode" },
    swatch: { hu: "Ropogós 6500K LED + meleg basking folt", en: "Crisp 6500K LED + warm basking spot" },
    addPrice: 0,
  },
  {
    id: "sunset",
    name: { hu: "Naplemente / aranyóra", en: "Sunset / Golden Hour" },
    swatch: { hu: "Meleg borostyán folt + tompított fény", en: "Warm amber spot + dimmed diffuse light" },
    addPrice: 45000,
  },
  {
    id: "off",
    name: { hu: "Kikapcsolva / sziluett", en: "Off / Silhouette" },
    swatch: { hu: "Éjszakai sziluett nézet", en: "Night silhouette view" },
    addPrice: 0,
  },
];

// ---------------------------------------------------------------------------
// Selection + derived spec
// ---------------------------------------------------------------------------

export type Selection = {
  tierId: string;
  woodId: string;
  paletteId: string;
  lightingId: Lighting["id"];
};

export const defaultSelection: Selection = {
  tierId: "arboreal",
  woodId: "oak",
  paletteId: "outback",
  lightingId: "day",
};

export function resolve(sel: Selection) {
  const tier = tiers.find((t) => t.id === sel.tierId) ?? tiers[0];
  const wood = woods.find((w) => w.id === sel.woodId) ?? woods[0];
  const palette = palettes.find((p) => p.id === sel.paletteId) ?? palettes[0];
  const lighting = lightings.find((l) => l.id === sel.lightingId) ?? lightings[0];
  const price =
    tier.basePrice + wood.addPrice + palette.addPrice + lighting.addPrice;
  const [w, d, h] = tier.dims;
  const volumeL = Math.round((w * d * h) / 1000);
  return { tier, wood, palette, lighting, price, volumeL };
}
