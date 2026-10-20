import { PageFrame, PageTitle, Section, Code } from "./Chrome";

interface DurationRow {
  varName: string;
  ms: string;
  tier: "confirmed" | "proposed";
  note: string;
}

const DURATIONS: DurationRow[] = [
  { varName: "--duration-instant", ms: "100ms", tier: "proposed", note: "micro-feedback — a tap, a checkbox toggle" },
  { varName: "--duration-fast", ms: "160ms", tier: "proposed", note: "hover/press states, small UI transitions" },
  { varName: "--duration-base", ms: "220ms", tier: "proposed", note: "the default — most component transitions" },
  { varName: "--duration-moderate", ms: "360ms", tier: "proposed", note: "panel expand/collapse, toast enter" },
  { varName: "--duration-slow", ms: "560ms", tier: "proposed", note: "larger choreographed moments" },
  {
    varName: "--duration-standard-max",
    ms: "1000ms",
    tier: "confirmed",
    note: "ceiling for the BIGGEST choreographed moments only (full-step wizard transitions, the commissioning success sequence) — not a default. Also aliased as --transition-standard.",
  },
];

interface EasingRow {
  varName: string;
  cubicBezier: [number, number, number, number];
  note: string;
}

const EASINGS: EasingRow[] = [
  { varName: "--ease-standard", cubicBezier: [0.4, 0, 0.2, 1], note: "the default — balanced accel/decel" },
  { varName: "--ease-decel", cubicBezier: [0, 0, 0.2, 1], note: "entrances — fast in, settles gently" },
  { varName: "--ease-accel", cubicBezier: [0.4, 0, 1, 1], note: "exits — eases in, leaves fast" },
  {
    varName: "--ease-out-expo",
    cubicBezier: [0.16, 1, 0.3, 1],
    note: "confident, decisive deceleration for step/route transitions and sheet entrances — reads less \"material-default\", more premium-native",
  },
];

/** A small real cubic-bezier curve diagram: control points plotted exactly as authored. */
function EasingCurve({ cubicBezier }: { cubicBezier: [number, number, number, number] }) {
  const [x1, y1, x2, y2] = cubicBezier;
  const size = 96;
  const pad = 10;
  const toPx = (v: number) => pad + v * (size - 2 * pad);
  // SVG y grows downward; flip so y=1 (curve "up") renders near the top.
  const toPy = (v: number) => size - pad - v * (size - 2 * pad);

  const start = { x: toPx(0), y: toPy(0) };
  const end = { x: toPx(1), y: toPy(1) };
  const c1 = { x: toPx(x1), y: toPy(y1) };
  const c2 = { x: toPx(x2), y: toPy(y2) };

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="cubic-bezier easing curve">
      <rect x={0} y={0} width={size} height={size} rx={8} fill="var(--surface-sunken)" />
      <line x1={pad} y1={size - pad} x2={size - pad} y2={size - pad} stroke="var(--border-subtle)" strokeWidth={1} />
      <line x1={pad} y1={pad} x2={pad} y2={size - pad} stroke="var(--border-subtle)" strokeWidth={1} />
      <path
        d={`M ${start.x} ${start.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${end.x} ${end.y}`}
        fill="none"
        stroke="var(--color-brand-orange-500)"
        strokeWidth={2}
        strokeLinecap="round"
      />
      <circle cx={c1.x} cy={c1.y} r={2.5} fill="var(--border-focus)" opacity={0.6} />
      <circle cx={c2.x} cy={c2.y} r={2.5} fill="var(--border-focus)" opacity={0.6} />
    </svg>
  );
}

export function BoardMotion() {
  return (
    <PageFrame>
      <PageTitle
        title="Motion"
        description="A static canvas screenshot can't 'play' a transition, so this is a labeled reference: duration name → ms value → real usage note, plus the 4 easing curves as their actual cubic-bezier values."
      />

      <Section title="Durations">
        <div className="flex flex-col">
          {DURATIONS.map((d) => (
            <div
              key={d.varName}
              className="grid items-center gap-6 py-4"
              style={{ gridTemplateColumns: "230px 70px 1fr", borderTop: "1px solid var(--border-subtle)" }}
            >
              <div className="flex items-center gap-2">
                <Code>{d.varName}</Code>
                {d.tier === "confirmed" && (
                  <span
                    className="uppercase"
                    style={{
                      fontSize: 9,
                      letterSpacing: "var(--tracking-micro)",
                      color: "var(--text-on-brand)",
                      background: "var(--surface-brand)",
                      borderRadius: "var(--radius-sm)",
                      padding: "2px 5px",
                    }}
                  >
                    confirmed
                  </span>
                )}
              </div>
              <div style={{ fontSize: "var(--font-size-body)", fontWeight: 700, color: "var(--text-primary)" }}>
                {d.ms}
              </div>
              <div style={{ fontSize: "var(--font-size-body)", lineHeight: "var(--line-height-body)", color: "var(--text-secondary)" }}>
                {d.note}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Easing curves">
        <div className="flex flex-wrap gap-8">
          {EASINGS.map((e) => (
            <div key={e.varName} className="flex flex-col gap-3" style={{ width: 220 }}>
              <EasingCurve cubicBezier={e.cubicBezier} />
              <Code>{e.varName}</Code>
              <span style={{ fontSize: "var(--font-size-caption)", color: "var(--text-tertiary)", fontFamily: "monospace" }}>
                cubic-bezier({e.cubicBezier.join(", ")})
              </span>
              <span style={{ fontSize: "var(--font-size-caption)", lineHeight: "var(--line-height-caption)", color: "var(--text-secondary)" }}>
                {e.note}
              </span>
            </div>
          ))}
        </div>
      </Section>
    </PageFrame>
  );
}
