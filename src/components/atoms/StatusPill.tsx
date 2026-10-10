import type { ReactNode } from "react";
import styles from "./StatusPill.module.css";

export type StatusTone = "success" | "error" | "warning" | "info" | "neutral" | "brand";

export interface StatusPillProps {
  tone?: StatusTone;
  children: ReactNode;
  showDot?: boolean;
}

export function StatusPill({ tone = "neutral", children, showDot = true }: StatusPillProps) {
  return (
    <span className={[styles.pill, styles[tone]].join(" ")}>
      {showDot && <span className={styles.dot} aria-hidden />}
      {children}
    </span>
  );
}
