import { useNavigate } from "react-router-dom";
import { AppShell } from "@/components/organisms/AppShell";
import { Button } from "@/components/atoms/Button";
import { ChecklistItem } from "@/components/molecules/ChecklistItem";
import { useInstallFlow } from "@/state/InstallFlowContext";
import { PHYSICAL_HEALTH_CHECKLIST_ITEMS } from "@/constants/mockData";
import type { ProcessingState } from "./ProcessingPage";
import formStyles from "./shared/form.module.css";

export function PhysicalHealthinessPage() {
  const navigate = useNavigate();
  const { state, togglePhysicalChecklistItem, stepOrder } = useInstallFlow();

  const allChecked = PHYSICAL_HEALTH_CHECKLIST_ITEMS.every(
    (item) => state.physicalChecklistProgress[item.key],
  );

  function handleContinue() {
    const processingState: ProcessingState = {
      label: "Confirming physical inspection…",
      sublabel: "Logging hardware condition",
      durationMs: 1500,
      next: "/ocpp-testing",
      failure:
        state.failureMode === "HWFAIL"
          ? {
              title: "Hardware check failed",
              description:
                "One or more physical checks couldn't be confirmed. Re-inspect the unit and try again.",
              retryLabel: "Try again",
              secondaryLabel: "Review checklist",
              secondaryTo: "/physical-healthiness",
            }
          : undefined,
    };
    navigate("/processing", { state: processingState });
  }

  return (
    <AppShell
      title="Physical healthiness"
      backDisabled
      stepper={{ steps: [...stepOrder], currentIndex: 6 }}
      footer={
        <Button fullWidth size="lg" disabled={!allChecked} onClick={handleContinue}>
          Continue
        </Button>
      }
    >
      <div className={formStyles.stack}>
        <div className={formStyles.intro}>
          <h1 className={formStyles.heading}>Inspect the physical unit</h1>
          <p className={formStyles.subheading}>
            Confirm each item is in good condition before running automated tests.
          </p>
        </div>

        <div className={formStyles.list}>
          {PHYSICAL_HEALTH_CHECKLIST_ITEMS.map((item) => (
            <ChecklistItem
              key={item.key}
              label={item.label}
              description={item.description}
              checked={Boolean(state.physicalChecklistProgress[item.key])}
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
