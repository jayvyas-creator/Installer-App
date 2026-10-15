import { request } from "@/api/http";
import { expectSuccess, unwrapData } from "@/api/normalize";
import {
  mockGetChargerByToken,
  mockGetStatus,
  mockPostInstall,
  mockPostStatus,
  mockPutTokenRegistration,
} from "@/api/mocks/realEndpoints";
import type {
  ChargerLookup,
  ChargerStatusResponse,
  InstallPayload,
  RegisterTokenPayload,
  RegisterTokenResult,
  Result,
} from "@/types/api";

// Build-time flag: baked into the bundle, not a runtime toggle. Defaults to
// mocks on so the app keeps working standalone until a real backend is wired.
const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== "false";

export async function getChargerByToken(
  chargerId: string,
  tenantId: string,
  siteId: string,
  installerToken: string,
): Promise<Result<ChargerLookup>> {
  if (USE_MOCKS) return mockGetChargerByToken(chargerId);

  // TODO(api): replace mock with GET /api/registercharger/v1.0/:chargerId?TenantId=&SiteId=
  const result = await request<unknown>(`/registercharger/v1.0/${encodeURIComponent(chargerId)}`, {
    query: { TenantId: tenantId, SiteId: siteId },
    installerToken,
  });
  if (!result.ok) return result;
  return unwrapData<ChargerLookup>(result.data);
}

export async function getStatus(
  chargerId: string,
  installerToken: string,
): Promise<Result<ChargerStatusResponse>> {
  if (USE_MOCKS) return mockGetStatus(chargerId);

  // TODO(api): replace mock with GET /api/registercharger/v1.0/status/:chargerId
  const result = await request<unknown>(
    `/registercharger/v1.0/status/${encodeURIComponent(chargerId)}`,
    { installerToken },
  );
  if (!result.ok) return result;
  return unwrapData<ChargerStatusResponse>(result.data);
}

export async function postStatus(
  chargerId: string,
  installationStep: string,
  installerToken: string,
): Promise<Result<void>> {
  if (USE_MOCKS) return mockPostStatus(chargerId, installationStep);

  // TODO(api): replace mock with POST /api/registercharger/v1.0/status/:chargerId?installationStep=
  const result = await request<unknown>(
    `/registercharger/v1.0/status/${encodeURIComponent(chargerId)}`,
    { method: "POST", query: { installationStep }, installerToken },
  );
  if (!result.ok) return result;
  return expectSuccess(result.data);
}

export async function putTokenRegistration(
  token: string,
  chargerId: string,
  payload: RegisterTokenPayload,
): Promise<Result<RegisterTokenResult>> {
  if (USE_MOCKS) return mockPutTokenRegistration(token, chargerId, payload);

  // TODO(api): replace mock with PUT /api/registertoken/v1.0?token=&chargerID=
  const result = await request<unknown>(`/registertoken/v1.0`, {
    method: "PUT",
    query: { token, chargerID: chargerId },
    body: payload,
  });
  if (!result.ok) return result;
  return unwrapData<RegisterTokenResult>(result.data);
}

export async function postInstall(
  chargerId: string,
  payload: InstallPayload,
  installerToken: string,
): Promise<Result<void>> {
  if (USE_MOCKS) return mockPostInstall(chargerId, payload);

  // TODO(api): replace mock with POST /api/registercharger/v1.0/installed/:chargerId
  const result = await request<unknown>(
    `/registercharger/v1.0/installed/${encodeURIComponent(chargerId)}`,
    { method: "POST", body: payload, installerToken },
  );
  if (!result.ok) return result;
  return expectSuccess(result.data);
}
