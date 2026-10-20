// Shapes for the 5 real EVES endpoints (CLAUDE.md "Backend integration (EVES-5453)").
// These describe the wire format after our server/ proxy has stripped auth
// headers and forwarded the upstream JSON — see src/api/normalize.ts for how
// the two documented envelope shapes collapse into these.

export type ChargerStatus =
  | "Registered"
  | "Installed"
  | "Connected"
  | "Active"
  | "Commissioned"
  | "Faulted";

// null = status just reached (no step taken yet at that status).
export type InstallationStep =
  | null
  | "CDCheckComplete"
  | "ChargerCommCheckComplete"
  | "ChargerHWCheckComplete";

export interface ApiSiteArea {
  siteAreaId: string;
  siteAreaName: string;
  voltage: number | null;
  numberOfPhases: number | null;
  phaseAssignment: string | null;
  maxPower: number | null;
  maxAmp: number | null;
}

export interface ApiConnector {
  connectorType: string;
}

// GET /api/registercharger/v1.0/:chargerId
export interface ChargerLookup {
  chargerId: string;
  qrCodeUrl: string;
  serialNumber: string;
  noOfConnector: number;
  connectors: ApiConnector[];
  site: {
    siteName: string;
    siteAreas: ApiSiteArea[];
  };
}

// GET .../status/:chargerId
export interface ChargerStatusResponse {
  status: ChargerStatus;
  installationStep: InstallationStep;
}

// PUT /api/registertoken/v1.0 body
export interface RegisterTokenPayload {
  Email: string;
  FirstName: string;
  LastName: string;
  CompanyName: string;
  PhoneNumber: string;
  ContractLicenseNumber: string;
}

// PUT /api/registertoken/v1.0 result
export interface RegisterTokenResult {
  tenantId: string;
  siteId: string;
}

// POST /api/registercharger/v1.0/installed/:chargerId body
export interface InstallPayload {
  chargerId: string;
  tenantId: string;
  siteId: string;
  siteArea: {
    isNew: boolean;
    siteAreaId: string;
    siteAreaName: string;
    voltage: number;
    maxPower: number;
    maxAmp: number;
    numberOfPhases: number;
    phaseAssignment: string;
  };
  chargerInfo: {
    numberOfPhases: number;
    chargerType: string;
    ratedPower: number;
    ratedAmp: number;
    phaseAssignment: string;
  };
  connectors: Array<{
    connectorId: string;
    type: string;
    currentType: string;
    numberOfPhases: number;
    amperage: number;
    voltage: number;
    phaseAssignment: string;
    ratedPower: number;
    ratedAmp: number;
  }>;
}

// Every function in src/api/ returns one of these instead of throwing, so
// pages can render loading/error/success without try/catch at the call site.
export type Result<T> = { ok: true; data: T } | { ok: false; error: string };

// UI-facing async state. Pages switch on `status` instead of juggling
// separate `loading`/`error`/`data` booleans that can disagree with each other.
export type RequestState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: string };
