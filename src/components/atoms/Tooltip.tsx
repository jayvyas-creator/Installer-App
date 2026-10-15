import { Info } from "lucide-react";
import { useId, useState } from "react";
import styles from "./Tooltip.module.css";

export interface TooltipProps {
  text: string;
}

// Note: the trigger icon is 16px today, below the 44x44 touch-target minimum
// DESIGN-HANDOFF.md §4 calls for — flagged there as a known gap to fix, not
// silently "fixed" here with an oversized hit target that would look wrong.
export function Tooltip({ text }: TooltipProps) {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <span className={styles.wrap}>
      <button
        type="button"
        className={styles.trigger}
        aria-describedby={id}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onClick={() => setOpen((value) => !value)}
      >
        <Info size={16} aria-hidden />
        <span className={styles.srOnly}>More information</span>
      </button>
      {open && (
        <span role="tooltip" id={id} className={styles.bubble}>
          {text}
        </span>
      )}
    </span>
  );
}
