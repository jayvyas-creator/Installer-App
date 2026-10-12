import styles from "./Stepper.module.css";

export interface StepperProps {
  steps: string[];
  currentIndex: number;
}

export function Stepper({ steps, currentIndex }: StepperProps) {
  const total = steps.length;
  const digits = String(total).length;
  const current = String(currentIndex + 1).padStart(Math.max(2, digits), "0");
  const totalPadded = String(total).padStart(Math.max(2, digits), "0");

  return (
    <div
      className={styles.stepper}
      role="group"
      aria-label={`Step ${currentIndex + 1} of ${total}: ${steps[currentIndex]}`}
    >
      <div className={styles.meta} aria-hidden="true">
        <span className={styles.stepName}>{steps[currentIndex]}</span>
        <span className={styles.stepCount}>
          {current}
          <span className={styles.stepCountDivider}>/</span>
          {totalPadded}
        </span>
      </div>
      <div className={styles.track} aria-hidden="true">
        {steps.map((step, index) => {
          const state =
            index < currentIndex ? "done" : index === currentIndex ? "current" : "upcoming";
          return (
            <div className={styles.segment} data-state={state} key={step}>
              <div className={styles.segmentFill} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
