import { useEffect, useState } from "react";
import { AppLayout } from "@/components/templates/AppLayout";
import { Button } from "@/components/atoms/Button";
import { Heading } from "@/components/atoms/Heading";
import { Input } from "@/components/atoms/Input";
import { ReadOnlyField } from "@/components/molecules/ReadOnlyField";
import { SelectField } from "@/components/molecules/SelectField";
import { useInstallFlow } from "@/state/InstallFlowContext";
import { useHistorySync } from "@/navigation/useHistorySync";
import { FLOW_STEPS } from "@/constants/flowSteps";
import { VOLTAGE_OPTIONS, NUMBER_OF_PHASES_OPTIONS, phaseAssignmentOptionsForSiteArea } from "@/constants/electrical";
import { createSiteAreaDraft, validateSiteAreaDraft, type NumberOfPhases, type PhaseAssignment } from "@/types";
import formStyles from "./shared/form.module.css";

export function CreateSiteAreaPage() {
  const navigate = useHistorySync();
  const { session, setNewSiteArea } = useInstallFlow();

  const existingNames = session.siteAreas.map((area) => area.siteAreaName);
  const hasExistingAreas = session.siteAreas.length > 0;

  // An installed charger's site area can't be re-created (KNOWN-LIMITATIONS
  // #8) — bounce back to Site Information, which renders the locked state.
  useEffect(() => {
    if (session.installed) navigate("/site-information");
  }, [session.installed, navigate]);

  const [draft, setDraft] = useState(createSiteAreaDraft);

  const validation = validateSiteAreaDraft(draft, existingNames);
  const errors = validation.errors ?? {};

  const phaseAssignmentOptions =
    draft.numberOfPhases === "" ? [] : phaseAssignmentOptionsForSiteArea(draft.numberOfPhases);

  const maxPowerPreview = (() => {
    if (draft.voltage === "" || draft.numberOfPhases === "") return null;
    const amps = Number(draft.ampsPerPhase);
    if (!draft.ampsPerPhase.trim() || !Number.isFinite(amps) || amps <= 0) return null;
    const phases = draft.numberOfPhases === "three" ? 3 : 1;
    return Math.round(((draft.voltage * amps * phases) / 1000) * 100) / 100;
  })();

  function handleNumberOfPhasesChange(value: NumberOfPhases) {
    const nextOptions = phaseAssignmentOptionsForSiteArea(value);
    setDraft((prev) => ({
      ...prev,
      numberOfPhases: value,
      // Changing phases clears an assignment that's no longer valid.
      phaseAssignment: nextOptions.includes(prev.phaseAssignment as PhaseAssignment)
        ? prev.phaseAssignment
        : "",
    }));
  }

  function handleAmpsChange(raw: string) {
    const digitsOnly = raw.replace(/\D/g, "").slice(0, 4);
    setDraft((prev) => ({ ...prev, ampsPerPhase: digitsOnly }));
  }

  function handleBack() {
    navigate("/validate-charger-details");
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!validation.data) return;
    const siteAreaId = `area-${Date.now()}`;
    setNewSiteArea(validation.data, siteAreaId);
    navigate("/charger-electrical");
  }

  return (
    <AppLayout
      title="Create Site Area"
      onBack={handleBack}
      stepper={{ steps: FLOW_STEPS, currentIndex: 3 }}
      footer={
        <Button type="submit" form="create-site-area-form" fullWidth disabled={!validation.data}>
          Next
        </Button>
      }
    >
      <form id="create-site-area-form" className={formStyles.stack} onSubmit={handleSubmit}>
        <Heading level={1}>Create Site Area</Heading>

        <Input
          label="Area Name"
          value={draft.name}
          onChange={(e) => setDraft((prev) => ({ ...prev, name: e.target.value }))}
          errorText={draft.name.trim() ? errors.name : undefined}
          required
        />

        <SelectField<string>
          label="Supply Voltage (V)"
          placeholder="Select a voltage"
          value={draft.voltage === "" ? "" : String(draft.voltage)}
          onValueChange={(value) => setDraft((prev) => ({ ...prev, voltage: Number(value) }))}
          options={VOLTAGE_OPTIONS.map((voltage) => ({ value: String(voltage), label: `${voltage}V` }))}
          required
        />

        <SelectField<NumberOfPhases>
          label="Number of Phases"
          placeholder="Select number of phases"
          value={draft.numberOfPhases}
          onValueChange={handleNumberOfPhasesChange}
          options={NUMBER_OF_PHASES_OPTIONS}
          required
        />

        <SelectField<PhaseAssignment>
          label="Phase Assignment"
          placeholder={draft.numberOfPhases === "" ? "Select number of phases first" : "Select a phase assignment"}
          helperText={draft.numberOfPhases === "" ? "Select number of phases first" : undefined}
          value={draft.phaseAssignment}
          onValueChange={(value) => setDraft((prev) => ({ ...prev, phaseAssignment: value }))}
          options={phaseAssignmentOptions.map((code) => ({ value: code, label: code }))}
          disabled={draft.numberOfPhases === ""}
          required
        />

        <Input
          label="Amps Per Phase (A)"
          value={draft.ampsPerPhase}
          onChange={(e) => handleAmpsChange(e.target.value)}
          errorText={draft.ampsPerPhase.trim() ? errors.ampsPerPhase : undefined}
          inputMode="numeric"
          maxLength={4}
          required
        />

        <ReadOnlyField
          label="Max Power (KW)"
          value={maxPowerPreview === null ? "" : maxPowerPreview.toFixed(2)}
        />

        {hasExistingAreas && (
          <button type="button" className={formStyles.dashedAddRow} onClick={() => navigate("/site-information")}>
            Choose an existing site area instead
          </button>
        )}
      </form>
    </AppLayout>
  );
}
