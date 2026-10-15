import { AppLayout } from "@/components/templates/AppLayout";
import { OutcomePanel } from "@/components/molecules/OutcomePanel";
import { useInstallFlow } from "@/state/InstallFlowContext";
import { useHistorySync } from "@/navigation/useHistorySync";

// DESIGN-HANDOFF.md "Screens reached from routing" > "No EV Charger Found":
// the backend rejected the charger or token. resolveRoute sends both
// EnterTokenIdPage's lookup failure and any unrecognised backend status here.
export function NoEvChargerFoundPage() {
  const navigate = useHistorySync();
  const { reset } = useInstallFlow();

  return (
    <AppLayout showHelp>
      <OutcomePanel
        tone="error"
        title="No EV Charger Found"
        description="We couldn't find this charger. Check the Charger ID and Token ID, or scan a different QR code."
        primaryAction={{
          label: "Try again",
          onClick: () => navigate("/enter-token"),
        }}
        secondaryAction={{
          label: "Back to Home",
          onClick: () => {
            reset();
            navigate("/");
          },
        }}
      >
        <p>
          Need help? Call{" "}
          <a href="tel:+13234882846">+1 323-488-2846</a>
        </p>
      </OutcomePanel>
    </AppLayout>
  );
}
