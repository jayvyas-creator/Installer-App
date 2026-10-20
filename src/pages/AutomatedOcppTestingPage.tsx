import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AppShell } from "@/components/organisms/AppShell";
import { Button } from "@/components/atoms/Button";
import { OutcomePanel } from "@/components/molecules/OutcomePanel";
import { StatusPill, type StatusTone } from "@/components/atoms/StatusPill";
import { useInstallFlow } from "@/state/InstallFlowContext";
import { useHistorySync } from "@/navigation/useHistorySync";
import { FLOW_STEPS } from "@/constants/flowSteps";
import type { OcppStepStatus } from "@/types";
import formStyles from "./shared/form.module.css";
import outcomeStyles from "@/styles/outcome.module.css";
import styles from "./AutomatedOcppTestingPage.module.css";

interface AutomatedOcppLocationState {
  checkError?: string;
}

const STEP_STATUS_TONE: Record<OcppStepStatus, StatusTone> = {
  waiting: "neutral",
  running: "brand",
  passed: "success",
  failed: "error",
};

// DESIGN-HANDOFF.md §2.12: this screen itself sends nothing to the backend —
// Next is what kicks off the final OCPP check (routed through /processing,
// which records OcppCheckComplete and drives session.ocppSteps live via
// useOcppStepRunner). A failed check redirects back here with the step
// states already updated and `checkError` in router state, so this page can
// show which command failed and why.
export function AutomatedOcppTestingPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const go = useHistorySync();
  const location = useLocation();
  const { session } = useInstallFlow();

  const [finalError, setFinalError] = useState<string | null>(
    () => (location.state as AutomatedOcppLocationState | null)?.checkError ?? null,
  );

  useEffect(() => {
    if (location.state) {
      navigate(location.pathname, { replace: true, state: null });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const failedStep = session.ocppSteps.find((step) => step.status === "failed");

  return (
    <AppShell
      title={t("automatedOcppTesting.title")}
      onBack={() => go("/physical-healthiness")}
      stepper={{ steps: FLOW_STEPS, currentIndex: 8 }}
      footer={
        <Button fullWidth size="lg" disabled={Boolean(finalError)} onClick={() => go("/processing")}>
          {t("automatedOcppTesting.next")}
        </Button>
      }
    >
      {finalError ? (
        <div className={outcomeStyles.wrap}>
          <OutcomePanel
            tone="error"
            title={t("automatedOcppTesting.ocppTestingFailedTitle")}
            description={t("automatedOcppTesting.ocppTestingFailedDescription")}
            primaryAction={{ label: t("automatedOcppTesting.tryAgain"), onClick: () => go("/processing") }}
            secondaryAction={{ label: t("automatedOcppTesting.cancel"), onClick: () => setFinalError(null) }}
          >
            <p className={styles.detailLine}>
              {failedStep
                ? t("automatedOcppTesting.failedStepDetail", { step: failedStep.label, reason: finalError })
                : finalError}
            </p>
            <p className={styles.footerNote}>
              {t("automatedOcppTesting.contactSupport")}{" "}
              <a href="tel:+13234882092">(323) 488-2092</a>
            </p>
          </OutcomePanel>
        </div>
      ) : (
        <div className={formStyles.stack}>
          <div className={formStyles.intro}>
            <h1 className={formStyles.heading}>{t("automatedOcppTesting.heading")}</h1>
            <p className={formStyles.subheading}>{t("automatedOcppTesting.subheading")}</p>
          </div>

          <div className={formStyles.list}>
            {session.ocppSteps.map((step) => (
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
        </div>
      )}
    </AppShell>
  );
}
