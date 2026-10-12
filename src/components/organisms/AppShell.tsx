import { ChevronLeft, Headphones } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { IconButton } from "@/components/atoms/IconButton";
import { Stepper, type StepperProps } from "@/components/molecules/Stepper";
import { ErrorBanner } from "@/components/molecules/ErrorBanner";
import { Toast } from "@/components/molecules/Toast";
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
  const [isOffline, setIsOffline] = useState(
    () => typeof navigator !== "undefined" && !navigator.onLine,
  );
  const [showBackOnline, setShowBackOnline] = useState(false);

  useEffect(() => {
    function handleOffline() {
      setIsOffline(true);
    }
    function handleOnline() {
      setIsOffline(false);
      setShowBackOnline(true);
      window.setTimeout(() => setShowBackOnline(false), 3200);
    }
    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);
    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.headerSide}>
          {onBack && !backDisabled && (
            <IconButton aria-label="Go back" tone="subtle" onClick={onBack}>
              <ChevronLeft size={22} />
            </IconButton>
          )}
        </div>
        <div className={styles.title}>{title}</div>
        <div className={[styles.headerSide, styles.end].join(" ")}>
          {showHelp && (
            <IconButton
              aria-label="Help and support"
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
      <div className={styles.content}>
        <div className={styles.inner}>
          {isOffline && (
            <div className={styles.offlineBanner}>
              <ErrorBanner
                tone="warning"
                title="You're offline"
                description="Check your connection — you can keep working, and we'll pick back up once you're back online."
              />
            </div>
          )}
          {children}
        </div>
      </div>
      {footer && (
        <div className={styles.footerBar}>
          <div className={styles.footerInner}>{footer}</div>
        </div>
      )}
      <Toast open={showBackOnline} message="Back online." />
    </div>
  );
}
