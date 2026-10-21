// Country list for the Installer Information mobile number field, built from
// libphonenumber-js's own metadata instead of a hand-rolled, partial list —
// per the "still gaps" report: the mobile app uses the full country list and
// validates with libphonenumber-js, so this does the same. `iso` (ISO 3166-1
// alpha-2, e.g. "US") is the field's value: it's unique even for countries
// that share a dial code (+1 covers the US, Canada, Jamaica, ...), which a
// dial-code-keyed value can't represent. The dial code is still derived here
// for display, and separately in src/api/mappers.ts for the wire payload.
import { getCountries, getCountryCallingCode, type CountryCode } from "libphonenumber-js";

export interface CountryOption {
  iso: CountryCode;
  name: string;
  dialCode: string;
}

const regionNames = new Intl.DisplayNames(["en"], { type: "region" });

export const COUNTRY_OPTIONS: CountryOption[] = getCountries()
  .map((iso) => ({
    iso,
    name: regionNames.of(iso) ?? iso,
    dialCode: `+${getCountryCallingCode(iso)}`,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

export function findCountryByIso(iso: string): CountryOption | undefined {
  return COUNTRY_OPTIONS.find((country) => country.iso === iso);
}
