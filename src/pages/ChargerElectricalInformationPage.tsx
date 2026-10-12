import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppShell } from "@/components/organisms/AppShell";
import { Button } from "@/components/atoms/Button";
import { Select } from "@/components/atoms/Select";
import { ChecklistItem } from "@/components/molecules/ChecklistItem";
import { ReadOnlyField } from "@/components/molecules/ReadOnlyField";
import { useInstallFlow } from "@/state/InstallFlowContext";
import {
  PHASE_CONFIG_LABELS,
  PHASE_LABELS,
  amperageOptionsFor,
} from "@/constants/electrical";
import type { Phase } from "@/types";
import formStyles from "./shared/form.module.css";

export function ChargerElectricalInformationPage() {
  const navigate = useNavigate();
  const { state, setElectricalConfig, stepOrder } = useInstallFlow();

  const siteArea = useMemo(
    () => state.siteAreas.find((area) => area.id === state.selectedSiteAreaId) ?? state.siteAreas[0],
    [state.siteAreas, state.selectedSiteAreaId],
  );

  const [assignedPhases, setAssignedPhases] = useState<Phase[]>(siteArea.availablePhases);
  const amperageOptions = amperageOptionsFor(siteArea.phaseConfig);
  const [maxAmperage, setMaxAmperage] = useState(String(amperageOptions[0]));

  function togglePhase(phase: Phase) {
    setAssignedPhases((prev) =>
      prev.includes(phase) ? prev.filter((p) => p !== phase) : [...prev, phase],
    );
  }

  function handleContinue() {
    setElectricalConfig({
      voltage: siteArea.voltage,
      phaseConfig: siteArea.phaseConfig,
      assignedPhases,
      maxAmperage: Number(maxAmperage),
    });
    navigate("/connector-information");
  }

  return (
    <AppShell
      title="Charger electrical info"
      onBack={() => navigate("/site-information")}
      stepper={{ steps: [...stepOrder], currentIndex: 3 }}
      footer={
        <Button
          fullWidth
          size="lg"
          disabled={assignedPhases.length === 0}
          onClick={handleContinue}
        >
          Continue
        </Button>
      }
    >
      <div className={formStyles.stack}>
        <div className={formStyles.intro}>
          <h1 className={formStyles.heading}>Confirm the charger's power</h1>
          <p className={formStyles.subheading}>
            Voltage and phase configuration are inherited from {siteArea.name} and can't be
            changed here.
          </p>
        </div>

        <div className={formStyles.fieldGrid}>
          <ReadOnlyField label="Voltage" value={`${siteArea.voltage}V`} />
          <ReadOnlyField label="Phase configuration" value={PHASE_CONFIG_LABELS[siteArea.phaseConfig]} />
        </div>

        <div className={formStyles.section}>
          <span className={formStyles.sectionTitle}>Assigned phases</span>
          <div className={formStyles.list}>
            {siteArea.availablePhases.map((phase) => (
              <ChecklistItem
                key={phase}
                label={PHASE_LABELS[phase]}
                checked={assignedPhases.includes(phase)}
                onToggle={() => togglePhase(phase)}
              />
            ))}
          </div>
        </div>

        <Select
          label="Maximum amperage"
          value={maxAmperage}
          onChange={(e) => setMaxAmperage(e.target.value)}
          options={amperageOptions.map((amp) => ({ value: String(amp), label: `${amp}A` }))}
          required
        />
      </div>
    </AppShell>
  );
}
