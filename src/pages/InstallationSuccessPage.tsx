import { AppShell } from "@/components/organisms/AppShell";
import { OutcomePanel } from "@/components/molecules/OutcomePanel";
import { useHistorySync } from "@/navigation/useHistorySync";
import styles from "@/styles/outcome.module.css";

// DESIGN-HANDOFF.md §2.8: a single confirmation state, no Back button, Next
// goes to the Communication Checklist.
export function InstallationSuccessPage() {
  const navigate = useHistorySync();

  return (
    <AppShell title="Installation Success" backDisabled>
      <div className={styles.wrap}>
        <OutcomePanel
          tone="success"
          title="Charger successfully installed"
          description="Congratulations on successfully completing all the setup steps! You can now proceed to the Communication Checklist to ensure everything is connected and ready for use."
          primaryAction={{
            label: "Continue",
            onClick: () => navigate("/communication-checklist"),
          }}
        />
      </div>
    </AppShell>
  );
}
