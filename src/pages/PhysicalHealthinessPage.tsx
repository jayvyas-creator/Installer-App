import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AppShell } from "@/components/organisms/AppShell";
import { Button } from "@/components/atoms/Button";
import { ChecklistItem } from "@/components/molecules/ChecklistItem";
import { ErrorBanner } from "@/components/molecules/ErrorBanner";
import { useInstallFlow } from "@/state/InstallFlowContext";
import { useHistorySync } from "@/navigation/useHistorySync";
import { FLOW_STEPS } from "@/constants/flowSteps";
import { PHYSICAL_HEALTH_CHECKLIST_ITEMS } from "@/constants/mockData";
import { commissioningFlow } from "@/flows/commissioningFlow";
import formStyles from "./shared/form.module.css";

// DESIGN-HANDOFF.md §2.11: a 30-item physical inspection checklist. Next
// records the hardware check with the backend directly (ChargerHWCheckComplete)
// — a "Saving…" state while it's in flight, and a failed save leaves the
// checklist ticks alone so Next can simply be pressed again to retry.
export function PhysicalHealthinessPage() {
  const { t } = useTranslation();
  const go = useHistorySync();
  const { session, togglePhysicalChecklistItem, setStatus } = useInstallFlow();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const allChecked = PHYSICAL_HEALTH_CHECKLIST_ITEMS.every(
    (item) => session.physicalChecklistProgress[item.key],
  );

  async function handleNext() {
    if (!session.installerToken) {
      setError(t("physicalHealthiness.sessionExpired"));
      return;
    }
    setSaving(true);
    setError(null);
    const result = await commissioningFlow(
      session.chargerId,
      session.installerToken,
      "ChargerHWCheckComplete",
      session.siteAreas.length,
    );
    if (!result.ok) {
      setError(result.error);
      setSaving(false);
      return;
    }
    setStatus({ status: "Installed", installationStep: "ChargerHWCheckComplete" });
    go("/ocpp-testing");
  }

  return (
    <AppShell
      title={t("physicalHealthiness.title")}
      onBack={() => go("/communication-checklist")}
      backDisabled={saving}
      stepper={{ steps: FLOW_STEPS, currentIndex: 7 }}
      footer={
        <Button fullWidth size="lg" disabled={!allChecked || saving} loading={saving} onClick={handleNext}>
          {saving ? t("physicalHealthiness.saving") : t("physicalHealthiness.next")}
        </Button>
      }
    >
      <div className={formStyles.stack}>
        <div className={formStyles.intro}>
          <h1 className={formStyles.heading}>{t("physicalHealthiness.heading")}</h1>
          <p className={formStyles.subheading}>{t("physicalHealthiness.subheading")}</p>
        </div>

        {error && <ErrorBanner title={t("physicalHealthiness.saveFailedTitle")} description={error} />}

        <div className={formStyles.list}>
          {PHYSICAL_HEALTH_CHECKLIST_ITEMS.map((item) => (
            <ChecklistItem
              key={item.key}
              label={item.label}
              checked={Boolean(session.physicalChecklistProgress[item.key])}
              onToggle={() => togglePhysicalChecklistItem(item.key)}
            />
          ))}
        </div>

        <span className="sr-only" role="status" aria-live="polite">
          {allChecked ? t("physicalHealthiness.allCheckedStatus") : ""}
        </span>
      </div>
    </AppShell>
  );
}
