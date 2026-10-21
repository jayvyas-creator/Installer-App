// Domain field types, shared across the app. These describe *values*, not
// backend wire shapes (see src/types/api.ts for that) or form-in-progress
// state (see the Draft/Data pairs below).

import { isValidPhoneNumber, type CountryCode } from "libphonenumber-js";
import { findCountryByIso } from "@/constants/countries";

export type NumberOfPhases = "single" | "three";

export type PhaseAssignment = "A" | "B" | "C" | "AB" | "BC" | "CA" | "ABC" | "BCA" | "CAB";

export type ChargerType = "AC" | "DC";

export type ConnectorCurrentType = "AC" | "DC";

export type ConnectorType =
  | "Type 2"
  | "CCS Type 2"
  | "CHAdeMO"
  | "Type 1"
  | "CCS Type 1"
  | "NACS";

export type FailureMode =
  | "NOAREA"
  | "ONEAREA"
  | "STEPFAIL"
  | "INSTALLFAIL"
  | "COMMFAIL"
  | "COMMTIMEOUT"
  | "NOHEARTBEAT"
  | "HWFAIL"
  | "OCPPFAIL"
  | "OCPPTIMEOUT"
  | "ACTIVE"
  | "COMMISSIONED"
  | "FAULTED"
  | "NOTFOUND"
  | "NONE";

export type OcppStepStatus = "waiting" | "running" | "passed" | "failed";

export interface OcppStep {
  key: string;
  label: string;
  status: OcppStepStatus;
  reason?: string;
}

// Resolved charger record, mapped from ApiChargerLookup (src/api/mappers.ts)
// for display on Validate Charger Details.
export interface ChargerDetails {
  chargerId: string;
  qrCodeUrl: string;
  serialNumber: string;
  connectorTypes: string[];
  noOfConnectors: number;
  siteName: string;
}

// A site area as returned by the backend (existing areas only — a newly
// created one is a SiteAreaData until the install POST confirms it).
export interface SiteArea {
  id: string;
  name: string;
  voltage: number | null;
  numberOfPhases: NumberOfPhases | null;
  phaseAssignment: PhaseAssignment | null;
  maxPowerKw: number | null;
  maxAmp: number | null;
}

// ---------------------------------------------------------------------------
// Draft/Data pairs (CLAUDE.md §3): a Draft holds whatever the user has typed
// so far (everything optional/string, always renderable); the matching Data
// type is only producible by validate*Draft, once every field is present and
// valid. Pages hold a Draft in local/session state and only ever hand a Data
// value to a flow (src/flows/) or API call.
// ---------------------------------------------------------------------------

export interface InstallerDraft {
  companyName: string;
  firstName: string;
  lastName: string;
  licenseNumber: string;
  evitpNumber: string;
  email: string;
  countryCode: string;
  countryName: string;
  phoneNumber: string;
}

export interface InstallerData {
  companyName: string;
  firstName: string;
  lastName: string;
  licenseNumber: string;
  evitpNumber: string;
  email: string;
  countryCode: string;
  countryName: string;
  phoneNumber: string;
}

export function createInstallerDraft(): InstallerDraft {
  return {
    companyName: "",
    firstName: "",
    lastName: "",
    licenseNumber: "",
    evitpNumber: "",
    email: "",
    countryCode: "US",
    countryName: "United States",
    phoneNumber: "",
  };
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface InstallerDraftErrors {
  companyName?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
}

export function validateInstallerDraft(
  draft: InstallerDraft,
): { data: InstallerData; errors: null } | { data: null; errors: InstallerDraftErrors } {
  const errors: InstallerDraftErrors = {};
  if (!draft.companyName.trim()) errors.companyName = "Enter your company name.";
  if (!draft.firstName.trim()) errors.firstName = "Enter your first name.";
  if (!draft.lastName.trim()) errors.lastName = "Enter your last name.";
  if (!draft.email.trim()) errors.email = "Enter your email address.";
  else if (!EMAIL_PATTERN.test(draft.email.trim())) errors.email = "Enter a valid email address.";
  if (!draft.phoneNumber.trim()) errors.phoneNumber = "Enter your mobile number.";
  // Mirrors the mobile app: full country list + libphonenumber-js validation
  // (CLAUDE.md §6, mobile app is the source of truth) instead of a bare
  // digit-count check. draft.countryCode is the ISO 3166-1 value the field
  // selects (see src/constants/countries.ts), which is what
  // isValidPhoneNumber needs to parse a nationally-formatted number.
  else if (!isValidPhoneNumber(draft.phoneNumber.trim(), draft.countryCode as CountryCode)) {
    const country = findCountryByIso(draft.countryCode);
    errors.phoneNumber = country
      ? `Enter a valid mobile number for ${country.name}.`
      : "Enter a valid mobile number.";
  }

  if (Object.keys(errors).length > 0) return { data: null, errors };
  return {
    data: {
      companyName: draft.companyName.trim(),
      firstName: draft.firstName.trim(),
      lastName: draft.lastName.trim(),
      licenseNumber: draft.licenseNumber.trim(),
      evitpNumber: draft.evitpNumber.trim(),
      email: draft.email.trim(),
      countryCode: draft.countryCode,
      countryName: draft.countryName,
      phoneNumber: draft.phoneNumber.trim(),
    },
    errors: null,
  };
}

// Create Site Area form (DESIGN-HANDOFF.md §2.6).
export interface SiteAreaDraft {
  name: string;
  voltage: number | "";
  numberOfPhases: NumberOfPhases | "";
  phaseAssignment: PhaseAssignment | "";
  ampsPerPhase: string;
}

export interface SiteAreaData {
  name: string;
  voltage: number;
  numberOfPhases: NumberOfPhases;
  phaseAssignment: PhaseAssignment;
  ampsPerPhase: number;
  maxPowerKw: number;
}

export function createSiteAreaDraft(): SiteAreaDraft {
  return { name: "", voltage: "", numberOfPhases: "", phaseAssignment: "", ampsPerPhase: "" };
}

export interface SiteAreaDraftErrors {
  name?: string;
  voltage?: string;
  numberOfPhases?: string;
  phaseAssignment?: string;
  ampsPerPhase?: string;
}

export function validateSiteAreaDraft(
  draft: SiteAreaDraft,
  existingNames: string[],
): { data: SiteAreaData; errors: null } | { data: null; errors: SiteAreaDraftErrors } {
  const errors: SiteAreaDraftErrors = {};
  const trimmedName = draft.name.trim();
  if (!trimmedName) errors.name = "Give this site area a name.";
  else if (existingNames.some((n) => n.toLowerCase() === trimmedName.toLowerCase())) {
    errors.name = `That site name's already taken. Try a different one.`;
  }
  if (draft.voltage === "") errors.voltage = "Select a supply voltage.";
  if (draft.numberOfPhases === "") errors.numberOfPhases = "Select the number of phases.";
  if (draft.phaseAssignment === "") errors.phaseAssignment = "Select a phase assignment.";

  const amps = Number(draft.ampsPerPhase);
  if (!draft.ampsPerPhase.trim() || !Number.isInteger(amps) || amps < 1 || amps > 9999) {
    errors.ampsPerPhase = "Enter a whole number between 1 and 9999.";
  }

  if (Object.keys(errors).length > 0) return { data: null, errors };

  const voltage = draft.voltage as number;
  const numberOfPhases = draft.numberOfPhases as NumberOfPhases;
  const phases = numberOfPhases === "three" ? 3 : 1;
  const maxPowerKw = Math.round(((voltage * amps * phases) / 1000) * 100) / 100;

  return {
    data: {
      name: trimmedName,
      voltage,
      numberOfPhases,
      phaseAssignment: draft.phaseAssignment as PhaseAssignment,
      ampsPerPhase: amps,
      maxPowerKw,
    },
    errors: null,
  };
}

// Charger Electrical Information (DESIGN-HANDOFF.md §2.7).
export interface ChargerElectricalDraft {
  chargerType: ChargerType | "";
  voltage: number | "";
  numberOfPhases: NumberOfPhases | "";
  phaseAssignment: PhaseAssignment | "";
  ampPerPhase: string;
}

export interface ChargerElectricalData {
  chargerType: ChargerType;
  voltage: number;
  numberOfPhases: NumberOfPhases;
  phaseAssignment: PhaseAssignment;
  ampPerPhase: number;
  ratedPowerKw: number;
}

export function createChargerElectricalDraft(siteAreaVoltage?: number): ChargerElectricalDraft {
  return {
    chargerType: "",
    voltage: siteAreaVoltage ?? "",
    numberOfPhases: "",
    phaseAssignment: "",
    ampPerPhase: "",
  };
}

export interface ChargerElectricalDraftErrors {
  chargerType?: string;
  voltage?: string;
  numberOfPhases?: string;
  phaseAssignment?: string;
  ampPerPhase?: string;
}

export function validateChargerElectricalDraft(
  draft: ChargerElectricalDraft,
  siteAreaVoltage: number,
): { data: ChargerElectricalData; errors: null } | { data: null; errors: ChargerElectricalDraftErrors } {
  const errors: ChargerElectricalDraftErrors = {};
  if (draft.chargerType === "") errors.chargerType = "Select the type of charger.";
  if (draft.voltage === "") errors.voltage = "Select a supply voltage.";
  else if (draft.voltage > siteAreaVoltage) {
    errors.voltage = `The selected voltage (${draft.voltage}V) exceeds the previously stored voltage (${siteAreaVoltage}V). Please select a lower voltage.`;
  }
  if (draft.numberOfPhases === "") errors.numberOfPhases = "Select the number of connected phases.";
  if (draft.phaseAssignment === "") errors.phaseAssignment = "Select a phase assignment.";

  const amps = Number(draft.ampPerPhase);
  if (!draft.ampPerPhase.trim() || amps < 1 || amps > 1000) {
    errors.ampPerPhase = "Enter a value between 1 and 1000.";
  }

  if (Object.keys(errors).length > 0) return { data: null, errors };

  const voltage = draft.voltage as number;
  const numberOfPhases = draft.numberOfPhases as NumberOfPhases;
  const phases = numberOfPhases === "three" ? 3 : 1;
  const ratedPowerKw = Math.round(((voltage * amps * phases) / 1000) * 100) / 100;

  return {
    data: {
      chargerType: draft.chargerType as ChargerType,
      voltage,
      numberOfPhases,
      phaseAssignment: draft.phaseAssignment as PhaseAssignment,
      ampPerPhase: amps,
      ratedPowerKw,
    },
    errors: null,
  };
}

// Connector Information Details, one per connector (DESIGN-HANDOFF.md §2.8).
export interface ConnectorDraft {
  id: string;
  connectorType: ConnectorType | "";
  currentType: ConnectorCurrentType | "";
  numberOfPhases: NumberOfPhases | "";
  totalAmperage: string;
  supplyVoltage: string;
  phaseAssignment: PhaseAssignment | "";
}

export interface ConnectorData {
  id: string;
  connectorType: ConnectorType;
  currentType: ConnectorCurrentType;
  numberOfPhases: NumberOfPhases;
  totalAmperage: number;
  supplyVoltage: number;
  phaseAssignment: PhaseAssignment;
}

export function createConnectorDraft(id: string): ConnectorDraft {
  return {
    id,
    connectorType: "",
    currentType: "",
    numberOfPhases: "",
    totalAmperage: "",
    supplyVoltage: "",
    phaseAssignment: "",
  };
}

export interface ConnectorDraftErrors {
  connectorType?: string;
  currentType?: string;
  numberOfPhases?: string;
  totalAmperage?: string;
  supplyVoltage?: string;
  phaseAssignment?: string;
}

export function validateConnectorDraft(
  draft: ConnectorDraft,
): { data: ConnectorData; errors: null } | { data: null; errors: ConnectorDraftErrors } {
  const errors: ConnectorDraftErrors = {};
  if (draft.connectorType === "") errors.connectorType = "Select a connector type.";
  if (draft.currentType === "") errors.currentType = "Select a current type.";
  if (draft.numberOfPhases === "") errors.numberOfPhases = "Select the number of connected phases.";
  if (draft.phaseAssignment === "") errors.phaseAssignment = "Select a phase assignment.";

  const amperage = Number(draft.totalAmperage);
  if (!draft.totalAmperage.trim() || amperage < 1 || amperage > 1000) {
    errors.totalAmperage = "Enter a value between 1 and 1000.";
  }
  const voltage = Number(draft.supplyVoltage);
  if (!draft.supplyVoltage.trim() || voltage < 1 || voltage > 9999) {
    errors.supplyVoltage = "Enter a value between 1 and 9999.";
  }

  if (Object.keys(errors).length > 0) return { data: null, errors };

  return {
    data: {
      id: draft.id,
      connectorType: draft.connectorType as ConnectorType,
      currentType: draft.currentType as ConnectorCurrentType,
      numberOfPhases: draft.numberOfPhases as NumberOfPhases,
      totalAmperage: amperage,
      supplyVoltage: voltage,
      phaseAssignment: draft.phaseAssignment as PhaseAssignment,
    },
    errors: null,
  };
}

// "Does this draft have enough in it to show a 'needs attention' marker on a
// collapsed connector panel?" — true once the user has touched a field but
// the draft doesn't yet validate. An untouched (all-empty) draft is not
// attention-worthy; it just hasn't been filled in yet.
export function connectorDraftNeedsAttention(draft: ConnectorDraft): boolean {
  const touched =
    draft.connectorType !== "" ||
    draft.currentType !== "" ||
    draft.numberOfPhases !== "" ||
    draft.totalAmperage.trim() !== "" ||
    draft.supplyVoltage.trim() !== "" ||
    draft.phaseAssignment !== "";
  if (!touched) return false;
  return validateConnectorDraft(draft).errors !== null;
}
