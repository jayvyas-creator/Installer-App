// Country dial codes for the Installer Information mobile number field.
// Replaces an earlier 4-country stand-in (+1/+44/+61/+91) with a much wider
// set of real E.164 calling codes, each with its national significant
// number's digit-length range (used for per-country validation instead of a
// single "at least 7 digits" check). One entry per distinct dial code — a
// shared code like +1 (US/Canada/Caribbean) lists the most common country so
// the field's value stays unambiguous. This is public E.164/ITU numbering
// data, not mobile-app-sourced; the mobile app itself (CLAUDE.md's source of
// truth) wasn't available to confirm its exact list, so treat this as a
// reasonable approximation to revisit if the mobile list is ever confirmed.
export interface CountryDialCode {
  iso: string;
  name: string;
  dialCode: string;
  minDigits: number;
  maxDigits: number;
}

export const COUNTRY_DIAL_CODES: CountryDialCode[] = [
  { iso: "US", name: "United States", dialCode: "+1", minDigits: 10, maxDigits: 10 },
  { iso: "GB", name: "United Kingdom", dialCode: "+44", minDigits: 10, maxDigits: 10 },
  { iso: "IE", name: "Ireland", dialCode: "+353", minDigits: 9, maxDigits: 9 },
  { iso: "FR", name: "France", dialCode: "+33", minDigits: 9, maxDigits: 9 },
  { iso: "DE", name: "Germany", dialCode: "+49", minDigits: 10, maxDigits: 11 },
  { iso: "ES", name: "Spain", dialCode: "+34", minDigits: 9, maxDigits: 9 },
  { iso: "IT", name: "Italy", dialCode: "+39", minDigits: 9, maxDigits: 10 },
  { iso: "NL", name: "Netherlands", dialCode: "+31", minDigits: 9, maxDigits: 9 },
  { iso: "BE", name: "Belgium", dialCode: "+32", minDigits: 8, maxDigits: 9 },
  { iso: "CH", name: "Switzerland", dialCode: "+41", minDigits: 9, maxDigits: 9 },
  { iso: "AT", name: "Austria", dialCode: "+43", minDigits: 10, maxDigits: 11 },
  { iso: "PT", name: "Portugal", dialCode: "+351", minDigits: 9, maxDigits: 9 },
  { iso: "SE", name: "Sweden", dialCode: "+46", minDigits: 7, maxDigits: 9 },
  { iso: "NO", name: "Norway", dialCode: "+47", minDigits: 8, maxDigits: 8 },
  { iso: "DK", name: "Denmark", dialCode: "+45", minDigits: 8, maxDigits: 8 },
  { iso: "FI", name: "Finland", dialCode: "+358", minDigits: 9, maxDigits: 9 },
  { iso: "PL", name: "Poland", dialCode: "+48", minDigits: 9, maxDigits: 9 },
  { iso: "CZ", name: "Czech Republic", dialCode: "+420", minDigits: 9, maxDigits: 9 },
  { iso: "GR", name: "Greece", dialCode: "+30", minDigits: 10, maxDigits: 10 },
  { iso: "RO", name: "Romania", dialCode: "+40", minDigits: 9, maxDigits: 9 },
  { iso: "HU", name: "Hungary", dialCode: "+36", minDigits: 9, maxDigits: 9 },
  { iso: "IN", name: "India", dialCode: "+91", minDigits: 10, maxDigits: 10 },
  { iso: "CN", name: "China", dialCode: "+86", minDigits: 11, maxDigits: 11 },
  { iso: "JP", name: "Japan", dialCode: "+81", minDigits: 10, maxDigits: 10 },
  { iso: "KR", name: "South Korea", dialCode: "+82", minDigits: 9, maxDigits: 10 },
  { iso: "SG", name: "Singapore", dialCode: "+65", minDigits: 8, maxDigits: 8 },
  { iso: "MY", name: "Malaysia", dialCode: "+60", minDigits: 9, maxDigits: 10 },
  { iso: "ID", name: "Indonesia", dialCode: "+62", minDigits: 9, maxDigits: 12 },
  { iso: "TH", name: "Thailand", dialCode: "+66", minDigits: 9, maxDigits: 9 },
  { iso: "VN", name: "Vietnam", dialCode: "+84", minDigits: 9, maxDigits: 10 },
  { iso: "PH", name: "Philippines", dialCode: "+63", minDigits: 10, maxDigits: 10 },
  { iso: "PK", name: "Pakistan", dialCode: "+92", minDigits: 10, maxDigits: 10 },
  { iso: "BD", name: "Bangladesh", dialCode: "+880", minDigits: 10, maxDigits: 10 },
  { iso: "LK", name: "Sri Lanka", dialCode: "+94", minDigits: 9, maxDigits: 9 },
  { iso: "HK", name: "Hong Kong", dialCode: "+852", minDigits: 8, maxDigits: 8 },
  { iso: "TW", name: "Taiwan", dialCode: "+886", minDigits: 9, maxDigits: 9 },
  { iso: "AE", name: "United Arab Emirates", dialCode: "+971", minDigits: 9, maxDigits: 9 },
  { iso: "SA", name: "Saudi Arabia", dialCode: "+966", minDigits: 9, maxDigits: 9 },
  { iso: "IL", name: "Israel", dialCode: "+972", minDigits: 9, maxDigits: 9 },
  { iso: "TR", name: "Turkey", dialCode: "+90", minDigits: 10, maxDigits: 10 },
  { iso: "QA", name: "Qatar", dialCode: "+974", minDigits: 8, maxDigits: 8 },
  { iso: "KW", name: "Kuwait", dialCode: "+965", minDigits: 8, maxDigits: 8 },
  { iso: "AU", name: "Australia", dialCode: "+61", minDigits: 9, maxDigits: 9 },
  { iso: "NZ", name: "New Zealand", dialCode: "+64", minDigits: 8, maxDigits: 9 },
  { iso: "ZA", name: "South Africa", dialCode: "+27", minDigits: 9, maxDigits: 9 },
  { iso: "NG", name: "Nigeria", dialCode: "+234", minDigits: 10, maxDigits: 10 },
  { iso: "KE", name: "Kenya", dialCode: "+254", minDigits: 9, maxDigits: 9 },
  { iso: "EG", name: "Egypt", dialCode: "+20", minDigits: 10, maxDigits: 10 },
  { iso: "MX", name: "Mexico", dialCode: "+52", minDigits: 10, maxDigits: 10 },
  { iso: "BR", name: "Brazil", dialCode: "+55", minDigits: 10, maxDigits: 11 },
  { iso: "AR", name: "Argentina", dialCode: "+54", minDigits: 10, maxDigits: 10 },
  { iso: "CL", name: "Chile", dialCode: "+56", minDigits: 9, maxDigits: 9 },
  { iso: "CO", name: "Colombia", dialCode: "+57", minDigits: 10, maxDigits: 10 },
];

export function findCountryByDialCode(dialCode: string): CountryDialCode | undefined {
  return COUNTRY_DIAL_CODES.find((country) => country.dialCode === dialCode);
}
