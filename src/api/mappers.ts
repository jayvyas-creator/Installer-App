import type { ChargerDetails, InstallerData } from "@/types";
import type { ChargerLookup, RegisterTokenPayload } from "@/types/api";

export function mapChargerLookupToDetails(lookup: ChargerLookup): ChargerDetails {
  return {
    chargerId: lookup.chargerId,
    qrCodeUrl: lookup.qrCodeUrl,
    serialNumber: lookup.serialNumber,
    connectorTypes: lookup.connectors.map((connector) => connector.connectorType),
    noOfConnectors: lookup.noOfConnector,
    siteName: lookup.site.siteName,
  };
}

export function mapInstallerToRegisterTokenPayload(installer: InstallerData): RegisterTokenPayload {
  return {
    Email: installer.email,
    FirstName: installer.firstName,
    LastName: installer.lastName,
    CompanyName: installer.companyName,
    PhoneNumber: `${installer.countryCode}${installer.phoneNumber}`,
    ContractLicenseNumber: installer.licenseNumber,
  };
}
