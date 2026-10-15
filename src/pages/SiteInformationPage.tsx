import { useEffect, useState } from "react";
import { AppLayout } from "@/components/templates/AppLayout";
import { Button } from "@/components/atoms/Button";
import { Heading } from "@/components/atoms/Heading";
import { ErrorBanner } from "@/components/molecules/ErrorBanner";
import { ReadOnlyField } from "@/components/molecules/ReadOnlyField";
import { SelectField } from "@/components/molecules/SelectField";
import { useInstallFlow } from "@/state/InstallFlowContext";
import { useHistorySync } from "@/navigation/useHistorySync";
import { FLOW_STEPS } from "@/constants/flowSteps";
import formStyles from "./shared/form.module.css";

const DASH = "—";

function formatNumber(value: number | null, digits = 0): string {
  return value === null || value === undefined ? DASH : value.toFixed(digits);
}

function formatPhases(count: number | null): string {
  if (count === 1) return "Single Phase";
  if (count === 3) return "Three Phase";
  if (count === null || count === undefined) return DASH;
  return `${count} Phase`;
}

// Normalized shape the capacity panel renders, built from either an existing
// ApiSiteArea (from the backend) or a freshly-created SiteAreaData (from
// CreateSiteAreaPage) — see resolveCurrentSiteArea below.
interface CapacityView {
  name: string;
  voltage: number | null;
  numberOfPhasesLabel: string;
  maxPowerKw: number | null;
  ampPerPhase: number | null;
  ampAllPhases: number | null;
}

function CapacityPanel({ area }: { area: CapacityView }) {
  return (
    <div className={formStyles.section}>
      <span className={formStyles.sectionTitle}>Capacity</span>
      <ReadOnlyField label="Supply Voltage (V)" value={formatNumber(area.voltage)} />
      <ReadOnlyField label="Number of Phases" value={area.numberOfPhasesLabel} />
      <ReadOnlyField label="Max Power (KW)" value={formatNumber(area.maxPowerKw, 2)} />
      <ReadOnlyField label="Amp Per Phase (A)" value={formatNumber(area.ampPerPhase)} />
      <ReadOnlyField label="Amp All Phases (A)" value={formatNumber(area.ampAllPhases)} />
    </div>
  );
}

export function SiteInformationPage() {
  const navigate = useHistorySync();
  const { session, setSelectedSiteArea } = useInstallFlow();

  const siteAreas = session.siteAreas;
  const siteName = session.chargerDetails?.siteName ?? "";

  // Resolves whichever site area id is "current" into the one shape the
  // capacity panel needs, whether it came from the backend (ApiSiteArea) or
  // was just created locally (SiteAreaData, not yet sent to the backend).
  function resolveSiteArea(id: string | null): CapacityView | null {
    if (!id) return null;
    if (session.newSiteArea && session.selectedSiteAreaId === id) {
      const draft = session.newSiteArea;
      const phases = draft.numberOfPhases === "three" ? 3 : 1;
      return {
        name: draft.name,
        voltage: draft.voltage,
        numberOfPhasesLabel: formatPhases(phases),
        maxPowerKw: draft.maxPowerKw,
        ampPerPhase: draft.ampsPerPhase,
        ampAllPhases: draft.ampsPerPhase * phases,
      };
    }
    const existing = siteAreas.find((area) => area.siteAreaId === id);
    if (!existing) return null;
    const ampAllPhases =
      existing.maxAmp !== null && existing.numberOfPhases !== null
        ? existing.maxAmp * existing.numberOfPhases
        : null;
    return {
      name: existing.siteAreaName,
      voltage: existing.voltage,
      numberOfPhasesLabel: formatPhases(existing.numberOfPhases),
      maxPowerKw: existing.maxPower,
      ampPerPhase: existing.maxAmp,
      ampAllPhases,
    };
  }

  const isKnownExistingArea = siteAreas.some((area) => area.siteAreaId === session.selectedSiteAreaId);
  const [pendingSelection, setPendingSelection] = useState<string>(
    siteAreas.length > 1 && isKnownExistingArea ? session.selectedSiteAreaId ?? "" : "",
  );

  // A single-area site has nothing to choose — it's selected automatically
  // (DESIGN-HANDOFF.md §2.5, "One area" variant).
  useEffect(() => {
    if (!session.installed && siteAreas.length === 1 && session.selectedSiteAreaId !== siteAreas[0].siteAreaId) {
      setSelectedSiteArea(siteAreas[0].siteAreaId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.installed, siteAreas, session.selectedSiteAreaId]);

  function handleBack() {
    navigate("/validate-charger-details");
  }

  function handleContinue() {
    if (siteAreas.length > 1) {
      if (!pendingSelection) return;
      setSelectedSiteArea(pendingSelection);
    }
    navigate("/charger-electrical");
  }

  // "Already installed" variant (DESIGN-HANDOFF.md §2.5 / KNOWN-LIMITATIONS
  // #8): once this session has completed an install, the chosen area is
  // locked and read-only, reachable only by navigating Back from a later
  // screen.
  if (session.installed) {
    const lockedArea = resolveSiteArea(session.selectedSiteAreaId);
    return (
      <AppLayout
        title="Site Information"
        onBack={handleBack}
        stepper={{ steps: FLOW_STEPS, currentIndex: 3 }}
        footer={
          <Button fullWidth onClick={handleContinue}>
            Next
          </Button>
        }
      >
        <div className={formStyles.stack}>
          <ErrorBanner
            tone="warning"
            title="Already installed"
            description="This charger is already installed. Contact support to change these details."
          />
          {lockedArea ? (
            <CapacityPanel area={lockedArea} />
          ) : (
            <p className={formStyles.subheading}>Site area details aren't available for this session.</p>
          )}
        </div>
      </AppLayout>
    );
  }

  if (siteAreas.length === 1) {
    const area = resolveSiteArea(siteAreas[0].siteAreaId);
    return (
      <AppLayout
        title="Site Information"
        onBack={handleBack}
        stepper={{ steps: FLOW_STEPS, currentIndex: 3 }}
        footer={
          <Button fullWidth onClick={handleContinue}>
            Next
          </Button>
        }
      >
        <div className={formStyles.stack}>
          <Heading level={1}>Site: {siteName}</Heading>
          <Heading level={2}>Site Area: {area?.name ?? siteAreas[0].siteAreaName}</Heading>
          {area && <CapacityPanel area={area} />}
        </div>
      </AppLayout>
    );
  }

  // Several areas: a required dropdown, the picked area's capacity below it,
  // and a link out to Create Site Area.
  const selectedArea = resolveSiteArea(pendingSelection || null);
  const options = siteAreas.map((area) => ({ value: area.siteAreaId, label: area.siteAreaName }));

  return (
    <AppLayout
      title="Site Information"
      onBack={handleBack}
      stepper={{ steps: FLOW_STEPS, currentIndex: 3 }}
      footer={
        <Button fullWidth disabled={!pendingSelection} onClick={handleContinue}>
          Next
        </Button>
      }
    >
      <div className={formStyles.stack}>
        <Heading level={1}>Site: {siteName}</Heading>

        <SelectField<string>
          label="Select Site Area"
          placeholder="Choose a site area"
          options={options}
          value={pendingSelection}
          onValueChange={setPendingSelection}
          required
        />

        {selectedArea && <CapacityPanel area={selectedArea} />}

        <button type="button" className={formStyles.dashedAddRow} onClick={() => navigate("/site-area/new")}>
          Can't find your site area? Create new site area
        </button>
      </div>
    </AppLayout>
  );
}
