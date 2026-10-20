import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AppShell } from "@/components/organisms/AppShell";
import { Button } from "@/components/atoms/Button";
import { ChecklistItem } from "@/components/molecules/ChecklistItem";
import { OutcomePanel } from "@/components/molecules/OutcomePanel";
import { useInstallFlow } from "@/state/InstallFlowContext";
import { useHistorySync } from "@/navigation/useHistorySync";
import { FLOW_STEPS } from "@/constants/flowSteps";
import { COMMUNICATION_CHECKLIST_ITEMS } from "@/constants/mockData";
import formStyles from "./shared/form.module.css";
import outcomeStyles from "@/styles/outcome.module.css";
import styles from "./CommunicationChecklistPage.module.css";

interface CommunicationChecklistLocationState {
  checkError?: string;
}

// DESIGN-HANDOFF.md §2.9: a local gate (nothing sent to the backend here) in
// front of the Processing screen, which is the thing that actually records
// the communication check. §3's "No Heartbeat Received!" panel "shows on
// every failure", so any error Processing bounces back with lands here
// verbatim, not just a literal heartbeat timeout.
export function CommunicationChecklistPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const go = useHistorySync();
  const location = useLocation();
  const { session, toggleChecklistItem } = useInstallFlow();

  const [checkError, setCheckError] = useState<string | null>(
    () => (location.state as CommunicationChecklistLocationState | null)?.checkError ?? null,
  );

  // Consume the router state once so a later refresh/back-nav to this route
  // doesn't resurrect a stale error panel.
  useEffect(() => {
    if (location.state) {
      navigate(location.pathname, { replace: true, state: null });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const allChecked = COMMUNICATION_CHECKLIST_ITEMS.every(
    (item) => session.checklistProgress[item.key],
  );

  return (
    <AppShell
      title={t("communicationChecklist.title")}
      onBack={() => go("/installation-success")}
      stepper={{ steps: FLOW_STEPS, currentIndex: 6 }}
      footer={
        !checkError && (
          <Button fullWidth size="lg" disabled={!allChecked} onClick={() => go("/processing")}>
            {t("communicationChecklist.next")}
          </Button>
        )
      }
    >
      {checkError ? (
        <div className={outcomeStyles.wrap}>
          <OutcomePanel
            tone="error"
            title={t("communicationChecklist.noHeartbeatTitle")}
            description={t("communicationChecklist.noHeartbeatDescription")}
            primaryAction={{ label: t("communicationChecklist.tryAgain"), onClick: () => go("/processing") }}
            secondaryAction={{ label: t("communicationChecklist.cancel"), onClick: () => setCheckError(null) }}
          >
            <p className={styles.detailLine}>{checkError}</p>
            <ul className={styles.tipsList}>
              <li>{t("communicationChecklist.tipNetwork")}</li>
              <li>{t("communicationChecklist.tipHardReset")}</li>
            </ul>
            <p className={styles.footerNote}>
              {t("communicationChecklist.contactCpo")}{" "}
              <a href="tel:+13234882092">(323) 488-2092</a>
            </p>
          </OutcomePanel>
        </div>
      ) : (
        <div className={formStyles.stack}>
          <div className={formStyles.intro}>
            <h1 className={formStyles.heading}>{t("communicationChecklist.heading")}</h1>
            <p className={formStyles.subheading}>{t("communicationChecklist.subheading")}</p>
          </div>

          <div className={formStyles.list}>
            {COMMUNICATION_CHECKLIST_ITEMS.map((item) => (
              <ChecklistItem
                key={item.key}
                label={item.label}
                description={item.description}
                checked={Boolean(session.checklistProgress[item.key])}
                onToggle={() => toggleChecklistItem(item.key)}
              />
            ))}
          </div>

          <span className="sr-only" role="status" aria-live="polite">
            {allChecked ? t("communicationChecklist.allCheckedStatus") : ""}
          </span>
        </div>
      )}
    </AppShell>
  );
}
