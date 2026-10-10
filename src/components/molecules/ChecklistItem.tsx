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
    <button
      type="button"
      className={styles.row}
      data-checked={checked || undefined}
      onClick={onToggle}
      disabled={disabled}
      role="checkbox"
      aria-checked={checked}
    >
      <Checkbox checked={checked} readOnly disabled={disabled} tabIndex={-1} />
      <span className={styles.texts}>
        <span className={styles.label}>{label}</span>
        {description && <span className={styles.description}>{description}</span>}
      </span>
    </button>
  );
}
