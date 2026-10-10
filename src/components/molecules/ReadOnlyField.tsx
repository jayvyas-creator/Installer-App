import { Lock } from "lucide-react";
import styles from "./ReadOnlyField.module.css";

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
