import { Lock } from "lucide-react";
import { defineControls } from "tempo-sdk/assets";
import styles from "./ReadOnlyField.module.css";

/**
 * The canvas for this component is at
 * tempo/designs/design-system/form-fields/index.canvas.tsx. If you adjust
 * this component in any way, ensure the canvas and its asset declaration
 * stay consistent.
 */
export interface ReadOnlyFieldProps {
  label: string;
  value: string;
}

export function ReadOnlyField({ label, value }: ReadOnlyFieldProps) {
  return (
    <div className={styles.field}>
      <span className={styles.labelRow}>
        <Lock size={12} className={styles.lockIcon} aria-hidden />
        <span className={styles.label}>{label}</span>
      </span>
      <span className={styles.value}>{value}</span>
    </div>
  );
}

// Both props are plain, non-interactive strings (no callbacks, no ReactNode
// escape hatches) — controls are trivial here but included for consistency
// with the rest of the form-field family.
defineControls(ReadOnlyField, {
  label: { type: "text" },
  value: { type: "text" },
});
