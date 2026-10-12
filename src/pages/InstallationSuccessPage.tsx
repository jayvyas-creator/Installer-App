import { useNavigate } from "react-router-dom";
import { AppShell } from "@/components/organisms/AppShell";
import { OutcomePanel } from "@/components/molecules/OutcomePanel";
import { useInstallFlow } from "@/state/InstallFlowContext";
import styles from "@/styles/outcome.module.css";

export function InstallationSuccessPage() {
  const navigate = useNavigate();
  const { state } = useInstallFlow();

  return (
    <AppShell title="Installation summary" backDisabled>
      <div className={styles.wrap}>
        <OutcomePanel
          tone="success"
          title="Installation recorded"
          description={`${state.chargerId} has been registered with ${state.connectors.length} connector${state.connectors.length === 1 ? "" : "s"}. Next, confirm the charger can communicate with the network.`}
          primaryAction={{
            label: "Continue to checklist",
            onClick: () => navigate("/communication-checklist"),
          }}
        />
      </div>
    </AppShell>
  );
}
