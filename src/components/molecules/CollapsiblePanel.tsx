import { useId, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import styles from "./CollapsiblePanel.module.css";

export interface CollapsiblePanelProps {
  trigger: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function CollapsiblePanel({ trigger, children, defaultOpen = false }: CollapsiblePanelProps) {
  const [open, setOpen] = useState(defaultOpen);
  const contentId = useId();

  return (
    <div className={styles.panel} data-open={open}>
      <button
        type="button"
        className={styles.trigger}
        aria-expanded={open}
        aria-controls={contentId}
        onClick={() => setOpen((v) => !v)}
      >
        <span>{trigger}</span>
        <ChevronDown size={18} className={styles.chevron} aria-hidden />
      </button>
      {open && (
        <div id={contentId} className={styles.content}>
          {children}
        </div>
      )}
    </div>
  );
}
