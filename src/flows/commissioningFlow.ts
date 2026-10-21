import { getStatus, postStatus } from "@/api/endpoints";
import { resolveRoute } from "@/navigation/resolveRoute";
import type { OcppCommandResult, Result } from "@/types/api";

// Shared "advance one installation step, then resolve where to go next"
// sequence (CLAUDE.md endpoint 3 POST + GET). Used by every screen that
// moves the flow forward: Validate Charger Details' Confirm, the
// Communication Checklist -> Processing step, and the Automated OCPP Testing
// -> Processing step. Keeping this in one place means there's exactly one
// place double-submits get prevented and exactly one place the routing table
// gets applied.
//
// `onOcppResults` is only ever invoked for the final OCPP check step, when
// the backend (mock today) reports a per-command result array instead of a
// single pass/fail — it lets the caller reflect each command's real outcome
// in the UI before this function decides whether the step overall succeeded.
export async function commissioningFlow(
  chargerId: string,
  installerToken: string,
  installationStep: string,
  siteAreaCount: number,
  onOcppResults?: (results: OcppCommandResult[]) => void | Promise<void>,
): Promise<Result<string>> {
  const posted = await postStatus(chargerId, installationStep, installerToken);
  if (!posted.ok) return posted;

  if (posted.data.ocppResults) {
    await onOcppResults?.(posted.data.ocppResults);
    const failedCommand = posted.data.ocppResults.find((result) => result.status === "failed");
    if (failedCommand) {
      return { ok: false, error: failedCommand.reason ?? "The OCPP test failed." };
    }
  }

  const status = await getStatus(chargerId, installerToken);
  if (!status.ok) return status;

  return { ok: true, data: resolveRoute(status.data, { siteAreaCount }) };
}

export function validateChargerFlow(
  chargerId: string,
  installerToken: string,
  siteAreaCount: number,
): Promise<Result<string>> {
  return commissioningFlow(chargerId, installerToken, "CDCheckComplete", siteAreaCount);
}
