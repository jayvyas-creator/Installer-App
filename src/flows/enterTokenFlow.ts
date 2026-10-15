import { getChargerByToken, putTokenRegistration } from "@/api/endpoints";
import { mapChargerLookupToDetails, mapInstallerToRegisterTokenPayload } from "@/api/mappers";
import type { InstallerData, ChargerDetails } from "@/types";
import type { ApiSiteArea, Result } from "@/types/api";

export interface EnterTokenFlowResult {
  tenantId: string;
  siteId: string;
  chargerDetails: ChargerDetails;
  siteAreas: ApiSiteArea[];
}

// Enter Token ID -> Validate Charger Details (CLAUDE.md endpoints 4 then 2).
// Registers the token (gets tenantId/siteId) and immediately looks up the
// charger record with them, so the page only has one async step to render.
export async function enterTokenFlow(
  chargerId: string,
  tokenId: string,
  installer: InstallerData,
): Promise<Result<EnterTokenFlowResult>> {
  const registration = await putTokenRegistration(
    tokenId,
    chargerId,
    mapInstallerToRegisterTokenPayload(installer),
  );
  if (!registration.ok) return registration;

  const lookup = await getChargerByToken(
    chargerId,
    registration.data.tenantId,
    registration.data.siteId,
    "",
  );
  if (!lookup.ok) return lookup;

  return {
    ok: true,
    data: {
      tenantId: registration.data.tenantId,
      siteId: registration.data.siteId,
      chargerDetails: mapChargerLookupToDetails(lookup.data),
      siteAreas: lookup.data.site.siteAreas,
    },
  };
}
