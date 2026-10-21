import { useTranslation } from "react-i18next";
import { Input } from "@/components/atoms/Input";
import { SelectField } from "@/components/molecules/SelectField";
import { COUNTRY_OPTIONS } from "@/constants/countries";
import { defineControls } from "tempo-sdk/assets";
import styles from "./PhoneNumberField.module.css";

/**
 * The canvas for this component is at
 * tempo/designs/design-system/form-fields/index.canvas.tsx. If you adjust
 * this component in any way, ensure the canvas and its asset declaration
 * stay consistent.
 */
export interface PhoneNumberFieldProps {
  countryCode: string;
  phoneNumber: string;
  onCountryCodeChange: (value: string) => void;
  onPhoneNumberChange: (value: string) => void;
  errorText?: string;
  required?: boolean;
}

export function PhoneNumberField({
  countryCode,
  phoneNumber,
  onCountryCodeChange,
  onPhoneNumberChange,
  errorText,
  required,
}: PhoneNumberFieldProps) {
  const { t } = useTranslation();
  // Value is the ISO country code (unique per option), not the dial code —
  // many countries share a dial code (+1 covers the US, Canada, Jamaica, ...)
  // so the dial code alone can't identify a selection. See
  // src/constants/countries.ts for why.
  const countryCodeOptions = COUNTRY_OPTIONS.map((country) => ({
    value: country.iso,
    label: t("phoneNumberField.countryOption", { dialCode: country.dialCode, name: country.name }),
  }));
  return (
    <div className={styles.row}>
      <SelectField
        label={t("phoneNumberField.codeLabel")}
        options={countryCodeOptions}
        value={countryCode}
        onValueChange={onCountryCodeChange}
      />
      <Input
        label={t("phoneNumberField.mobileNumberLabel")}
        type="tel"
        inputMode="tel"
        required={required}
        value={phoneNumber}
        errorText={errorText}
        onChange={(event) => onPhoneNumberChange(event.target.value)}
      />
    </div>
  );
}

defineControls(PhoneNumberField, {
  countryCode: { type: "text" },
  phoneNumber: { type: "text" },
  errorText: { type: "text" },
  required: { type: "boolean" },
  onCountryCodeChange: false,
  onPhoneNumberChange: false,
});
