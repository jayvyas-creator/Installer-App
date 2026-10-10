import { AlertTriangle, XCircle } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/atoms/Button";
import { ProgressRing } from "@/components/atoms/ProgressRing";
import { SuccessCheck } from "@/components/atoms/SuccessCheck";
import styles from "./OutcomePanel.module.css";

export type OutcomeTone = "success" | "error" | "warning" | "pending";

export interface OutcomeAction {
  label: string;
  onClick: () => void;
  loading?: boolean;
}

export interface OutcomePanelProps {
  tone: OutcomeTone;
  title: string;
  description: string;
  primaryAction?: OutcomeAction;
  secondaryAction?: OutcomeAction;
  children?: ReactNode;
}

function ToneIcon({ tone }: { tone: OutcomeTone }) {
  switch (tone) {
    case "success":
      return <SuccessCheck size={48} />;
    case "error":
      return <XCircle size={40} strokeWidth={1.75} />;
    case "warning":
      return <AlertTriangle size={40} strokeWidth={1.75} />;
    case "pending":
      return <ProgressRing size={44} strokeWidth={4} />;
  }
}

export function OutcomePanel({
  tone,
  title,
  description,
  primaryAction,
  secondaryAction,
  children,
}: OutcomePanelProps) {
  return (
    <div className={styles.panel} role={tone === "error" || tone === "warning" ? "alert" : "status"}>
      <div className={styles.iconWrap} data-tone={tone}>
        <ToneIcon tone={tone} />
      </div>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.description}>{description}</p>
      {children && <div className={styles.extra}>{children}</div>}
      {(primaryAction || secondaryAction) && (
        <div className={styles.actions}>
          {primaryAction && (
            <Button
              fullWidth
              variant={tone === "error" ? "danger" : "primary"}
              onClick={primaryAction.onClick}
              loading={primaryAction.loading}
            >
              {primaryAction.label}
            </Button>
          )}
          {secondaryAction && (
            <Button fullWidth variant="ghost" onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
