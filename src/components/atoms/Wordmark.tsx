import styles from "./Wordmark.module.css";

export interface WordmarkProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Wordmark({ size = "md", className }: WordmarkProps) {
  return (
    <span className={[styles.wordmark, styles[size], className ?? ""].filter(Boolean).join(" ")}>
      DYNA<span className={styles.accent}>CHRG</span>
    </span>
  );
}
