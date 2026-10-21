import { useTranslation } from "react-i18next";
import { StatusPill, type StatusTone } from "@/components/atoms/StatusPill";
import type { OcppStep, OcppStepStatus } from "@/types";
import styles from "./OcppStepList.module.css";

export interface OcppStepListProps {
  steps: OcppStep[];
}

const STEP_STATUS_TONE: Record<OcppStepStatus, StatusTone> = {
  waiting: "neutral",
  running: "brand",
  passed: "success",
  failed: "error",
};

// Renders the 4 real OCPP commands' live waiting/running/passed/failed state
// (CLAUDE.md §6). Shared between Automated OCPP Testing and the Processing
// screen that actually runs the check, so the installer sees the same
// result-driven progress on whichever screen they're waiting on.
export function OcppStepList({ steps }: OcppStepListProps) {
  const { t } = useTranslation();
  return (
    <div className={styles.list}>
      {steps.map((step) => (
        <div key={step.key} className={styles.stepRow} data-status={step.status}>
          <span className={styles.iconSlot} aria-hidden="true">
            <span className={styles.pendingDot} />
          </span>
          <span className={styles.stepLabel}>{step.label}</span>
          <StatusPill tone={STEP_STATUS_TONE[step.status]}>
            {t(`automatedOcppTesting.stepStatus.${step.status}`)}
          </StatusPill>
        </div>
      ))}
    </div>
  );
}
