import type { Locale } from "@/lib/i18n/dictionaries";

/** A bilingual string. */
export type Bi = { hu: string; en: string };

/** Client-safe localized picker (no server-only import). */
export function pick(locale: Locale, b: Bi): string {
  return locale === "hu" ? b.hu : b.en;
}

/** Indicative HUF → EUR conversion, display only. */
export const EUR_RATE = 395;

/** Workshop rate for hand-carving hardscape, HUF / hour. */
export const HARDSCAPE_HOURLY = 8500;

// ---------------------------------------------------------------------------
// Tier / enclosure size
// ---------------------------------------------------------------------------

export type Tier = {
  id: string;
  name: Bi;
  tagline: Bi;
  /** width × depth × height, cm */
  dims: [number, number, number];
  note?: Bi;
  /** PVC core + cabinet carcass, HUF */
  frameCost: number;
  /** lighting, UVB, heating and control gear, HUF */
  techCost: number;
  /** hand-carving hours for the rockscape */
  hardscapeHours: number;
  bioload: Bi;
  uvb: Bi;
  heating: Bi;
  /** substrate bed depth, cm */
  substrateDepth: number;
};

export const tiers: Tier[] = [
  {
    id: "solo",
    name: { hu: "Solo Agamid / Sivatagi Standard", en: "Solo Agamid / Desert Standard" },
    tagline: {
      hu: "Egyedi szakállas agámáknak és sivatagi fajoknak",
      en: "For single bearded dragons and desert species",
    },
    dims: [120, 60, 60],
    frameCost: 240000,
    techCost: 95000,
    hardscapeHours: 18,
    bioload: {
      hu: "Közepes — 1 kifejlett agáma, szárazságtűrő CUC",
      en: "Medium — 1 adult agamid, arid clean-up crew",
    },
    uvb: { hu: "Arcadia ProT5 12% Desert, süllyesztve", en: "Arcadia ProT5 12% Desert, recessed" },
    heating: {
      hu: "Halogén napozó + Deep Heat Projector, dimmelt termosztát",
      en: "Halogen basking + Deep Heat Projector, dimming thermostat",
    },
    substrateDepth: 15,
  },
  {
    id: "arboreal",
    name: {
      hu: "Arboreal Crown / Gekkó & Trópusi Torony",
      en: "Arboreal Crown / Gecko & Tropical Tower",
    },
    tagline: {
      hu: "Magas, párás torony fán lakó fajoknak",
      en: "A tall, humid tower for arboreal species",
    },
    dims: [90, 50, 100],
    frameCost: 275000,
    techCost: 110000,
    hardscapeHours: 24,
    bioload: {
      hu: "Magas — koronaszint, élő növényzet, trópusi CUC",
      en: "High — canopy level, live planting, tropical CUC",
    },
    uvb: { hu: "Arcadia ShadeDweller ProT5 7%", en: "Arcadia ShadeDweller ProT5 7%" },
    heating: {
      hu: "Alacsony wattos DHP + automata párásító",
      en: "Low-wattage DHP + automated misting",
    },
    substrateDepth: 12,
  },
  {
    id: "apex",
    name: {
      hu: "Apex Predator / Teju & Varány Bútorfal",
      en: "Apex Predator / Tegu & Monitor Furniture Wall",
    },
    tagline: {
      hu: "Teljes falat betöltő, moduláris bútorrendszer",
      en: "A full-wall, modular furniture system",
    },
    dims: [200, 90, 180],
    note: {
      hu: "Alsó 200 cm Teju szekció + felső iker-agáma modulok",
      en: "Lower 200 cm tegu section + upper twin agamid modules",
    },
    frameCost: 690000,
    techCost: 260000,
    hardscapeHours: 52,
    bioload: {
      hu: "Kiemelkedő — nagytestű varánuszok, teju, mély ásózóna",
      en: "Exceptional — large monitors, tegu, deep digging zone",
    },
    uvb: { hu: "Arcadia D3+ 14% T5 iker soros", en: "Arcadia D3+ 14% T5 dual array" },
    heating: {
      hu: "Többzónás halogén tömb + DHP, zónánkénti szabályzás",
      en: "Multi-zone halogen array + DHP, per-zone control",
    },
    substrateDepth: 25,
  },
];

// ---------------------------------------------------------------------------
// Exterior hardwood veneer
// ---------------------------------------------------------------------------

export type Wood = {
  id: string;
  name: Bi;
  swatch: Bi;
  surcharge: number;
  /** preview + 3D material colours */
  base: string;
  light: string;
  dark: string;
  grain: string;
  roughness: number;
};

export const woods: Wood[] = [
  {
    id: "oak",
    name: { hu: "Természetes Tölgy", en: "Natural Oak" },
    swatch: { hu: "Meleg, aranyló tölgy erezet", en: "Warm golden oak grain" },
    surcharge: 0,
    base: "#c69a5f",
    light: "#e6cd9a",
    dark: "#9a7238",
    grain: "#8a6530",
    roughness: 0.62,
  },
  {
    id: "walnut",
    name: { hu: "Füstölt Dió", en: "Smoked Walnut" },
    swatch: { hu: "Mély csokoládébarna, füstölt", en: "Deep chocolate, smoked" },
    surcharge: 120000,
    base: "#4b2f1e",
    light: "#7a5334",
    dark: "#2f1c11",
    grain: "#23140b",
    roughness: 0.52,
  },
  {
    id: "ash",
    name: { hu: "Fekete Kőris", en: "Black Ash" },
    swatch: { hu: "Faszénfekete, matt nyitott pórus", en: "Charcoal black, matte open pore" },
    surcharge: 90000,
    base: "#35302b",
    light: "#4d463d",
    dark: "#201d19",
    grain: "#16130f",
    roughness: 0.78,
  },
  {
    id: "birch",
    name: { hu: "Natúr Nyír", en: "Nordic Birch" },
    swatch: { hu: "Világos, minimál skandináv tónus", en: "Pale, minimal Nordic tone" },
    surcharge: 55000,
    base: "#e4d5b7",
    light: "#f4ecd7",
    dark: "#c3ad86",
    grain: "#b39a6f",
    roughness: 0.58,
  },
];

// ---------------------------------------------------------------------------
// Hand-carved 3D rockscape
// ---------------------------------------------------------------------------

export type Scape = {
  id: string;
  name: Bi;
  swatch: Bi;
  /** multiplier on hand-carving hours */
  laborFactor: number;
  bg: string;
  rockDark: string;
  rockMid: string;
  rockLight: string;
  accent: string;
  moss?: string;
  substrate: string;
};

export const scapes: Scape[] = [
  {
    id: "outback",
    name: { hu: "Outback Vörös Pala", en: "Outback Red Slate" },
    swatch: {
      hu: "Ausztrál sziéna, terrakotta, meleg homokkő",
      en: "Australian sienna, terracotta, warm sandstone",
    },
    laborFactor: 1,
    bg: "#4a1a0b",
    rockDark: "#7c2d12",
    rockMid: "#9e472a",
    rockLight: "#d98b58",
    accent: "#e58a3c",
    substrate: "#8a5a34",
  },
  {
    id: "canyon",
    name: { hu: "Vulkáni Kanyon Gránit", en: "Volcanic Canyon Granite" },
    swatch: {
      hu: "Bazaltfekete, sötétszürke, ezüst drybrush",
      en: "Basalt black, dark gray, silver drybrush",
    },
    laborFactor: 1.15,
    bg: "#0d1117",
    rockDark: "#1e252e",
    rockMid: "#3c4653",
    rockLight: "#7f8b99",
    accent: "#aab6c4",
    substrate: "#4a4f57",
  },
  {
    id: "mossy",
    name: { hu: "Szubtrópusi Mohás Sziklafal", en: "Subtropical Mossy Rock Wall" },
    swatch: {
      hu: "Mélybarna szikla, élő zöld mohafoltok",
      en: "Deep brown rock, live green moss",
    },
    laborFactor: 1.3,
    bg: "#1d1408",
    rockDark: "#3a2a1c",
    rockMid: "#5b4128",
    rockLight: "#836039",
    accent: "#6b8e23",
    moss: "#4d7c0f",
    substrate: "#3d2e1d",
  },
];

// ---------------------------------------------------------------------------
// Lighting profile
// ---------------------------------------------------------------------------

export type LightingId = "day" | "golden" | "night";

export type Lighting = {
  id: LightingId;
  name: Bi;
  swatch: Bi;
  surcharge: number;
  /** key light colour + intensity driving the 3D rig and the CSS ambience */
  key: string;
  fill: string;
  ambient: string;
  keyIntensity: number;
  ambientIntensity: number;
  /** page-level glow used behind the canvas */
  glow: string;
};

export const lightings: Lighting[] = [
  {
    id: "day",
    name: { hu: "Nappali", en: "Daylight" },
    swatch: {
      hu: "Full Spectrum 6500K LED + napozó spot",
      en: "Full spectrum 6500K LED + basking spot",
    },
    surcharge: 0,
    key: "#fff4e2",
    fill: "#7dd3fc",
    ambient: "#9fb6c8",
    keyIntensity: 3.1,
    ambientIntensity: 0.85,
    glow: "rgba(125,211,252,0.20)",
  },
  {
    id: "golden",
    name: { hu: "Naplemente / Golden Hour", en: "Sunset / Golden Hour" },
    swatch: {
      hu: "3000K meleg borostyán napozófény",
      en: "3000K warm amber basking light",
    },
    surcharge: 45000,
    key: "#e58a3c",
    fill: "#9e472a",
    ambient: "#5c3a24",
    keyIntensity: 2.6,
    ambientIntensity: 0.45,
    glow: "rgba(229,138,60,0.26)",
  },
  {
    id: "night",
    name: { hu: "Éjszakai Sziluett", en: "Nocturnal Silhouette" },
    swatch: {
      hu: "Kikapcsolt fűtés, derengő holdfény",
      en: "Heating off, faint moonlight",
    },
    surcharge: 28000,
    key: "#8ba3d9",
    fill: "#1b2440",
    ambient: "#131a2e",
    keyIntensity: 0.75,
    ambientIntensity: 0.22,
    glow: "rgba(60,80,150,0.22)",
  },
];

// ---------------------------------------------------------------------------
// Selection, pricing engine and derived spec
// ---------------------------------------------------------------------------

export type Selection = {
  tierId: string;
  woodId: string;
  scapeId: string;
  lightingId: LightingId;
};

export const defaultSelection: Selection = {
  tierId: "solo",
  woodId: "oak",
  scapeId: "outback",
  lightingId: "day",
};

export type BomLine = {
  key: "frame" | "hardscape" | "tech";
  amount: number;
  /** e.g. "18 × 8 500 Ft" for the labour line */
  detail?: string;
};

export function resolve(sel: Selection) {
  const tier = tiers.find((t) => t.id === sel.tierId) ?? tiers[0];
  const wood = woods.find((w) => w.id === sel.woodId) ?? woods[0];
  const scape = scapes.find((s) => s.id === sel.scapeId) ?? scapes[0];
  const lighting = lightings.find((l) => l.id === sel.lightingId) ?? lightings[0];

  const frame = tier.frameCost + wood.surcharge;
  const hours = Math.round(tier.hardscapeHours * scape.laborFactor);
  const hardscape = hours * HARDSCAPE_HOURLY;
  const tech = tier.techCost + lighting.surcharge;

  const bom: BomLine[] = [
    { key: "frame", amount: frame },
    { key: "hardscape", amount: hardscape, detail: `${hours} h × ${HARDSCAPE_HOURLY}` },
    { key: "tech", amount: tech },
  ];

  const price = frame + hardscape + tech;
  const [w, d, h] = tier.dims;
  const volumeL = Math.round((w * d * h) / 1000);

  return { tier, wood, scape, lighting, price, bom, hours, volumeL };
}
