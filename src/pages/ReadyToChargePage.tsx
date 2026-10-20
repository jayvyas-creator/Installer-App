import { useTranslation } from "react-i18next";
import { AppShell } from "@/components/organisms/AppShell";
import { OutcomePanel } from "@/components/molecules/OutcomePanel";
import { useInstallFlow } from "@/state/InstallFlowContext";
import { useHistorySync } from "@/navigation/useHistorySync";
import styles from "@/styles/outcome.module.css";
import pageStyles from "./ReadyToChargePage.module.css";

// DESIGN-HANDOFF.md "Screens reached from routing" > Ready to Charge: reached
// when the charger's status is already "Active" (resolveRoute.ts) — there is
// nothing left to install, so this is informational only.
const APP_STORE_URL = "https://apps.apple.com/app/dynachrg-payg";
const GOOGLE_PLAY_URL = "https://play.google.com/store/apps/details?id=com.dynachrg.payg";

export function ReadyToChargePage() {
  const { t } = useTranslation();
  const navigate = useHistorySync();
  const { reset } = useInstallFlow();

  function handleBackToHome() {
    reset();
    navigate("/");
  }

  return (
    <AppShell title={t("readyToCharge.title")} backDisabled showHelp={false}>
      <div className={styles.wrap}>
        <OutcomePanel
          tone="success"
          title={t("readyToCharge.title")}
          description={t("readyToCharge.description")}
          primaryAction={{ label: t("readyToCharge.backToHome"), onClick: handleBackToHome }}
        >
          <div className={pageStyles.storeLinks}>
            <a className={pageStyles.storeLink} href={APP_STORE_URL} target="_blank" rel="noreferrer">
              {t("readyToCharge.appStore")}
            </a>
            <a className={pageStyles.storeLink} href={GOOGLE_PLAY_URL} target="_blank" rel="noreferrer">
              {t("readyToCharge.googlePlay")}
            </a>
          </div>
        </OutcomePanel>
      </div>
    </AppShell>
  );
}
