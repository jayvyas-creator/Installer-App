import { PageFrame, PageTitle, Section, Code } from "./Chrome";

const SPACE_STEPS: { name: string; varName: string; px: number }[] = [
  { name: "space-1", varName: "--space-1", px: 4 },
  { name: "space-2", varName: "--space-2", px: 8 },
  { name: "space-3", varName: "--space-3", px: 12 },
  { name: "space-4", varName: "--space-4", px: 16 },
  { name: "space-5", varName: "--space-5", px: 20 },
  { name: "space-6", varName: "--space-6", px: 24 },
  { name: "space-8", varName: "--space-8", px: 32 },
  { name: "space-10", varName: "--space-10", px: 40 },
  { name: "space-12", varName: "--space-12", px: 48 },
  { name: "space-16", varName: "--space-16", px: 64 },
];

const RADIUS_STEPS: { name: string; varName: string; px: string }[] = [
  { name: "sm", varName: "--radius-sm", px: "8px" },
  { name: "md", varName: "--radius-md", px: "12px" },
  { name: "lg", varName: "--radius-lg", px: "16px" },
  { name: "xl", varName: "--radius-xl", px: "24px" },
  { name: "full", varName: "--radius-full", px: "999px" },
];

const SHADOW_STEPS: { name: string; varName: string }[] = [
  { name: "xs", varName: "--shadow-xs" },
  { name: "sm", varName: "--shadow-sm" },
  { name: "md", varName: "--shadow-md" },
  { name: "lg", varName: "--shadow-lg" },
];

export function BoardSpacingRadiusElevation() {
  return (
    <PageFrame>
      <PageTitle
        title="Spacing, Radius & Elevation"
        description="The 4px spacing base, the radius scale, and the elevation system — rendered as real measured boxes and real box-shadow values, not illustrations."
      />

      <Section title="Spacing — 4px base, 10 steps" description="A visual ruler: each bar's width IS var(--space-n).">
        <div className="flex flex-col gap-3">
          {SPACE_STEPS.map((s) => (
            <div key={s.varName} className="flex items-center gap-4">
              <div style={{ width: 110, display: "flex", gap: 8, alignItems: "baseline" }}>
                <Code>{s.varName}</Code>
              </div>
              <div
                style={{
                  width: `var(${s.varName})`,
                  height: 16,
                  background: "var(--surface-brand)",
                  borderRadius: "var(--radius-sm)",
                }}
              />
              <span style={{ fontSize: "var(--font-size-caption)", color: "var(--text-tertiary)" }}>{s.px}px</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Radius">
        <div className="flex flex-wrap items-end gap-6">
          {RADIUS_STEPS.map((r) => (
            <div key={r.varName} className="flex flex-col items-center gap-2">
              <div
                style={{
                  width: 88,
                  height: 88,
                  background: "var(--surface-sunken)",
                  border: "1px solid var(--border-default)",
                  borderRadius: `var(${r.varName})`,
                }}
              />
              <Code>{r.varName}</Code>
              <span style={{ fontSize: "var(--font-size-caption)", color: "var(--text-tertiary)" }}>{r.px}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Elevation"
        description={
          <>
            A "modern-flat" scale: soft, low-opacity, tight-blur OKLCH umbras
            that read as a faint lift off the page —{" "}
            <strong>explicitly NOT a cast drop-shadow</strong>. Also included:{" "}
            <Code>--shadow-up-sm</Code> for bars docked to the bottom edge
            (upward cast), and the two focus-ring tokens.
          </>
        }
      >
        <div className="flex flex-wrap gap-8 pb-8">
          {SHADOW_STEPS.map((sh) => (
            <div key={sh.varName} className="flex flex-col items-center gap-3" style={{ width: 150 }}>
              <div
                style={{
                  width: 120,
                  height: 80,
                  background: "var(--surface-card)",
                  borderRadius: "var(--radius-md)",
                  boxShadow: `var(${sh.varName})`,
                }}
              />
              <Code>{sh.varName}</Code>
            </div>
          ))}
          <div className="flex flex-col items-center gap-3" style={{ width: 150 }}>
            <div
              className="flex items-end justify-center"
              style={{
                width: 120,
                height: 80,
                background: "var(--color-neutral-900)",
                borderRadius: "var(--radius-md)",
                padding: 8,
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: 28,
                  background: "var(--surface-card)",
                  borderRadius: "var(--radius-sm)",
                  boxShadow: "var(--shadow-up-sm)",
                }}
              />
            </div>
            <Code>--shadow-up-sm</Code>
          </div>
        </div>

        <div className="flex flex-wrap gap-8">
          <div className="flex flex-col items-center gap-3" style={{ width: 220 }}>
            <input
              readOnly
              value="Focused field"
              style={{
                width: 200,
                height: 44,
                borderRadius: "var(--radius-md)",
                border: "1.5px solid var(--border-focus)",
                boxShadow: "var(--shadow-focus-ring)",
                padding: "0 var(--space-3)",
                fontSize: "var(--font-size-body)",
                fontFamily: "var(--font-family-base)",
                color: "var(--text-primary)",
                outline: "none",
              }}
            />
            <Code>--shadow-focus-ring</Code>
          </div>
          <div className="flex flex-col items-center gap-3" style={{ width: 220 }}>
            <input
              readOnly
              value="Errored field"
              style={{
                width: 200,
                height: 44,
                borderRadius: "var(--radius-md)",
                border: "1.5px solid var(--border-error)",
                boxShadow: "var(--shadow-focus-ring-error)",
                padding: "0 var(--space-3)",
                fontSize: "var(--font-size-body)",
                fontFamily: "var(--font-family-base)",
                color: "var(--text-primary)",
                outline: "none",
              }}
            />
            <Code>--shadow-focus-ring-error</Code>
          </div>
        </div>
      </Section>
    </PageFrame>
  );
}
