// Canvas-local mock-data harnesses. Not shipped to the app.
//
// InstallFlowProvider holds all flow state in useState with no prop-based
// override, so the only way to preview a mid-flow or failure screen is to
// mount a real provider + real router, seed state via the same setters the
// app itself calls, then render the real page. Every page below is the
// genuine production component from src/pages — nothing here is redrawn.

import { useEffect, useRef, type ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";
import "@/styles/global.css";
import { InstallFlowProvider, useInstallFlow } from "@/state/InstallFlowContext";
import { SplashPage } from "@/pages/SplashPage";
import { HomePage } from "@/pages/HomePage";
import { ValidateChargerDetailsPage } from "@/pages/ValidateChargerDetailsPage";
import { InstallerInformationPage } from "@/pages/InstallerInformationPage";
import { EnterTokenIdPage } from "@/pages/EnterTokenIdPage";
import { ProcessingPage, type ProcessingState } from "@/pages/ProcessingPage";
import { SelectSitePage } from "@/pages/SelectSitePage";
import { SiteInformationPage } from "@/pages/SiteInformationPage";
import { CreateSiteAreaPage } from "@/pages/CreateSiteAreaPage";
import { ChargerElectricalInformationPage } from "@/pages/ChargerElectricalInformationPage";
import { ConnectorInformationDetailsPage } from "@/pages/ConnectorInformationDetailsPage";
import { InstallationSuccessPage } from "@/pages/InstallationSuccessPage";
import { CommunicationChecklistPage } from "@/pages/CommunicationChecklistPage";
import { PhysicalHealthinessPage } from "@/pages/PhysicalHealthinessPage";
import { AutomatedOcppTestingPage } from "@/pages/AutomatedOcppTestingPage";
import { ReadyToBeCommissionedPage } from "@/pages/ReadyToBeCommissionedPage";
import { ReadyToChargePage } from "@/pages/ReadyToChargePage";
import { NoEvChargerFoundPage } from "@/pages/NoEvChargerFoundPage";
import { buildMockChargerDetails, COMMUNICATION_CHECKLIST_ITEMS } from "@/constants/mockData";
import type {
  ChargerDetails,
  ChargerElectricalConfig,
  ConnectorConfig,
  FailureMode,
  InstallerInfo,
} from "@/types";

const SAMPLE_INSTALLER: InstallerInfo = {
  fullName: "Jordan Avery",
  phone: "(555) 010-0199",
  email: "jordan@fieldcrew.com",
};

const GARAGE_ELECTRICAL: ChargerElectricalConfig = {
  voltage: 240,
  phaseConfig: "single-phase",
  assignedPhases: ["L1"],
  maxAmperage: 40,
};

const SAMPLE_CONNECTOR: ConnectorConfig = {
  id: "conn-preview-1",
  label: "Connector 1",
  currentType: "AC",
  phaseConfig: "single-phase",
  assignedPhases: ["L1"],
  maxAmperage: 40,
};

interface SeedPatch {
  chargerId?: string;
  failureMode?: FailureMode;
  tokenId?: string;
  chargerDetails?: ChargerDetails;
  installerInfo?: InstallerInfo;
  electricalConfig?: ChargerElectricalConfig;
  connectors?: ConnectorConfig[];
  checklistKeysChecked?: string[];
}

function Seed({ patch, children }: { patch: SeedPatch; children: ReactNode }) {
  const {
    setChargerId,
    setChargerDetails,
    setTokenId,
    setInstallerInfo,
    setElectricalConfig,
    setConnectors,
    toggleChecklistItem,
  } = useInstallFlow();
  const seeded = useRef(false);

  useEffect(() => {
    if (seeded.current) return;
    seeded.current = true;
    if (patch.chargerId) setChargerId(patch.chargerId, patch.failureMode ?? "NONE");
    if (patch.chargerDetails) setChargerDetails(patch.chargerDetails);
    if (patch.tokenId) setTokenId(patch.tokenId);
    if (patch.installerInfo) setInstallerInfo(patch.installerInfo);
    if (patch.electricalConfig) setElectricalConfig(patch.electricalConfig);
    if (patch.connectors) setConnectors(patch.connectors);
    patch.checklistKeysChecked?.forEach((key) => toggleChecklistItem(key));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{children}</>;
}

function SimulateOffline({ children }: { children: ReactNode }) {
  useEffect(() => {
    window.dispatchEvent(new Event("offline"));
  }, []);
  return <>{children}</>;
}

function SimulateBackOnline({ children }: { children: ReactNode }) {
  useEffect(() => {
    window.dispatchEvent(new Event("online"));
  }, []);
  return <>{children}</>;
}

function Harness({ patch, children }: { patch: SeedPatch; children: ReactNode }) {
  return (
    <InstallFlowProvider>
      <MemoryRouter initialEntries={["/"]}>
        <Seed patch={patch}>{children}</Seed>
      </MemoryRouter>
    </InstallFlowProvider>
  );
}

function ProcessingHarness({ state }: { state: ProcessingState }) {
  return (
    <InstallFlowProvider>
      <MemoryRouter initialEntries={[{ pathname: "/processing", state }]}>
        <ProcessingPage />
      </MemoryRouter>
    </InstallFlowProvider>
  );
}

const HOUR = 60 * 60 * 1000;

export function SplashSeeded() {
  return (
    <MemoryRouter initialEntries={["/splash"]}>
      <SplashPage />
    </MemoryRouter>
  );
}

export function ProcessingLookup() {
  return (
    <ProcessingHarness
      state={{
        label: "Looking up charger…",
        sublabel: "Checking records for DC-48213",
        durationMs: HOUR,
        next: "/installer-info",
      }}
    />
  );
}

export function ProcessingValidate() {
  return (
    <ProcessingHarness
      state={{
        label: "Validating charger details…",
        sublabel: "Matching token to DC-48213",
        durationMs: HOUR,
        next: "/site-information",
      }}
    />
  );
}

export function ProcessingInstallFail() {
  return (
    <ProcessingHarness
      state={{
        label: "Validating charger details…",
        sublabel: "Matching token to DC-48213",
        durationMs: 1,
        next: "/site-information",
        failure: {
          title: "Validation failed",
          description:
            "We couldn't match this token to the charger. Double-check the token ID and try again.",
          retryLabel: "Try again",
          secondaryLabel: "Re-enter token",
          secondaryTo: "/enter-token",
        },
      }}
    />
  );
}

export function ProcessingFinalize() {
  return (
    <ProcessingHarness
      state={{
        label: "Finalizing installation…",
        sublabel: "Recording 1 connector",
        durationMs: HOUR,
        next: "/installation-success",
      }}
    />
  );
}

export function ProcessingCommVerify() {
  return (
    <ProcessingHarness
      state={{
        label: "Verifying communication…",
        sublabel: "Pinging DC-48213 over the network",
        durationMs: HOUR,
        next: "/physical-healthiness",
      }}
    />
  );
}

export function ProcessingCommFail() {
  return (
    <ProcessingHarness
      state={{
        label: "Verifying communication…",
        sublabel: "Pinging DC-48213 over the network",
        durationMs: 1,
        next: "/physical-healthiness",
        failure: {
          title: "Communication check failed",
          description:
            "The charger isn't responding on the network. Verify the cable and signal, then retry.",
          retryLabel: "Try again",
          secondaryLabel: "Review checklist",
          secondaryTo: "/communication-checklist",
        },
      }}
    />
  );
}

export function ValidateChargerDetailsSeeded() {
  return (
    <Harness
      patch={{ chargerId: "DC-48213", chargerDetails: buildMockChargerDetails("DC-48213") }}
    >
      <ValidateChargerDetailsPage />
    </Harness>
  );
}

export function ValidateChargerDetailsMultiSeeded() {
  return (
    <Harness
      patch={{
        chargerId: "DC-MULTI-7731",
        chargerDetails: buildMockChargerDetails("DC-MULTI-7731"),
      }}
    >
      <ValidateChargerDetailsPage />
    </Harness>
  );
}

export function ProcessingNoHeartbeat() {
  return (
    <ProcessingHarness
      state={{
        label: "Verifying communication…",
        sublabel: "Pinging DC-48213 over the network",
        durationMs: 1,
        next: "/physical-healthiness",
        failure: {
          title: "No heartbeat received",
          description:
            "The charger connected once but has stopped sending heartbeat signals. Power-cycle the unit and confirm the network light is solid before retrying.",
          retryLabel: "Retry heartbeat check",
          secondaryLabel: "Review checklist",
          secondaryTo: "/communication-checklist",
        },
      }}
    />
  );
}

export function InstallerInfoSeeded() {
  return (
    <Harness patch={{ chargerId: "DC-48213" }}>
      <InstallerInformationPage />
    </Harness>
  );
}

export function EnterTokenSeeded() {
  return (
    <Harness patch={{ chargerId: "DC-48213", installerInfo: SAMPLE_INSTALLER }}>
      <EnterTokenIdPage />
    </Harness>
  );
}

export function SelectSiteSeeded() {
  return (
    <Harness patch={{ chargerId: "DC-48213", tokenId: "TOK-MULTI-4471" }}>
      <SelectSitePage />
    </Harness>
  );
}

export function SiteInformationSeeded() {
  return (
    <Harness patch={{ chargerId: "DC-48213" }}>
      <SiteInformationPage />
    </Harness>
  );
}

export function SiteInformationNoArea() {
  return (
    <Harness patch={{ chargerId: "DC-NOAREA-1", failureMode: "NOAREA" }}>
      <SiteInformationPage />
    </Harness>
  );
}

export function SiteAreaFormSeeded() {
  return (
    <Harness patch={{ chargerId: "DC-48213" }}>
      <CreateSiteAreaPage />
    </Harness>
  );
}

export function SiteAreaFilledSeeded() {
  return (
    <Harness patch={{ chargerId: "DC-48213" }}>
      <CreateSiteAreaPage initialName="North Lot" />
    </Harness>
  );
}

export function SiteAreaErrorSeeded() {
  return (
    <Harness patch={{ chargerId: "DC-48213" }}>
      <CreateSiteAreaPage
        initialName="Main Garage"
        initialNameError='A site area named "Main Garage" already exists. Choose a different name.'
      />
    </Harness>
  );
}

export function ChargerElectricalSeeded() {
  return (
    <Harness patch={{ chargerId: "DC-48213" }}>
      <ChargerElectricalInformationPage />
    </Harness>
  );
}

export function ConnectorInfoEmptySeeded() {
  return (
    <Harness patch={{ chargerId: "DC-48213", electricalConfig: GARAGE_ELECTRICAL }}>
      <ConnectorInformationDetailsPage />
    </Harness>
  );
}

export function ConnectorInfoAddedSeeded() {
  return (
    <Harness
      patch={{
        chargerId: "DC-48213",
        electricalConfig: GARAGE_ELECTRICAL,
        connectors: [SAMPLE_CONNECTOR],
      }}
    >
      <ConnectorInformationDetailsPage />
    </Harness>
  );
}

export function InstallationSuccessSeeded() {
  return (
    <Harness patch={{ chargerId: "DC-48213", connectors: [SAMPLE_CONNECTOR] }}>
      <InstallationSuccessPage />
    </Harness>
  );
}

export function CommChecklistSeeded() {
  return (
    <Harness patch={{ chargerId: "DC-48213" }}>
      <CommunicationChecklistPage />
    </Harness>
  );
}

export function CommChecklistCheckedSeeded() {
  return (
    <Harness
      patch={{
        chargerId: "DC-48213",
        checklistKeysChecked: COMMUNICATION_CHECKLIST_ITEMS.map((item) => item.key),
      }}
    >
      <CommunicationChecklistPage />
    </Harness>
  );
}

export function PhysicalHealthinessSeeded() {
  return (
    <Harness patch={{ chargerId: "DC-48213" }}>
      <PhysicalHealthinessPage />
    </Harness>
  );
}

export function OcppTestingSeeded() {
  return (
    <Harness patch={{ chargerId: "DC-48213" }}>
      <AutomatedOcppTestingPage />
    </Harness>
  );
}

export function OcppTestingFailSeeded() {
  return (
    <Harness patch={{ chargerId: "DC-48213", failureMode: "OCPPFAIL" }}>
      <AutomatedOcppTestingPage />
    </Harness>
  );
}

export function ReadyToBeCommissionedSeeded() {
  return (
    <Harness
      patch={{
        chargerId: "DC-48213",
        installerInfo: SAMPLE_INSTALLER,
        connectors: [SAMPLE_CONNECTOR],
      }}
    >
      <ReadyToBeCommissionedPage />
    </Harness>
  );
}

export function ReadyToChargeSeeded() {
  return (
    <Harness patch={{ chargerId: "DC-ACTIVE-7", failureMode: "ACTIVE" }}>
      <ReadyToChargePage />
    </Harness>
  );
}

export function NoChargerFoundSeeded() {
  return (
    <Harness patch={{ chargerId: "DC-NOTFOUND-1", failureMode: "NOTFOUND" }}>
      <NoEvChargerFoundPage />
    </Harness>
  );
}

export function HomeWithDraftSeeded() {
  return (
    <Harness patch={{ chargerId: "DC-48213", installerInfo: SAMPLE_INSTALLER }}>
      <HomePage />
    </Harness>
  );
}

export function HomeOfflineSeeded() {
  return (
    <Harness patch={{}}>
      <SimulateOffline>
        <HomePage />
      </SimulateOffline>
    </Harness>
  );
}

export function HomeBackOnlineSeeded() {
  return (
    <Harness patch={{}}>
      <SimulateBackOnline>
        <HomePage />
      </SimulateBackOnline>
    </Harness>
  );
}
