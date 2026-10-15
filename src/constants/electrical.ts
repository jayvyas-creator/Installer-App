import type { ChargerType, ConnectorCurrentType, ConnectorType, NumberOfPhases, PhaseAssignment } from "@/types";

// Site area supply voltage choices (DESIGN-HANDOFF.md §2.6), listed in the
// documented order.
export const VOLTAGE_OPTIONS = [400, 380, 277, 240, 230, 220, 208, 120, 110] as const;

export const NUMBER_OF_PHASES_OPTIONS: Array<{ value: NumberOfPhases; label: string }> = [
  { value: "single", label: "Single Phase" },
  { value: "three", label: "Three Phase" },
];

export const CHARGER_TYPE_OPTIONS: Array<{ value: ChargerType; label: string }> = [
  { value: "AC", label: "AC" },
  { value: "DC", label: "DC" },
];

export const CONNECTOR_TYPE_OPTIONS: ConnectorType[] = [
  "Type 2",
  "CCS Type 2",
  "CHAdeMO",
  "Type 1",
  "CCS Type 1",
  "NACS",
];

// Site Area: Phase Assignment choices depend only on how many phases the
// area has (DESIGN-HANDOFF.md §2.6).
export function phaseAssignmentOptionsForSiteArea(numberOfPhases: NumberOfPhases): PhaseAssignment[] {
  return numberOfPhases === "three" ? ["ABC"] : ["A", "B", "C", "AB", "BC", "CA"];
}

// Charger Electrical Information: a single-phase site area can only host a
// single-phase charger; a three-phase site area can host either
// (DESIGN-HANDOFF.md §2.7).
export function numberOfPhasesOptionsForCharger(siteAreaNumberOfPhases: NumberOfPhases): NumberOfPhases[] {
  return siteAreaNumberOfPhases === "single" ? ["single"] : ["single", "three"];
}

// Charger Electrical Information: Phase Assignment is filtered by the site
// area's own assignment. A three-phase charger only fits an all-phases
// ("ABC") area; a single-phase charger picks one of the letters the site
// area's assignment actually carries. This cascade isn't fully spelled out
// in DESIGN-HANDOFF.md — it's inferred from how site area wiring works and
// should be confirmed against the mobile reference app (CLAUDE.md's source
// of truth) before this is load-bearing against the real backend.
export function phaseAssignmentOptionsForCharger(
  siteAreaAssignment: PhaseAssignment,
  chargerNumberOfPhases: NumberOfPhases,
): PhaseAssignment[] {
  if (chargerNumberOfPhases === "three") {
    return siteAreaAssignment === "ABC" ? ["ABC"] : [];
  }
  const letters = siteAreaAssignment.split("") as PhaseAssignment[];
  return letters.filter((letter): letter is PhaseAssignment => letter === "A" || letter === "B" || letter === "C");
}

// Connector Information Details (DESIGN-HANDOFF.md §2.8). A single-phase
// charger can only offer connectors it can actually drive single-phase.
export function connectorTypeOptionsForCharger(chargerNumberOfPhases: NumberOfPhases): ConnectorType[] {
  if (chargerNumberOfPhases === "single") return ["Type 2", "Type 1", "NACS"];
  return CONNECTOR_TYPE_OPTIONS;
}

export function currentTypeOptionsForConnector(connectorType: ConnectorType): ConnectorCurrentType[] {
  if (connectorType === "Type 1" || connectorType === "Type 2") return ["AC"];
  if (connectorType === "NACS") return ["AC", "DC"];
  return ["DC"]; // CCS Type 2, CCS Type 1, CHAdeMO
}

export function numberOfPhasesOptionsForConnector(
  connectorType: ConnectorType,
  currentType: ConnectorCurrentType,
): NumberOfPhases[] {
  if (currentType === "DC") return ["three"];
  if (connectorType === "Type 1" || connectorType === "NACS") return ["single"];
  return ["single", "three"]; // Type 2 AC
}

export function phaseAssignmentOptionsForConnector(
  connectorType: ConnectorType,
  numberOfPhases: NumberOfPhases,
): PhaseAssignment[] {
  if (numberOfPhases === "three") return ["ABC"];
  if (connectorType === "Type 2") return ["A", "B", "C"];
  return ["AB", "BC", "CA"]; // Type 1 / NACS single-phase
}
