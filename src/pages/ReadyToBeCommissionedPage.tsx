import { useNavigate } from "react-router-dom";
import { AppShell } from "@/components/organisms/AppShell";
import { OutcomePanel } from "@/components/molecules/OutcomePanel";
import { StatusPill } from "@/components/atoms/StatusPill";
import { useInstallFlow } from "@/state/InstallFlowContext";
import styles from "./ProcessingPage.module.css";
import formStyles from "./shared/form.module.css";

export function ReadyToBeCommissionedPage() {
  const navigate = useNavigate();
  const { state, reset } = useInstallFlow();

  function handleDone() {
    reset();
    navigate("/", { replace: true });
  }

  return (
    <AppShell title="All set" backDisabled showHelp={false}>
      <div className={styles.wrap}>
        <OutcomePanel
          tone="success"
          title="Ready to be commissioned"
          description={`${state.chargerId} has passed every check and is ready to go live. A DynaChrg coordinator will complete final commissioning shortly.`}
          primaryAction={{ label: "Done", onClick: handleDone }}
        >
          <div className={formStyles.summaryRow}>
            <span className={formStyles.summaryText}>Installer</span>
            <span className={formStyles.summaryText}>{state.installerInfo.fullName}</span>
          </div>
          <div className={formStyles.summaryRow}>
            <span className={formStyles.summaryText}>Connectors</span>
            <StatusPill tone="success" showDot={false}>
              {state.connectors.length} configured
            </StatusPill>
          </div>
        </OutcomePanel>
      </div>
    </AppShell>
  );
}
