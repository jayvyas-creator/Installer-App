import { useEffect } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { AppShell } from "@/components/organisms/AppShell";
import { OutcomePanel } from "@/components/molecules/OutcomePanel";
import { useInstallFlow } from "@/state/InstallFlowContext";
import { useHistorySync } from "@/navigation/useHistorySync";
import styles from "@/styles/outcome.module.css";
import formStyles from "./shared/form.module.css";

// DESIGN-HANDOFF.md 2.13 "Ready to be commissioned (end)": the final screen of
// the main flow. "Back to Home" clears the session and returns to Home.
export function ReadyToBeCommissionedPage() {
  const { t } = useTranslation();
  const navigate = useHistorySync();
  const { session, reset } = useInstallFlow();

  useEffect(() => {
    const showTimer = window.setTimeout(() => {
      toast(t("readyToBeCommissioned.toastMessage", { chargerId: session.chargerId }), {
        duration: 3700,
      });
    }, 500);
    return () => window.clearTimeout(showTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.chargerId]);

  function handleBackToHome() {
    reset();
    navigate("/");
  }

  return (
    <AppShell title={t("readyToBeCommissioned.title")} backDisabled showHelp={false}>
      <div className={styles.wrap}>
        <OutcomePanel
          tone="success"
          title={t("readyToBeCommissioned.title")}
          description={t("readyToBeCommissioned.description")}
          primaryAction={{ label: t("readyToBeCommissioned.backToHome"), onClick: handleBackToHome }}
        >
          <div className={formStyles.section}>
            <p className={formStyles.subheading}>{t("readyToBeCommissioned.subheading")}</p>
          </div>
        </OutcomePanel>
      </div>
    </AppShell>
  );
}
