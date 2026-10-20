import { Component, Fragment, type ErrorInfo, type ReactNode } from "react";
import { AppShell } from "@/components/organisms/AppShell";
import { OutcomePanel } from "@/components/molecules/OutcomePanel";
import i18n from "@/i18n";
import styles from "@/styles/outcome.module.css";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
  resetKey: number;
}

/**
 * Catches render errors anywhere in the wrapped tree and shows a recovery
 * screen styled like the rest of the app, instead of a blank page or the
 * default React crash overlay.
 *
 * Placement (see App.tsx): this boundary sits INSIDE InstallFlowProvider,
 * wrapping only the route tree. A render error is almost always caused by
 * one page, not the install-flow state itself, so "Try again" only needs to
 * remount the routes, not the provider above it. That keeps the in-progress
 * install (charger ID, site, electrical config, etc.) intact across a
 * recovered error, instead of silently wiping it the way a boundary placed
 * above the provider would.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null, resetKey: 0 };

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Unhandled error in app tree:", error, info.componentStack);
  }

  private handleRetry = () => {
    this.setState((prev) => ({ error: null, resetKey: prev.resetKey + 1 }));
  };

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    const { error, resetKey } = this.state;

    if (error) {
      return (
        <AppShell title={i18n.t("errorBoundary.title")} backDisabled showHelp={false}>
          <div className={styles.wrap}>
            <OutcomePanel
              tone="error"
              title={i18n.t("errorBoundary.heading")}
              description={i18n.t("errorBoundary.description")}
              primaryAction={{ label: i18n.t("errorBoundary.tryAgain"), onClick: this.handleRetry }}
              secondaryAction={{ label: i18n.t("errorBoundary.reloadApp"), onClick: this.handleReload }}
            />
          </div>
        </AppShell>
      );
    }

    return <Fragment key={resetKey}>{this.props.children}</Fragment>;
  }
}
