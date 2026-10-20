import { StatusPill, type StatusTone } from "../../../../src/components/atoms/StatusPill";
import { Demo, PageFrame, PageTitle, Row } from "./Chrome";

const TONES: { tone: StatusTone; label: string; copy: string }[] = [
  { tone: "success", label: "success", copy: "Passed" },
  { tone: "error", label: "error", copy: "Failed" },
  { tone: "warning", label: "warning", copy: "Needs attention" },
  { tone: "info", label: "info", copy: "Info" },
  { tone: "neutral", label: "neutral", copy: "Pending" },
  { tone: "brand", label: "brand", copy: "Running" },
];

export function BoardStatusPillTones() {
  return (
    <PageFrame>
      <PageTitle
        title="StatusPill Tones"
        description="Six tones map to the app's semantic token surfaces (success/error/warning/info) plus two extras — neutral for an unstarted/idle state and brand for an in-progress one. The one real caller today, AutomatedOcppTestingPage, drives tone from a step-status lookup: pending → neutral, running → brand, passed → success, failed → error."
      />

      <Row
        name="All 6 tones"
        description="Visible text is required on every pill — tone color alone is never the only signal (WCAG 1.4.1). Copy should read correctly even described over the phone, e.g. “Needs attention” rather than a bare color-coded word."
      >
        <Demo label="with dot">
          {TONES.map(({ tone, copy }) => (
            <StatusPill key={tone} tone={tone}>
              {copy}
            </StatusPill>
          ))}
        </Demo>
        <Demo label="without dot">
          {TONES.map(({ tone, copy }) => (
            <StatusPill key={tone} tone={tone} showDot={false}>
              {copy}
            </StatusPill>
          ))}
        </Demo>
      </Row>

      <Row
        name="Real usage — AutomatedOcppTestingPage"
        description="The only production call site (AutomatedOcppTestingPage.tsx:173-175). Tone is resolved from a STEP_STATUS_TONE lookup map, text from i18n keys automatedOcppTesting.stepStatus.*, so tone and copy can never drift out of sync with each other."
      >
        <Demo label="pending">
          <StatusPill tone="neutral">Pending</StatusPill>
        </Demo>
        <Demo label="running">
          <StatusPill tone="brand">Running</StatusPill>
        </Demo>
        <Demo label="passed">
          <StatusPill tone="success">Passed</StatusPill>
        </Demo>
        <Demo label="failed">
          <StatusPill tone="error">Failed</StatusPill>
        </Demo>
      </Row>
    </PageFrame>
  );
}
