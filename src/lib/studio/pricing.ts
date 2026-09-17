import {
  getSpecies,
  ARCADIA_SPEC,
  type HusbandrySpecies,
} from "@/lib/data/species-database";
import { LIMITS, type EnclosureUnit, type Tier, type GlobalFurnitureConfig } from "@/lib/store/vivarium-store";
import { getBiome, getFinish, getWater, SUBSTRATES } from "./catalog";

/** Indicative HUF → EUR rate, display only. */
export const EUR_RATE = 395;

// ---- Fabrication rates (HUF) ---------------------------------------------

export const RATES = {
  /** 10 mm closed-cell foamed PVC, per m² of sheet consumed. */
  pvcPerSqm: 21500,
  /** Tangit cold-weld + structural screws, per running metre of seam. */
  seamPerM: 2600,
  /** 4 mm float glass with polished edges, per m². */
  glassPerSqm: 18500,
  /** Aluminium sliding track, per running metre. */
  trackPerM: 7400,
  /** Hand-chiselled rockscape, per hour. */
  chiselPerHour: 8500,
  /** Arcadia ProT5 fixture + tube, per unit. */
  arcadiaFixture: 41000,
  /** Ceramic basking lamp + dimming thermostat channel, per unit. */
  baskingChannel: 23500,
  /** Misting/rain system brass nozzle punch-out prep, per unit. */
  mistingPrep: 18500,
  /** Cabinet hardware, pulls and feet, per unit. */
  hardware: 9800,
  /** Assembly and finishing labour, per hour. */
  assemblyPerHour: 7200,
} as const;

export const PVC_SHEET = { width: 3050, height: 1560, thicknessMm: 10 } as const;

// ---- Geometry -------------------------------------------------------------

export type UnitGeometry = {
  /** m² of PVC panel area (5 faces: back, 2 sides, floor, top). */
  pvcSqm: number;
  /** m² of front glass (two sliding panes). */
  glassSqm: number;
  /** running metres of cold-welded seam. */
  seamM: number;
  /** running metres of sliding track (top + bottom). */
  trackM: number;
  /** m² of veneered visible face (front frame + exposed sides/top). */
  veneerSqm: number;
  /** usable interior volume in litres */
  volumeL: number;
  /** hand-chisel hours for the rockscape */
  chiselHours: number;
};

export function unitGeometry(u: EnclosureUnit): UnitGeometry {
  const w = u.width / 100;
  const h = u.height / 100;
  const d = u.depth / 100;

  const pvcSqm = w * h /* back */ + 2 * (d * h) /* sides */ + 2 * (w * d) /* floor + top */;
  const glassSqm = w * h;
  // Seams: 4 around the back panel + 4 vertical/horizontal corner joints.
  const seamM = 2 * (w + h) + 2 * (w + d) + 2 * h;
  const trackM = 2 * w;
  // Visible face: the front frame surround plus the two exposed side panels.
  const veneerSqm = w * h * 0.22 + 2 * (d * h) + w * d;
  const volumeL = u.width * u.depth * u.height / 1000;

  const biome = getBiome(u.custom.biome);
  // Carving scales with the back wall area, not the volume.
  const chiselHours = Math.round(w * h * 14 * biome.laborFactor);

  return { pvcSqm, glassSqm, seamM, trackM, veneerSqm, volumeL, chiselHours };
}

// ---- Bill of materials ----------------------------------------------------

export type BomLine = {
  key: string;
  label: { hu: string; en: string };
  qty: string;
  amount: number;
};

export type Quote = {
  lines: BomLine[];
  subtotal: number;
  /** Total PVC sheet area required, m². */
  pvcSqm: number;
  glassSqm: number;
  chiselHours: number;
  unitCount: number;
  totalVolumeL: number;
  total: number;
  eur: number;
};

const f = (n: number) => Math.round(n);

export function quoteBuild(tiers: Tier[], furniture: GlobalFurnitureConfig): Quote {
  const units = tiers.flatMap((t) => t.units);
  const finish = getFinish(furniture.finish);

  let pvcSqm = 0;
  let glassSqm = 0;
  let seamM = 0;
  let trackM = 0;
  let veneerSqm = 0;
  let chiselHours = 0;
  let totalVolumeL = 0;
  let substrateCost = 0;
  let waterCost = 0;
  let mistingCount = 0;

  for (const u of units) {
    const g = unitGeometry(u);
    pvcSqm += g.pvcSqm;
    glassSqm += g.glassSqm;
    seamM += g.seamM;
    trackM += g.trackM;
    veneerSqm += g.veneerSqm;
    chiselHours += g.chiselHours;
    totalVolumeL += g.volumeL;

    // Substrate volume: footprint × bed depth (deeper for diggers).
    const species = getSpecies(u.custom.speciesId);
    const bedCm = species?.behaviours.includes("digging") ? 25 : 12;
    const litres = (u.width * u.depth * bedCm) / 1000;
    const sub = SUBSTRATES.find((s) => s.id === u.custom.substrate) ?? SUBSTRATES[0];
    substrateCost += litres * sub.pricePerLitre;

    waterCost += getWater(u.custom.water).price;
    if (u.custom.mistingPrep) mistingCount += 1;
  }

  const assemblyHours = Math.round(units.length * 9 + pvcSqm * 1.6);

  const lines: BomLine[] = [
    {
      key: "pvc",
      label: { hu: "10 mm zárt cellás PVC mag", en: "10 mm closed-cell PVC core" },
      qty: `${pvcSqm.toFixed(2)} m²`,
      amount: f(pvcSqm * RATES.pvcPerSqm),
    },
    {
      key: "seam",
      label: { hu: "Tangit hideghegesztés + csavarozás", en: "Tangit cold-weld + screw fixing" },
      qty: `${seamM.toFixed(1)} m`,
      amount: f(seamM * RATES.seamPerM),
    },
    {
      key: "veneer",
      label: { hu: `Nemesfa furnér — ${finish.name.hu}`, en: `Hardwood veneer — ${finish.name.en}` },
      qty: `${veneerSqm.toFixed(2)} m²`,
      amount: f(veneerSqm * finish.pricePerSqm),
    },
    {
      key: "glass",
      label: { hu: "4 mm float üveg, csiszolt él", en: "4 mm float glass, polished edge" },
      qty: `${glassSqm.toFixed(2)} m²`,
      amount: f(glassSqm * RATES.glassPerSqm),
    },
    {
      key: "track",
      label: { hu: "Alumínium tolósín", en: "Aluminium sliding track" },
      qty: `${trackM.toFixed(1)} m`,
      amount: f(trackM * RATES.trackPerM),
    },
    {
      key: "chisel",
      label: { hu: "Kézi sziklafaragás", en: "Hand-chiselled rockscape" },
      qty: `${chiselHours} h`,
      amount: f(chiselHours * RATES.chiselPerHour),
    },
    {
      key: "arcadia",
      label: { hu: "Arcadia ProT5 készlet", en: "Arcadia ProT5 fixture set" },
      qty: `${units.length} ×`,
      amount: f(units.length * RATES.arcadiaFixture),
    },
    {
      key: "basking",
      label: { hu: "Kerámia napozó + termosztát csatorna", en: "Ceramic basking + thermostat channel" },
      qty: `${units.length} ×`,
      amount: f(units.length * RATES.baskingChannel),
    },
    {
      key: "substrate",
      label: { hu: "Aljzatrendszer", en: "Substrate system" },
      qty: "—",
      amount: f(substrateCost),
    },
  ];

  if (waterCost > 0) {
    lines.push({
      key: "water",
      label: { hu: "Vízrendszer modulok", en: "Water system modules" },
      qty: "—",
      amount: f(waterCost),
    });
  }
  if (mistingCount > 0) {
    lines.push({
      key: "misting",
      label: { hu: "Párásító előkészítés", en: "Misting system prep" },
      qty: `${mistingCount} ×`,
      amount: f(mistingCount * RATES.mistingPrep),
    });
  }

  lines.push(
    {
      key: "hardware",
      label: { hu: "Bútorvasalat, fogantyúk, lábak", en: "Cabinet hardware, pulls, feet" },
      qty: `${units.length} ×`,
      amount: f(units.length * RATES.hardware),
    },
    {
      key: "assembly",
      label: { hu: "Összeszerelés és felületkezelés", en: "Assembly and finishing" },
      qty: `${assemblyHours} h`,
      amount: f(assemblyHours * RATES.assemblyPerHour),
    }
  );

  const subtotal = lines.reduce((sum, l) => sum + l.amount, 0);

  return {
    lines,
    subtotal,
    pvcSqm,
    glassSqm,
    chiselHours,
    unitCount: units.length,
    totalVolumeL,
    total: subtotal,
    eur: Math.round(subtotal / EUR_RATE),
  };
}

// ---- Species fit validation ----------------------------------------------

export type FitIssue = {
  level: "error" | "warning" | "info";
  code: string;
  message: { hu: string; en: string };
};

/**
 * Some animals simply outgrow furniture-scale cabinetry. A crocodile monitor
 * or an adult sulcata needs more floor than the largest module this system
 * builds, so we say that plainly instead of showing "too small" against a
 * box the customer cannot actually enlarge.
 */
export function exceedsSystem(species: HusbandrySpecies): boolean {
  const maxVolumeL = (LIMITS.width.max * LIMITS.depth.max * LIMITS.height.max) / 1000;
  const [w, d] = species.minFootprintCm;
  return (
    species.minVolumeL > maxVolumeL ||
    w > LIMITS.width.max ||
    d > LIMITS.depth.max
  );
}

/**
 * Checks a unit against its assigned animal. Errors mean the build as
 * configured is not suitable for that animal; warnings mean it will work but
 * the configuration is fighting the species' needs.
 */
export function validateUnit(u: EnclosureUnit): FitIssue[] {
  const species = getSpecies(u.custom.speciesId);
  if (!species) return [];

  const issues: FitIssue[] = [];
  const volumeL = (u.width * u.depth * u.height) / 1000;
  const [minW, minD] = species.minFootprintCm;

  if (exceedsSystem(species)) {
    issues.push({
      level: "error",
      code: "system_limit",
      message: {
        hu: `Ez a faj kinövi a bútorrendszert: ${minW}×${minD} cm alapterület és ${species.minVolumeL} L kell neki, ami a legnagyobb modulnál (${LIMITS.width.max}×${LIMITS.depth.max}×${LIMITS.height.max} cm) is több. Helyiség-léptékű egyedi építés szükséges.`,
        en: `This animal outgrows the furniture system: it needs ${minW}×${minD} cm of floor and ${species.minVolumeL} L, beyond even the largest module (${LIMITS.width.max}×${LIMITS.depth.max}×${LIMITS.height.max} cm). A room-scale custom build is required.`,
      },
    });
    return issues;
  }

  if (volumeL < species.minVolumeL) {
    issues.push({
      level: "error",
      code: "volume",
      message: {
        hu: `Túl kicsi: ${Math.round(volumeL)} L, a minimum ${species.minVolumeL} L.`,
        en: `Too small: ${Math.round(volumeL)} L against a ${species.minVolumeL} L minimum.`,
      },
    });
  }

  if (u.width < minW || u.depth < minD) {
    issues.push({
      level: "error",
      code: "footprint",
      message: {
        hu: `Alapterület kevés: ${u.width}×${u.depth} cm, a minimum ${minW}×${minD} cm.`,
        en: `Footprint too small: ${u.width}×${u.depth} cm against ${minW}×${minD} cm.`,
      },
    });
  }

  if (species.behaviours.includes("digging") && u.custom.substrate === "natural_inert") {
    issues.push({
      level: "warning",
      code: "digging",
      message: {
        hu: "Ásó faj — 25 cm mély aljzatágyat igényel, bioaktív rendszer ajánlott.",
        en: "A digging species — needs a 25 cm bed; a bioactive system is recommended.",
      },
    });
  }

  if (species.behaviours.includes("swimming") && u.custom.water === "none") {
    issues.push({
      level: "error",
      code: "water",
      message: {
        hu: "Úszó faj — vízmodul kötelező (süllyesztett medence vagy paludárium).",
        en: "A swimming species — a water module is required (sunken basin or paludarium).",
      },
    });
  }

  if (species.behaviours.includes("climbing") && u.height < 60) {
    issues.push({
      level: "warning",
      code: "climbing",
      message: {
        hu: "Mászó faj — legalább 60 cm magasság javasolt a vertikális térhez.",
        en: "A climbing species — at least 60 cm of height is advised for vertical space.",
      },
    });
  }

  if (species.humidity[0] >= 70 && u.custom.water === "none" && !u.custom.mistingPrep) {
    issues.push({
      level: "warning",
      code: "humidity",
      message: {
        hu: `Magas páraigény (${species.humidity[0]}–${species.humidity[1]}%) — párásító előkészítés javasolt.`,
        en: `High humidity need (${species.humidity[0]}–${species.humidity[1]}%) — misting prep is advised.`,
      },
    });
  }

  issues.push({
    level: "info",
    code: "arcadia",
    message: {
      hu: `Ferguson ${species.fergusonZone}. zóna → ${ARCADIA_SPEC[species.fergusonZone].tube}`,
      en: `Ferguson zone ${species.fergusonZone} → ${ARCADIA_SPEC[species.fergusonZone].tube}`,
    },
  });

  return issues;
}

export function validateBuild(tiers: Tier[]): Map<string, FitIssue[]> {
  const out = new Map<string, FitIssue[]>();
  for (const t of tiers) {
    for (const u of t.units) {
      const issues = validateUnit(u);
      if (issues.length) out.set(u.id, issues);
    }
  }
  return out;
}

/** True when any unit has a blocking problem. */
export function hasBlockingIssues(tiers: Tier[]): boolean {
  for (const issues of validateBuild(tiers).values()) {
    if (issues.some((i) => i.level === "error")) return true;
  }
  return false;
}

/** Species whose husbandry needs match a given unit's geometry. */
export function fitsUnit(species: HusbandrySpecies, u: EnclosureUnit): boolean {
  const volumeL = (u.width * u.depth * u.height) / 1000;
  const [minW, minD] = species.minFootprintCm;
  return volumeL >= species.minVolumeL && u.width >= minW && u.depth >= minD;
}
