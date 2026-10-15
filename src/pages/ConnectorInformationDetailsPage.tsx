import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/organisms/AppShell";
import { Button } from "@/components/atoms/Button";
import { Select } from "@/components/atoms/Select";
import { Input } from "@/components/atoms/Input";
import { SelectField } from "@/components/molecules/SelectField";
import { CollapsiblePanel } from "@/components/molecules/CollapsiblePanel";
import { ErrorBanner } from "@/components/molecules/ErrorBanner";
import { useInstallFlow } from "@/state/InstallFlowContext";
import { useHistorySync } from "@/navigation/useHistorySync";
import { FLOW_STEPS } from "@/constants/flowSteps";
import {
  connectorTypeOptionsForCharger,
  currentTypeOptionsForConnector,
  numberOfPhasesOptionsForConnector,
  phaseAssignmentOptionsForConnector,
} from "@/constants/electrical";
import {
  connectorDraftNeedsAttention,
  createConnectorDraft,
  validateConnectorDraft,
  type ConnectorCurrentType,
  type ConnectorDraft,
  type ConnectorType,
  type NumberOfPhases,
  type PhaseAssignment,
} from "@/types";
import { installFlow } from "@/flows/installFlow";
import formStyles from "./shared/form.module.css";

const CONNECTOR_COUNT_OPTIONS = [1, 2, 3, 4, 5, 6].map((n) => ({ value: String(n), label: String(n) }));

// Keeps a connector draft internally consistent after any single field
// changes: clears any downstream choice ("later" in the field order on the
// panel) that the new upstream values no longer allow (DESIGN-HANDOFF.md
// §2.7: "changing a choice clears any later choice that is no longer
// allowed").
function reconcileConnectorDraft(draft: ConnectorDraft, chargerNumberOfPhases: NumberOfPhases): ConnectorDraft {
  let { connectorType, currentType, numberOfPhases, phaseAssignment } = draft;

  const typeOptions = connectorTypeOptionsForCharger(chargerNumberOfPhases);
  if (connectorType !== "" && !typeOptions.includes(connectorType)) connectorType = "";

  const currentOptions = connectorType === "" ? [] : currentTypeOptionsForConnector(connectorType);
  if (currentType !== "" && !currentOptions.includes(currentType)) currentType = "";

  const phaseCountOptions =
    connectorType === "" || currentType === "" ? [] : numberOfPhasesOptionsForConnector(connectorType, currentType);
  if (numberOfPhases !== "" && !phaseCountOptions.includes(numberOfPhases)) numberOfPhases = "";

  const assignmentOptions =
    connectorType === "" || numberOfPhases === "" ? [] : phaseAssignmentOptionsForConnector(connectorType, numberOfPhases);
  if (phaseAssignment !== "" && !assignmentOptions.includes(phaseAssignment)) phaseAssignment = "";

  return { ...draft, connectorType, currentType, numberOfPhases, phaseAssignment };
}

function seedInitialDrafts(
  existing: ConnectorDraft[],
  startingConnectorCount: number | undefined,
): ConnectorDraft[] {
  const hasContent = existing.some(
    (d) =>
      d.connectorType !== "" ||
      d.currentType !== "" ||
      d.numberOfPhases !== "" ||
      d.totalAmperage.trim() !== "" ||
      d.supplyVoltage.trim() !== "" ||
      d.phaseAssignment !== "",
  );
  // A resumed session that already has more than the default single draft,
  // or has actually been typed into, is left alone — otherwise seed the
  // panel count from the charger's own connector count (capped at 6).
  if (existing.length > 1 || hasContent) return existing;
  const count = Math.min(Math.max(startingConnectorCount ?? 1, 1), 6);
  return Array.from({ length: count }, (_, i) => createConnectorDraft(`connector-${i + 1}`));
}

export function ConnectorInformationDetailsPage() {
  const navigate = useHistorySync();
  const { session, setConnectorDrafts, markInstalled, reset } = useInstallFlow();

  const hasCoreSession = Boolean(
    session.chargerId &&
      session.installerToken &&
      session.tenantId &&
      session.siteId &&
      (session.selectedSiteAreaId || session.newSiteArea),
  );
  const chargerElectricalMissing = !session.chargerElectrical;
  const locked = session.installed;

  const chargerNumberOfPhases: NumberOfPhases = session.chargerElectrical?.numberOfPhases ?? "single";

  const [drafts, setDrafts] = useState<ConnectorDraft[]>(() =>
    seedInitialDrafts(session.connectorDrafts, session.chargerDetails?.noOfConnectors),
  );
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Keep the session's copy in sync as the installer fills the form in, so a
  // refresh or accidental back-nav resumes with what they'd already entered.
  useEffect(() => {
    setConnectorDrafts(drafts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drafts]);

  function updateConnectorCount(nextCount: number) {
    setDrafts((prev) => {
      if (nextCount === prev.length) return prev;
      if (nextCount > prev.length) {
        const added = Array.from({ length: nextCount - prev.length }, (_, i) =>
          createConnectorDraft(`connector-${prev.length + i + 1}`),
        );
        return [...prev, ...added];
      }
      // Lowering the count removes the last panels immediately, no confirmation.
      return prev.slice(0, nextCount);
    });
  }

  function updateConnector(index: number, patch: Partial<ConnectorDraft>) {
    setDrafts((prev) =>
      prev.map((draft, i) => (i === index ? reconcileConnectorDraft({ ...draft, ...patch }, chargerNumberOfPhases) : draft)),
    );
  }

  const allValid = useMemo(() => drafts.every((draft) => validateConnectorDraft(draft).errors === null), [drafts]);

  async function handleSubmit() {
    if (locked) {
      navigate("/installation-success");
      return;
    }
    if (!allValid || submitting || !session.chargerElectrical) return;

    const connectors = drafts.map((draft) => validateConnectorDraft(draft).data!);
    const siteAreaInput = session.newSiteArea
      ? { created: session.newSiteArea, siteAreaId: session.selectedSiteAreaId! }
      : { existing: session.siteAreas.find((area) => area.siteAreaId === session.selectedSiteAreaId)! };

    setSubmitting(true);
    setSubmitError(null);

    const result = await installFlow({
      chargerId: session.chargerId,
      installerToken: session.installerToken!,
      tenantId: session.tenantId!,
      siteId: session.siteId!,
      siteArea: siteAreaInput,
      chargerElectrical: session.chargerElectrical,
      connectors,
    });

    setSubmitting(false);
    if (!result.ok) {
      setSubmitError(result.error || "Failed to install the charger. Please try again.");
      return;
    }

    setConnectorDrafts(drafts);
    markInstalled();
    navigate("/installation-success");
  }

  function handleCancel() {
    reset();
    navigate("/");
  }

  // Session errors replace the whole form (DESIGN-HANDOFF.md §2.7).
  if (!hasCoreSession) {
    return (
      <AppShell title="Connector Information Details" backDisabled stepper={{ steps: FLOW_STEPS, currentIndex: 5 }}>
        <div className={formStyles.stack}>
          <ErrorBanner
            tone="error"
            title="Missing session details"
            description="Your session is missing the charger or site details. Please cancel and start again."
          />
          <Button fullWidth size="lg" variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </AppShell>
    );
  }

  if (chargerElectricalMissing) {
    return (
      <AppShell
        title="Connector Information Details"
        onBack={() => navigate("/charger-electrical")}
        stepper={{ steps: FLOW_STEPS, currentIndex: 5 }}
      >
        <div className={formStyles.stack}>
          <ErrorBanner
            tone="error"
            title="Charger electrical details incomplete"
            description="The charger electrical details are incomplete. Please go back and check them."
          />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      title="Connector Information Details"
      onBack={submitting ? undefined : () => navigate("/charger-electrical")}
      backDisabled={submitting}
      stepper={{ steps: FLOW_STEPS, currentIndex: 5 }}
      footer={
        <div className={formStyles.stack}>
          {submitError && <ErrorBanner tone="error" title="Couldn't submit" description={submitError} />}
          <Button
            fullWidth
            size="lg"
            loading={submitting}
            disabled={(!locked && !allValid) || submitting}
            onClick={handleSubmit}
          >
            {submitting ? "Submitting…" : "Continue"}
          </Button>
        </div>
      }
    >
      <div className={formStyles.stack}>
        <div className={formStyles.intro}>
          <h1 className={formStyles.heading}>Connector Information Details</h1>
          <p className={formStyles.subheading}>
            Describe each connector (plug) on the charger, then submit the whole installation.
          </p>
        </div>

        {locked && (
          <ErrorBanner
            tone="warning"
            title="Already installed"
            description="This charger is already installed. Contact support to change these details."
          />
        )}

        {!locked && (
          <Select
            label="No. of Connectors"
            value={String(drafts.length)}
            onChange={(event) => updateConnectorCount(Number(event.target.value))}
            options={CONNECTOR_COUNT_OPTIONS}
            required
          />
        )}

        <div className={formStyles.list}>
          {drafts.map((draft, index) => {
            const needsAttention = !locked && connectorDraftNeedsAttention(draft);
            const { errors } = validateConnectorDraft(draft);
            const fieldErrors = errors ?? {};

            const typeOptions = connectorTypeOptionsForCharger(chargerNumberOfPhases);
            const currentOptions = draft.connectorType === "" ? [] : currentTypeOptionsForConnector(draft.connectorType);
            const phaseCountOptions =
              draft.connectorType === "" || draft.currentType === ""
                ? []
                : numberOfPhasesOptionsForConnector(draft.connectorType, draft.currentType);
            const assignmentOptions =
              draft.connectorType === "" || draft.numberOfPhases === ""
                ? []
                : phaseAssignmentOptionsForConnector(draft.connectorType, draft.numberOfPhases);

            return (
              <div
                key={draft.id}
                style={{
                  border: needsAttention ? "1.5px solid var(--border-error)" : "1.5px solid transparent",
                  borderRadius: "var(--radius-md)",
                }}
              >
                <CollapsiblePanel
                  trigger={needsAttention ? `Connector ${index + 1} — needs attention` : `Connector ${index + 1}`}
                  defaultOpen={index === 0}
                >
                  <div className={formStyles.stack}>
                    {locked ? (
                      <div className={formStyles.fieldGrid}>
                        <span>{draft.connectorType || "—"}</span>
                        <span>{draft.currentType || "—"}</span>
                        <span>{draft.numberOfPhases === "three" ? "Three Phase" : draft.numberOfPhases === "single" ? "Single Phase" : "—"}</span>
                        <span>{draft.totalAmperage ? `${draft.totalAmperage}A` : "—"}</span>
                        <span>{draft.supplyVoltage ? `${draft.supplyVoltage}V` : "—"}</span>
                        <span>{draft.phaseAssignment || "—"}</span>
                      </div>
                    ) : (
                      <>
                        <SelectField<ConnectorType>
                          label="Connector Type"
                          options={typeOptions.map((t) => ({ value: t, label: t }))}
                          value={draft.connectorType}
                          onValueChange={(value) => updateConnector(index, { connectorType: value })}
                          placeholder="Select connector type"
                          required
                          errorText={draft.connectorType !== "" ? fieldErrors.connectorType : undefined}
                        />

                        <SelectField<ConnectorCurrentType>
                          label="Current Type"
                          options={currentOptions.map((t) => ({ value: t, label: t === "AC" ? "Alternating Current (AC)" : "Direct Current (DC)" }))}
                          value={draft.currentType}
                          onValueChange={(value) => updateConnector(index, { currentType: value })}
                          placeholder={draft.connectorType === "" ? "Select connector type first" : "Select current type"}
                          disabled={draft.connectorType === ""}
                          required
                          errorText={draft.currentType !== "" ? fieldErrors.currentType : undefined}
                        />

                        <SelectField<NumberOfPhases>
                          label="Number of Connected Phase"
                          options={phaseCountOptions.map((p) => ({ value: p, label: p === "three" ? "Three Phase" : "Single Phase" }))}
                          value={draft.numberOfPhases}
                          onValueChange={(value) => updateConnector(index, { numberOfPhases: value })}
                          placeholder={draft.currentType === "" ? "Select current type first" : "Select number of phases"}
                          disabled={draft.currentType === ""}
                          required
                          errorText={draft.numberOfPhases !== "" ? fieldErrors.numberOfPhases : undefined}
                        />

                        <Input
                          label="Total Amperage (A)"
                          value={draft.totalAmperage}
                          onChange={(event) =>
                            updateConnector(index, { totalAmperage: event.target.value.replace(/\D/g, "").slice(0, 4) })
                          }
                          inputMode="numeric"
                          placeholder="e.g. 32"
                          required
                          errorText={draft.totalAmperage.trim() !== "" ? fieldErrors.totalAmperage : undefined}
                        />

                        <Input
                          label="Supply Voltage (V)"
                          value={draft.supplyVoltage}
                          onChange={(event) =>
                            updateConnector(index, { supplyVoltage: event.target.value.replace(/\D/g, "").slice(0, 4) })
                          }
                          inputMode="numeric"
                          placeholder="e.g. 230"
                          required
                          errorText={draft.supplyVoltage.trim() !== "" ? fieldErrors.supplyVoltage : undefined}
                        />

                        <SelectField<PhaseAssignment>
                          label="Phase Assignment"
                          options={assignmentOptions.map((pa) => ({ value: pa, label: pa }))}
                          value={draft.phaseAssignment}
                          onValueChange={(value) => updateConnector(index, { phaseAssignment: value })}
                          placeholder={draft.numberOfPhases === "" ? "Select number of phases first" : "Select a phase assignment"}
                          disabled={draft.numberOfPhases === ""}
                          required
                          errorText={draft.phaseAssignment !== "" ? fieldErrors.phaseAssignment : undefined}
                        />
                      </>
                    )}
                  </div>
                </CollapsiblePanel>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
