import { useNavigate } from "react-router-dom";
import { Mail, Phone } from "lucide-react";
import { AppShell } from "@/components/organisms/AppShell";
import { CollapsiblePanel } from "@/components/molecules/CollapsiblePanel";
import { FAQ_ENTRIES, SUPPORT_EMAIL, SUPPORT_PHONE } from "@/constants/helpContent";
import formStyles from "./shared/form.module.css";
import styles from "./HelpPage.module.css";

export function HelpPage() {
  const navigate = useNavigate();

  return (
    <AppShell title="Help & support" onBack={() => navigate(-1)} showHelp={false}>
      <div className={formStyles.stack}>
        <div className={formStyles.intro}>
          <h1 className={formStyles.heading}>Frequently asked questions</h1>
        </div>

        <div className={formStyles.list}>
          {FAQ_ENTRIES.map((entry) => (
            <CollapsiblePanel key={entry.question} trigger={entry.question}>
              {entry.answer}
            </CollapsiblePanel>
          ))}
        </div>

        <div className={styles.supportCard}>
          <span className={styles.supportTitle}>Still stuck?</span>
          <span className={styles.supportRow}>
            <Phone size={16} aria-hidden />
            {SUPPORT_PHONE}
          </span>
          <span className={styles.supportRow}>
            <Mail size={16} aria-hidden />
            {SUPPORT_EMAIL}
          </span>
        </div>
      </div>
    </AppShell>
  );
}
