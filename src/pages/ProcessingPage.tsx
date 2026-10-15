import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppShell } from "@/components/organisms/AppShell";
import { PulsingBadge } from "@/components/atoms/PulsingBadge";
import { Wordmark } from "@/components/atoms/Wordmark";
import { useInstallFlow } from "@/state/InstallFlowContext";
import { useCommissioningCheck } from "@/hooks/useCommissioningCheck";
import { useHistorySync } from "@/navigation/useHistorySync";
import { commissioningFlow } from "@/flows/commissioningFlow";
import type { InstallSession } from "@/state/InstallFlowContext";
import outcomeStyles from "@/styles/outcome.module.css";
import styles from "./ProcessingPage.module.css";

// This screen is used twice (DESIGN-HANDOFF.md §2.10): once after the
// Communication Checklist (to record the comm check) and once after
// Automated OCPP Testing (to record the final OCPP check). Rather than
// threading that choice through router state (useHistorySync's navigate
// only takes a path — see src/navigation/useHistorySync.ts), this page
// derives "what we're waiting on" from the session's last known
// ChargerStatusResponse: no installationStep yet means the comm check is
// still outstanding; ChargerHWCheckComplete means only the final OCPP check
// is left. Both callers are responsible for keeping session.status current
// before they ever route here.
function derivePlan(session: InstallSession): { installationStep: string; failureRoute: string } {
  if (session.status?.installationStep === "ChargerHWCheckComplete") {
    return { installationStep: "OcppCheckComplete", failureRoute: "/ocpp-testing" };
  }
  return { installationStep: "ChargerCommCheckComplete", failureRoute: "/communication-checklist" };
}

export function ProcessingPage() {
  const navigate = useNavigate();
  const goHome = useHistorySync();
  const { session, setStatus } = useInstallFlow();
  const hasSession = Boolean(session.chargerId && session.installerToken);
  const plan = derivePlan(session);

  const { elapsedLabel, result } = useCommissioningCheck({
    run: () => {
      if (!session.installerToken) {
        return Promise.resolve({ ok: false as const, error: "Your session has expired. Please start again." });
      }
      return commissioningFlow(
        session.chargerId,
        session.installerToken,
        plan.installationStep,
        session.siteAreas.length,
      );
    },
  });

  useEffect(() => {
    if (!hasSession) {
      goHome("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasSession]);

  useEffect(() => {
    if (!result || !hasSession) return;

    if (result.ok) {
      // Keep the session's status in sync with what we just recorded so a
      // later visit here (after Automated OCPP Testing) derives the right
      // plan, and so any page that reads session.status stays accurate.
      setStatus(
        plan.installationStep === "ChargerCommCheckComplete"
          ? { status: "Installed", installationStep: "ChargerCommCheckComplete" }
          : { status: "Connected", installationStep: null },
      );
      // Replace, not push: this screen must never be a valid Back target
      // (DESIGN-HANDOFF.md §4, "no way out" while a check runs).
      navigate(result.data, { replace: true });
    } else {
      navigate(plan.failureRoute, { replace: true, state: { checkError: result.error } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result, hasSession]);

  if (!hasSession) return null;

  return (
    <AppShell showHelp={false}>
      <div className={outcomeStyles.wrap}>
        <h1 className="sr-only">Processing</h1>
        <PulsingBadge aria-label="Processing">
          <Wordmark size="lg" />
        </PulsingBadge>
        <div>
          <p className={styles.label}>
            Please stay on this screen while we complete the process. This may take a few
            minutes. Do not close or navigate away from the app.
          </p>
          <p className={styles.sublabel}>Elapsed: {elapsedLabel}</p>
        </div>
      </div>
    </AppShell>
  );
}
