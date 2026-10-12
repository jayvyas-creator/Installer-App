import type { ReactNode } from "react";
import styles from "./StatusPill.module.css";

export type StatusTone = "success" | "error" | "warning" | "info" | "neutral" | "brand";

export interface StatusPillProps {
  tone?: StatusTone;
  /**
   * Visible status text. Required: tone color alone must never be the only
   * signal (WCAG 1.4.1). Use wording that is unambiguous on its own, e.g.
   * "Ready" / "Needs attention" rather than the same label in two tones.
   */
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
