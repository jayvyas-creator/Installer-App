import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { DEFAULT_OCPP_STEPS } from "@/constants/mockData";
import {
  createConnectorDraft,
  createInstallerDraft,
  type ChargerDetails,
  type ChargerElectricalData,
  type ConnectorDraft,
  type InstallerDraft,
  type OcppStep,
  type SiteAreaData,
} from "@/types";
import type { ApiSiteArea, ChargerStatusResponse } from "@/types/api";

// Bump this whenever the session shape changes incompatibly. A mismatch (or
// missing key) resets to a fresh session instead of attempting a migration —
// simplest thing that works for a short-lived, single-device install flow.
// v7: installerDraft.countryCode now holds an ISO 3166-1 country code (e.g.
// "US") instead of a dial code (e.g. "+1") — see src/constants/countries.ts.
const SESSION_KEY = "dynachrg.installSession.v7";

export interface InstallSession {
  chargerId: string;
  installerDraft: InstallerDraft;
  tokenId: string;
  installerToken: string | null;
  tenantId: string | null;
  siteId: string | null;
  chargerDetails: ChargerDetails | null;
  siteAreas: ApiSiteArea[];
  selectedSiteAreaId: string | null;
  newSiteArea: SiteAreaData | null;
  chargerElectrical: ChargerElectricalData | null;
  connectorDrafts: ConnectorDraft[];
  checklistProgress: Record<string, boolean>;
  physicalChecklistProgress: Record<string, boolean>;
  ocppSteps: OcppStep[];
  status: ChargerStatusResponse | null;
  // Guard flags (Parity.md): prevent a retried/duplicated POST once a step
  // has actually succeeded against the backend.
  registered: boolean;
  installed: boolean;
}

function createEmptySession(installerDraft: InstallerDraft = createInstallerDraft()): InstallSession {
  return {
    chargerId: "",
    installerDraft,
    tokenId: "",
    installerToken: null,
    tenantId: null,
    siteId: null,
    chargerDetails: null,
    siteAreas: [],
    selectedSiteAreaId: null,
    newSiteArea: null,
    chargerElectrical: null,
    connectorDrafts: [createConnectorDraft("connector-1")],
    checklistProgress: {},
    physicalChecklistProgress: {},
    ocppSteps: DEFAULT_OCPP_STEPS,
    status: null,
    registered: false,
    installed: false,
  };
}

function loadSession(): InstallSession {
  try {
    const raw = window.sessionStorage.getItem(SESSION_KEY);
    if (!raw) return createEmptySession();
    const parsed = JSON.parse(raw) as Partial<InstallSession>;
    return { ...createEmptySession(), ...parsed };
  } catch {
    return createEmptySession();
  }
}

function persistSession(session: InstallSession) {
  try {
    window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    // Private browsing or full storage: fall back to in-memory only.
  }
}

interface InstallFlowContextValue {
  session: InstallSession;
  setChargerId: (chargerId: string) => void;
  resetForNewChargerId: (chargerId: string) => void;
  setInstallerDraft: (draft: InstallerDraft) => void;
  setTokenId: (tokenId: string) => void;
  setRegistration: (tenantId: string, siteId: string) => void;
  setChargerDetails: (details: ChargerDetails, siteAreas: ApiSiteArea[]) => void;
  setStatus: (status: ChargerStatusResponse) => void;
  setSelectedSiteArea: (siteAreaId: string) => void;
  setNewSiteArea: (siteArea: SiteAreaData, siteAreaId: string) => void;
  setChargerElectrical: (data: ChargerElectricalData) => void;
  setConnectorDrafts: (drafts: ConnectorDraft[]) => void;
  markRegistered: () => void;
  markInstalled: () => void;
  toggleChecklistItem: (key: string) => void;
  togglePhysicalChecklistItem: (key: string) => void;
  setOcppSteps: (steps: OcppStep[]) => void;
  reset: () => void;
}

const InstallFlowContext = createContext<InstallFlowContextValue | null>(null);

export function InstallFlowProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<InstallSession>(loadSession);

  const update = useCallback((updater: (prev: InstallSession) => InstallSession) => {
    setSession((prev) => {
      const next = updater(prev);
      persistSession(next);
      return next;
    });
  }, []);

  const setChargerId = useCallback(
    (chargerId: string) => update((prev) => ({ ...prev, chargerId })),
    [update],
  );

  // Starting over on a different charger ID clears everything downstream,
  // but keeps what the installer already typed on the Installer Information
  // screen — there's no reason to make them retype their own details.
  const resetForNewChargerId = useCallback(
    (chargerId: string) => update((prev) => ({ ...createEmptySession(prev.installerDraft), chargerId })),
    [update],
  );

  const setInstallerDraft = useCallback(
    (installerDraft: InstallerDraft) => update((prev) => ({ ...prev, installerDraft })),
    [update],
  );

  const setTokenId = useCallback(
    (tokenId: string) => update((prev) => ({ ...prev, tokenId, installerToken: tokenId })),
    [update],
  );

  const setRegistration = useCallback(
    (tenantId: string, siteId: string) => update((prev) => ({ ...prev, tenantId, siteId })),
    [update],
  );

  const setChargerDetails = useCallback(
    (chargerDetails: ChargerDetails, siteAreas: ApiSiteArea[]) =>
      update((prev) => ({ ...prev, chargerDetails, siteAreas })),
    [update],
  );

  const setStatus = useCallback(
    (status: ChargerStatusResponse) => update((prev) => ({ ...prev, status })),
    [update],
  );

  const setSelectedSiteArea = useCallback(
    (selectedSiteAreaId: string) => update((prev) => ({ ...prev, selectedSiteAreaId, newSiteArea: null })),
    [update],
  );

  const setNewSiteArea = useCallback(
    (newSiteArea: SiteAreaData, siteAreaId: string) =>
      update((prev) => ({ ...prev, newSiteArea, selectedSiteAreaId: siteAreaId })),
    [update],
  );

  const setChargerElectrical = useCallback(
    (chargerElectrical: ChargerElectricalData) => update((prev) => ({ ...prev, chargerElectrical })),
    [update],
  );

  const setConnectorDrafts = useCallback(
    (connectorDrafts: ConnectorDraft[]) => update((prev) => ({ ...prev, connectorDrafts })),
    [update],
  );

  const markRegistered = useCallback(() => update((prev) => ({ ...prev, registered: true })), [update]);
  const markInstalled = useCallback(() => update((prev) => ({ ...prev, installed: true })), [update]);

  const toggleChecklistItem = useCallback(
    (key: string) =>
      update((prev) => ({
        ...prev,
        checklistProgress: { ...prev.checklistProgress, [key]: !prev.checklistProgress[key] },
      })),
    [update],
  );

  const togglePhysicalChecklistItem = useCallback(
    (key: string) =>
      update((prev) => ({
        ...prev,
        physicalChecklistProgress: {
          ...prev.physicalChecklistProgress,
          [key]: !prev.physicalChecklistProgress[key],
        },
      })),
    [update],
  );

  const setOcppSteps = useCallback(
    (ocppSteps: OcppStep[]) => update((prev) => ({ ...prev, ocppSteps })),
    [update],
  );

  const reset = useCallback(() => update(() => createEmptySession()), [update]);

  const value = useMemo<InstallFlowContextValue>(
    () => ({
      session,
      setChargerId,
      resetForNewChargerId,
      setInstallerDraft,
      setTokenId,
      setRegistration,
      setChargerDetails,
      setStatus,
      setSelectedSiteArea,
      setNewSiteArea,
      setChargerElectrical,
      setConnectorDrafts,
      markRegistered,
      markInstalled,
      toggleChecklistItem,
      togglePhysicalChecklistItem,
      setOcppSteps,
      reset,
    }),
    [
      session,
      setChargerId,
      resetForNewChargerId,
      setInstallerDraft,
      setTokenId,
      setRegistration,
      setChargerDetails,
      setStatus,
      setSelectedSiteArea,
      setNewSiteArea,
      setChargerElectrical,
      setConnectorDrafts,
      markRegistered,
      markInstalled,
      toggleChecklistItem,
      togglePhysicalChecklistItem,
      setOcppSteps,
      reset,
    ],
  );

  return <InstallFlowContext.Provider value={value}>{children}</InstallFlowContext.Provider>;
}

export function useInstallFlow() {
  const ctx = useContext(InstallFlowContext);
  if (!ctx) throw new Error("useInstallFlow must be used within InstallFlowProvider");
  return ctx;
}
