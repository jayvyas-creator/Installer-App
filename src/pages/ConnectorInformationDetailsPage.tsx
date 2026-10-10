import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2 } from "lucide-react";
import { AppShell } from "@/components/organisms/AppShell";
import { Button } from "@/components/atoms/Button";
import { Select } from "@/components/atoms/Select";
import { IconButton } from "@/components/atoms/IconButton";
import { ReadOnlyField } from "@/components/molecules/ReadOnlyField";
import { useInstallFlow } from "@/state/InstallFlowContext";
import { CONNECTOR_TYPE_OPTIONS, PHASE_LABELS } from "@/constants/electrical";
import type { ConnectorConfig, ConnectorCurrentType, Phase } from "@/types";
import type { ProcessingState } from "./ProcessingPage";
import formStyles from "./shared/form.module.css";
import styles from "./ConnectorInformationDetailsPage.module.css";

export function ConnectorInformationDetailsPage() {
  const navigate = useNavigate();
  const { state, setConnectors, stepOrder } = useInstallFlow();
  const electrical = state.electricalConfig;
  const [connectors, setLocalConnectors] = useState<ConnectorConfig[]>(state.connectors);
  const [currentType, setCurrentType] = useState<ConnectorCurrentType>("AC");
  const [phase, setPhase] = useState<Phase>(electrical?.assignedPhases[0] ?? "L1");

  if (!electrical) {
    navigate("/charger-electrical", { replace: true });
    return null;
  }

  function addConnector() {
    const next: ConnectorConfig = {
      id: `conn-${Date.now()}`,
      label: `Connector ${connectors.length + 1}`,
      currentType,
      phaseConfig: electrical!.phaseConfig,
      assignedPhases: [phase],
      maxAmperage: electrical!.maxAmperage,
    };
    setLocalConnectors((prev) => [...prev, next]);
  }

  function removeConnector(id: string) {
    setLocalConnectors((prev) => prev.filter((c) => c.id !== id));
  }

  function handleContinue() {
    setConnectors(connectors);
    const processingState: ProcessingState = {
      label: "Finalizing installation…",
      sublabel: `Recording ${connectors.length} connector${connectors.length === 1 ? "" : "s"}`,
      durationMs: 1800,
      next: "/installation-success",
      failure:
        state.failureMode === "STEPFAIL"
          ? {
              title: "Installation step failed",
              description:
                "Something interrupted the install sequence. Check your connections and try again.",
              retryLabel: "Try again",
              secondaryLabel: "Review connectors",
              secondaryTo: "/connector-information",
            }
          : undefined,
    };
    navigate("/processing", { state: processingState });
  }

  return (
    <AppShell
      title="Connector information"
      onBack={() => navigate("/charger-electrical")}
      stepper={{ steps: [...stepOrder], currentIndex: 4 }}
      footer={
        <Button fullWidth size="lg" disabled={connectors.length === 0} onClick={handleContinue}>
          Continue
        </Button>
      }
    >
      <div className={formStyles.stack}>
        <div className={formStyles.intro}>
          <h1 className={formStyles.heading}>Add each charge connector</h1>
          <p className={formStyles.subheading}>
            Type and phase assignment inherit the charger's electrical limits.
          </p>
        </div>

        <div className={formStyles.fieldGrid}>
          <ReadOnlyField label="Max amperage" value={`${electrical.maxAmperage}A`} />
          <ReadOnlyField label="Phase config" value={electrical.phaseConfig === "single-phase" ? "Single-phase" : "Three-phase"} />
        </div>

        {connectors.length > 0 && (
          <div className={formStyles.list}>
            {connectors.map((connector) => (
              <div className={styles.connectorRow} key={connector.id}>
                <span className={styles.connectorTexts}>
                  <span className={styles.connectorLabel}>{connector.label}</span>
                  <span className={styles.connectorMeta}>
                    {connector.currentType} · {connector.assignedPhases.join(", ")} ·{" "}
                    {connector.maxAmperage}A
                  </span>
                </span>
                <IconButton
                  aria-label={`Remove ${connector.label}`}
                  tone="subtle"
                  onClick={() => removeConnector(connector.id)}
                >
                  <Trash2 size={18} />
                </IconButton>
              </div>
            ))}
          </div>
        )}

        <div className={formStyles.section}>
          <span className={formStyles.sectionTitle}>New connector</span>
          <Select
            label="Connector type"
            value={currentType}
            onChange={(e) => setCurrentType(e.target.value as ConnectorCurrentType)}
            options={[...CONNECTOR_TYPE_OPTIONS]}
          />
          <Select
            label="Phase assignment"
            value={phase}
            onChange={(e) => setPhase(e.target.value as Phase)}
            options={electrical.assignedPhases.map((p) => ({ value: p, label: PHASE_LABELS[p] }))}
          />
          <button type="button" className={styles.addRow} onClick={addConnector}>
            <Plus size={16} aria-hidden />
            Add connector
          </button>
        </div>
      </div>
    </AppShell>
  );
}
