import { useEffect, useRef } from "react";
import { DEFAULT_OCPP_STEPS } from "@/constants/mockData";
import type { OcppStep } from "@/types";
import type { OcppCommandResult } from "@/types/api";

interface UseOcppStepRunnerOptions {
  active: boolean;
  setSteps: (steps: OcppStep[]) => void;
  revealDelayMs?: number;
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

// Drives the 4 real OCPP commands (CLAUDE.md §6) through
// waiting -> running -> passed/failed for ProcessingPage's actual
// commissioningFlow request. Each command's final status comes from the
// backend's own per-command result (applyResults), revealed one at a time
// for a live feel — not from a fixed timer guessing at progress. A command
// after the one that failed never runs, so it's left at "waiting".
// markFailedStep() stays as a fallback for failures that carry no
// per-command data at all (a network timeout, a generic step-update error).
export function useOcppStepRunner({ active, setSteps, revealDelayMs = 600 }: UseOcppStepRunnerOptions) {
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
  }, [active]);

  async function applyResults(results: OcppCommandResult[]) {
    for (const step of DEFAULT_OCPP_STEPS) {
      const result = results.find((candidate) => candidate.key === step.key);
      if (!result) break; // never attempted: an earlier command already failed

      apply(stepsRef.current.map((s) => (s.key === step.key ? { ...s, status: "running" } : s)));
      await wait(revealDelayMs);
      apply(
        stepsRef.current.map((s) =>
          s.key === step.key ? { ...s, status: result.status, reason: result.reason } : s,
        ),
      );
      if (result.status === "failed") break;
    }
  }

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

  return { applyResults, markFailedStep };
}
