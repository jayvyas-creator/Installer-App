import { useNavigate } from "react-router-dom";
import { AppShell } from "@/components/organisms/AppShell";
import { OutcomePanel } from "@/components/molecules/OutcomePanel";
import styles from "@/styles/outcome.module.css";

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <AppShell title="Page not found" backDisabled>
      <div className={styles.wrap}>
        <OutcomePanel
          tone="warning"
          title="Page not found"
          description="That address doesn't match a step in the install flow. Head back to the start and pick up from there."
          primaryAction={{ label: "Go to Home", onClick: () => navigate("/") }}
        />
      </div>
    </AppShell>
  );
}
