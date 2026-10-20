import { PageFrame, PageTitle, Section, Swatch, Code } from "./Chrome";

export function BoardColors() {
  return (
    <PageFrame>
      <PageTitle
        title="Color"
        description="Every swatch below renders its real var(--token) as the background — not a re-typed hex duplicate. Two tiers: confirmed brand values (never alter without explicit instruction) and the proposed OKLCH-based scale built around them."
      />

      <Section
        title="Brand orange — confirmed"
        description="The primary brand hue. 500 is the CTA/accent default; 50/100 are subtle fills; 600–800 are hover/press/on-light-text steps."
      >
        <div className="flex flex-wrap gap-4">
          <Swatch varName="--color-brand-orange-50" rawValue="#fff3e6" onColor="rgba(0,0,0,0.6)" />
          <Swatch varName="--color-brand-orange-100" rawValue="#ffe3c2" onColor="rgba(0,0,0,0.6)" />
          <Swatch varName="--color-brand-orange-500" rawValue="#ff851b" note="= --color-primary alias" />
          <Swatch varName="--color-brand-orange-600" rawValue="#e8710a" />
          <Swatch varName="--color-brand-orange-700" rawValue="#c95f06" />
          <Swatch varName="--color-brand-orange-800" rawValue="#b85600" note="--text-link source" />
        </div>
      </Section>

      <Section
        title="Success green — confirmed"
        description="#388e3c verified against the PayG Installer App source. Used for completed steps, success toasts, the install-success screen."
      >
        <div className="flex flex-wrap gap-4">
          <Swatch varName="--color-success-50" rawValue="#eaf6eb" onColor="rgba(0,0,0,0.6)" />
          <Swatch varName="--color-success-100" rawValue="#cfe9d1" onColor="rgba(0,0,0,0.6)" />
          <Swatch varName="--color-success-600" rawValue="#388e3c" note="= --color-success alias" />
          <Swatch varName="--color-success-700" rawValue="#2e7431" note="--text-success source" />
        </div>
      </Section>

      <Section
        title="CTA navy — confirmed"
        description="#001f3f — a secondary brand anchor distinct from the orange accent, used sparingly for CTA surfaces."
      >
        <div className="flex flex-wrap gap-4">
          <Swatch varName="--color-cta-500" rawValue="#001f3f" />
          <Swatch varName="--color-cta-600" rawValue="#001939" />
          <Swatch varName="--color-cta-700" rawValue="#001332" />
        </div>
      </Section>

      <Section
        title="Disabled overlay — confirmed"
        description="A single 38%-black overlay convention, reused everywhere something needs to read as disabled (also aliased as --text-disabled and --color-disabled)."
      >
        <div
          className="flex items-center gap-3 p-4"
          style={{ borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)", background: "var(--surface-brand-subtle)" }}
        >
          <Swatch varName="--color-disabled-overlay" rawValue="rgba(0,0,0,0.38)" onColor="#fff" />
        </div>
      </Section>

      <Section
        title="Neutral ramp — proposed, OKLCH"
        description="13 steps, hue 235 (cool slate — deliberately opposite the brand orange's hue), chroma tapering toward the lightness extremes per OKLCH convention. This is the backbone every surface/text/border token below is built from."
      >
        <div className="flex flex-wrap gap-4">
          <Swatch varName="--color-neutral-0" rawValue="oklch(0.995 0.002 235)" onColor="rgba(0,0,0,0.5)" />
          <Swatch varName="--color-neutral-25" rawValue="oklch(0.985 0.003 235)" onColor="rgba(0,0,0,0.5)" />
          <Swatch varName="--color-neutral-50" rawValue="oklch(0.965 0.004 235)" onColor="rgba(0,0,0,0.6)" />
          <Swatch varName="--color-neutral-75" rawValue="oklch(0.945 0.005 235)" onColor="rgba(0,0,0,0.6)" />
          <Swatch varName="--color-neutral-100" rawValue="oklch(0.92 0.006 235)" onColor="rgba(0,0,0,0.6)" />
          <Swatch varName="--color-neutral-200" rawValue="oklch(0.865 0.007 235)" onColor="rgba(0,0,0,0.6)" />
          <Swatch varName="--color-neutral-300" rawValue="oklch(0.78 0.008 235)" onColor="rgba(0,0,0,0.7)" />
          <Swatch varName="--color-neutral-400" rawValue="oklch(0.655 0.009 235)" />
          <Swatch varName="--color-neutral-500" rawValue="oklch(0.53 0.009 235)" />
          <Swatch varName="--color-neutral-600" rawValue="oklch(0.42 0.008 235)" />
          <Swatch varName="--color-neutral-700" rawValue="oklch(0.32 0.007 235)" />
          <Swatch varName="--color-neutral-800" rawValue="oklch(0.225 0.006 235)" />
          <Swatch varName="--color-neutral-900" rawValue="oklch(0.155 0.004 235)" />
        </div>
      </Section>

      <Section
        title="Semantic — error / warning / info — proposed"
        description="Each ramp carries only the steps actually used: error gets a full 4-step ramp (50/100/600/700), warning and info stop at 3 steps (50/100/600) — there's no warning/info -700 because nothing in the app needs on-dark text in those hues yet."
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-4">
            <Swatch varName="--color-error-50" rawValue="#fcecec" onColor="rgba(0,0,0,0.6)" />
            <Swatch varName="--color-error-100" rawValue="#f7d4d4" onColor="rgba(0,0,0,0.6)" />
            <Swatch varName="--color-error-600" rawValue="#d53f3f" />
            <Swatch varName="--color-error-700" rawValue="#b32f2f" note="--text-error source" />
          </div>
          <div className="flex flex-wrap gap-4">
            <Swatch varName="--color-warning-50" rawValue="#fbf2e0" onColor="rgba(0,0,0,0.6)" />
            <Swatch varName="--color-warning-100" rawValue="#f3dfb8" onColor="rgba(0,0,0,0.6)" />
            <Swatch varName="--color-warning-600" rawValue="#a8670a" note="--text-warning source" />
          </div>
          <div className="flex flex-wrap gap-4">
            <Swatch varName="--color-info-50" rawValue="#eaf2fa" onColor="rgba(0,0,0,0.6)" />
            <Swatch varName="--color-info-100" rawValue="#cfe0f2" onColor="rgba(0,0,0,0.6)" />
            <Swatch varName="--color-info-600" rawValue="#2f6fb3" note="--text-info source" />
          </div>
        </div>
      </Section>

      <Section
        title="Surfaces — proposed, composed"
        description="10 named surfaces, each a composition of a brand/neutral/semantic token above — never a fresh value."
      >
        <div className="flex flex-wrap gap-4">
          <Swatch varName="--surface-page" rawValue="var(--color-neutral-0)" onColor="rgba(0,0,0,0.5)" />
          <Swatch varName="--surface-card" rawValue="var(--color-neutral-0)" onColor="rgba(0,0,0,0.5)" />
          <Swatch varName="--surface-sunken" rawValue="var(--color-neutral-75)" onColor="rgba(0,0,0,0.6)" />
          <Swatch varName="--surface-brand" rawValue="var(--color-brand-orange-500)" />
          <Swatch varName="--surface-brand-subtle" rawValue="var(--color-brand-orange-50)" onColor="rgba(0,0,0,0.6)" />
          <Swatch varName="--surface-success-subtle" rawValue="var(--color-success-50)" onColor="rgba(0,0,0,0.6)" />
          <Swatch varName="--surface-error-subtle" rawValue="var(--color-error-50)" onColor="rgba(0,0,0,0.6)" />
          <Swatch varName="--surface-warning-subtle" rawValue="var(--color-warning-50)" onColor="rgba(0,0,0,0.6)" />
          <Swatch varName="--surface-info-subtle" rawValue="var(--color-info-50)" onColor="rgba(0,0,0,0.6)" />
          <Swatch varName="--surface-overlay-scrim" rawValue="rgba(28,22,18,0.45)" />
        </div>
      </Section>

      <Section
        title="Text — proposed"
        description={
          <>
            11 text tones. Two deliberate call-outs from the source comments:{" "}
            <Code>--text-link</Code> uses <Code>-800</Code>, not <Code>-600</Code> —
            -600 is only 3.09:1 on white, below the 4.5:1 WCAG&nbsp;1.4.3 floor
            for normal-size text (non-text uses of -600 like icons/fills/borders
            are unaffected, that's the looser 3:1 bar of 1.4.11). Separately,{" "}
            <Code>--border-field</Code> (next section) is deliberately matched
            to <Code>--border-subtle</Code>, below the 1.4.11 3:1
            boundary-contrast guideline for an outline-only field at rest — a
            documented tradeoff for a lighter look, compensated by stronger
            focus/error border+ring treatment.
          </>
        }
      >
        <div className="flex flex-wrap gap-4">
          <div className="flex flex-col gap-1 p-3" style={{ width: 170, borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)" }}>
            <span style={{ color: "var(--text-primary)", fontSize: "var(--font-size-body)", fontWeight: 600 }}>Primary text</span>
            <Code>--text-primary</Code>
          </div>
          <div className="flex flex-col gap-1 p-3" style={{ width: 170, borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)" }}>
            <span style={{ color: "var(--text-secondary)", fontSize: "var(--font-size-body)", fontWeight: 600 }}>Secondary text</span>
            <Code>--text-secondary</Code>
          </div>
          <div className="flex flex-col gap-1 p-3" style={{ width: 170, borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)" }}>
            <span style={{ color: "var(--text-tertiary)", fontSize: "var(--font-size-body)", fontWeight: 600 }}>Tertiary text</span>
            <Code>--text-tertiary</Code>
          </div>
          <div className="flex flex-col gap-1 p-3" style={{ width: 170, borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)" }}>
            <span style={{ color: "var(--text-disabled)", fontSize: "var(--font-size-body)", fontWeight: 600 }}>Disabled text</span>
            <Code>--text-disabled</Code>
          </div>
          <div className="flex flex-col gap-1 p-3" style={{ width: 170, borderRadius: "var(--radius-md)", background: "var(--surface-brand)" }}>
            <span style={{ color: "var(--text-on-brand)", fontSize: "var(--font-size-body)", fontWeight: 600 }}>On brand</span>
            <span style={{ color: "var(--text-on-brand)", fontSize: 11, fontFamily: "monospace", opacity: 0.85 }}>--text-on-brand</span>
          </div>
          <div className="flex flex-col gap-1 p-3" style={{ width: 170, borderRadius: "var(--radius-md)", background: "var(--color-success-600)" }}>
            <span style={{ color: "var(--text-on-success)", fontSize: "var(--font-size-body)", fontWeight: 600 }}>On success</span>
            <span style={{ color: "var(--text-on-success)", fontSize: 11, fontFamily: "monospace", opacity: 0.85 }}>--text-on-success</span>
          </div>
          <div className="flex flex-col gap-1 p-3" style={{ width: 170, borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)" }}>
            <span style={{ color: "var(--text-link)", fontSize: "var(--font-size-body)", fontWeight: 600, textDecoration: "underline" }}>Link text</span>
            <Code>--text-link</Code>
          </div>
          <div className="flex flex-col gap-1 p-3" style={{ width: 170, borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)" }}>
            <span style={{ color: "var(--text-error)", fontSize: "var(--font-size-body)", fontWeight: 600 }}>Error text</span>
            <Code>--text-error</Code>
          </div>
          <div className="flex flex-col gap-1 p-3" style={{ width: 170, borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)" }}>
            <span style={{ color: "var(--text-success)", fontSize: "var(--font-size-body)", fontWeight: 600 }}>Success text</span>
            <Code>--text-success</Code>
          </div>
          <div className="flex flex-col gap-1 p-3" style={{ width: 170, borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)" }}>
            <span style={{ color: "var(--text-warning)", fontSize: "var(--font-size-body)", fontWeight: 600 }}>Warning text</span>
            <Code>--text-warning</Code>
          </div>
          <div className="flex flex-col gap-1 p-3" style={{ width: 170, borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)" }}>
            <span style={{ color: "var(--text-info)", fontSize: "var(--font-size-body)", fontWeight: 600 }}>Info text</span>
            <Code>--text-info</Code>
          </div>
        </div>
      </Section>

      <Section
        title="Borders — proposed"
        description="7 border tones, from barely-there dividers to error/focus states."
      >
        <div className="flex flex-wrap gap-4">
          {([
            ["--border-subtle", "var(--color-neutral-200)"],
            ["--border-default", "var(--color-neutral-300)"],
            ["--border-strong", "var(--color-neutral-400)"],
            ["--border-field", "var(--color-neutral-200)"],
            ["--border-focus", "var(--color-brand-orange-500)"],
            ["--border-error", "var(--color-error-600)"],
            ["--border-success", "var(--color-success-600)"],
          ] as const).map(([name, val]) => (
            <div
              key={name}
              className="flex flex-col items-center justify-center gap-2 p-3"
              style={{ width: 140, height: 72, borderRadius: "var(--radius-md)", border: `2px solid var(${name})` }}
            >
              <Code>{name}</Code>
              <span style={{ fontSize: 10, color: "var(--text-tertiary)" }}>{val}</span>
            </div>
          ))}
        </div>
      </Section>
    </PageFrame>
  );
}
