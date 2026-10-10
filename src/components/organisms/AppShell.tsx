import { ChevronLeft, Headphones } from "lucide-react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { IconButton } from "@/components/atoms/IconButton";
import { Stepper, type StepperProps } from "@/components/molecules/Stepper";
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
        <div className={styles.inner}>{children}</div>
      </div>
      {footer && (
        <div className={styles.footerBar}>
          <div className={styles.footerInner}>{footer}</div>
        </div>
      )}
    </div>
  );
}
