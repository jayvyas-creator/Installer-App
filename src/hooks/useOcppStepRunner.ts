import { useEffect, useRef } from "react";
import { DEFAULT_OCPP_STEPS } from "@/constants/mockData";
import type { OcppStep } from "@/types";

interface UseOcppStepRunnerOptions {
  active: boolean;
  setSteps: (steps: OcppStep[]) => void;
  stepDurationMs?: number;
}

// Animates the 4 real OCPP commands (CLAUDE.md §6) through
// waiting -> running -> passed while ProcessingPage's actual commissioningFlow
// request is in flight. The backend only reports pass/fail for the check as a
// whole, not per-command, so this progression is a best-effort visual
// simulation — markFailedStep() is what reconciles it with the real outcome
// once the request resolves, marking the step that was running (or, if the
// animation already finished, the last step) as the one that failed.
export function useOcppStepRunner({ active, setSteps, stepDurationMs = 1200 }: UseOcppStepRunnerOptions) {
  const stepsRef = useRef<OcppStep[]>(DEFAULT_OCPP_STEPS);
  const setStepsRef = useRef(setSteps);
  useEffect(() => {
    setStepsRef.current = setSteps;
  });

  function apply(next: OcppStep[]) {
    stepsRef.current = next;
    setStepsRef.current(next);
  }

  useEffect(() => {
    if (!active) return;
    apply(DEFAULT_OCPP_STEPS.map((step) => ({ ...step, status: "waiting", reason: undefined })));

    let cancelled = false;
    let index = 0;

    function advance() {
      if (cancelled || index >= DEFAULT_OCPP_STEPS.length) return;
      apply(
        DEFAULT_OCPP_STEPS.map((step, i) => ({
          ...step,
          status: i < index ? "passed" : i === index ? "running" : "waiting",
        })),
      );
      window.setTimeout(() => {
        if (cancelled) return;
        index += 1;
        apply(DEFAULT_OCPP_STEPS.map((step, i) => ({ ...step, status: i < index ? "passed" : "waiting" })));
        advance();
      }, stepDurationMs);
    }

    advance();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, stepDurationMs]);

  function markFailedStep(reason: string) {
    const current = stepsRef.current;
    let failIndex = current.findIndex((step) => step.status === "running");
    if (failIndex === -1) failIndex = current.findIndex((step) => step.status !== "passed");
    if (failIndex === -1) failIndex = current.length - 1;
    apply(
      current.map((step, i) => {
        if (i === failIndex) return { ...step, status: "failed", reason };
        if (i < failIndex) return { ...step, status: "passed" };
        return step;
      }),
    );
  }

  return { markFailedStep };
}
