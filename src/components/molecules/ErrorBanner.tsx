import { AlertTriangle } from "lucide-react";
import { defineControls } from "tempo-sdk/assets";
import styles from "./ErrorBanner.module.css";

export interface ErrorBannerProps {
  title: string;
  description?: string;
  tone?: "error" | "warning";
}

/**
 * The canvas for this component is at
 * tempo/designs/design-system/status-and-feedback/index.canvas.tsx.
 * If you adjust this component in any way, ensure the canvas and its asset
 * declaration stay consistent.
 */
export function ErrorBanner({ title, description, tone = "error" }: ErrorBannerProps) {
  return (
    <div className={styles.banner} data-tone={tone} role="alert">
      <AlertTriangle size={20} className={styles.icon} aria-hidden />
      <span className={styles.texts}>
        <span className={styles.title}>{title}</span>
        {description && <span className={styles.description}>{description}</span>}
      </span>
    </div>
  );
}

defineControls(ErrorBanner, {
  title: { type: "text" },
  description: { type: "text" },
  tone: { type: "select" },
});
