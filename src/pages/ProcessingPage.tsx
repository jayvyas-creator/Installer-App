import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Zap } from "lucide-react";
import { AppShell } from "@/components/organisms/AppShell";
import { PulsingBadge } from "@/components/atoms/PulsingBadge";
import { Wordmark } from "@/components/atoms/Wordmark";
import { useInstallFlow } from "@/state/InstallFlowContext";
import { useCommissioningCheck } from "@/hooks/useCommissioningCheck";
import { useOcppStepRunner } from "@/hooks/useOcppStepRunner";
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
  const { t } = useTranslation();
  const navigate = useNavigate();
  const goHome = useHistorySync();
  const { session, setStatus, setOcppSteps } = useInstallFlow();
  const hasSession = Boolean(session.chargerId && session.installerToken);
  const plan = derivePlan(session);
  const isOcppCheck = plan.installationStep === "OcppCheckComplete";
  const { markFailedStep } = useOcppStepRunner({ active: isOcppCheck, setSteps: setOcppSteps });

  const { elapsedLabel, result } = useCommissioningCheck({
    run: () => {
      if (!session.installerToken) {
        return Promise.resolve({ ok: false as const, error: t("processing.sessionExpired") });
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
      if (isOcppCheck) markFailedStep(result.error);
      navigate(plan.failureRoute, { replace: true, state: { checkError: result.error } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result, hasSession]);

  if (!hasSession) return null;

  return (
    <AppShell showHelp={false}>
      <div className={outcomeStyles.wrap}>
        <h1 className="sr-only">{t("processing.srOnlyHeading")}</h1>
        <Wordmark size="md" />
        <PulsingBadge aria-label={t("processing.processingAriaLabel")}>
          <Zap size={28} />
        </PulsingBadge>
        <div>
          <p className={styles.label}>{t("processing.stayMessage")}</p>
          <p className={styles.sublabel}>{t("processing.elapsedLabel", { elapsed: elapsedLabel })}</p>
        </div>
      </div>
    </AppShell>
  );
}
