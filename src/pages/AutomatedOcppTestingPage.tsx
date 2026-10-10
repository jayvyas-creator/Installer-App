import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Loader2, X } from "lucide-react";
import { AppShell } from "@/components/organisms/AppShell";
import { OutcomePanel } from "@/components/molecules/OutcomePanel";
import { useInstallFlow } from "@/state/InstallFlowContext";
import { DEFAULT_OCPP_STEPS } from "@/constants/mockData";
import type { OcppStep } from "@/types";
import formStyles from "./shared/form.module.css";
import styles from "./AutomatedOcppTestingPage.module.css";

const STEP_DURATION = 650;

export function AutomatedOcppTestingPage() {
  const navigate = useNavigate();
  const { state, setOcppSteps, stepOrder } = useInstallFlow();
  const [attempt, setAttempt] = useState(0);
  const [failed, setFailed] = useState(false);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    setFailed(false);

    const steps: OcppStep[] = DEFAULT_OCPP_STEPS.map((s) => ({ ...s, status: "pending" }));
    setOcppSteps(steps);

    const shouldFailLast = state.failureMode === "OCPPFAIL";

    steps.forEach((_, index) => {
      const startDelay = index * STEP_DURATION;
      const runningTimer = window.setTimeout(() => {
        steps[index] = { ...steps[index], status: "running" };
        setOcppSteps([...steps]);
      }, startDelay);

      const settleTimer = window.setTimeout(() => {
        const isLast = index === steps.length - 1;
        const willFail = shouldFailLast && isLast;
        steps[index] = { ...steps[index], status: willFail ? "failed" : "passed" };
        setOcppSteps([...steps]);
        if (willFail) {
          setFailed(true);
        } else if (isLast) {
          window.setTimeout(() => navigate("/ready-to-be-commissioned", { replace: true }), 500);
        }
      }, startDelay + STEP_DURATION);

      timers.current.push(runningTimer, settleTimer);
    });

    return () => {
      timers.current.forEach((t) => window.clearTimeout(t));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempt]);

  return (
    <AppShell
      title="Automated OCPP testing"
      backDisabled
      stepper={{ steps: [...stepOrder], currentIndex: 7 }}
    >
      <div className={formStyles.stack}>
        <div className={formStyles.intro}>
          <h1 className={formStyles.heading}>Running protocol tests</h1>
          <p className={formStyles.subheading}>
            Verifying the charger speaks OCPP correctly with the network.
          </p>
        </div>

        <div className={formStyles.list}>
          {state.ocppSteps.map((step) => (
            <motion.div
              key={step.key}
              className={styles.stepRow}
              data-status={step.status}
              layout
            >
              <span className={styles.iconSlot}>
                {step.status === "pending" && <span className={styles.pendingDot} />}
                {step.status === "running" && (
                  <Loader2 size={18} className="spin" color="var(--color-brand-orange-500)" />
                )}
                {step.status === "passed" && <Check size={18} color="var(--color-success-600)" />}
                {step.status === "failed" && <X size={18} color="var(--color-error-600)" />}
              </span>
              <span className={styles.stepLabel}>{step.label}</span>
            </motion.div>
          ))}
        </div>

        {failed && (
          <OutcomePanel
            tone="error"
            title="OCPP test failed"
            description="The charger didn't complete the protocol handshake. Retry the test, or contact support if it keeps failing."
            primaryAction={{ label: "Retry tests", onClick: () => setAttempt((a) => a + 1) }}
            secondaryAction={{ label: "Contact support", onClick: () => navigate("/help") }}
          />
        )}
      </div>
    </AppShell>
  );
}
