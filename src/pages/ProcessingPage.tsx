import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AppShell } from "@/components/organisms/AppShell";
import { ProgressRing } from "@/components/atoms/ProgressRing";
import { OutcomePanel } from "@/components/molecules/OutcomePanel";
import styles from "./ProcessingPage.module.css";

export interface ProcessingFailure {
  title: string;
  description: string;
  retryLabel?: string;
  secondaryLabel?: string;
  secondaryTo?: string;
}

export interface ProcessingState {
  label: string;
  sublabel?: string;
  durationMs?: number;
  next: string;
  failure?: ProcessingFailure;
}

export function ProcessingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as ProcessingState | null;
  const [attempt, setAttempt] = useState(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!state) return;
    setFailed(false);
    const timer = setTimeout(() => {
      if (state.failure) {
        setFailed(true);
      } else {
        navigate(state.next, { replace: true });
      }
    }, state.durationMs ?? 1400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, attempt]);

  if (!state) {
    navigate("/", { replace: true });
    return null;
  }

  return (
    <AppShell title="" showHelp={!failed}>
      <div className={styles.wrap}>
        {!failed ? (
          <>
            <h1 className="sr-only">{state.label}</h1>
            <ProgressRing size={64} tone="brand" />
            <div>
              <p className={styles.label}>{state.label}</p>
              {state.sublabel && <p className={styles.sublabel}>{state.sublabel}</p>}
            </div>
          </>
        ) : (
          <OutcomePanel
            tone="error"
            title={state.failure!.title}
            description={state.failure!.description}
            primaryAction={{
              label: state.failure!.retryLabel ?? "Try again",
              onClick: () => setAttempt((a) => a + 1),
            }}
            secondaryAction={
              state.failure!.secondaryTo
                ? {
                    label: state.failure!.secondaryLabel ?? "Go back",
                    onClick: () => navigate(state.failure!.secondaryTo!),
                  }
                : undefined
            }
          />
        )}
      </div>
    </AppShell>
  );
}
