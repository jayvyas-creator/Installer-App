import { useTranslation } from "react-i18next";
import { defineControls } from "tempo-sdk/assets";
import styles from "./Stepper.module.css";

export interface StepperProps {
  steps: string[];
  currentIndex: number;
}

/**
 * The canvas for this component is at
 * tempo/designs/design-system/progress-and-flow/index.canvas.tsx. If you
 * adjust this component in any way, ensure the canvas and its asset
 * declaration stay consistent.
 */
export function Stepper({ steps, currentIndex }: StepperProps) {
  const { t } = useTranslation();
  const total = steps.length;
  const digits = String(total).length;
  const current = String(currentIndex + 1).padStart(Math.max(2, digits), "0");
  const totalPadded = String(total).padStart(Math.max(2, digits), "0");

  return (
    <div
      className={styles.stepper}
      role="group"
      aria-label={t("stepper.ariaLabel", {
        current: currentIndex + 1,
        total,
        stepName: steps[currentIndex],
      })}
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

defineControls(Stepper, {
  // steps is the real FLOW_STEPS sequence — not a prop to hand-edit per instance.
  steps: false,
  currentIndex: { type: "number" },
});
