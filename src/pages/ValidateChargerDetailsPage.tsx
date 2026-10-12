import { useNavigate } from "react-router-dom";
import { Plug } from "lucide-react";
import { AppShell } from "@/components/organisms/AppShell";
import { Button } from "@/components/atoms/Button";
import { StatusPill } from "@/components/atoms/StatusPill";
import { ReadOnlyField } from "@/components/molecules/ReadOnlyField";
import { useInstallFlow } from "@/state/InstallFlowContext";
import { buildMockDetectedConnectors } from "@/constants/mockData";
import formStyles from "./shared/form.module.css";
import styles from "./ValidateChargerDetailsPage.module.css";

export function ValidateChargerDetailsPage() {
  const navigate = useNavigate();
  const { state } = useInstallFlow();
  const details = state.chargerDetails;
  const connectors = buildMockDetectedConnectors(state.chargerId);

  function handleConfirm() {
    navigate("/installer-info");
  }

  return (
    <AppShell
      title="Validate charger details"
      onBack={() => navigate("/")}
      footer={
        <Button fullWidth size="lg" onClick={handleConfirm}>
          Confirm and continue
        </Button>
      }
    >
      <div className={formStyles.stack}>
        <div className={formStyles.intro}>
          <h1 className={formStyles.heading}>Is this the right charger?</h1>
          <p className={formStyles.subheading}>
            We matched this charger ID to the record below. Confirm the details before starting
            the install.
          </p>
        </div>

        <div className={formStyles.section}>
          <span className={formStyles.sectionTitle}>Charger record</span>
          <ReadOnlyField label="Charger ID" value={details?.chargerId ?? state.chargerId} />
          <ReadOnlyField label="Model" value={details?.model ?? "—"} />
          <ReadOnlyField label="Serial number" value={details?.serialNumber ?? "—"} />
          <ReadOnlyField label="Manufacturer" value={details?.manufacturer ?? "—"} />
        </div>

        <div className={formStyles.section}>
          <span className={formStyles.sectionTitle}>
            {connectors.length > 1 ? `${connectors.length} connectors detected` : "Connector detected"}
          </span>
          <div className={formStyles.list}>
            {connectors.map((connector) => (
              <div key={connector.id} className={styles.connectorRow}>
                <span className={styles.connectorIcon} aria-hidden>
                  <Plug size={18} />
                </span>
                <span className={styles.connectorTexts}>
                  <span className={styles.connectorLabel}>{connector.label}</span>
                  <span className={styles.connectorMeta}>{connector.currentType} connector</span>
                </span>
                <StatusPill tone={connector.status === "ready" ? "success" : "error"}>
                  {connector.status === "ready" ? "Ready" : "Needs attention"}
                </StatusPill>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
