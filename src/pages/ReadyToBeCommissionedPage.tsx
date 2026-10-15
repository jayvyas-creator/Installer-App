import { useEffect } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/organisms/AppShell";
import { OutcomePanel } from "@/components/molecules/OutcomePanel";
import { useInstallFlow } from "@/state/InstallFlowContext";
import { useHistorySync } from "@/navigation/useHistorySync";
import styles from "@/styles/outcome.module.css";
import formStyles from "./shared/form.module.css";

// DESIGN-HANDOFF.md 2.13 "Ready to be commissioned (end)": the final screen of
// the main flow. "Back to Home" clears the session and returns to Home.
export function ReadyToBeCommissionedPage() {
  const navigate = useHistorySync();
  const { session, reset } = useInstallFlow();

  useEffect(() => {
    const showTimer = window.setTimeout(() => {
      toast(`${session.chargerId} commissioning complete. Charger is now live.`, {
        duration: 3700,
      });
    }, 500);
    return () => window.clearTimeout(showTimer);
  }, [session.chargerId]);

  function handleBackToHome() {
    reset();
    navigate("/");
  }

  return (
    <AppShell title="Ready to be commissioned" backDisabled showHelp={false}>
      <div className={styles.wrap}>
        <OutcomePanel
          tone="success"
          title="Ready to be commissioned"
          description="All tasks are successfully completed"
          primaryAction={{ label: "Back to Home", onClick: handleBackToHome }}
        >
          <div className={formStyles.section}>
            <p className={formStyles.subheading}>
              Charger is Ready for Commissioning. Thank you for completing the installation steps
              successfully.
            </p>
          </div>
        </OutcomePanel>
      </div>
    </AppShell>
  );
}
