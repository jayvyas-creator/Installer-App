import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppShell } from "@/components/organisms/AppShell";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Select } from "@/components/atoms/Select";
import { Checkbox } from "@/components/atoms/Checkbox";
import { useInstallFlow } from "@/state/InstallFlowContext";
import { PHASE_LABELS } from "@/constants/electrical";
import type { Phase, PhaseConfig } from "@/types";
import formStyles from "./shared/form.module.css";

const VOLTAGE_OPTIONS = [120, 208, 240, 480];
const PHASE_CONFIG_OPTIONS: { value: PhaseConfig; label: string }[] = [
  { value: "single-phase", label: "Single-phase" },
  { value: "three-phase", label: "Three-phase" },
];
const PHASES_FOR_CONFIG: Record<PhaseConfig, Phase[]> = {
  "single-phase": ["L1"],
  "three-phase": ["L1", "L2", "L3"],
};

interface CreateSiteAreaPageProps {
  initialName?: string;
  initialNameError?: string;
}

export function CreateSiteAreaPage({
  initialName = "",
  initialNameError,
}: CreateSiteAreaPageProps = {}) {
  const navigate = useNavigate();
  const { state, addSiteArea, setSelectedSiteArea } = useInstallFlow();

  const [name, setName] = useState(initialName);
  const [voltage, setVoltage] = useState(String(VOLTAGE_OPTIONS[0]));
  const [phaseConfig, setPhaseConfig] = useState<PhaseConfig>("single-phase");
  const [availablePhases, setAvailablePhases] = useState<Phase[]>(["L1"]);
  const [nameError, setNameError] = useState<string | undefined>(initialNameError);

  function handlePhaseConfigChange(next: PhaseConfig) {
    setPhaseConfig(next);
    setAvailablePhases(PHASES_FOR_CONFIG[next]);
  }

  function togglePhase(phase: Phase) {
    setAvailablePhases((prev) =>
      prev.includes(phase) ? prev.filter((p) => p !== phase) : [...prev, phase],
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setNameError("Give this site area a name.");
      return;
    }
    const isDuplicate = state.siteAreas.some(
      (area) => area.name.toLowerCase() === trimmed.toLowerCase(),
    );
    if (isDuplicate) {
      setNameError(`A site area named "${trimmed}" already exists. Choose a different name.`);
      return;
    }
    setNameError(undefined);

    const id = `area-${trimmed.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`;
    addSiteArea({
      id,
      name: trimmed,
      voltage: Number(voltage),
      phaseConfig,
      availablePhases,
    });
    setSelectedSiteArea(id);
    navigate("/site-information");
  }

  return (
    <AppShell
      title="New site area"
      onBack={() => navigate("/site-information")}
      footer={
        <Button type="submit" form="create-site-area-form" fullWidth size="lg">
          Save site area
        </Button>
      }
    >
      <form id="create-site-area-form" className={formStyles.stack} onSubmit={handleSubmit}>
        <div className={formStyles.intro}>
          <h1 className={formStyles.heading}>Add a site area</h1>
          <p className={formStyles.subheading}>
            Describe the electrical service for this area. The charger's limits will be set from
            what you enter here.
          </p>
        </div>

        <Input
          label="Site area name"
          placeholder="e.g. North Lot"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (nameError) setNameError(undefined);
          }}
          errorText={nameError}
          autoCapitalize="words"
          required
        />

        <div className={formStyles.fieldGrid}>
          <Select
            label="Voltage"
            value={voltage}
            onChange={(e) => setVoltage(e.target.value)}
            options={VOLTAGE_OPTIONS.map((v) => ({ value: String(v), label: `${v}V` }))}
            required
          />
          <Select
            label="Phase configuration"
            value={phaseConfig}
            onChange={(e) => handlePhaseConfigChange(e.target.value as PhaseConfig)}
            options={PHASE_CONFIG_OPTIONS}
            required
          />
        </div>

        <div className={formStyles.section}>
          <span className={formStyles.sectionTitle}>Available phases</span>
          {PHASES_FOR_CONFIG[phaseConfig].map((phase) => (
            <label key={phase} className={formStyles.summaryRow} style={{ cursor: "pointer" }}>
              <span className={formStyles.summaryText}>{PHASE_LABELS[phase]}</span>
              <Checkbox checked={availablePhases.includes(phase)} onChange={() => togglePhase(phase)} />
            </label>
          ))}
        </div>
      </form>
    </AppShell>
  );
}
