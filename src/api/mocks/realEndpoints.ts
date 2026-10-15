import type { FailureMode } from "@/types";
import type {
  ApiSiteArea,
  ChargerLookup,
  ChargerStatus,
  ChargerStatusResponse,
  InstallPayload,
  InstallationStep,
  RegisterTokenPayload,
  RegisterTokenResult,
  Result,
} from "@/types/api";

// Offline stand-in for the real EVES API, used whenever VITE_USE_MOCKS is not
// explicitly "false". Keyed by charger ID so a session's lookups/status
// checks/installs stay consistent with each other across a single page
// session (an in-memory Map is enough — mock state isn't meant to survive a
// reload, matching how the versioned sessionStorage session resets too).
//
// Failure behavior is selected by a case-insensitive substring in the
// charger ID (the documented mock-mode keyword table) — see
// docs/OPS-TEST-GUIDE.md for the full list the QA walkthrough uses.

const MOCK_DELAY_MS = 450;

function delay(): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, MOCK_DELAY_MS));
}

function resolveFailureMode(chargerId: string): FailureMode {
  const normalized = chargerId.trim().toUpperCase();
  const known: FailureMode[] = [
    "NOTFOUND",
    "NOAREA",
    "ONEAREA",
    "STEPFAIL",
    "INSTALLFAIL",
    "COMMFAIL",
    "HWFAIL",
    "OCPPFAIL",
    "ACTIVE",
  ];
  for (const mode of known) {
    if (normalized.includes(mode)) return mode;
  }
  return "NONE";
}

const SOUTH_LOT: ApiSiteArea = {
  siteAreaId: "area-south-lot",
  siteAreaName: "South Lot",
  voltage: 230,
  numberOfPhases: 1,
  phaseAssignment: "A",
  maxPower: 6.9,
  maxAmp: 30,
};

const FLEET_DEPOT: ApiSiteArea = {
  siteAreaId: "area-fleet-depot",
  siteAreaName: "Fleet Depot",
  voltage: 400,
  numberOfPhases: 3,
  phaseAssignment: "ABC",
  maxPower: 48,
  maxAmp: 40,
};

const LOADING_DOCK: ApiSiteArea = {
  siteAreaId: "area-loading-dock",
  siteAreaName: "Loading Dock",
  voltage: 400,
  numberOfPhases: 3,
  phaseAssignment: "ABC",
  maxPower: 60,
  maxAmp: 50,
};

const ONE_AREA_ALREADY_INSTALLED: ApiSiteArea = {
  siteAreaId: "area-one",
  siteAreaName: "Main Garage",
  voltage: 240,
  numberOfPhases: 1,
  phaseAssignment: "A",
  // Max Power reads 0 for an already-existing area per KNOWN-LIMITATIONS.md #14.
  maxPower: 0,
  maxAmp: 40,
};

interface MockChargerRecord {
  status: ChargerStatus;
  installationStep: InstallationStep;
  siteAreas: ApiSiteArea[];
  failureMode: FailureMode;
}

const store = new Map<string, MockChargerRecord>();

function buildInitialSiteAreas(failureMode: FailureMode): ApiSiteArea[] {
  if (failureMode === "NOAREA") return [];
  if (failureMode === "ONEAREA") return [ONE_AREA_ALREADY_INSTALLED];
  return [SOUTH_LOT, FLEET_DEPOT, LOADING_DOCK];
}

function getOrCreateRecord(chargerId: string): MockChargerRecord {
  const key = chargerId.trim().toUpperCase();
  let record = store.get(key);
  if (!record) {
    const failureMode = resolveFailureMode(chargerId);
    record = {
      status: failureMode === "ACTIVE" ? "Active" : "Registered",
      installationStep: null,
      siteAreas: buildInitialSiteAreas(failureMode),
      failureMode,
    };
    store.set(key, record);
  }
  return record;
}

export async function mockGetChargerByToken(chargerId: string): Promise<Result<ChargerLookup>> {
  await delay();
  const normalized = chargerId.trim().toUpperCase();
  if (normalized.includes("NOTFOUND")) {
    return { ok: false, error: "We couldn't find this charger." };
  }
  const record = getOrCreateRecord(chargerId);
  const data: ChargerLookup = {
    chargerId: normalized,
    qrCodeUrl: `https://dynachrg.example.com/qr/${normalized}`,
    serialNumber: `SN-${normalized.replace(/[^A-Z0-9]/g, "").slice(-6).padStart(6, "0")}`,
    noOfConnector: 1,
    connectors: [{ connectorType: "Type 2" }],
    site: { siteName: "Riverside HQ", siteAreas: record.siteAreas },
  };
  return { ok: true, data };
}

export async function mockGetStatus(chargerId: string): Promise<Result<ChargerStatusResponse>> {
  await delay();
  const record = getOrCreateRecord(chargerId);
  return { ok: true, data: { status: record.status, installationStep: record.installationStep } };
}

// Step values this mock recognizes. `OcppCheckComplete` is our own stand-in
// for the final OCPP step — CLAUDE.md notes the mobile app sends an
// unconfirmed value here, so treat this name as provisional until the real
// backend behavior is confirmed.
export async function mockPostStatus(
  chargerId: string,
  installationStep: string,
): Promise<Result<void>> {
  await delay();
  const record = getOrCreateRecord(chargerId);

  if (record.failureMode === "STEPFAIL") {
    return { ok: false, error: "Could not update the installation status. Please try again." };
  }
  if (installationStep === "ChargerCommCheckComplete" && record.failureMode === "COMMFAIL") {
    return { ok: false, error: "We have not received a heartbeat signal from this charger." };
  }
  if (installationStep === "ChargerHWCheckComplete" && record.failureMode === "HWFAIL") {
    return { ok: false, error: "The hardware check did not complete successfully." };
  }
  if (installationStep === "OcppCheckComplete" && record.failureMode === "OCPPFAIL") {
    return { ok: false, error: "We couldn't complete the OCPP test. Please check your network communication." };
  }

  record.installationStep = installationStep as InstallationStep;
  if (installationStep === "CDCheckComplete") record.status = "Registered";
  if (installationStep === "ChargerCommCheckComplete" || installationStep === "ChargerHWCheckComplete") {
    record.status = "Installed";
  }
  if (installationStep === "OcppCheckComplete") {
    record.status = "Connected";
    record.installationStep = null;
  }
  return { ok: true, data: undefined };
}

export async function mockPutTokenRegistration(
  _token: string,
  _chargerId: string,
  _payload: RegisterTokenPayload,
): Promise<Result<RegisterTokenResult>> {
  await delay();
  return { ok: true, data: { tenantId: "mock-tenant", siteId: "mock-site" } };
}

export async function mockPostInstall(chargerId: string, payload: InstallPayload): Promise<Result<void>> {
  await delay();
  const record = getOrCreateRecord(chargerId);
  if (record.failureMode === "INSTALLFAIL") {
    return { ok: false, error: "Installation could not be recorded. Please try again." };
  }
  record.status = "Installed";
  record.installationStep = null;
  if (payload.siteArea.isNew) {
    record.siteAreas = [
      ...record.siteAreas,
      {
        siteAreaId: payload.siteArea.siteAreaId,
        siteAreaName: payload.siteArea.siteAreaName,
        voltage: payload.siteArea.voltage,
        numberOfPhases: payload.siteArea.numberOfPhases,
        phaseAssignment: payload.siteArea.phaseAssignment,
        maxPower: payload.siteArea.maxPower,
        maxAmp: payload.siteArea.maxAmp,
      },
    ];
  }
  return { ok: true, data: undefined };
}
