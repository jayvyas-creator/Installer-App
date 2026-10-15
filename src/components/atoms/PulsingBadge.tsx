import type { ReactNode } from "react";
import styles from "./PulsingBadge.module.css";

export interface PulsingBadgeProps {
  children: ReactNode;
  "aria-label"?: string;
}

// Used on the two Processing screens and Automated OCPP Testing. Respects
// prefers-reduced-motion (DESIGN-HANDOFF.md §4) via the stylesheet rule.
export function PulsingBadge({ children, "aria-label": ariaLabel }: PulsingBadgeProps) {
  return (
    <div className={styles.wrap} role="img" aria-label={ariaLabel}>
      <span className={styles.ring} aria-hidden />
      <span className={styles.ring} aria-hidden />
      <span className={styles.badge}>{children}</span>
    </div>
  );
}
