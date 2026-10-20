import { useNavigate } from "react-router-dom";
import { Globe, Phone } from "lucide-react";
import { useTranslation } from "react-i18next";
import { AppShell } from "@/components/organisms/AppShell";
import { CollapsiblePanel } from "@/components/molecules/CollapsiblePanel";
import { FAQ_GROUPS, SUPPORT_PHONE, SUPPORT_WEBSITE } from "@/constants/helpContent";
import formStyles from "./shared/form.module.css";
import styles from "./HelpPage.module.css";

// DESIGN-HANDOFF.md "Help": opened from the header on any screen except
// Processing. A Back link returns to the screen it was opened from, then a
// "Need Further Assistance?" card, then two FAQ groups.
export function HelpPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <AppShell title={t("help.title")} onBack={() => navigate(-1)} showHelp={false}>
      <div className={formStyles.stack}>
        <div className={styles.supportCard}>
          <span className={styles.supportTitle}>{t("help.needFurtherAssistance")}</span>
          <a className={styles.supportRow} href={`https://${SUPPORT_WEBSITE}`} target="_blank" rel="noreferrer">
            <Globe size={16} aria-hidden />
            {SUPPORT_WEBSITE}
          </a>
          <a className={styles.supportRow} href={`tel:${SUPPORT_PHONE.replace(/[^+\d]/g, "")}`}>
            <Phone size={16} aria-hidden />
            {SUPPORT_PHONE}
          </a>
        </div>

        {FAQ_GROUPS.map((group) => (
          <div key={group.title} className={formStyles.list}>
            <h2 className={styles.groupTitle}>{group.title}</h2>
            {group.entries.map((entry) => (
              <CollapsiblePanel key={entry.question} trigger={entry.question}>
                {entry.answer}
              </CollapsiblePanel>
            ))}
          </div>
        ))}
      </div>
    </AppShell>
  );
}
