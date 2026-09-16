"use client";

import { create } from "zustand";
import {
  defaultSelection,
  resolve,
  type LightingId,
  type Selection,
} from "./options";

type ConfiguratorState = Selection & {
  /** Which hotspot pin is currently expanded, if any. */
  activePin: string | null;
  /** Whether the inquiry drawer is open. */
  inquiryOpen: boolean;

  setTier: (id: string) => void;
  setWood: (id: string) => void;
  setScape: (id: string) => void;
  setLighting: (id: LightingId) => void;
  setActivePin: (id: string | null) => void;
  setInquiryOpen: (open: boolean) => void;
};

export const useConfigurator = create<ConfiguratorState>((set) => ({
  ...defaultSelection,
  activePin: null,
  inquiryOpen: false,

  setTier: (tierId) => set({ tierId }),
  setWood: (woodId) => set({ woodId }),
  setScape: (scapeId) => set({ scapeId }),
  setLighting: (lightingId) => set({ lightingId }),
  setActivePin: (activePin) => set({ activePin }),
  setInquiryOpen: (inquiryOpen) => set({ inquiryOpen }),
}));

/** Reads the current selection and returns the resolved spec + pricing. */
export function useResolved() {
  const tierId = useConfigurator((s) => s.tierId);
  const woodId = useConfigurator((s) => s.woodId);
  const scapeId = useConfigurator((s) => s.scapeId);
  const lightingId = useConfigurator((s) => s.lightingId);
  return resolve({ tierId, woodId, scapeId, lightingId });
}
