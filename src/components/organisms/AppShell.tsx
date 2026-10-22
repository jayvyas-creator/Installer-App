import { ChevronLeft, Headphones } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";
import { useTranslation } from "react-i18next";
import { IconButton } from "@/components/atoms/IconButton";
import { Stepper, type StepperProps } from "@/components/molecules/Stepper";
import { ErrorBanner } from "@/components/molecules/ErrorBanner";
import styles from "./AppShell.module.css";

export interface AppShellProps {
  title?: string;
  onBack?: () => void;
  backDisabled?: boolean;
  showHelp?: boolean;
  stepper?: StepperProps;
  footer?: ReactNode;
  children: ReactNode;
}

export function AppShell({
  title,
  onBack,
  backDisabled = false,
  showHelp = true,
  stepper,
  footer,
  children,
}: AppShellProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isOffline, setIsOffline] = useState(
    () => typeof navigator !== "undefined" && !navigator.onLine,
  );

  useEffect(() => {
    function handleOffline() {
      setIsOffline(true);
    }
    function handleOnline() {
      setIsOffline(false);
      toast(t("appShell.backOnline"));
    }
    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);
    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, [t]);

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.headerSide}>
          {onBack && !backDisabled && (
            <IconButton aria-label={t("appShell.goBack")} tone="subtle" onClick={onBack}>
              <ChevronLeft size={22} />
            </IconButton>
          )}
        </div>
        <div className={styles.title}>{title}</div>
        <div className={[styles.headerSide, styles.end].join(" ")}>
          {showHelp && (
            <IconButton
              aria-label={t("appShell.helpAndSupport")}
              tone="subtle"
              onClick={() => navigate("/help")}
            >
              <Headphones size={20} />
            </IconButton>
          )}
        </div>
      </header>
      {stepper && (
        <div className={styles.stepperWrap}>
          <Stepper {...stepper} />
        </div>
      )}
      <main className={styles.content}>
        <div className={styles.inner}>
          {isOffline && (
            <div className={styles.offlineBanner}>
              <ErrorBanner
                tone="warning"
                title={t("appShell.offlineTitle")}
                description={t("appShell.offlineDescription")}
              />
            </div>
          )}
          {children}
        </div>
      </main>
      {footer && (
        <div className={styles.footerBar}>
          <div className={styles.footerInner}>{footer}</div>
        </div>
      )}
      <Toaster
        position="top-center"
        offset={{ top: "calc(3.5rem + var(--space-3))" }}
        mobileOffset={{ top: "calc(3.5rem + var(--space-3))" }}
        className={styles.toaster}
        toastOptions={{ classNames: { toast: styles.toast } }}
      />
    </div>
  );
}
