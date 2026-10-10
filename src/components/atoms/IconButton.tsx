import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./IconButton.module.css";

export interface IconButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  "aria-label": string;
  tone?: "default" | "subtle" | "onBrand";
  children: ReactNode;
}

export function IconButton({
  tone = "default",
  className,
  children,
  ...rest
}: IconButtonProps) {
  const toneClass =
    tone === "subtle" ? styles.subtle : tone === "onBrand" ? styles.onBrand : "";

  return (
    <button
      className={[styles.iconButton, toneClass, className ?? ""]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {children}
    </button>
  );
}
