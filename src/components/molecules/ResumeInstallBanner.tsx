import { History } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/atoms/Button";
import styles from "./ResumeInstallBanner.module.css";

/** Canvas: tempo/designs/canvases/dynachrg-flow, storyboard "HomeWithDraft". */
export interface ResumeInstallBannerProps {
  chargerId: string;
  installerName: string;
  onResume: () => void;
  onDiscard: () => void;
}

export function ResumeInstallBanner({
  chargerId,
  installerName,
  onResume,
  onDiscard,
}: ResumeInstallBannerProps) {
  const { t } = useTranslation();
  return (
    <div className={styles.banner} role="status">
      <div className={styles.iconWrap} aria-hidden>
        <History size={20} />
      </div>
      <div className={styles.texts}>
        <span className={styles.title}>{t("resumeInstallBanner.title")}</span>
        <span className={styles.description}>
          {t("resumeInstallBanner.description", { chargerId, installerName })}
        </span>
      </div>
      <div className={styles.actions}>
        <Button size="md" variant="secondary" onClick={onResume}>
          {t("resumeInstallBanner.resume")}
        </Button>
        <Button size="md" variant="ghost" onClick={onDiscard}>
          {t("resumeInstallBanner.startNew")}
        </Button>
      </div>
    </div>
  );
}
