import { useNavigate } from "react-router-dom";
import { AppShell } from "@/components/organisms/AppShell";
import { OutcomePanel } from "@/components/molecules/OutcomePanel";
import { useInstallFlow } from "@/state/InstallFlowContext";
import styles from "./ProcessingPage.module.css";

export function NoEvChargerFoundPage() {
  const navigate = useNavigate();
  const { state } = useInstallFlow();

  return (
    <AppShell title="Charger lookup" onBack={() => navigate("/")}>
      <div className={styles.wrap}>
        <OutcomePanel
          tone="warning"
          title="No EV charger found"
          description={`We couldn't find a charger matching "${state.chargerId || "that ID"}". Double-check the ID on the charger's label, or try scanning the QR code again.`}
          primaryAction={{ label: "Try again", onClick: () => navigate("/") }}
        />
      </div>
    </AppShell>
  );
}
