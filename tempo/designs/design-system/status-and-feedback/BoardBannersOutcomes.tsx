import { ErrorBanner } from "../../../../src/components/molecules/ErrorBanner";
import { OutcomePanel } from "../../../../src/components/molecules/OutcomePanel";
import { SuccessCheck } from "../../../../src/components/atoms/SuccessCheck";
import { PageFrame, PageTitle, Row } from "./Chrome";

const noop = () => {};

export function BoardBannersOutcomes() {
  return (
    <PageFrame>
      <PageTitle
        title="Banners & Outcomes"
        description="ErrorBanner interrupts a form with an inline, non-blocking warning or error. OutcomePanel is the full-screen resolution at the end of a flow — success, error, warning, or an in-progress pending state — composing Button, SuccessCheck, and ProgressRing (owned by the Progress & Flow canvas)."
      />

      <Row
        name="ErrorBanner — error & warning"
        description="Two tones, no third option — error for a blocking problem, warning for something the installer should notice but can proceed past. Copy taken verbatim from real call sites."
      >
        <div className="flex flex-col gap-4" style={{ maxWidth: 440 }}>
          <ErrorBanner
            tone="error"
            title="Charger electrical details incomplete"
            description="The charger electrical details are incomplete. Please go back and check them."
          />
          <ErrorBanner
            tone="warning"
            title="You're offline"
            description="Check your connection — you can keep working, and we'll pick back up once you're back online."
          />
        </div>
      </Row>

      <Row
        name="SuccessCheck — standalone"
        description="The animated checkmark-in-circle. Its only production use today is inside OutcomePanel's success icon at size={48} — shown here standalone at a few sizes to depict the primitive on its own."
      >
        <div className="flex items-center gap-8">
          <SuccessCheck size={32} />
          <SuccessCheck size={48} />
          <SuccessCheck size={56} />
        </div>
      </Row>

      <Row
        name="OutcomePanel — success"
        description="InstallationSuccessPage.tsx:16-24 — the end of the install flow, before the Communication Checklist step."
      >
        <div style={{ width: 360, border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
          <OutcomePanel
            tone="success"
            title="Charger successfully installed"
            description="Congratulations on successfully completing all the setup steps! You can now proceed to the Communication Checklist to ensure everything is connected and ready for use."
            primaryAction={{ label: "Continue", onClick: noop }}
          />
        </div>
      </Row>

      <Row
        name="OutcomePanel — error"
        description="NoEvChargerFoundPage.tsx:17-37 — reached when a scanned/entered charger ID doesn't resolve. Both a primary retry and a secondary escape hatch, plus a children slot for a support phone link."
      >
        <div style={{ width: 360, border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
          <OutcomePanel
            tone="error"
            title="No EV Charger Found"
            description="We couldn't find this charger. Check the Charger ID and Token ID, or scan a different QR code."
            primaryAction={{ label: "Try again", onClick: noop }}
            secondaryAction={{ label: "Back to Home", onClick: noop }}
          >
            <p style={{ margin: 0, fontSize: "var(--font-size-body)", color: "var(--text-secondary)" }}>
              Need help? Call{" "}
              <a href="tel:+13234882846" style={{ color: "var(--text-link)" }}>
                +1 323-488-2846
              </a>
            </p>
          </OutcomePanel>
        </div>
      </Row>

      <Row
        name="OutcomePanel — warning"
        description="NotFoundPage.tsx:14-19 — the app's 404, styled as a warning rather than an error since no data or install progress was lost."
      >
        <div style={{ width: 360, border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
          <OutcomePanel
            tone="warning"
            title="Page not found"
            description="That address doesn't match a step in the install flow. Head back to the start and pick up from there."
            primaryAction={{ label: "Go to Home", onClick: noop }}
          />
        </div>
      </Row>

      <Row
        name="OutcomePanel — pending (no real caller)"
        description="tone='pending' renders the sibling Progress and Flow canvas's ProgressRing as its icon, but nothing in src/pages or src/components ever reaches for it — only OutcomePanel.test.tsx exercises it. Copy below is illustrative, not pulled from a real screen. See the Design System Debt storyboard."
      >
        <div style={{ width: 360, border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
          <OutcomePanel
            tone="pending"
            title="Finishing up"
            description="Hold tight while we save this step. This won't take long."
          />
        </div>
      </Row>
    </PageFrame>
  );
}
