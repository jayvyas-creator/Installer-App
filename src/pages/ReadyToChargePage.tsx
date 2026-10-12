import { useNavigate } from "react-router-dom";
import { AppShell } from "@/components/organisms/AppShell";
import { OutcomePanel } from "@/components/molecules/OutcomePanel";
import { useInstallFlow } from "@/state/InstallFlowContext";
import styles from "./ProcessingPage.module.css";

export function ReadyToChargePage() {
  const navigate = useNavigate();
  const { state, reset } = useInstallFlow();

  function handleReturnHome() {
    reset();
    navigate("/", { replace: true });
  }

  return (
    <AppShell title="Already active" backDisabled showHelp={false}>
      <div className={styles.wrap}>
        <OutcomePanel
          tone="success"
          title="Ready to charge"
          description={`${state.chargerId} is already commissioned and live. No further setup is needed, it's ready for drivers to use.`}
          primaryAction={{ label: "Return home", onClick: handleReturnHome }}
        />
      </div>
    </AppShell>
  );
}
