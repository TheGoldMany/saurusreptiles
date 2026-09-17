"use client";

import { create } from "zustand";
import { nanoUnitId } from "@/lib/studio/ids";

// ---------------------------------------------------------------------------
// Domain types
// ---------------------------------------------------------------------------

export type BiomeId =
  | "outback_red_slate"
  | "volcanic_canyon_basalt"
  | "tropical_moss_vines"
  | "virgin_cork_bark"
  | "mangrove_estuary";

export type SubstrateSystem = "bioactive" | "natural_inert";

export type WaterModule =
  | "none"
  | "removable_sunken_basin"
  | "built_in_acrylic_paludarium"
  | "rock_integrated_waterfall";

export type HardwoodFinish =
  | "smoked_walnut"
  | "golden_oak"
  | "charcoal_black_ash"
  | "white_birch";

export type LightingMode = "daylight" | "sunset" | "nocturnal";

/** Per-unit interior specification. */
export type UnitCustomization = {
  speciesId: string | null;
  biome: BiomeId;
  substrate: SubstrateSystem;
  /** Clean-up crew species, only meaningful when substrate is bioactive. */
  cleanupCrew: string[];
  water: WaterModule;
  /** Brass nozzle punch-outs prepped for a misting/rain system. */
  mistingPrep: boolean;
};

/** One enclosure in the wall. */
export type EnclosureUnit = {
  id: string;
  /** cm — clamped to the ranges below */
  width: number;
  height: number;
  depth: number;
  custom: UnitCustomization;
};

/** A horizontal row of units. */
export type Tier = {
  id: string;
  units: EnclosureUnit[];
};

export type GlobalFurnitureConfig = {
  finish: HardwoodFinish;
  lighting: LightingMode;
};

export const LIMITS = {
  width: { min: 60, max: 240 },
  height: { min: 40, max: 140 },
  depth: { min: 45, max: 100 },
} as const;

export function clampDim(kind: keyof typeof LIMITS, value: number): number {
  const { min, max } = LIMITS[kind];
  return Math.min(max, Math.max(min, Math.round(value)));
}

export const DEFAULT_CUSTOMIZATION: UnitCustomization = {
  speciesId: null,
  biome: "outback_red_slate",
  substrate: "natural_inert",
  cleanupCrew: [],
  water: "none",
  mistingPrep: false,
};

export function makeUnit(
  width: number,
  height: number,
  depth: number,
  custom: Partial<UnitCustomization> = {}
): EnclosureUnit {
  return {
    id: nanoUnitId(),
    width: clampDim("width", width),
    height: clampDim("height", height),
    depth: clampDim("depth", depth),
    custom: { ...DEFAULT_CUSTOMIZATION, ...custom },
  };
}

// ---------------------------------------------------------------------------
// Architectural presets
// ---------------------------------------------------------------------------

export type PresetId = "apex_hybrid" | "quad_matrix" | "arboreal_towers" | "freeform";

export const PRESETS: {
  id: PresetId;
  name: { hu: string; en: string };
  detail: { hu: string; en: string };
  build: () => Tier[];
}[] = [
  {
    id: "apex_hybrid",
    name: { hu: "Flagship Apex Hibrid", en: "Flagship Apex Hybrid" },
    detail: {
      hu: "1× alsó Teju/Varánusz szuite (200×90×90) + 2× felső agáma penthouse (100×60×60)",
      en: "1× bottom tegu/monitor suite (200×90×90) + 2× top agamid penthouses (100×60×60)",
    },
    build: () => [
      {
        id: nanoUnitId(),
        units: [makeUnit(100, 60, 60), makeUnit(100, 60, 60)],
      },
      { id: nanoUnitId(), units: [makeUnit(200, 90, 90)] },
    ],
  },
  {
    id: "quad_matrix",
    name: { hu: "Standard Quad Mátrix", en: "Standard Quad Matrix" },
    detail: {
      hu: "2×2 rács, mindegyik 120×60×60",
      en: "2×2 grid, each 120×60×60",
    },
    build: () => [
      { id: nanoUnitId(), units: [makeUnit(120, 60, 60), makeUnit(120, 60, 60)] },
      { id: nanoUnitId(), units: [makeUnit(120, 60, 60), makeUnit(120, 60, 60)] },
    ],
  },
  {
    id: "arboreal_towers",
    name: { hu: "Arboreal Tripla Torony", en: "Arboreal Triple Tower" },
    detail: {
      hu: "3× vertikális kaméleon/gekkó szuite (80×50×100)",
      en: "3× vertical chameleon/gecko suites (80×50×100)",
    },
    build: () => [
      {
        id: nanoUnitId(),
        units: [
          makeUnit(80, 100, 50, { biome: "tropical_moss_vines" }),
          makeUnit(80, 100, 50, { biome: "tropical_moss_vines" }),
          makeUnit(80, 100, 50, { biome: "tropical_moss_vines" }),
        ],
      },
    ],
  },
  {
    id: "freeform",
    name: { hu: "Egyedi Moduláris", en: "Custom Modular Freeform" },
    detail: {
      hu: "Kezdj egy modullal, majd adj hozzá sorokat és oszd/vond össze a modulokat",
      en: "Start from one module, then add rows and split or merge modules",
    },
    build: () => [{ id: nanoUnitId(), units: [makeUnit(120, 60, 60)] }],
  },
];

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export type WizardStep = 1 | 2 | 3 | 4 | 5;

type State = {
  tiers: Tier[];
  furniture: GlobalFurnitureConfig;
  step: WizardStep;
  /** Unit currently being edited / focused in the 3D view. */
  selectedUnitId: string | null;
  activePin: string | null;

  // architecture
  applyPreset: (id: PresetId) => void;
  addTier: (position?: "top" | "bottom") => void;
  removeTier: (tierId: string) => void;
  addUnit: (tierId: string) => void;
  removeUnit: (unitId: string) => void;
  /** Split a unit into two half-width modules. */
  splitUnit: (unitId: string) => void;
  /** Merge a unit with its right-hand neighbour. */
  mergeWithNext: (unitId: string) => void;
  setUnitDim: (unitId: string, kind: keyof typeof LIMITS, value: number) => void;

  // interior
  updateUnit: (unitId: string, patch: Partial<UnitCustomization>) => void;

  // global
  setFinish: (finish: HardwoodFinish) => void;
  setLighting: (lighting: LightingMode) => void;

  // navigation
  setStep: (step: WizardStep) => void;
  next: () => void;
  prev: () => void;
  selectUnit: (unitId: string | null) => void;
  setActivePin: (pin: string | null) => void;
};

function mapUnits(tiers: Tier[], fn: (u: EnclosureUnit) => EnclosureUnit): Tier[] {
  return tiers.map((t) => ({ ...t, units: t.units.map(fn) }));
}

export const useVivarium = create<State>((set) => ({
  tiers: PRESETS[0].build(),
  furniture: { finish: "golden_oak", lighting: "daylight" },
  step: 1,
  selectedUnitId: null,
  activePin: null,

  applyPreset: (id) =>
    set(() => {
      const preset = PRESETS.find((p) => p.id === id) ?? PRESETS[0];
      const tiers = preset.build();
      return { tiers, selectedUnitId: tiers[0]?.units[0]?.id ?? null };
    }),

  addTier: (position = "top") =>
    set((s) => {
      const tier: Tier = { id: nanoUnitId(), units: [makeUnit(120, 60, 60)] };
      return {
        tiers: position === "top" ? [tier, ...s.tiers] : [...s.tiers, tier],
      };
    }),

  removeTier: (tierId) =>
    set((s) => ({
      // Never leave the wall with nothing in it.
      tiers: s.tiers.length > 1 ? s.tiers.filter((t) => t.id !== tierId) : s.tiers,
    })),

  addUnit: (tierId) =>
    set((s) => ({
      tiers: s.tiers.map((t) =>
        t.id === tierId ? { ...t, units: [...t.units, makeUnit(120, 60, 60)] } : t
      ),
    })),

  removeUnit: (unitId) =>
    set((s) => {
      const tiers = s.tiers
        .map((t) => ({ ...t, units: t.units.filter((u) => u.id !== unitId) }))
        .filter((t) => t.units.length > 0);
      return {
        tiers: tiers.length ? tiers : s.tiers,
        selectedUnitId: s.selectedUnitId === unitId ? null : s.selectedUnitId,
      };
    }),

  splitUnit: (unitId) =>
    set((s) => ({
      tiers: s.tiers.map((t) => {
        const i = t.units.findIndex((u) => u.id === unitId);
        if (i === -1) return t;
        const u = t.units[i];
        const half = clampDim("width", u.width / 2);
        // Splitting below the minimum width would silently resize the wall,
        // so refuse rather than produce an unbuildable module.
        if (u.width / 2 < LIMITS.width.min) return t;
        const a = { ...u, id: nanoUnitId(), width: half };
        const b = { ...u, id: nanoUnitId(), width: half, custom: { ...u.custom } };
        const units = [...t.units];
        units.splice(i, 1, a, b);
        return { ...t, units };
      }),
    })),

  mergeWithNext: (unitId) =>
    set((s) => ({
      tiers: s.tiers.map((t) => {
        const i = t.units.findIndex((u) => u.id === unitId);
        if (i === -1 || i === t.units.length - 1) return t;
        const a = t.units[i];
        const b = t.units[i + 1];
        const merged: EnclosureUnit = {
          ...a,
          width: clampDim("width", a.width + b.width),
          height: Math.max(a.height, b.height),
          depth: Math.max(a.depth, b.depth),
        };
        const units = [...t.units];
        units.splice(i, 2, merged);
        return { ...t, units };
      }),
    })),

  setUnitDim: (unitId, kind, value) =>
    set((s) => ({
      tiers: mapUnits(s.tiers, (u) =>
        u.id === unitId ? { ...u, [kind]: clampDim(kind, value) } : u
      ),
    })),

  updateUnit: (unitId, patch) =>
    set((s) => ({
      tiers: mapUnits(s.tiers, (u) =>
        u.id === unitId ? { ...u, custom: { ...u.custom, ...patch } } : u
      ),
    })),

  setFinish: (finish) => set((s) => ({ furniture: { ...s.furniture, finish } })),
  setLighting: (lighting) => set((s) => ({ furniture: { ...s.furniture, lighting } })),

  setStep: (step) => set({ step }),
  next: () => set((s) => ({ step: Math.min(5, s.step + 1) as WizardStep })),
  prev: () => set((s) => ({ step: Math.max(1, s.step - 1) as WizardStep })),
  selectUnit: (selectedUnitId) => set({ selectedUnitId }),
  setActivePin: (activePin) => set({ activePin }),
}));

/** Flat list of every unit in the wall, top tier first. */
export function flatUnits(tiers: Tier[]): EnclosureUnit[] {
  return tiers.flatMap((t) => t.units);
}
