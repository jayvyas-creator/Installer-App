import type { ReactNode } from "react";
import { Info } from "lucide-react";
import { Tooltip } from "../../../../src/components/atoms/Tooltip";
import { OutcomePanel } from "../../../../src/components/molecules/OutcomePanel";
import { PageFrame, PageTitle } from "./Chrome";

/* ------------------------------------------------------------------ */
/*  Building blocks (mirrors the Buttons & Icon Actions debt board)    */
/* ------------------------------------------------------------------ */

function Code({ children }: { children: ReactNode }) {
  return <code style={{ fontFamily: "monospace", fontSize: 13, color: "var(--color-neutral-200)" }}>{children}</code>;
}

function Note({ children }: { children: ReactNode }) {
  return <span style={{ color: "var(--color-neutral-500)" }}>{children}</span>;
}

function Bullets({ items }: { items: ReactNode[] }) {
  return (
    <ul className="flex flex-col gap-2" style={{ margin: 0, padding: 0, listStyle: "none" }}>
      {items.map((it, i) => (
        <li key={i} className="flex gap-2.5" style={{ fontSize: "var(--font-size-body)", lineHeight: "var(--line-height-body)" }}>
          <span style={{ color: "var(--color-neutral-600)" }}>•</span>
          <span style={{ color: "var(--color-neutral-400)" }}>{it}</span>
        </li>
      ))}
    </ul>
  );
}

function Fix({ children }: { children: ReactNode }) {
  return (
    <div style={{ fontSize: "var(--font-size-body)", lineHeight: "var(--line-height-body)", color: "var(--color-neutral-300)" }}>
      <span style={{ fontWeight: 700, color: "var(--color-success-600)" }}>Fix</span>
      <span style={{ color: "var(--color-neutral-500)" }}> · </span>
      {children}
    </div>
  );
}

type TileTone = "neutral" | "target" | "remove" | "warn";

const TILE: Record<TileTone, { border: string; label: string }> = {
  neutral: { border: "#3f3f46", label: "#a1a1aa" },
  target: { border: "var(--color-success-600)", label: "#4ade80" },
  remove: { border: "#7f1d1d", label: "#f87171" },
  warn: { border: "var(--color-warning-600)", label: "#fbbf24" },
};

function Tile({
  tone = "neutral",
  label,
  mock,
  children,
}: {
  tone?: TileTone;
  label: string;
  /** Marks a tile depicting a PROPOSED fix that doesn't exist in source yet —
   * distinct from "reimplemented for display", which is for code that DOES
   * exist but can't be rendered in isolation. Nothing here should be copied
   * as-is; it illustrates the shape of the fix only. */
  mock?: boolean;
  children: ReactNode;
}) {
  const c = TILE[tone];
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="relative flex items-center justify-center px-4 py-3"
        style={{
          minHeight: 64,
          minWidth: 64,
          borderRadius: "var(--radius-lg)",
          border: `1px solid ${c.border}`,
          paddingTop: mock ? 28 : undefined,
        }}
      >
        {children}
        {mock && (
          <span
            className="absolute uppercase"
            style={{ left: 8, top: 6, fontSize: 9, fontWeight: 700, letterSpacing: "0.06em", color: "#fbbf24" }}
          >
            proposed · mock
          </span>
        )}
      </div>
      <span style={{ fontFamily: "monospace", fontSize: 12, color: c.label }}>{label}</span>
    </div>
  );
}

function Arrow() {
  return <div style={{ marginTop: 22, color: "var(--color-neutral-600)" }}>→</div>;
}

/** Depicts the proposed fix: the same 16px Info icon, now centered inside a
 * 44x44 hit area. Values (radius, color, focus ring) copied from
 * Tooltip.module.css so the shape is faithful — this is NOT the real
 * component, since the fix hasn't been applied to source. */
function ProposedTooltipTrigger() {
  return (
    <span className="relative inline-flex" style={{ display: "inline-flex" }}>
      <button
        type="button"
        aria-label="More information"
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 44,
          height: 44,
          borderRadius: "var(--radius-full)",
          color: "var(--text-secondary)",
          background: "transparent",
          border: "none",
        }}
      >
        <Info size={16} aria-hidden />
      </button>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Rows                                                               */
/* ------------------------------------------------------------------ */

interface DebtRow {
  title: string;
  body: ReactNode;
  bullets: ReactNode[];
  fix: ReactNode;
  visual: ReactNode;
}

const ROWS: DebtRow[] = [
  {
    title: "Tooltip's trigger is well under the 44×44 touch-target minimum",
    body: (
      <>
        <Code>Tooltip.tsx</Code>'s own source comment already documents this
        as a known gap, not something found fresh here: a 16px <Code>Info</Code>{" "}
        glyph inside a 20×20px (<Code>1.25rem</Code>) button, against{" "}
        <Code>DESIGN-HANDOFF.md</Code>'s §4 44×44 minimum (the same minimum this
        codebase names <Code>--touch-target-min</Code> in{" "}
        <Code>tokens.css</Code>). The one production caller,{" "}
        <Code>ChargerElectricalInformationPage.tsx:274</Code>, sits the trigger
        as a field's trailing adornment — exactly the kind of small, precise
        tap target a glove or a work-site thumb will miss.
      </>
    ),
    bullets: [
      <>
        <Code>src/components/atoms/Tooltip.tsx:9-11</Code>{" "}
        <Note>
          — the comment: "the trigger icon is 16px today, below the 44x44
          touch-target minimum DESIGN-HANDOFF.md §4 calls for — flagged there
          as a known gap to fix, not silently 'fixed' here with an oversized
          hit target that would look wrong."
        </Note>
      </>,
      <>
        <Code>src/components/atoms/Tooltip.module.css:6-15</Code>{" "}
        <Note>
          — <Code>.trigger</Code> is <Code>width: 1.25rem; height: 1.25rem</Code>{" "}
          (20×20px), the actual hit area; the <Code>Info</Code> glyph inside it
          renders at <Code>size={16}</Code>
        </Note>
      </>,
      <>
        <Code>src/pages/ChargerElectricalInformationPage.tsx:274</Code>{" "}
        <Note>— the one production caller, as a field's trailing adornment</Note>
      </>,
    ],
    fix: (
      <>
        Keep the 16px glyph exactly as-is — the comment is right that
        oversizing the icon itself would look wrong next to body text — and
        instead grow only the invisible hit area: give <Code>.trigger</Code>{" "}
        a <Code>min-width</Code>/<Code>min-height</Code> of{" "}
        <Code>var(--touch-target-min)</Code> (44px) with the icon centered
        inside via flex, same as <Code>IconButton</Code> already does for its
        own tappable surface. No visual change to the glyph, no layout shift
        for sighted mouse users — just a bigger invisible target.
      </>
    ),
    visual: (
      <div className="flex items-start gap-4 pt-1">
        <Tile tone="remove" label="20×20px hit area · today">
          <Tooltip text="The current draw per phase, in amps, that this charger pulls under full load." />
        </Tile>
        <Arrow />
        <Tile tone="target" label="44×44px hit area · proposed" mock>
          <ProposedTooltipTrigger />
        </Tile>
      </div>
    ),
  },
  {
    title: '`OutcomePanel` tone="pending" — 0 real callers',
    body: (
      <>
        <Code>OutcomePanel</Code> ships a fourth tone, <Code>"pending"</Code>,
        whose icon renders the sibling Progress & Flow canvas's{" "}
        <Code>ProgressRing</Code>. Every other tone (success/error/warning)
        has at least one real page behind it — pending has none. Its only
        exerciser anywhere in the repo is a unit test.
      </>
    ),
    bullets: [
      <>
        <Code>src/components/molecules/OutcomePanel.tsx:33-34</Code>{" "}
        <Note>
          — <Code>case "pending": return &lt;ProgressRing size=&#123;44&#125; strokeWidth=&#123;4&#125; /&gt;</Code>
        </Note>
      </>,
      <>
        <Code>src/components/molecules/OutcomePanel.test.tsx:24</Code>{" "}
        <Note>— the only place <Code>tone="pending"</Code> is exercised</Note>
      </>,
      <>
        <Note>
          zero call sites across <Code>src/pages</Code>/<Code>src/components</Code>{" "}
          — confirmed by grepping every <Code>&lt;OutcomePanel</Code> usage
        </Note>
      </>,
    ],
    fix: (
      <>
        Not necessarily dead code — a mid-step "saving your progress" screen
        is a plausible future use for it, and it costs little to keep. But
        until a real page reaches for it, treat it as unverified: the
        "pending" row on the Banners &amp; Outcomes storyboard is marked
        explicitly as illustrative copy, not a real screen's copy, so nobody
        mistakes it for confirmed UX.
      </>
    ),
    visual: (
      <div className="flex items-start gap-4 pt-1">
        <Tile tone="warn" label="0 callers · watch" mock>
          <div style={{ transform: "scale(0.55)", transformOrigin: "top left" }}>
            <OutcomePanel tone="pending" title="Finishing up" description="Hold tight." />
          </div>
        </Tile>
      </div>
    ),
  },
];

/* ------------------------------------------------------------------ */
/*  Storyboard                                                         */
/* ------------------------------------------------------------------ */

function DebtRowView({ row }: { row: DebtRow }) {
  return (
    <div className="grid gap-14 py-8" style={{ gridTemplateColumns: "280px 1fr", borderBottom: "1px solid var(--color-neutral-800)" }}>
      <div style={{ fontSize: "var(--font-size-body)", fontWeight: 600, lineHeight: "var(--line-height-body)", color: "var(--color-neutral-0)" }}>
        {row.title}
      </div>
      <div className="flex flex-col gap-4">
        <div style={{ fontSize: "var(--font-size-body)", lineHeight: "var(--line-height-body)", color: "var(--color-neutral-400)" }}>
          {row.body}
        </div>
        <Bullets items={row.bullets} />
        <Fix>{row.fix}</Fix>
        {row.visual}
      </div>
    </div>
  );
}

export function BoardDesignSystemDebt() {
  return (
    <PageFrame dark>
      <PageTitle
        title="Design System Debt"
        description="Two real findings from this family, each with file:line evidence and a proposed fix. Prod is deliberately NOT touched in this pass. Tiles marked 'proposed · mock' depict a fix that does not exist in source yet, so nothing in them should be copied as a real component."
      />

      <div className="flex flex-col">
        {ROWS.map((row) => (
          <DebtRowView key={row.title} row={row} />
        ))}
      </div>

      <div
        className="mt-8 px-5 py-4"
        style={{
          maxWidth: 760,
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--color-neutral-800)",
          background: "rgba(255,255,255,0.03)",
          fontSize: "var(--font-size-body)",
          lineHeight: "var(--line-height-body)",
          color: "var(--color-neutral-400)",
        }}
      >
        <span style={{ fontWeight: 700, color: "var(--color-neutral-200)" }}>
          Checked and clean: no hand-rolled look-alikes found.
        </span>{" "}
        Grepped <Code>src/pages</Code> and <Code>src/components</Code> for
        inline status-badge patterns (colored <Code>&lt;span&gt;</Code>s for
        words like "Connected"/"Active"/"Failed" not going through{" "}
        <Code>StatusPill</Code>) and for inline alert/error markup (a styled{" "}
        <Code>role="alert"</Code> div not going through <Code>ErrorBanner</Code>
        ). Neither grep turned up a real instance: the only{" "}
        <Code>StatusPill</Code>-shaped status word in the app (
        <Code>AutomatedOcppTestingPage.tsx:174</Code>) already goes through the
        real component, and the only <Code>role="alert"</Code> in the codebase
        is <Code>ErrorBanner.tsx:12</Code> itself. The field-level helper/error
        text inside <Code>Input</Code>/<Code>Select</Code> (e.g.{" "}
        <Code>Input.tsx:73-78</Code>) is a distinct, legitimate pattern — scoped
        under one field, no title, not a banner — not a copy of{" "}
        <Code>ErrorBanner</Code>.
      </div>
    </PageFrame>
  );
}
