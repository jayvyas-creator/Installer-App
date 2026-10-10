import styles from "./SuccessCheck.module.css";

export function SuccessCheck({ size = 56 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none" aria-hidden>
      <circle className={styles.circle} cx="28" cy="28" r="24" />
      <path className={styles.check} d="M17 29.5L24 36.5L39 20.5" />
    </svg>
  );
}
