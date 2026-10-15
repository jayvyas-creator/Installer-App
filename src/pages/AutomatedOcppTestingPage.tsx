import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Radio } from "lucide-react";
import { AppShell } from "@/components/organisms/AppShell";
import { Button } from "@/components/atoms/Button";
import { ErrorBanner } from "@/components/molecules/ErrorBanner";
import { OutcomePanel } from "@/components/molecules/OutcomePanel";
import { PulsingBadge } from "@/components/atoms/PulsingBadge";
import { StatusPill, type StatusTone } from "@/components/atoms/StatusPill";
import { useInstallFlow } from "@/state/InstallFlowContext";
import { useHistorySync } from "@/navigation/useHistorySync";
import { FLOW_STEPS } from "@/constants/flowSteps";
import { commissioningFlow } from "@/flows/commissioningFlow";
import type { OcppStepStatus } from "@/types";
import formStyles from "./shared/form.module.css";
import outcomeStyles from "@/styles/outcome.module.css";
import styles from "./AutomatedOcppTestingPage.module.css";

type Phase = "checking" | "ready" | "hw-failed";

interface AutomatedOcppLocationState {
  checkError?: string;
}

const STEP_STATUS_LABEL: Record<OcppStepStatus, string> = {
  pending: "Pending",
  running: "Running",
  passed: "Passed",
  failed: "Failed",
};

const STEP_STATUS_TONE: Record<OcppStepStatus, StatusTone> = {
  pending: "neutral",
  running: "brand",
  passed: "success",
  failed: "error",
};

// DESIGN-HANDOFF.md §2.12: "opening this screen records the hardware check.
// Next then starts the final OCPP check." So unlike the other two checklist
// screens, this page makes its own commissioningFlow call directly (for
// ChargerHWCheckComplete) rather than routing through /processing — the
// trip through /processing is reserved for the *final* OcppCheckComplete
// check that Next kicks off.
export function AutomatedOcppTestingPage() {
  const navigate = useNavigate();
  const go = useHistorySync();
  const location = useLocation();
  const { session, setStatus } = useInstallFlow();

  const [phase, setPhase] = useState<Phase>(() =>
    session.status?.installationStep === "ChargerHWCheckComplete" ? "ready" : "checking",
  );
  const [hwError, setHwError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  const [finalError, setFinalError] = useState<string | null>(
    () => (location.state as AutomatedOcppLocationState | null)?.checkError ?? null,
  );

  useEffect(() => {
    if (location.state) {
      navigate(location.pathname, { replace: true, state: null });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (phase !== "checking") return;
    if (!session.installerToken) {
      setHwError("Your session has expired. Please start again.");
      setPhase("hw-failed");
      return;
    }

    let cancelled = false;
    commissioningFlow(
      session.chargerId,
      session.installerToken,
      "ChargerHWCheckComplete",
      session.siteAreas.length,
    ).then((result) => {
      if (cancelled) return;
      if (result.ok) {
        setStatus({ status: "Installed", installationStep: "ChargerHWCheckComplete" });
        setPhase("ready");
      } else {
        setHwError(result.error);
        setPhase("hw-failed");
      }
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, attempt]);

  function handleRetryHwCheck() {
    setHwError(null);
    setPhase("checking");
    setAttempt((a) => a + 1);
  }

  return (
    <AppShell
      title="Automated OCPP Testing"
      onBack={() => go("/physical-healthiness")}
      backDisabled={phase === "checking"}
      stepper={{ steps: FLOW_STEPS, currentIndex: 8 }}
      footer={
        phase === "ready" ? (
          <Button fullWidth size="lg" disabled={Boolean(finalError)} onClick={() => go("/processing")}>
            Next
          </Button>
        ) : (
          <Button fullWidth size="lg" disabled loading={phase === "checking"}>
            {phase === "checking" ? "Checking…" : "Next"}
          </Button>
        )
      }
    >
      {phase === "checking" && (
        <div className={outcomeStyles.wrap}>
          <PulsingBadge aria-label="Checking hardware">
            <Radio size={28} />
          </PulsingBadge>
          <p className={styles.checkingMessage}>Processing... this may take a few minutes.</p>
        </div>
      )}

      {phase === "hw-failed" && (
        <div className={formStyles.stack}>
          <div className={styles.hwFailedBlock}>
            <ErrorBanner
              title="Hardware check failed"
              description={hwError ?? "Failed to update installation step. Please try again."}
            />
            <Button variant="secondary" onClick={handleRetryHwCheck}>
              Retry
            </Button>
          </div>
        </div>
      )}

      {phase === "ready" && finalError && (
        <div className={outcomeStyles.wrap}>
          <OutcomePanel
            tone="error"
            title="OCPP Testing Failed"
            description="We couldn't complete the OCPP test. Please check your network communication."
            primaryAction={{ label: "Try again", onClick: () => go("/processing") }}
            secondaryAction={{ label: "Cancel", onClick: () => setFinalError(null) }}
          >
            <p className={styles.detailLine}>{finalError}</p>
            <p className={styles.footerNote}>
              If the problem persists, contact your support team at{" "}
              <a href="tel:+13234882092">(323) 488-2092</a>
            </p>
          </OutcomePanel>
        </div>
      )}

      {phase === "ready" && !finalError && (
        <div className={formStyles.stack}>
          <div className={formStyles.intro}>
            <h1 className={formStyles.heading}>Automated OCPP Testing</h1>
            <p className={formStyles.subheading}>
              These checks run automatically once you continue.
            </p>
          </div>

          <div className={formStyles.list}>
            {session.ocppSteps.map((step) => (
              <div key={step.key} className={styles.stepRow} data-status={step.status}>
                <span className={styles.iconSlot} aria-hidden="true">
                  <span className={styles.pendingDot} />
                </span>
                <span className={styles.stepLabel}>{step.label}</span>
                <StatusPill tone={STEP_STATUS_TONE[step.status]}>
                  {STEP_STATUS_LABEL[step.status]}
                </StatusPill>
              </div>
            ))}
          </div>
        </div>
      )}
    </AppShell>
  );
}
