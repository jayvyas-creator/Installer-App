import { useTranslation } from "react-i18next";
import { AppLayout } from "@/components/templates/AppLayout";
import { OutcomePanel } from "@/components/molecules/OutcomePanel";
import { useInstallFlow } from "@/state/InstallFlowContext";
import { useHistorySync } from "@/navigation/useHistorySync";

// DESIGN-HANDOFF.md "Screens reached from routing" > "No EV Charger Found":
// the backend rejected the charger or token. resolveRoute sends both
// EnterTokenIdPage's lookup failure and any unrecognised backend status here.
export function NoEvChargerFoundPage() {
  const { t } = useTranslation();
  const navigate = useHistorySync();
  const { reset } = useInstallFlow();

  return (
    <AppLayout showHelp>
      <OutcomePanel
        tone="error"
        title={t("noEvChargerFound.title")}
        description={t("noEvChargerFound.description")}
        primaryAction={{
          label: t("noEvChargerFound.tryAgain"),
          onClick: () => navigate("/enter-token"),
        }}
        secondaryAction={{
          label: t("noEvChargerFound.backToHome"),
          onClick: () => {
            reset();
            navigate("/");
          },
        }}
      >
        <p>
          {t("noEvChargerFound.needHelp")}{" "}
          <a href="tel:+13234882846">+1 323-488-2846</a>
        </p>
      </OutcomePanel>
    </AppLayout>
  );
}
