import type {
  BiomeId,
  HardwoodFinish,
  LightingMode,
  SubstrateSystem,
  WaterModule,
} from "@/lib/store/vivarium-store";

export type Bi = { hu: string; en: string };

// ---------------------------------------------------------------------------
// Biomes
// ---------------------------------------------------------------------------

export type BiomeSpec = {
  id: BiomeId;
  name: Bi;
  detail: Bi;
  /** Rockscape palette driving the 3D shader + blueprint hatching. */
  rockDark: string;
  rockMid: string;
  rockLight: string;
  accent: string;
  substrateColor: string;
  moss?: string;
  /** Multiplier on hand-chisel hours. */
  laborFactor: number;
};

export const BIOMES: BiomeSpec[] = [
  {
    id: "outback_red_slate",
    name: { hu: "Outback Vörös Pala", en: "Outback Red Slate" },
    detail: {
      hu: "Ausztrál sziéna, terrakotta, meleg homokkő",
      en: "Australian sienna, terracotta, warm sandstone",
    },
    rockDark: "#7c2d12",
    rockMid: "#9e472a",
    rockLight: "#d98b58",
    accent: "#e58a3c",
    substrateColor: "#8a5a34",
    laborFactor: 1,
  },
  {
    id: "volcanic_canyon_basalt",
    name: { hu: "Vulkáni Kanyon Bazalt", en: "Volcanic Canyon Basalt" },
    detail: {
      hu: "Bazaltfekete, sötétszürke, ezüst drybrush",
      en: "Basalt black, dark gray, silver drybrush",
    },
    rockDark: "#1e252e",
    rockMid: "#3c4653",
    rockLight: "#7f8b99",
    accent: "#aab6c4",
    substrateColor: "#4a4f57",
    laborFactor: 1.15,
  },
  {
    id: "tropical_moss_vines",
    name: { hu: "Trópusi Moha & Liánok", en: "Tropical Moss & Vines" },
    detail: {
      hu: "Mélybarna szikla, élő zöld mohafoltok, liánok",
      en: "Deep brown rock, live moss, hanging vines",
    },
    rockDark: "#3a2a1c",
    rockMid: "#5b4128",
    rockLight: "#836039",
    accent: "#6b8e23",
    substrateColor: "#3d2e1d",
    moss: "#4d7c0f",
    laborFactor: 1.3,
  },
  {
    id: "virgin_cork_bark",
    name: { hu: "Natúr Parafa Kéreg", en: "Natural Virgin Cork Bark" },
    detail: {
      hu: "Vastag parafatölgy kéreg, természetes repedésekkel",
      en: "Thick virgin cork oak bark with natural fissures",
    },
    rockDark: "#4a3524",
    rockMid: "#6f5236",
    rockLight: "#a5825a",
    accent: "#c9a06a",
    substrateColor: "#4a3a26",
    laborFactor: 1.1,
  },
  {
    id: "mangrove_estuary",
    name: { hu: "Mangrove Torkolat", en: "Mangrove Estuary" },
    detail: {
      hu: "Iszapos gyökérzet, brakkvíz, sűrű árnyék",
      en: "Silted root mass, brackish water, dense shade",
    },
    rockDark: "#232b25",
    rockMid: "#3b463a",
    rockLight: "#6b7d63",
    accent: "#8fa37f",
    substrateColor: "#2e3329",
    moss: "#4f7a3a",
    laborFactor: 1.35,
  },
];

export const BIOME_BY_ID = new Map(BIOMES.map((b) => [b.id, b]));
export function getBiome(id: BiomeId): BiomeSpec {
  return BIOME_BY_ID.get(id) ?? BIOMES[0];
}

// ---------------------------------------------------------------------------
// Hardwood finishes
// ---------------------------------------------------------------------------

export type FinishSpec = {
  id: HardwoodFinish;
  name: Bi;
  detail: Bi;
  base: string;
  light: string;
  dark: string;
  grain: string;
  roughness: number;
  /** HUF per m² of veneered face. */
  pricePerSqm: number;
};

export const FINISHES: FinishSpec[] = [
  {
    id: "smoked_walnut",
    name: { hu: "Füstölt Dió", en: "Smoked Walnut" },
    detail: { hu: "Mély csokoládébarna", en: "Deep chocolate brown" },
    base: "#3E2723",
    light: "#6b4630",
    dark: "#241612",
    grain: "#1a0f0c",
    roughness: 0.52,
    pricePerSqm: 46000,
  },
  {
    id: "golden_oak",
    name: { hu: "Natúr Aranytölgy", en: "Natural Golden Oak" },
    detail: { hu: "Meleg, aranyló tölgy erezet", en: "Warm golden oak grain" },
    base: "#C19A6B",
    light: "#e3c393",
    dark: "#8d6d45",
    grain: "#7a5c38",
    roughness: 0.62,
    pricePerSqm: 34000,
  },
  {
    id: "charcoal_black_ash",
    name: { hu: "Faszén Fekete Kőris", en: "Charcoal Black Ash" },
    detail: { hu: "Matt, nyitott pórusú feketített kőris", en: "Matte open-pore blackened ash" },
    base: "#1A1A1A",
    light: "#343434",
    dark: "#0d0d0d",
    grain: "#000000",
    roughness: 0.78,
    pricePerSqm: 42000,
  },
  {
    id: "white_birch",
    name: { hu: "Skandináv Fehér Nyír", en: "Scandinavian White Birch" },
    detail: { hu: "Világos, minimál skandináv tónus", en: "Pale, minimal Nordic tone" },
    base: "#E0C9A6",
    light: "#f3e6cd",
    dark: "#bda57f",
    grain: "#a88d63",
    roughness: 0.58,
    pricePerSqm: 31000,
  },
];

export const FINISH_BY_ID = new Map(FINISHES.map((f) => [f.id, f]));
export function getFinish(id: HardwoodFinish): FinishSpec {
  return FINISH_BY_ID.get(id) ?? FINISHES[1];
}

// ---------------------------------------------------------------------------
// Lighting modes
// ---------------------------------------------------------------------------

export type LightingSpec = {
  id: LightingMode;
  name: Bi;
  detail: Bi;
  key: string;
  fill: string;
  ambient: string;
  keyIntensity: number;
  ambientIntensity: number;
  glow: string;
};

export const LIGHTING: LightingSpec[] = [
  {
    id: "daylight",
    name: { hu: "Nappali", en: "Daylight" },
    detail: { hu: "6500K LED + UVB derengés", en: "6500K LED + UVB glow" },
    key: "#fff4e2",
    fill: "#7dd3fc",
    ambient: "#9fb6c8",
    keyIntensity: 3.1,
    ambientIntensity: 0.85,
    glow: "rgba(125,211,252,0.20)",
  },
  {
    id: "sunset",
    name: { hu: "Naplemente", en: "Sunset Golden Hour" },
    detail: { hu: "2800K meleg napozófény", en: "2800K warm basking glow" },
    key: "#e58a3c",
    fill: "#9e472a",
    ambient: "#5c3a24",
    keyIntensity: 2.6,
    ambientIntensity: 0.45,
    glow: "rgba(229,138,60,0.26)",
  },
  {
    id: "nocturnal",
    name: { hu: "Éjszakai", en: "Nocturnal Moonlight" },
    detail: { hu: "450nm mély indigó holdfény", en: "450nm deep indigo moonlight" },
    key: "#6d7fc4",
    fill: "#1b2440",
    ambient: "#111831",
    keyIntensity: 0.7,
    ambientIntensity: 0.2,
    glow: "rgba(60,80,150,0.24)",
  },
];

export const LIGHTING_BY_ID = new Map(LIGHTING.map((l) => [l.id, l]));
export function getLighting(id: LightingMode): LightingSpec {
  return LIGHTING_BY_ID.get(id) ?? LIGHTING[0];
}

// ---------------------------------------------------------------------------
// Substrate + water modules
// ---------------------------------------------------------------------------

export const SUBSTRATES: { id: SubstrateSystem; name: Bi; detail: Bi; pricePerLitre: number }[] = [
  {
    id: "natural_inert",
    name: { hu: "Natúr inert aljzat", en: "Natural inert substrate" },
    detail: {
      hu: "Agyag-homok keverék, mikrofauna nélkül",
      en: "Clay-sand mix without microfauna",
    },
    pricePerLitre: 260,
  },
  {
    id: "bioactive",
    name: { hu: "Bioaktív ökoszisztéma", en: "Bioactive ecosystem" },
    detail: {
      hu: "Drenázs, válaszfal, humuszmátrix és élő takarítócsapat",
      en: "Drainage, barrier, humus matrix and a live clean-up crew",
    },
    pricePerLitre: 520,
  },
];

/** Clean-up crew options for bioactive builds. */
export const CLEANUP_CREW: { id: string; name: Bi; forArid: boolean }[] = [
  { id: "porcellio_scaber", name: { hu: "Porcellio scaber (pinceászka)", en: "Porcellio scaber (rough woodlouse)" }, forArid: true },
  { id: "porcellio_laevis", name: { hu: "Porcellio laevis (Dairy Cow)", en: "Porcellio laevis (Dairy Cow)" }, forArid: true },
  { id: "armadillidium_vulgare", name: { hu: "Armadillidium vulgare", en: "Armadillidium vulgare" }, forArid: true },
  { id: "trichorhina_tomentosa", name: { hu: "Trichorhina tomentosa (törpefehér ászka)", en: "Trichorhina tomentosa (dwarf white)" }, forArid: false },
  { id: "folsomia_candida", name: { hu: "Folsomia candida (ugróvillás)", en: "Folsomia candida (springtail)" }, forArid: false },
  { id: "eisenia_hortensis", name: { hu: "Eisenia hortensis (trágyagiliszta)", en: "Eisenia hortensis (dendrobaena)" }, forArid: false },
];

export const WATER_MODULES: {
  id: WaterModule;
  name: Bi;
  detail: Bi;
  price: number;
  /** Needs a bulkhead drain through the PVC floor. */
  bulkhead: boolean;
}[] = [
  {
    id: "none",
    name: { hu: "Nincs vízrendszer", en: "No water system" },
    detail: { hu: "Csak ivótál", en: "Water bowl only" },
    price: 0,
    bulkhead: false,
  },
  {
    id: "removable_sunken_basin",
    name: { hu: "Kivehető süllyesztett medence", en: "Removable sunken basin" },
    detail: {
      hu: "Aljzatszintbe süllyesztett, kivehető tálca a könnyű tisztításhoz",
      en: "Tray recessed flush with the substrate, lifts out for cleaning",
    },
    price: 48000,
    bulkhead: false,
  },
  {
    id: "built_in_acrylic_paludarium",
    name: { hu: "Beépített akril paludárium", en: "Built-in acrylic paludarium" },
    detail: {
      hu: "25 mm-es alsó átvezetéssel és külső kanna-szűrő csonkokkal",
      en: "With a 25 mm bottom bulkhead drain and external canister ports",
    },
    price: 186000,
    bulkhead: true,
  },
  {
    id: "rock_integrated_waterfall",
    name: { hu: "Sziklába integrált vízesés", en: "Rock-integrated waterfall" },
    detail: {
      hu: "Zárt körforgás a faragott háttérben, rejtett pumpakamrával",
      en: "Closed loop inside the carved background with a hidden pump chamber",
    },
    price: 238000,
    bulkhead: true,
  },
];

export const WATER_BY_ID = new Map(WATER_MODULES.map((w) => [w.id, w]));
export function getWater(id: WaterModule) {
  return WATER_BY_ID.get(id) ?? WATER_MODULES[0];
}
