import { Radio } from "lucide-react";
import { StatusPill } from "../../../../src/components/atoms/StatusPill";
import { SuccessCheck } from "../../../../src/components/atoms/SuccessCheck";
import { Tooltip } from "../../../../src/components/atoms/Tooltip";
import { ErrorBanner } from "../../../../src/components/molecules/ErrorBanner";
import { PulsingBadge } from "../../../../src/components/atoms/PulsingBadge";
import { PageFrame, StatCard } from "./Chrome";

export function BoardIntro() {
  return (
    <PageFrame>
      <div className="flex flex-col gap-6" style={{ maxWidth: 640 }}>
        <div
          className="uppercase tracking-widest"
          style={{
            fontSize: "var(--font-size-micro)",
            letterSpacing: "var(--tracking-micro)",
            color: "var(--text-tertiary)",
          }}
        >
          Components
        </div>
        <h1
          style={{
            fontSize: "var(--font-size-display)",
            lineHeight: "var(--line-height-display)",
            fontWeight: "var(--weight-display)" as unknown as number,
            letterSpacing: "-0.01em",
            margin: 0,
          }}
        >
          Status &amp; Feedback
        </h1>
        <p style={{ fontSize: "var(--font-size-body)", lineHeight: "var(--line-height-body)", color: "var(--text-secondary)", margin: 0 }}>
          Six components cover every way this app tells the installer what is
          happening: a tagged state (<code style={{ background: "var(--surface-sunken)", borderRadius: 4, padding: "2px 6px", fontSize: "var(--font-size-caption)" }}>StatusPill</code>),
          a resolved outcome (<code style={{ background: "var(--surface-sunken)", borderRadius: 4, padding: "2px 6px", fontSize: "var(--font-size-caption)" }}>SuccessCheck</code>,{" "}
          <code style={{ background: "var(--surface-sunken)", borderRadius: 4, padding: "2px 6px", fontSize: "var(--font-size-caption)" }}>OutcomePanel</code>),
          an interruption that needs attention (<code style={{ background: "var(--surface-sunken)", borderRadius: 4, padding: "2px 6px", fontSize: "var(--font-size-caption)" }}>ErrorBanner</code>),
          work in progress (<code style={{ background: "var(--surface-sunken)", borderRadius: 4, padding: "2px 6px", fontSize: "var(--font-size-caption)" }}>PulsingBadge</code>),
          and extra context on demand (<code style={{ background: "var(--surface-sunken)", borderRadius: 4, padding: "2px 6px", fontSize: "var(--font-size-caption)" }}>Tooltip</code>).
        </p>
        <p style={{ fontSize: "var(--font-size-body)", lineHeight: "var(--line-height-body)", color: "var(--text-secondary)", margin: 0 }}>
          All six live at{" "}
          <code style={{ fontSize: "var(--font-size-caption)" }}>src/components/atoms/</code> and{" "}
          <code style={{ fontSize: "var(--font-size-caption)" }}>src/components/molecules/</code>, styled
          entirely from <code style={{ fontSize: "var(--font-size-caption)" }}>src/styles/tokens.css</code>'s
          semantic error/warning/info/success surfaces and text colors — never a literal hex. See the{" "}
          <strong>Design System Debt</strong> storyboard for a gap found while researching this family
          and the one documented gap already called out in <code style={{ fontSize: "var(--font-size-caption)" }}>Tooltip.tsx</code>'s
          own source comment.
        </p>

        <div className="flex flex-wrap items-center gap-4 pt-4">
          <StatusPill tone="success">Passed</StatusPill>
          <StatusPill tone="error">Failed</StatusPill>
          <StatusPill tone="brand">Running</StatusPill>
          <SuccessCheck size={40} />
          <PulsingBadge aria-label="Checking hardware">
            <Radio size={22} />
          </PulsingBadge>
          <Tooltip text="The current draw per phase, in amps, that this charger pulls under full load." />
        </div>

        <div style={{ maxWidth: 420 }}>
          <ErrorBanner
            tone="warning"
            title="You're offline"
            description="Check your connection — you can keep working, and we'll pick back up once you're back online."
          />
        </div>

        <div className="grid grid-cols-3 gap-3 pt-6">
          <StatCard label="StatusPill" value={6} detail="tones · 1 real caller (AutomatedOcppTestingPage)" />
          <StatCard label="SuccessCheck" value={1} detail="caller — inside OutcomePanel's success icon" />
          <StatCard label="Tooltip" value={1} detail="caller — ChargerElectricalInformationPage" />
          <StatCard label="ErrorBanner" value={8} detail="files · 14 call sites across pages + AppShell" />
          <StatCard label="OutcomePanel" value={8} detail="pages, incl. ErrorBoundary's crash screen" />
          <StatCard label="PulsingBadge" value={2} detail="pages — Processing, Automated OCPP Testing" />
        </div>
      </div>
    </PageFrame>
  );
}
