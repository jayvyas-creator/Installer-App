import { AppShell } from "@/components/organisms/AppShell";
import { Button } from "@/components/atoms/Button";
import { ChecklistItem } from "@/components/molecules/ChecklistItem";
import { useInstallFlow } from "@/state/InstallFlowContext";
import { useHistorySync } from "@/navigation/useHistorySync";
import { FLOW_STEPS } from "@/constants/flowSteps";
import { PHYSICAL_HEALTH_CHECKLIST_ITEMS } from "@/constants/mockData";
import formStyles from "./shared/form.module.css";

// DESIGN-HANDOFF.md §2.11: a 30-item physical inspection checklist. "Nothing
// is sent to the backend from this screen" — Next is a plain local
// navigation to Automated OCPP Testing, which is the screen that actually
// records the hardware check with the backend on open.
export function PhysicalHealthinessPage() {
  const go = useHistorySync();
  const { session, togglePhysicalChecklistItem } = useInstallFlow();

  const allChecked = PHYSICAL_HEALTH_CHECKLIST_ITEMS.every(
    (item) => session.physicalChecklistProgress[item.key],
  );

  return (
    <AppShell
      title="Physical Healthiness"
      onBack={() => go("/communication-checklist")}
      stepper={{ steps: FLOW_STEPS, currentIndex: 7 }}
      footer={
        <Button fullWidth size="lg" disabled={!allChecked} onClick={() => go("/ocpp-testing")}>
          Next
        </Button>
      }
    >
      <div className={formStyles.stack}>
        <div className={formStyles.intro}>
          <h1 className={formStyles.heading}>Physical Healthiness</h1>
          <p className={formStyles.subheading}>Please validate the following:</p>
        </div>

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
          {allChecked ? "All items checked. You can continue." : ""}
        </span>
      </div>
    </AppShell>
  );
}
