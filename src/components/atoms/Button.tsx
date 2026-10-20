import { Slot } from "@radix-ui/react-slot";
import { Loader2 } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode, Ref } from "react";
import { defineControls } from "tempo-sdk/assets";
import styles from "./Button.module.css";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "md" | "lg";

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Shows a spinner in place of the leading icon and implies `disabled`. */
  loading?: boolean;
  fullWidth?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  children: ReactNode;
  ref?: Ref<HTMLButtonElement>;
  /**
   * Merge the button's classes and props onto a single child element (e.g. a router `Link`
   * or `<a>`) instead of rendering a `<button>`. The child renders as-is — icon slots and the
   * loading spinner are skipped, since there's no longer a fixed internal markup to place them in.
   */
  asChild?: boolean;
}

/**
 * The canvas for this component is at
 * tempo/designs/design-system/buttons-and-icon-actions/index.canvas.tsx.
 * If you adjust this component in any way, ensure the canvas and its asset
 * declaration stay consistent.
 */
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
  ref,
  asChild = false,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const classNames = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth ? styles.fullWidth : "",
    loading ? styles.loading : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  if (asChild) {
    return (
      <Slot
        ref={ref}
        className={classNames}
        aria-disabled={isDisabled || undefined}
        aria-busy={loading || undefined}
        {...rest}
      >
        {children}
      </Slot>
    );
  }

  return (
    <button
      ref={ref}
      className={classNames}
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

defineControls(Button, {
  children: { type: "text" },
  variant: { type: "select" },
  size: { type: "select" },
  loading: { type: "boolean" },
  fullWidth: { type: "boolean" },
  disabled: { type: "boolean" },
  asChild: { type: "boolean" },
  leadingIcon: false,
  trailingIcon: false,
  className: false,
  onClick: false,
});
