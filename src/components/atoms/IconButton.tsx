import type { ButtonHTMLAttributes, ReactNode, Ref } from "react";
import styles from "./IconButton.module.css";

export interface IconButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  "aria-label": string;
  tone?: "default" | "subtle" | "onBrand";
  children: ReactNode;
  ref?: Ref<HTMLButtonElement>;
}

export function IconButton({
  tone = "default",
  className,
  children,
  ref,
  ...rest
}: IconButtonProps) {
  const toneClass =
    tone === "subtle" ? styles.subtle : tone === "onBrand" ? styles.onBrand : "";

  return (
    <button
      ref={ref}
      className={[styles.iconButton, toneClass, className ?? ""]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {children}
    </button>
  );
}
