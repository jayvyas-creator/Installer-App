import { useTranslation } from "react-i18next";
import { AppLayout } from "@/components/templates/AppLayout";
import { OutcomePanel } from "@/components/molecules/OutcomePanel";
import { useInstallFlow } from "@/state/InstallFlowContext";
import { useHistorySync } from "@/navigation/useHistorySync";
import { SUPPORT_PHONE } from "@/constants/helpContent";

// CLAUDE.md §6 routing table: a "Faulted" status means the charger itself is
// reporting a fault — this isn't something a retry on this screen can fix,
// so the only actions are calling support or heading home.
export function ChargerUnavailablePage() {
  const { t } = useTranslation();
  const navigate = useHistorySync();
  const { reset } = useInstallFlow();

  return (
    <AppLayout showHelp>
      <OutcomePanel
        tone="error"
        title={t("chargerUnavailable.title")}
        description={t("chargerUnavailable.description")}
        primaryAction={{
          label: t("chargerUnavailable.backToHome"),
          onClick: () => {
            reset();
            navigate("/");
          },
        }}
      >
        <p>
          {t("chargerUnavailable.needHelp")}{" "}
          <a href={`tel:${SUPPORT_PHONE.replace(/[^+\d]/g, "")}`}>{SUPPORT_PHONE}</a>
        </p>
      </OutcomePanel>
    </AppLayout>
  );
}
