import { Loader2 } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./Button.module.css";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "md" | "lg";

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "lg",
  loading = false,
  fullWidth = false,
  leadingIcon,
  trailingIcon,
  disabled,
  className,
  children,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      className={[
        styles.button,
        styles[variant],
        styles[size],
        fullWidth ? styles.fullWidth : "",
        loading ? styles.loading : "",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? (
        <Loader2 className="spin" size={size === "lg" ? 20 : 18} aria-hidden />
      ) : (
        leadingIcon && (
          <span className={styles.icon} aria-hidden>
            {leadingIcon}
          </span>
        )
      )}
      <span className={styles.label}>{children}</span>
      {!loading && trailingIcon && (
        <span className={styles.icon} aria-hidden>
          {trailingIcon}
        </span>
      )}
    </button>
  );
}
