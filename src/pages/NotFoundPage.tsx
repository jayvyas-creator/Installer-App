import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AppShell } from "@/components/organisms/AppShell";
import { OutcomePanel } from "@/components/molecules/OutcomePanel";
import styles from "@/styles/outcome.module.css";

export function NotFoundPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <AppShell title={t("notFound.title")} backDisabled>
      <div className={styles.wrap}>
        <OutcomePanel
          tone="warning"
          title={t("notFound.title")}
          description={t("notFound.description")}
          primaryAction={{ label: t("notFound.goToHome"), onClick: () => navigate("/") }}
        />
      </div>
    </AppShell>
  );
}
