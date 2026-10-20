import { useTranslation } from "react-i18next";
import { AppLayout } from "@/components/templates/AppLayout";
import { OutcomePanel } from "@/components/molecules/OutcomePanel";
import { useInstallFlow } from "@/state/InstallFlowContext";
import { useHistorySync } from "@/navigation/useHistorySync";

// CLAUDE.md §6 routing table: a "Commissioned" status means this charger is
// already live and fully set up elsewhere — there's nothing left to install,
// so unlike No EV Charger Found there's no retry action, only a way home.
export function ChargerCommissionedPage() {
  const { t } = useTranslation();
  const navigate = useHistorySync();
  const { reset } = useInstallFlow();

  return (
    <AppLayout showHelp>
      <OutcomePanel
        tone="warning"
        title={t("chargerCommissioned.title")}
        description={t("chargerCommissioned.description")}
        primaryAction={{
          label: t("chargerCommissioned.backToHome"),
          onClick: () => {
            reset();
            navigate("/");
          },
        }}
      />
    </AppLayout>
  );
}
