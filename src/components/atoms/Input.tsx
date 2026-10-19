import { AlertCircle } from "lucide-react";
import { useId, type InputHTMLAttributes, type ReactNode, type Ref } from "react";
import styles from "./Input.module.css";

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "id"> {
  label: string;
  helperText?: string;
  /** Replaces helperText and switches the field into its error visual state. */
  errorText?: string;
  leadingIcon?: ReactNode;
  trailingAdornment?: ReactNode;
  ref?: Ref<HTMLInputElement>;
}

export function Input({
  label,
  helperText,
  errorText,
  leadingIcon,
  trailingAdornment,
  required,
  disabled,
  className,
  ref,
  ...rest
}: InputProps) {
  const id = useId();
  const helperId = `${id}-helper`;
  const hasError = Boolean(errorText);
  const message = errorText ?? helperText;

  return (
    <div className={[styles.field, className ?? ""].filter(Boolean).join(" ")}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {required && (
          <span className={styles.required} aria-hidden>
            *
          </span>
        )}
      </label>
      <div
        className={styles.inputWrapper}
        data-error={hasError || undefined}
        data-disabled={disabled || undefined}
      >
        {leadingIcon && (
          <span className={styles.leadingIcon} aria-hidden>
            {leadingIcon}
          </span>
        )}
        <input
          ref={ref}
          id={id}
          className={styles.input}
          disabled={disabled}
          required={required}
          aria-invalid={hasError || undefined}
          aria-describedby={message ? helperId : undefined}
          {...rest}
        />
        {trailingAdornment}
      </div>
      {message && (
        <span className={styles.helper} id={helperId} data-error={hasError || undefined}>
          {hasError && (
            <AlertCircle size={14} className={styles.helperIcon} aria-hidden />
          )}
          {message}
        </span>
      )}
    </div>
  );
}
