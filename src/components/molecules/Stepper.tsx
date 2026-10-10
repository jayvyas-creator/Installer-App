import styles from "./Stepper.module.css";

export interface StepperProps {
  steps: string[];
  currentIndex: number;
}

export function Stepper({ steps, currentIndex }: StepperProps) {
  return (
    <div
      className={styles.stepper}
      aria-label={`Step ${currentIndex + 1} of ${steps.length}: ${steps[currentIndex]}`}
    >
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
      <span className={styles.stepLabel} aria-hidden="true">
        {steps[currentIndex]}
      </span>
    </div>
  );
}
