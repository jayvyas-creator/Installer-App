import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import {
  DEFAULT_INSTALLER_INFO,
  DEFAULT_OCPP_STEPS,
} from "@/constants/mockData";
import { MOCK_SITE_AREAS } from "@/constants/electrical";
import type {
  ChargerDetails,
  ChargerElectricalConfig,
  ConnectorConfig,
  FailureMode,
  InstallFlowState,
  InstallerInfo,
} from "@/types";

const STEP_ORDER = [
  "Installer info",
  "Token ID",
  "Site info",
  "Electrical",
  "Connectors",
  "Checklist",
  "Physical check",
  "OCPP test",
] as const;

export type StepLabel = (typeof STEP_ORDER)[number];

interface InstallFlowContextValue {
  state: InstallFlowState;
  stepOrder: readonly string[];
  setChargerId: (chargerId: string, failureMode: FailureMode) => void;
  setChargerDetails: (details: ChargerDetails) => void;
  setInstallerInfo: (info: InstallerInfo) => void;
  setTokenId: (token: string) => void;
  setSelectedSiteArea: (areaId: string) => void;
  setElectricalConfig: (config: ChargerElectricalConfig) => void;
  setConnectors: (connectors: ConnectorConfig[]) => void;
  toggleChecklistItem: (key: string) => void;
  togglePhysicalChecklistItem: (key: string) => void;
  setOcppSteps: (steps: InstallFlowState["ocppSteps"]) => void;
  reset: () => void;
}

function createInitialState(): InstallFlowState {
  return {
    chargerId: "",
    failureMode: "NONE",
    chargerDetails: null,
    installerInfo: DEFAULT_INSTALLER_INFO,
    tokenId: "",
    siteAreas: MOCK_SITE_AREAS,
    selectedSiteAreaId: null,
    electricalConfig: null,
    connectors: [],
    checklistProgress: {},
    physicalChecklistProgress: {},
    ocppSteps: DEFAULT_OCPP_STEPS,
  };
}

const InstallFlowContext = createContext<InstallFlowContextValue | null>(null);

export function InstallFlowProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<InstallFlowState>(createInitialState);

  const setChargerId = useCallback((chargerId: string, failureMode: FailureMode) => {
    setState((prev) => ({ ...prev, chargerId, failureMode }));
  }, []);

  const setChargerDetails = useCallback((details: ChargerDetails) => {
    setState((prev) => ({ ...prev, chargerDetails: details }));
  }, []);

  const setInstallerInfo = useCallback((info: InstallerInfo) => {
    setState((prev) => ({ ...prev, installerInfo: info }));
  }, []);

  const setTokenId = useCallback((token: string) => {
    setState((prev) => ({ ...prev, tokenId: token }));
  }, []);

  const setSelectedSiteArea = useCallback((areaId: string) => {
    setState((prev) => ({ ...prev, selectedSiteAreaId: areaId }));
  }, []);

  const setElectricalConfig = useCallback((config: ChargerElectricalConfig) => {
    setState((prev) => ({ ...prev, electricalConfig: config }));
  }, []);

  const setConnectors = useCallback((connectors: ConnectorConfig[]) => {
    setState((prev) => ({ ...prev, connectors }));
  }, []);

  const toggleChecklistItem = useCallback((key: string) => {
    setState((prev) => ({
      ...prev,
      checklistProgress: { ...prev.checklistProgress, [key]: !prev.checklistProgress[key] },
    }));
  }, []);

  const togglePhysicalChecklistItem = useCallback((key: string) => {
    setState((prev) => ({
      ...prev,
      physicalChecklistProgress: {
        ...prev.physicalChecklistProgress,
        [key]: !prev.physicalChecklistProgress[key],
      },
    }));
  }, []);

  const setOcppSteps = useCallback((steps: InstallFlowState["ocppSteps"]) => {
    setState((prev) => ({ ...prev, ocppSteps: steps }));
  }, []);

  const reset = useCallback(() => {
    setState(createInitialState());
  }, []);

  const value = useMemo<InstallFlowContextValue>(
    () => ({
      state,
      stepOrder: STEP_ORDER,
      setChargerId,
      setChargerDetails,
      setInstallerInfo,
      setTokenId,
      setSelectedSiteArea,
      setElectricalConfig,
      setConnectors,
      toggleChecklistItem,
      togglePhysicalChecklistItem,
      setOcppSteps,
      reset,
    }),
    [
      state,
      setChargerId,
      setChargerDetails,
      setInstallerInfo,
      setTokenId,
      setSelectedSiteArea,
      setElectricalConfig,
      setConnectors,
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
