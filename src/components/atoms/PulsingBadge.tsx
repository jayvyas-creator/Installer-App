import type { ReactNode } from "react";
import { defineControls } from "tempo-sdk/assets";
import styles from "./PulsingBadge.module.css";

export interface PulsingBadgeProps {
  children: ReactNode;
  "aria-label"?: string;
}

// Used on the two Processing screens and Automated OCPP Testing. Respects
// prefers-reduced-motion (DESIGN-HANDOFF.md §4) via the stylesheet rule.
//
// The canvas for this component is at
// tempo/designs/design-system/status-and-feedback/index.canvas.tsx.
// If you adjust this component in any way, ensure the canvas and its asset
// declaration stay consistent.
export function PulsingBadge({ children, "aria-label": ariaLabel }: PulsingBadgeProps) {
  return (
    <div className={styles.wrap} role="img" aria-label={ariaLabel}>
      <span className={styles.ring} aria-hidden />
      <span className={styles.ring} aria-hidden />
      <span className={styles.badge}>{children}</span>
    </div>
  );
}

defineControls(PulsingBadge, {
  "aria-label": { type: "text" },
  // children is a ReactNode (a Wordmark or icon), not an editable control type —
  // curated via defineAsset variants instead.
  children: false,
});
