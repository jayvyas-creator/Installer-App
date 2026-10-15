import { getStatus, postStatus } from "@/api/endpoints";
import { resolveRoute } from "@/navigation/resolveRoute";
import type { Result } from "@/types/api";

// Shared "advance one installation step, then resolve where to go next"
// sequence (CLAUDE.md endpoint 3 POST + GET). Used by every screen that
// moves the flow forward: Validate Charger Details' Confirm, the
// Communication Checklist -> Processing step, and the Automated OCPP Testing
// -> Processing step. Keeping this in one place means there's exactly one
// place double-submits get prevented and exactly one place the routing table
// gets applied.
export async function commissioningFlow(
  chargerId: string,
  installerToken: string,
  installationStep: string,
  siteAreaCount: number,
): Promise<Result<string>> {
  const posted = await postStatus(chargerId, installationStep, installerToken);
  if (!posted.ok) return posted;

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
