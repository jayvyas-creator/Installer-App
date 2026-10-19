import { Checkbox } from "@/components/atoms/Checkbox";
import styles from "./ChecklistItem.module.css";

export interface ChecklistItemProps {
  label: string;
  description?: string;
  checked: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export function ChecklistItem({
  label,
  description,
  checked,
  onToggle,
  disabled,
}: ChecklistItemProps) {
  return (
    <label
      className={styles.row}
      data-checked={checked || undefined}
      data-disabled={disabled || undefined}
    >
      <Checkbox checked={checked} disabled={disabled} onChange={onToggle} />
      <span className={styles.texts}>
        <span className={styles.label}>{label}</span>
        {description && <span className={styles.description}>{description}</span>}
      </span>
    </label>
  );
}
