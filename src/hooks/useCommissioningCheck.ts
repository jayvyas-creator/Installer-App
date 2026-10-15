import { useEffect, useRef, useState } from "react";
import type { Result } from "@/types/api";

interface UseCommissioningCheckOptions {
  run: () => Promise<Result<string>>;
  delayMs?: number;
  timeoutMs?: number;
}

// Drives both Processing screens (DESIGN-HANDOFF.md §3): shows an
// "Elapsed: m:ss" counter, waits `delayMs` before firing the actual check
// (so the screen never flashes for a near-instant mock response), and
// surfaces a timeout failure if the real call hangs past `timeoutMs`.
export function useCommissioningCheck({ run, delayMs = 3000, timeoutMs = 30000 }: UseCommissioningCheckOptions) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [result, setResult] = useState<Result<string> | null>(null);
  const runRef = useRef(run);
  useEffect(() => {
    runRef.current = run;
  });

  useEffect(() => {
    let cancelled = false;
    const tick = window.setInterval(() => setElapsedSeconds((seconds) => seconds + 1), 1000);
    const timeout = window.setTimeout(() => {
      if (!cancelled) setResult({ ok: false, error: "This is taking longer than expected. Please try again." });
    }, timeoutMs);
    const start = window.setTimeout(() => {
      void runRef.current().then((outcome) => {
        if (cancelled) return;
        window.clearTimeout(timeout);
        setResult(outcome);
      });
    }, delayMs);

    return () => {
      cancelled = true;
      window.clearInterval(tick);
      window.clearTimeout(timeout);
      window.clearTimeout(start);
    };
  }, [delayMs, timeoutMs]);

  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;
  const elapsedLabel = `${minutes}:${String(seconds).padStart(2, "0")}`;

  return { elapsedLabel, result };
}
