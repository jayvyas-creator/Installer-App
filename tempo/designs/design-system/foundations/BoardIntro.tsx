import { PageFrame, StatCard, Code } from "./Chrome";

export function BoardIntro() {
  return (
    <PageFrame>
      <div className="flex max-w-[640px] flex-col gap-6">
        <div
          className="uppercase tracking-widest"
          style={{
            fontSize: "var(--font-size-micro)",
            letterSpacing: "var(--tracking-micro)",
            color: "var(--text-tertiary)",
          }}
        >
          Foundations
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
          Design Tokens
        </h1>
        <p
          style={{
            fontSize: "var(--font-size-body)",
            lineHeight: "var(--line-height-body)",
            color: "var(--text-secondary)",
            margin: 0,
          }}
        >
          This canvas documents <Code>src/styles/tokens.css</Code> — the full
          design token system every other design-system canvas (Buttons &amp;
          Icon Actions, Form Fields, Typography &amp; Brand, and more to come)
          references rather than duplicating. There is no single component
          here: the tokens themselves are the asset. Every swatch, type
          specimen, and measurement on the following storyboards renders the
          real CSS custom property via <Code>var(--token-name)</Code> — what
          you see IS the production value, not a re-typed copy.
        </p>

        <div className="flex flex-col gap-3 pt-2">
          <h2
            style={{
              fontSize: "var(--font-size-headline)",
              fontWeight: 700,
              margin: 0,
              color: "var(--text-primary)",
            }}
          >
            Two tiers, same split used across the product's design docs
          </h2>
          <div
            className="flex flex-col gap-3 p-5"
            style={{
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--border-subtle)",
              background: "var(--surface-sunken)",
            }}
          >
            <div className="flex items-start gap-3">
              <span
                className="shrink-0 uppercase"
                style={{
                  fontSize: "var(--font-size-micro)",
                  letterSpacing: "var(--tracking-micro)",
                  color: "var(--text-on-brand)",
                  background: "var(--surface-brand)",
                  borderRadius: "var(--radius-sm)",
                  padding: "3px 7px",
                }}
              >
                confirmed
              </span>
              <p style={{ fontSize: "var(--font-size-body)", lineHeight: "var(--line-height-body)", margin: 0, color: "var(--text-primary)" }}>
                Fixed brand values verified against the PayG Installer App
                source directly — brand orange, success green, the 38%-black
                disabled convention, the SF&nbsp;Pro / Lato font pairing, and
                the 1000ms transition ceiling. Do not alter without explicit
                instruction.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span
                className="shrink-0 uppercase"
                style={{
                  fontSize: "var(--font-size-micro)",
                  letterSpacing: "var(--tracking-micro)",
                  color: "var(--text-info)",
                  background: "var(--surface-info-subtle)",
                  borderRadius: "var(--radius-sm)",
                  padding: "3px 7px",
                }}
              >
                proposed
              </span>
              <p style={{ fontSize: "var(--font-size-body)", lineHeight: "var(--line-height-body)", margin: 0, color: "var(--text-primary)" }}>
                Everything built around those anchors — the OKLCH neutral
                ramp, semantic error/warning/info ramps, surfaces, text tones,
                borders, type scale, spacing, radius, elevation, and motion.
                Internally consistent today and already load-bearing across
                every atom/molecule/organism, open to further design review.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-2">
          <h2
            style={{
              fontSize: "var(--font-size-headline)",
              fontWeight: 700,
              margin: 0,
              color: "var(--text-primary)",
            }}
          >
            Why doc-compatibility aliases exist
          </h2>
          <p style={{ fontSize: "var(--font-size-body)", lineHeight: "var(--line-height-body)", color: "var(--text-secondary)", margin: 0 }}>
            A block at the end of <Code>tokens.css</Code> (<Code>:root</Code>)
            adds flatter, doc-familiar names — <Code>--color-primary</Code>,{" "}
            <Code>--color-success</Code>, <Code>--color-disabled</Code>,{" "}
            <Code>--color-text</Code>, <Code>--color-border</Code>,{" "}
            <Code>--color-surface</Code>, <Code>--shadow-surface</Code>, and a
            handful more — as thin aliases <em>pointing at</em> the real
            tokens above (e.g. <Code>--color-primary: var(--color-brand-orange-500)</Code>).
            Per this repo's <Code>CLAUDE.md</Code> §2: the OKLCH scale reflects
            real prior design review and is already load-bearing in every
            component's CSS today, so renaming it to match a flatter proposal
            from the authoritative source doc would have silently changed
            pixel-level values (contrast ratios, spacing, shadows) across the
            whole app for no functional gain. The aliases exist purely so a
            developer who read that doc first can grep the name they expect
            and land on the right real value — a thin compatibility shim, not
            a second competing token system.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 pt-4">
          <StatCard label="Neutral ramp" value="13" detail="steps, 0 → 900, OKLCH hue 235" />
          <StatCard label="Type scale" value="7" detail="display → micro" />
          <StatCard label="Spacing scale" value="10" detail="4px base, 1 → 16" />
        </div>
      </div>
    </PageFrame>
  );
}
