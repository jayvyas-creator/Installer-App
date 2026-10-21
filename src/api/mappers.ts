import { getCountryCallingCode, type CountryCode } from "libphonenumber-js";
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
  // installer.countryCode is the ISO 3166-1 value the field selects (see
  // src/constants/countries.ts); the backend wants the dial code glued
  // directly to the digits, so it's derived here rather than stored twice.
  const dialCode = getCountryCallingCode(installer.countryCode as CountryCode);
  return {
    Email: installer.email,
    FirstName: installer.firstName,
    LastName: installer.lastName,
    CompanyName: installer.companyName,
    PhoneNumber: `+${dialCode}${installer.phoneNumber}`,
    ContractLicenseNumber: installer.licenseNumber,
  };
}
