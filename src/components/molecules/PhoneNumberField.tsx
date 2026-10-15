import { Input } from "@/components/atoms/Input";
import { SelectField } from "@/components/molecules/SelectField";
import styles from "./PhoneNumberField.module.css";

const COUNTRY_CODE_OPTIONS = [
  { value: "+1", label: "+1 (US/CA)" },
  { value: "+44", label: "+44 (UK)" },
  { value: "+61", label: "+61 (AU)" },
  { value: "+91", label: "+91 (IN)" },
];

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
  return (
    <div className={styles.row}>
      <SelectField
        label="Code"
        options={COUNTRY_CODE_OPTIONS}
        value={countryCode}
        onValueChange={onCountryCodeChange}
      />
      <Input
        label="Mobile Number"
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
