import type { Phase, PhaseConfig, SiteArea } from "@/types";

export const MOCK_SITE_AREAS: SiteArea[] = [
  {
    id: "area-garage",
    name: "Main Garage",
    voltage: 240,
    phaseConfig: "single-phase",
    availablePhases: ["L1"],
  },
  {
    id: "area-loading-dock",
    name: "Loading Dock",
    voltage: 480,
    phaseConfig: "three-phase",
    availablePhases: ["L1", "L2", "L3"],
  },
  {
    id: "area-visitor-lot",
    name: "Visitor Parking Lot",
    voltage: 208,
    phaseConfig: "three-phase",
    availablePhases: ["L1", "L2", "L3"],
  },
];

export const PHASE_LABELS: Record<Phase, string> = {
  L1: "Line 1 (L1)",
  L2: "Line 2 (L2)",
  L3: "Line 3 (L3)",
};

export const PHASE_CONFIG_LABELS: Record<PhaseConfig, string> = {
  "single-phase": "Single-phase",
  "three-phase": "Three-phase",
};

export function amperageOptionsFor(phaseConfig: PhaseConfig): number[] {
  return phaseConfig === "single-phase" ? [30, 40, 50] : [40, 60, 80, 100];
}

export const CONNECTOR_TYPE_OPTIONS = [
  { value: "AC", label: "AC — Type 2 (Mennekes)" },
  { value: "DC", label: "DC — CCS Combo" },
] as const;
