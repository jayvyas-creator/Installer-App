import styles from "./ProgressRing.module.css";

export interface ProgressRingProps {
  size?: number;
  strokeWidth?: number;
  /** 0-100. Omit for an indeterminate (unknown-duration) spinner. */
  progress?: number;
  tone?: "brand" | "success" | "error";
}

export function ProgressRing({
  size = 64,
  strokeWidth = 5,
  progress,
  tone = "brand",
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  if (progress === undefined) {
    return (
      <svg
        className={styles.svg}
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="status"
        aria-label="Loading"
      >
        <circle
          className={styles.track}
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <g className={styles.indeterminateGroup}>
          <circle
            className={styles.indeterminateIndicator}
            cx={center}
            cy={center}
            r={radius}
            strokeWidth={strokeWidth}
          />
        </g>
      </svg>
    );
  }

  const clamped = Math.min(100, Math.max(0, progress));
  const offset = circumference * (1 - clamped / 100);

  return (
    <svg
      className={styles.svg}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="progressbar"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <circle
        className={styles.track}
        cx={center}
        cy={center}
        r={radius}
        strokeWidth={strokeWidth}
      />
      <circle
        className={styles.indicator}
        data-tone={tone}
        cx={center}
        cy={center}
        r={radius}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
      />
    </svg>
  );
}
