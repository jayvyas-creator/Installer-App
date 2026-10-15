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
  const navigate = useHistorySync();
  const { reset } = useInstallFlow();

  function handleBackToHome() {
    reset();
    navigate("/");
  }

  return (
    <AppShell title="Ready to Charge" backDisabled showHelp={false}>
      <div className={styles.wrap}>
        <OutcomePanel
          tone="success"
          title="Ready to Charge"
          description="To start charging, download the DynaChrg PayG app from the App Store or Google Play."
          primaryAction={{ label: "Back to Home", onClick: handleBackToHome }}
        >
          <div className={pageStyles.storeLinks}>
            <a className={pageStyles.storeLink} href={APP_STORE_URL} target="_blank" rel="noreferrer">
              App Store
            </a>
            <a className={pageStyles.storeLink} href={GOOGLE_PLAY_URL} target="_blank" rel="noreferrer">
              Google Play
            </a>
          </div>
        </OutcomePanel>
      </div>
    </AppShell>
  );
}
