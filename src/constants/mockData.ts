import type {
  ChargerDetails,
  DetectedConnector,
  FailureMode,
  InstallerInfo,
  OcppStep,
} from "@/types";

export const DEFAULT_INSTALLER_INFO: InstallerInfo = {
  fullName: "",
  phone: "",
  email: "",
};

export function resolveFailureMode(chargerId: string): FailureMode {
  const normalized = chargerId.trim().toUpperCase();
  const known: FailureMode[] = [
    "NOTFOUND",
    "NOAREA",
    "ONEAREA",
    "STEPFAIL",
    "INSTALLFAIL",
    "NOHEARTBEAT",
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

export function buildMockChargerDetails(chargerId: string): ChargerDetails {
  return {
    chargerId: chargerId.trim().toUpperCase(),
    model: "DynaChrg DC-50",
    serialNumber: `SN-${chargerId.trim().toUpperCase().replace(/[^A-Z0-9]/g, "").slice(-6).padStart(6, "0")}`,
    manufacturer: "DynaChrg Energy Systems",
  };
}

export function buildMockDetectedConnectors(chargerId: string): DetectedConnector[] {
  const normalized = chargerId.trim().toUpperCase();
  if (normalized.includes("MULTI")) {
    return [
      { id: "connector-1", label: "Connector A", currentType: "AC", status: "ready" },
      { id: "connector-2", label: "Connector B", currentType: "DC", status: "ready" },
    ];
  }
  return [{ id: "connector-1", label: "Connector A", currentType: "AC", status: "ready" }];
}

export const COMMUNICATION_CHECKLIST_ITEMS = [
  {
    key: "network",
    label: "Network cable connected",
    description: "Ethernet run from the charger to the site network panel is seated and secured.",
  },
  {
    key: "signal",
    label: "Cellular signal verified",
    description: "On-board modem shows at least 2 bars on the installer dashboard.",
  },
  {
    key: "firmware",
    label: "Firmware up to date",
    description: "Charger is running the latest published firmware build.",
  },
];

export const PHYSICAL_HEALTH_CHECKLIST_ITEMS = [
  {
    key: "enclosure",
    label: "Enclosure sealed and undamaged",
    description: "No cracks, gaps, or exposed wiring on the housing.",
  },
  {
    key: "mounting",
    label: "Mounting bolts torqued",
    description: "All four mounting bolts are torqued to spec and the unit doesn't shift.",
  },
  {
    key: "grounding",
    label: "Grounding wire secured",
    description: "Ground wire is connected to the site grounding rod and tug-tested.",
  },
  {
    key: "cable",
    label: "Charge cable undamaged",
    description: "No cuts, fraying, or exposed conductors along the full cable length.",
  },
];

export const DEFAULT_OCPP_STEPS: OcppStep[] = [
  { key: "boot", label: "Boot notification", status: "pending" },
  { key: "heartbeat", label: "Heartbeat exchange", status: "pending" },
  { key: "auth", label: "Authorization handshake", status: "pending" },
  { key: "status", label: "Status notification", status: "pending" },
  { key: "transaction", label: "Mock transaction start/stop", status: "pending" },
];
