export type Phase = "L1" | "L2" | "L3";

export type PhaseConfig = "single-phase" | "three-phase";

export type ConnectorCurrentType = "AC" | "DC";

export interface InstallerInfo {
  fullName: string;
  phone: string;
  email: string;
}

export interface SiteArea {
  id: string;
  name: string;
  voltage: number;
  phaseConfig: PhaseConfig;
  availablePhases: Phase[];
}

export interface ChargerElectricalConfig {
  voltage: number;
  phaseConfig: PhaseConfig;
  assignedPhases: Phase[];
  maxAmperage: number;
}

export interface ConnectorConfig {
  id: string;
  label: string;
  currentType: ConnectorCurrentType;
  phaseConfig: PhaseConfig;
  assignedPhases: Phase[];
  maxAmperage: number;
}

export interface ChargerDetails {
  chargerId: string;
  model: string;
  serialNumber: string;
  manufacturer: string;
}

export type OcppStepStatus = "pending" | "running" | "passed" | "failed";

export interface OcppStep {
  key: string;
  label: string;
  status: OcppStepStatus;
}

export type FailureMode =
  | "NOAREA"
  | "ONEAREA"
  | "STEPFAIL"
  | "INSTALLFAIL"
  | "COMMFAIL"
  | "HWFAIL"
  | "OCPPFAIL"
  | "ACTIVE"
  | "NONE";

export interface InstallFlowState {
  chargerId: string;
  failureMode: FailureMode;
  chargerDetails: ChargerDetails | null;
  installerInfo: InstallerInfo;
  tokenId: string;
  siteAreas: SiteArea[];
  selectedSiteAreaId: string | null;
  electricalConfig: ChargerElectricalConfig | null;
  connectors: ConnectorConfig[];
  checklistProgress: Record<string, boolean>;
  physicalChecklistProgress: Record<string, boolean>;
  ocppSteps: OcppStep[];
}
