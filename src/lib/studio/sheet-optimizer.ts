import type { Tier } from "@/lib/store/vivarium-store";
import { PVC_SHEET } from "./pricing";

/** A rectangular part to be cut from PVC board, millimetres. */
export type Part = {
  id: string;
  unitId: string;
  /** Which face of the enclosure this panel is. */
  role: "back" | "side" | "floor" | "top";
  w: number;
  h: number;
};

export type PlacedPart = Part & { x: number; y: number; rotated: boolean };

export type Sheet = {
  index: number;
  parts: PlacedPart[];
  /** Fraction of the sheet covered by parts, 0..1 */
  usage: number;
};

export type NestResult = {
  sheets: Sheet[];
  /** Parts that do not fit on a single board at all. */
  oversized: Part[];
  totalPartArea: number;
  totalSheetArea: number;
  /** Fraction of purchased board that ends up as offcut. */
  wasteRatio: number;
  kerfMm: number;
};

/** Saw kerf allowance between parts. */
const KERF = 4;

/** Build the flat part list for the whole wall. */
export function partsForBuild(tiers: Tier[]): Part[] {
  const parts: Part[] = [];
  for (const tier of tiers) {
    for (const u of tier.units) {
      const w = u.width * 10; // cm → mm
      const h = u.height * 10;
      const d = u.depth * 10;
      parts.push({ id: `${u.id}-back`, unitId: u.id, role: "back", w, h });
      parts.push({ id: `${u.id}-sideL`, unitId: u.id, role: "side", w: d, h });
      parts.push({ id: `${u.id}-sideR`, unitId: u.id, role: "side", w: d, h });
      parts.push({ id: `${u.id}-floor`, unitId: u.id, role: "floor", w, h: d });
      parts.push({ id: `${u.id}-top`, unitId: u.id, role: "top", w, h: d });
    }
  }
  return parts;
}

type FreeRect = { x: number; y: number; w: number; h: number };

type Placement = { rectIndex: number; rotated: boolean; waste: number };

/**
 * Guillotine shelf-packing with best-area-fit and free-rectangle splitting.
 *
 * This is deliberately a heuristic, not an optimal nest: exact 2D bin packing
 * is NP-hard, and for a handful of large rectangular panels a decreasing-height
 * best-fit pass lands within a few percent of hand-nesting while staying
 * instant to recompute on every slider drag.
 */
export function nestParts(
  parts: Part[],
  sheetW = PVC_SHEET.width,
  sheetH = PVC_SHEET.height
): NestResult {
  const oversized: Part[] = [];
  const fitting: Part[] = [];

  for (const p of parts) {
    const fitsFlat = p.w <= sheetW && p.h <= sheetH;
    const fitsRotated = p.h <= sheetW && p.w <= sheetH;
    if (!fitsFlat && !fitsRotated) oversized.push(p);
    else fitting.push(p);
  }

  // Largest area first — big panels define the layout, offcuts absorb the rest.
  const queue = [...fitting].sort((a, b) => b.w * b.h - a.w * a.h);

  const sheets: { free: FreeRect[]; parts: PlacedPart[] }[] = [];

  const newSheet = () => {
    sheets.push({ free: [{ x: 0, y: 0, w: sheetW, h: sheetH }], parts: [] });
    return sheets[sheets.length - 1];
  };

  for (const part of queue) {
    let placed = false;

    for (const sheet of sheets) {
      const spot = findBestFree(sheet.free, part);
      if (!spot) continue;
      place(sheet, spot.rectIndex, part, spot.rotated);
      placed = true;
      break;
    }

    if (!placed) {
      const sheet = newSheet();
      const spot = findBestFree(sheet.free, part);
      if (spot) {
        place(sheet, spot.rectIndex, part, spot.rotated);
      } else {
        // Fits a bare board by dimension check but not after kerf — treat as
        // oversized rather than silently dropping it from the cut list.
        oversized.push(part);
        sheets.pop();
      }
    }
  }

  const totalPartArea = fitting.reduce((s, p) => s + p.w * p.h, 0);
  const totalSheetArea = sheets.length * sheetW * sheetH;

  return {
    sheets: sheets.map((s, i) => ({
      index: i,
      parts: s.parts,
      usage:
        s.parts.reduce((sum, p) => sum + p.w * p.h, 0) / (sheetW * sheetH),
    })),
    oversized,
    totalPartArea,
    totalSheetArea,
    wasteRatio: totalSheetArea > 0 ? 1 - totalPartArea / totalSheetArea : 0,
    kerfMm: KERF,
  };

  // --- helpers ---

  function findBestFree(free: FreeRect[], part: Part): Placement | null {
    // A plain loop, not forEach: TypeScript does not track assignments made
    // inside a callback, which narrows the accumulator to `never`.
    let best: Placement | null = null;

    for (let rectIndex = 0; rectIndex < free.length; rectIndex++) {
      const rect = free[rectIndex];
      for (const rotated of [false, true]) {
        const pw = (rotated ? part.h : part.w) + KERF;
        const ph = (rotated ? part.w : part.h) + KERF;
        if (pw > rect.w || ph > rect.h) continue;
        const waste = rect.w * rect.h - pw * ph;
        if (best === null || waste < best.waste) {
          best = { rectIndex, rotated, waste };
        }
      }
    }

    return best;
  }

  function place(
    sheet: { free: FreeRect[]; parts: PlacedPart[] },
    rectIndex: number,
    part: Part,
    rotated: boolean
  ) {
    const rect = sheet.free[rectIndex];
    const pw = (rotated ? part.h : part.w) + KERF;
    const ph = (rotated ? part.w : part.h) + KERF;

    sheet.parts.push({ ...part, x: rect.x, y: rect.y, rotated });

    // Guillotine split: the remainder to the right, and the strip below.
    const right: FreeRect = { x: rect.x + pw, y: rect.y, w: rect.w - pw, h: ph };
    const below: FreeRect = { x: rect.x, y: rect.y + ph, w: rect.w, h: rect.h - ph };

    sheet.free.splice(rectIndex, 1);
    if (right.w > KERF && right.h > KERF) sheet.free.push(right);
    if (below.w > KERF && below.h > KERF) sheet.free.push(below);
    // Keep the tightest offcuts first so small parts land in them.
    sheet.free.sort((a, b) => a.w * a.h - b.w * b.h);
  }
}

export const ROLE_LABELS: Record<Part["role"], { hu: string; en: string }> = {
  back: { hu: "Hátfal", en: "Back" },
  side: { hu: "Oldalfal", en: "Side" },
  floor: { hu: "Aljzat", en: "Floor" },
  top: { hu: "Tető", en: "Top" },
};
