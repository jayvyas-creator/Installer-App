import { useNavigate } from "react-router-dom";
import { AppShell } from "@/components/organisms/AppShell";
import { Button } from "@/components/atoms/Button";
import { ChecklistItem } from "@/components/molecules/ChecklistItem";
import { useInstallFlow } from "@/state/InstallFlowContext";
import { COMMUNICATION_CHECKLIST_ITEMS } from "@/constants/mockData";
import type { ProcessingState } from "./ProcessingPage";
import formStyles from "./shared/form.module.css";

export function CommunicationChecklistPage() {
  const navigate = useNavigate();
  const { state, toggleChecklistItem, stepOrder } = useInstallFlow();

  const allChecked = COMMUNICATION_CHECKLIST_ITEMS.every(
    (item) => state.checklistProgress[item.key],
  );

  function handleContinue() {
    const processingState: ProcessingState = {
      label: "Verifying communication…",
      sublabel: `Pinging ${state.chargerId} over the network`,
      durationMs: 1600,
      next: "/physical-healthiness",
      failure:
        state.failureMode === "COMMFAIL"
          ? {
              title: "Communication check failed",
              description:
                "The charger isn't responding on the network. Verify the cable and signal, then retry.",
              retryLabel: "Try again",
              secondaryLabel: "Review checklist",
              secondaryTo: "/communication-checklist",
            }
          : state.failureMode === "NOHEARTBEAT"
            ? {
                title: "No heartbeat received",
                description:
                  "The charger connected once but has stopped sending heartbeat signals. Power-cycle the unit and confirm the network light is solid before retrying.",
                retryLabel: "Retry heartbeat check",
                secondaryLabel: "Review checklist",
                secondaryTo: "/communication-checklist",
              }
            : undefined,
    };
    navigate("/processing", { state: processingState });
  }

  return (
    <AppShell
      title="Communication checklist"
      onBack={() => navigate("/installation-success")}
      backDisabled
      stepper={{ steps: [...stepOrder], currentIndex: 5 }}
      footer={
        <Button fullWidth size="lg" disabled={!allChecked} onClick={handleContinue}>
          Continue
        </Button>
      }
    >
      <div className={formStyles.stack}>
        <div className={formStyles.intro}>
          <h1 className={formStyles.heading}>Confirm the charger is online</h1>
          <p className={formStyles.subheading}>
            Walk through each item before we verify communication with the network.
          </p>
        </div>

        <div className={formStyles.list}>
          {COMMUNICATION_CHECKLIST_ITEMS.map((item) => (
            <ChecklistItem
              key={item.key}
              label={item.label}
              description={item.description}
              checked={Boolean(state.checklistProgress[item.key])}
              onToggle={() => toggleChecklistItem(item.key)}
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
