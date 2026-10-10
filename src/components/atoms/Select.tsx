import { AlertCircle, ChevronDown } from "lucide-react";
import { useId, type ReactNode, type SelectHTMLAttributes } from "react";
import inputStyles from "./Input.module.css";
import styles from "./Select.module.css";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "id"> {
  label: string;
  options: SelectOption[];
  placeholder?: string;
  helperText?: string;
  errorText?: string;
  leadingIcon?: ReactNode;
}

export function Select({
  label,
  options,
  placeholder,
  helperText,
  errorText,
  leadingIcon,
  required,
  disabled,
  value,
  className,
  ...rest
}: SelectProps) {
  const id = useId();
  const helperId = `${id}-helper`;
  const hasError = Boolean(errorText);
  const message = errorText ?? helperText;

  return (
    <div
      className={[inputStyles.field, className ?? ""].filter(Boolean).join(" ")}
    >
      <label htmlFor={id} className={inputStyles.label}>
        {label}
        {required && (
          <span className={inputStyles.required} aria-hidden>
            *
          </span>
        )}
      </label>
      <div
        className={inputStyles.inputWrapper}
        data-error={hasError || undefined}
        data-disabled={disabled || undefined}
      >
        {leadingIcon && (
          <span className={inputStyles.leadingIcon} aria-hidden>
            {leadingIcon}
          </span>
        )}
        <div className={styles.selectWrapper} style={{ flex: 1, minWidth: 0 }}>
          <select
            id={id}
            className={styles.select}
            disabled={disabled}
            required={required}
            value={value}
            aria-invalid={hasError || undefined}
            aria-describedby={message ? helperId : undefined}
            {...rest}
          >
            {placeholder && (
              <option value="" disabled className={styles.placeholderOption}>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown size={18} className={styles.chevron} aria-hidden />
        </div>
      </div>
      {message && (
        <span
          className={inputStyles.helper}
          id={helperId}
          data-error={hasError || undefined}
        >
          {hasError && (
            <AlertCircle size={14} className={inputStyles.helperIcon} aria-hidden />
          )}
          {message}
        </span>
      )}
    </div>
  );
}
