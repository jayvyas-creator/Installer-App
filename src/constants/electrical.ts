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

// Rotations of a phase code: "ABC" -> ["ABC", "BCA", "CAB"]. The mobile app's
// three-phase site area picker offers all three cyclic rotations of the
// phase order, not just "ABC" (CLAUDE.md's mobile-source-of-truth rule) —
// not fully documented in DESIGN-HANDOFF.md, so flagged here as inferred.
function rotate(code: string, start: number): string {
  return code.slice(start) + code.slice(0, start);
}

function rotations(code: string): string[] {
  return code.split("").map((_, i) => rotate(code, i));
}

// A `length`-character window of `code`, wrapping cyclically from `start`.
function cyclicWindow(code: string, start: number, length: number): string {
  let out = "";
  for (let i = 0; i < length; i++) out += code[(start + i) % code.length];
  return out;
}

// Every contiguous cyclic subset of `code`, smallest-to-largest, ending with
// the full code itself: "ABC" -> ["A","B","C","AB","BC","CA","ABC"],
// "AB" -> ["A","B","AB"]. This is what a single-phase charger wired into a
// three-phase site area can be assigned to: any one line, or any adjacent
// pair, or (for single-phase site areas) just the full pair. Inferred from
// the mobile app's behavior, not spelled out in DESIGN-HANDOFF.md.
function phaseSubsetsInOrder(code: string): string[] {
  const out: string[] = [];
  for (let size = 1; size < code.length; size++) {
    for (let start = 0; start < code.length; start++) {
      out.push(cyclicWindow(code, start, size));
    }
  }
  out.push(code);
  return out;
}

const LINE_BY_LETTER: Record<string, string> = { A: "L1", B: "L2", C: "L3" };

// Human-readable line annotation for a phase-assignment code, matching the
// mobile app's labels: "A" -> "A (L1-N)", "AB" -> "AB (L1-L2-G)",
// "ABC" -> "ABC (L1, L2, L3)".
export function labelForPhaseAssignment(code: string): string {
  const lines = code.split("").map((letter) => LINE_BY_LETTER[letter] ?? letter);
  if (lines.length === 1) return `${code} (${lines[0]}-N)`;
  if (lines.length === 2) return `${code} (${lines[0]}-${lines[1]}-G)`;
  return `${code} (${lines.join(", ")})`;
}

// Site Area: Phase Assignment choices depend only on how many phases the
// area has (DESIGN-HANDOFF.md §2.6). A three-phase area offers every cyclic
// rotation of "ABC" (mobile source of truth, not just the single "ABC"
// DESIGN-HANDOFF.md shows).
export function phaseAssignmentOptionsForSiteArea(numberOfPhases: NumberOfPhases): PhaseAssignment[] {
  if (numberOfPhases === "three") return rotations("ABC") as PhaseAssignment[];
  return ["A", "B", "C", "AB", "BC", "CA"];
}

// Charger Electrical Information: a single-phase site area can only host a
// single-phase charger; a three-phase site area can host either
// (DESIGN-HANDOFF.md §2.7).
export function numberOfPhasesOptionsForCharger(siteAreaNumberOfPhases: NumberOfPhases): NumberOfPhases[] {
  return siteAreaNumberOfPhases === "single" ? ["single"] : ["single", "three"];
}

// Charger Electrical Information: Phase Assignment is filtered by the site
// area's own assignment. A three-phase charger fits any three-phase
// ("ABC"/"BCA"/"CAB") area as-is; a single-phase charger can be wired to any
// contiguous cyclic subset of the area's own assignment (every single line,
// every adjacent pair, and — for a single-phase area — the full pair).
// Inferred from the mobile app's behavior (CLAUDE.md's source-of-truth
// rule); not fully spelled out in DESIGN-HANDOFF.md and should be confirmed
// against the mobile reference before this is load-bearing against the real
// backend.
export function phaseAssignmentOptionsForCharger(
  siteAreaAssignment: PhaseAssignment,
  chargerNumberOfPhases: NumberOfPhases,
): PhaseAssignment[] {
  if (chargerNumberOfPhases === "three") {
    return siteAreaAssignment.length === 3 ? [siteAreaAssignment] : [];
  }
  return phaseSubsetsInOrder(siteAreaAssignment) as PhaseAssignment[];
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
