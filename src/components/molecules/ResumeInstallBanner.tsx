import { History } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import styles from "./ResumeInstallBanner.module.css";

/** Canvas: tempo/designs/canvases/dynachrg-flow — storyboard "HomeWithDraft". */
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
  return (
    <div className={styles.banner} role="status">
      <div className={styles.iconWrap} aria-hidden>
        <History size={20} />
      </div>
      <div className={styles.texts}>
        <span className={styles.title}>Resume install in progress</span>
        <span className={styles.description}>
          {chargerId} — started by {installerName}. Pick up where you left off, or start over.
        </span>
      </div>
      <div className={styles.actions}>
        <Button size="md" variant="secondary" onClick={onResume}>
          Resume
        </Button>
        <Button size="md" variant="ghost" onClick={onDiscard}>
          Start new
        </Button>
      </div>
    </div>
  );
}
