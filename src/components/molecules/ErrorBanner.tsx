import { AlertTriangle } from "lucide-react";
import styles from "./ErrorBanner.module.css";

export interface ErrorBannerProps {
  title: string;
  description?: string;
  tone?: "error" | "warning";
}

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
