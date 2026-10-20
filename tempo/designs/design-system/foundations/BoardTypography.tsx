import { PageFrame, PageTitle, Section, Code } from "./Chrome";

interface TypeStep {
  name: string;
  sizeVar: string;
  lineHeightVar: string;
  weightVar: string;
  px: string;
  weightValue: number;
  sample: string;
  extraVar?: string;
}

const TYPE_STEPS: TypeStep[] = [
  { name: "display", sizeVar: "--font-size-display", lineHeightVar: "--line-height-display", weightVar: "--weight-display", px: "28px / 34px", weightValue: 800, sample: "Ready to charge" },
  { name: "title", sizeVar: "--font-size-title", lineHeightVar: "--line-height-title", weightVar: "--weight-title", px: "22px / 28px", weightValue: 700, sample: "Site information" },
  { name: "headline", sizeVar: "--font-size-headline", lineHeightVar: "--line-height-headline", weightVar: "--weight-headline", px: "17px / 24px", weightValue: 700, sample: "Communication checklist" },
  { name: "body-lg", sizeVar: "--font-size-body-lg", lineHeightVar: "--line-height-body-lg", weightVar: "--weight-body-lg", px: "16px / 24px", weightValue: 500, sample: "Confirm the charger details below." },
  { name: "body", sizeVar: "--font-size-body", lineHeightVar: "--line-height-body", weightVar: "--weight-body", px: "15px / 22px", weightValue: 400, sample: "Scan the QR code printed on the charger label." },
  { name: "caption", sizeVar: "--font-size-caption", lineHeightVar: "--line-height-caption", weightVar: "--weight-caption", px: "13px / 18px", weightValue: 500, sample: "Required for OCPP testing" },
  { name: "micro", sizeVar: "--font-size-micro", lineHeightVar: "--line-height-micro", weightVar: "--weight-micro", px: "11px / 14px", weightValue: 700, sample: "STEP 3 OF 6", extraVar: "--tracking-micro" },
];

export function BoardTypography() {
  return (
    <PageFrame>
      <PageTitle
        title="Typography"
        description="7 type-scale steps, mobile-first — legible at arm's length, outdoors, on a work site. Each sample below is rendered at its real font-size / line-height / weight tokens, not approximated."
      />

      <Section title="Type scale">
        <div className="flex flex-col">
          {TYPE_STEPS.map((step) => (
            <div
              key={step.name}
              className="grid items-baseline gap-8 py-5"
              style={{ gridTemplateColumns: "180px 1fr", borderTop: "1px solid var(--border-subtle)" }}
            >
              <div className="flex flex-col gap-1">
                <span style={{ fontSize: "var(--font-size-body)", fontWeight: 700, color: "var(--text-primary)" }}>
                  {step.name}
                </span>
                <span style={{ fontSize: "var(--font-size-caption)", color: "var(--text-tertiary)" }}>{step.px}</span>
                <Code>{step.sizeVar}</Code>
                <Code>{step.lineHeightVar}</Code>
                <Code>{step.weightVar}</Code>
                {step.extraVar && <Code>{step.extraVar}</Code>}
              </div>
              <div
                style={{
                  fontSize: `var(${step.sizeVar})`,
                  lineHeight: `var(${step.lineHeightVar})`,
                  fontWeight: `var(${step.weightVar})` as unknown as number,
                  letterSpacing: step.extraVar ? "var(--tracking-micro)" : undefined,
                  textTransform: step.name === "micro" ? "uppercase" : undefined,
                  color: "var(--text-primary)",
                }}
              >
                {step.sample}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Font family pairing"
        description={
          <>
            A documented bug fix: SF&nbsp;Pro (<Code>--font-family-base</Code>)
            is the body/control font everywhere. Lato (
            <Code>--font-family-heading</Code>) is reserved for the{" "}
            <Code>Heading</Code> atom ONLY. An earlier pass had these swapped
            — Lato as the base face — sourced from the wrong repo; this is the
            corrected, verified pairing.
          </>
        }
      >
        <div className="flex gap-6">
          <div
            className="flex flex-1 flex-col gap-3 p-5"
            style={{ borderRadius: "var(--radius-lg)", border: "1px solid var(--border-subtle)" }}
          >
            <Code>--font-family-base</Code>
            <div
              style={{
                fontFamily: "var(--font-family-base)",
                fontSize: "var(--font-size-body-lg)",
                lineHeight: "var(--line-height-body-lg)",
                color: "var(--text-primary)",
              }}
            >
              SF Pro — body text, labels, buttons, form fields. The workhorse
              face for every control in the install flow.
            </div>
            <span style={{ fontSize: "var(--font-size-caption)", color: "var(--text-tertiary)" }}>
              "SF Pro Text", "SF Pro Display", -apple-system, BlinkMacSystemFont, …
            </span>
          </div>
          <div
            className="flex flex-1 flex-col gap-3 p-5"
            style={{ borderRadius: "var(--radius-lg)", border: "1px solid var(--border-subtle)" }}
          >
            <Code>--font-family-heading</Code>
            <div
              style={{
                fontFamily: "var(--font-family-heading)",
                fontSize: "var(--font-size-title)",
                lineHeight: "var(--line-height-title)",
                fontWeight: 700,
                color: "var(--text-primary)",
              }}
            >
              Lato — the Heading atom only
            </div>
            <span style={{ fontSize: "var(--font-size-caption)", color: "var(--text-tertiary)" }}>
              "Lato", "SF Pro Display", -apple-system, BlinkMacSystemFont, …
            </span>
          </div>
        </div>
      </Section>
    </PageFrame>
  );
}
