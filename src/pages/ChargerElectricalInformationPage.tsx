import { useMemo, useState } from "react";
import { AppShell } from "@/components/organisms/AppShell";
import { Button } from "@/components/atoms/Button";
import { Select } from "@/components/atoms/Select";
import { Input } from "@/components/atoms/Input";
import { Tooltip } from "@/components/atoms/Tooltip";
import { SelectField } from "@/components/molecules/SelectField";
import { ReadOnlyField } from "@/components/molecules/ReadOnlyField";
import { ErrorBanner } from "@/components/molecules/ErrorBanner";
import { useInstallFlow } from "@/state/InstallFlowContext";
import { useHistorySync } from "@/navigation/useHistorySync";
import { FLOW_STEPS } from "@/constants/flowSteps";
import {
  CHARGER_TYPE_OPTIONS,
  NUMBER_OF_PHASES_OPTIONS,
  VOLTAGE_OPTIONS,
  numberOfPhasesOptionsForCharger,
  phaseAssignmentOptionsForCharger,
} from "@/constants/electrical";
import {
  createChargerElectricalDraft,
  validateChargerElectricalDraft,
  type ChargerElectricalData,
  type ChargerElectricalDraft,
  type ChargerType,
  type NumberOfPhases,
  type PhaseAssignment,
} from "@/types";
import type { InstallSession } from "@/state/InstallFlowContext";
import formStyles from "./shared/form.module.css";

// The site area's electrical limits, in the shape this page needs, however
// the session happens to be holding them (a freshly-created area this
// session, or one picked from the areas the charger lookup returned).
interface EffectiveSiteArea {
  voltage: number;
  numberOfPhases: NumberOfPhases;
  phaseAssignment: PhaseAssignment;
}

const VALID_PHASE_ASSIGNMENTS: PhaseAssignment[] = ["A", "B", "C", "AB", "BC", "CA", "ABC"];

// The session only ever stores the validated Data shape once this page has
// been completed; editing it again means re-hydrating it back into the
// in-progress Draft shape (numeric amps -> string, drop the derived
// ratedPowerKw, which the draft recomputes live as the user types).
function chargerElectricalDataToDraft(data: ChargerElectricalData): ChargerElectricalDraft {
  return {
    chargerType: data.chargerType,
    voltage: data.voltage,
    numberOfPhases: data.numberOfPhases,
    phaseAssignment: data.phaseAssignment,
    ampPerPhase: String(data.ampPerPhase),
  };
}

function resolveSiteArea(session: InstallSession): EffectiveSiteArea | null {
  if (session.newSiteArea) {
    return {
      voltage: session.newSiteArea.voltage,
      numberOfPhases: session.newSiteArea.numberOfPhases,
      phaseAssignment: session.newSiteArea.phaseAssignment,
    };
  }
  const existing = session.siteAreas.find((area) => area.siteAreaId === session.selectedSiteAreaId);
  if (
    !existing ||
    existing.voltage == null ||
    existing.numberOfPhases == null ||
    !existing.phaseAssignment ||
    !VALID_PHASE_ASSIGNMENTS.includes(existing.phaseAssignment as PhaseAssignment)
  ) {
    return null;
  }
  return {
    voltage: existing.voltage,
    numberOfPhases: existing.numberOfPhases === 3 ? "three" : "single",
    phaseAssignment: existing.phaseAssignment as PhaseAssignment,
  };
}

export function ChargerElectricalInformationPage() {
  const navigate = useHistorySync();
  const { session, setChargerElectrical } = useInstallFlow();

  const siteArea = useMemo(() => resolveSiteArea(session), [session]);
  const locked = session.installed;

  const [draft, setDraft] = useState<ChargerElectricalDraft>(() =>
    session.chargerElectrical
      ? chargerElectricalDataToDraft(session.chargerElectrical)
      : createChargerElectricalDraft(siteArea?.voltage),
  );

  const validation = useMemo(
    () => (siteArea ? validateChargerElectricalDraft(draft, siteArea.voltage) : { data: null, errors: null }),
    [draft, siteArea],
  );
  const errors = validation.errors ?? {};

  const numberOfPhasesOptions = siteArea
    ? NUMBER_OF_PHASES_OPTIONS.filter((opt) => numberOfPhasesOptionsForCharger(siteArea.numberOfPhases).includes(opt.value))
    : [];

  const phaseAssignmentOptions =
    siteArea && draft.numberOfPhases !== ""
      ? phaseAssignmentOptionsForCharger(siteArea.phaseAssignment, draft.numberOfPhases)
      : [];

  const ratedPowerKw = useMemo(() => {
    if (draft.voltage === "" || draft.numberOfPhases === "") return null;
    const amps = Number(draft.ampPerPhase);
    if (!draft.ampPerPhase.trim() || Number.isNaN(amps)) return null;
    const phases = draft.numberOfPhases === "three" ? 3 : 1;
    return Math.round(((draft.voltage * amps * phases) / 1000) * 100) / 100;
  }, [draft.voltage, draft.numberOfPhases, draft.ampPerPhase]);

  function handleContinue() {
    if (locked) {
      navigate("/connector-information");
      return;
    }
    if (!validation.data) return;
    setChargerElectrical(validation.data);
    navigate("/connector-information");
  }

  const canContinue = locked || validation.data !== null;

  return (
    <AppShell
      title="Charger Electrical Information"
      onBack={() => navigate("/site-information")}
      stepper={{ steps: FLOW_STEPS, currentIndex: 4 }}
      footer={
        <Button fullWidth size="lg" disabled={!canContinue} onClick={handleContinue}>
          Continue
        </Button>
      }
    >
      <div className={formStyles.stack}>
        <div className={formStyles.intro}>
          <h1 className={formStyles.heading}>Charger Electrical Information</h1>
          <p className={formStyles.subheading}>
            Describe the charger's electrical setup. It's checked against the chosen site area.
          </p>
        </div>

        {locked && (
          <ErrorBanner
            tone="warning"
            title="Already installed"
            description="This charger is already installed. Contact support to change these details."
          />
        )}

        {!locked && !siteArea && (
          <ErrorBanner
            tone="warning"
            title="No site area selected"
            description="No site area is selected. Please go back and choose one."
          />
        )}

        {locked ? (
          <div className={formStyles.fieldGrid}>
            <ReadOnlyField label="Type of Charger" value={session.chargerElectrical?.chargerType ?? "—"} />
            <ReadOnlyField
              label="Supply Voltage (V)"
              value={session.chargerElectrical ? `${session.chargerElectrical.voltage}V` : "—"}
            />
            <ReadOnlyField
              label="Number of Connected Phase"
              value={
                session.chargerElectrical
                  ? session.chargerElectrical.numberOfPhases === "three"
                    ? "Three Phase"
                    : "Single Phase"
                  : "—"
              }
            />
            <ReadOnlyField label="Phase Assignment" value={session.chargerElectrical?.phaseAssignment ?? "—"} />
            <ReadOnlyField
              label="Amp Per Phase (A)"
              value={session.chargerElectrical ? `${session.chargerElectrical.ampPerPhase}A` : "—"}
            />
            <ReadOnlyField
              label="Rated Power (kW)"
              value={session.chargerElectrical ? `${session.chargerElectrical.ratedPowerKw.toFixed(2)} kW` : "—"}
            />
          </div>
        ) : (
          siteArea && (
            <div className={formStyles.stack}>
              <SelectField<ChargerType>
                label="Type of Charger"
                options={CHARGER_TYPE_OPTIONS}
                value={draft.chargerType}
                onValueChange={(value) => {
                  setDraft((prev) => ({ ...prev, chargerType: value }));
                }}
                placeholder="Select type of charger"
                required
                errorText={draft.chargerType !== "" ? errors.chargerType : undefined}
              />

              <Select
                label="Supply Voltage (V)"
                value={draft.voltage === "" ? "" : String(draft.voltage)}
                onChange={(event) => {
                  const next = event.target.value;
                  setDraft((prev) => ({ ...prev, voltage: next === "" ? "" : Number(next) }));
                }}
                options={VOLTAGE_OPTIONS.map((v) => ({ value: String(v), label: `${v}V` }))}
                placeholder="Select a voltage"
                required
                errorText={draft.voltage !== "" ? errors.voltage : undefined}
              />

              <SelectField<NumberOfPhases>
                label="Number of Connected Phase"
                options={numberOfPhasesOptions}
                value={draft.numberOfPhases}
                onValueChange={(value) => {
                  setDraft((prev) => {
                    const allowedAssignments = siteArea
                      ? phaseAssignmentOptionsForCharger(siteArea.phaseAssignment, value)
                      : [];
                    const phaseAssignment = allowedAssignments.includes(prev.phaseAssignment as PhaseAssignment)
                      ? prev.phaseAssignment
                      : "";
                    return { ...prev, numberOfPhases: value, phaseAssignment };
                  });
                }}
                placeholder="Select number of phases"
                required
                errorText={draft.numberOfPhases !== "" ? errors.numberOfPhases : undefined}
              />

              <SelectField<PhaseAssignment>
                label="Phase Assignment"
                options={phaseAssignmentOptions.map((pa) => ({ value: pa, label: pa }))}
                value={draft.phaseAssignment}
                onValueChange={(value) => {
                  setDraft((prev) => ({ ...prev, phaseAssignment: value }));
                }}
                placeholder={draft.numberOfPhases === "" ? "Select number of phases first" : "Select a phase assignment"}
                disabled={draft.numberOfPhases === ""}
                required
                errorText={draft.phaseAssignment !== "" ? errors.phaseAssignment : undefined}
              />

              <Input
                label="Amp Per Phase (A)"
                value={draft.ampPerPhase}
                onChange={(event) => {
                  const digits = event.target.value.replace(/\D/g, "").slice(0, 4);
                  setDraft((prev) => ({ ...prev, ampPerPhase: digits }));
                }}
                inputMode="numeric"
                placeholder="e.g. 32"
                required
                trailingAdornment={
                  <Tooltip text="The current draw per phase, in amps, that this charger pulls under full load." />
                }
                errorText={draft.ampPerPhase.trim() !== "" ? errors.ampPerPhase : undefined}
              />

              <ReadOnlyField
                label="Rated Power (kW)"
                value={ratedPowerKw !== null ? `${ratedPowerKw.toFixed(2)} kW` : "—"}
              />
            </div>
          )
        )}
      </div>
    </AppShell>
  );
}
