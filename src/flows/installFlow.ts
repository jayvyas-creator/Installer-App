import { postInstall } from "@/api/endpoints";
import type { ChargerElectricalData, ConnectorData, SiteAreaData } from "@/types";
import type { ApiSiteArea, InstallPayload, Result } from "@/types/api";

export interface InstallFlowInput {
  chargerId: string;
  installerToken: string;
  tenantId: string;
  siteId: string;
  siteArea: { existing: ApiSiteArea } | { created: SiteAreaData; siteAreaId: string };
  chargerElectrical: ChargerElectricalData;
  connectors: ConnectorData[];
}

function buildInstallPayload(input: InstallFlowInput): InstallPayload {
  const { siteArea } = input;
  const siteAreaPayload =
    "created" in siteArea
      ? {
          isNew: true,
          siteAreaId: siteArea.siteAreaId,
          siteAreaName: siteArea.created.name,
          voltage: siteArea.created.voltage,
          maxPower: siteArea.created.maxPowerKw,
          maxAmp: siteArea.created.ampsPerPhase,
          numberOfPhases: siteArea.created.numberOfPhases === "three" ? 3 : 1,
          phaseAssignment: siteArea.created.phaseAssignment,
        }
      : {
          isNew: false,
          siteAreaId: siteArea.existing.siteAreaId,
          siteAreaName: siteArea.existing.siteAreaName,
          voltage: siteArea.existing.voltage ?? 0,
          maxPower: siteArea.existing.maxPower ?? 0,
          maxAmp: siteArea.existing.maxAmp ?? 0,
          numberOfPhases: siteArea.existing.numberOfPhases ?? 1,
          phaseAssignment: siteArea.existing.phaseAssignment ?? "",
        };

  return {
    chargerId: input.chargerId,
    tenantId: input.tenantId,
    siteId: input.siteId,
    siteArea: siteAreaPayload,
    chargerInfo: {
      numberOfPhases: input.chargerElectrical.numberOfPhases === "three" ? 3 : 1,
      chargerType: input.chargerElectrical.chargerType,
      ratedPower: input.chargerElectrical.ratedPowerKw,
      ratedAmp: input.chargerElectrical.ampPerPhase,
      phaseAssignment: input.chargerElectrical.phaseAssignment,
    },
    connectors: input.connectors.map((connector) => ({
      connectorId: connector.id,
      type: connector.connectorType,
      currentType: connector.currentType,
      numberOfPhases: connector.numberOfPhases === "three" ? 3 : 1,
      amperage: connector.totalAmperage,
      voltage: connector.supplyVoltage,
      phaseAssignment: connector.phaseAssignment,
      ratedPower: Math.round(((connector.supplyVoltage * connector.totalAmperage) / 1000) * 100) / 100,
      ratedAmp: connector.totalAmperage,
    })),
  };
}

// Connector Information Details' submit -> Installation Success
// (CLAUDE.md endpoint 5). Builds the install payload from the session's
// validated Data types and submits it as one atomic call.
export async function installFlow(input: InstallFlowInput): Promise<Result<void>> {
  return postInstall(input.chargerId, buildInstallPayload(input), input.installerToken);
}
