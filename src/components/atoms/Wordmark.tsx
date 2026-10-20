import { defineControls } from "tempo-sdk/assets";
import styles from "./Wordmark.module.css";

export interface WordmarkProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

// The canvas for this component is at
// tempo/designs/design-system/typography-and-brand/index.canvas.tsx. If you
// adjust this component in any way, ensure the canvas and its asset
// declaration stay consistent.
export function Wordmark({ size = "md", className }: WordmarkProps) {
  return (
    <span className={[styles.wordmark, styles[size], className ?? ""].filter(Boolean).join(" ")}>
      DYNA<span className={styles.accent}>CHRG</span>
    </span>
  );
}

defineControls(Wordmark, {
  size: { type: "select" },
  className: false,
});
