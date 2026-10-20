import { useTranslation } from "react-i18next";
import { AppShell } from "@/components/organisms/AppShell";
import { OutcomePanel } from "@/components/molecules/OutcomePanel";
import { useHistorySync } from "@/navigation/useHistorySync";
import styles from "@/styles/outcome.module.css";

// DESIGN-HANDOFF.md §2.8: a single confirmation state, no Back button, Next
// goes to the Communication Checklist.
export function InstallationSuccessPage() {
  const { t } = useTranslation();
  const navigate = useHistorySync();

  return (
    <AppShell title={t("installationSuccess.title")} backDisabled>
      <div className={styles.wrap}>
        <OutcomePanel
          tone="success"
          title={t("installationSuccess.heading")}
          description={t("installationSuccess.description")}
          primaryAction={{
            label: t("installationSuccess.continue"),
            onClick: () => navigate("/communication-checklist"),
          }}
        />
      </div>
    </AppShell>
  );
}
