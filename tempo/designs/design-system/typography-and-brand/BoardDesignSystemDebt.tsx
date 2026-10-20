import type { ReactNode } from "react";
import { Heading } from "@/components/atoms/Heading";
import { PageFrame, PageTitle } from "./Chrome";

/* ------------------------------------------------------------------ */
/*  Building blocks                                                    */
/* ------------------------------------------------------------------ */

function Code({ children }: { children: ReactNode }) {
  return (
    <code className="font-mono text-[13px] text-neutral-200">{children}</code>
  );
}

function Note({ children }: { children: ReactNode }) {
  return <span className="text-neutral-500">{children}</span>;
}

function Bullets({ items }: { items: ReactNode[] }) {
  return (
    <ul className="flex flex-col gap-2">
      {items.map((it, i) => (
        <li key={i} className="flex gap-2.5 text-[13px] leading-relaxed">
          <span className="select-none text-neutral-600">•</span>
          <span className="text-neutral-400">{it}</span>
        </li>
      ))}
    </ul>
  );
}

function Fix({ children }: { children: ReactNode }) {
  return (
    <div className="text-[13px] leading-relaxed text-neutral-300">
      <span className="font-semibold text-emerald-400">Fix</span>
      <span className="text-neutral-500"> · </span>
      {children}
    </div>
  );
}

type TileTone = "neutral" | "target" | "remove" | "warn";

const TILE: Record<TileTone, { border: string; label: string }> = {
  neutral: { border: "#3f3f46", label: "#71717a" },
  target: { border: "#34d399", label: "#4ade80" },
  remove: { border: "#7f1d1d", label: "#f87171" },
  warn: { border: "#78560f", label: "#fbbf24" },
};

function Tile({
  tone = "neutral",
  label,
  reimplemented,
  children,
}: {
  tone?: TileTone;
  label: string;
  /** Marks a tile whose contents are RECREATED for display because the
   * original is raw JSX inline in an app page and styled through a
   * page-local CSS module class, not an importable component. */
  reimplemented?: boolean;
  children: ReactNode;
}) {
  const c = TILE[tone];
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`relative flex min-h-[64px] min-w-[180px] items-center justify-center rounded-xl px-4 py-3 ${reimplemented ? "pt-7" : ""}`}
        style={{ border: `1px solid ${c.border}` }}
      >
        {children}
        {reimplemented && (
          <span className="absolute left-2 top-1.5 text-[9px] font-semibold uppercase tracking-wider text-amber-400">
            reimplemented for display
          </span>
        )}
      </div>
      <span className="font-mono text-[12px]" style={{ color: c.label }}>
        {label}
      </span>
    </div>
  );
}

function Arrow() {
  return <div className="mt-[22px] text-neutral-600">→</div>;
}

/* ------------------------------------------------------------------ */
/*  Reimplemented-for-display look-alikes                              */
/*                                                                      */
/*  Each one below reproduces the EXACT className + CSS-module rule a   */
/*  real page uses today, so the tile shows the true rendered look of   */
/*  the debt — not a generic placeholder. Styles are copied verbatim    */
/*  from each page's own .module.css (cited per row) since those        */
/*  classes are page-local and not importable in isolation.             */
/* ------------------------------------------------------------------ */

/** Recreation of the shared `formStyles.heading` rule
 * (src/pages/shared/form.module.css:14-20), used verbatim by 7 pages. */
function FormHeadingLookalike({ children }: { children: ReactNode }) {
  return (
    <h1
      style={{
        margin: 0,
        fontSize: "var(--font-size-title)",
        fontWeight: 800,
        color: "var(--text-primary)",
        letterSpacing: "-0.01em",
      }}
    >
      {children}
    </h1>
  );
}

/** Recreation of HomePage.module.css:22-28 `.title`. */
function HomeTitleLookalike({ children }: { children: ReactNode }) {
  return (
    <h1
      style={{
        fontSize: "var(--font-size-display)",
        fontWeight: 800,
        letterSpacing: "-0.02em",
        color: "var(--text-primary)",
        margin: 0,
      }}
    >
      {children}
    </h1>
  );
}

/** Recreation of OutcomePanel.module.css:51-56 `.title`. */
function OutcomeTitleLookalike({ children }: { children: ReactNode }) {
  return (
    <h1
      style={{
        fontSize: "var(--font-size-title)",
        fontWeight: 700,
        color: "var(--text-primary)",
        margin: 0,
      }}
    >
      {children}
    </h1>
  );
}

/** Recreation of HelpPage.module.css:33-37 `.groupTitle`. */
function HelpGroupTitleLookalike({ children }: { children: ReactNode }) {
  return (
    <h2
      style={{
        margin: 0,
        fontSize: "var(--font-size-body)",
        fontWeight: 700,
        color: "var(--text-primary)",
      }}
    >
      {children}
    </h2>
  );
}

/* ------------------------------------------------------------------ */
/*  Rows                                                                */
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
    title: "A shared raw `<h1>` style is used by 7 pages instead of Heading",
    body: (
      <>
        <Code>src/pages/shared/form.module.css</Code> defines a <Code>.heading</Code> rule that 7
        page components render as a raw <Code>{"<h1 className={formStyles.heading}>"}</Code>{" "}
        instead of <Code>{"<Heading level={1}>"}</Code>. None of the 7 set a font-family, so they
        inherit the body default — meaning every one of these page titles renders in{" "}
        <strong>SF Pro</strong>, not the Lato the Heading atom reserves for exactly this job. The
        size (22px) and weight (800) also don't match any real Heading level (30px/24px/20px at
        weight 600).
      </>
    ),
    bullets: [
      <>
        <Code>src/pages/shared/form.module.css:14-20</Code>{" "}
        <Note>the shared `.heading` rule itself</Note>
      </>,
      <>
        <Code>src/pages/EnterTokenIdPage.tsx:114</Code>
      </>,
      <>
        <Code>src/pages/InstallerInformationPage.tsx:65</Code>
      </>,
      <>
        <Code>src/pages/ChargerElectricalInformationPage.tsx:145</Code>
      </>,
      <>
        <Code>src/pages/ConnectorInformationDetailsPage.tsx:242</Code>
      </>,
      <>
        <Code>src/pages/CommunicationChecklistPage.tsx:85</Code>
      </>,
      <>
        <Code>src/pages/PhysicalHealthinessPage.tsx:37</Code>
      </>,
      <>
        <Code>src/pages/AutomatedOcppTestingPage.tsx:162</Code>
      </>,
    ],
    fix: (
      <>
        Replace all 7 <Code>{"<h1 className={formStyles.heading}>"}</Code> call sites with{" "}
        <Code>{"<Heading level={1}>"}</Code> and delete the now-unused <Code>.heading</Code> rule
        from <Code>form.module.css</Code>. This is a visible change (size/weight/font-family all
        shift) — propose it, don't land it silently.
      </>
    ),
    visual: (
      <div className="flex items-start gap-4 pt-1">
        <Tile tone="remove" label="formStyles.heading · 7 call sites" reimplemented>
          <FormHeadingLookalike>Enter token ID</FormHeadingLookalike>
        </Tile>
        <Arrow />
        <Tile tone="target" label="Heading level={1}">
          <Heading level={1}>Enter token ID</Heading>
        </Tile>
      </div>
    ),
  },
  {
    title: "HomePage's hero title hand-rolls what level 1 already does",
    body: (
      <>
        The landing screen's own <Code>.title</Code> rule duplicates a page-heading look —
        28px/800 — directly in the page's CSS module instead of reaching for the Heading atom, and
        again never sets Lato.
      </>
    ),
    bullets: [
      <>
        <Code>src/pages/HomePage.tsx:128</Code>{" "}
        <Note>{'<h1 className={styles.title}>'}</Note>
      </>,
      <>
        <Code>src/pages/HomePage.module.css:22-28</Code> <Note>the `.title` rule</Note>
      </>,
    ],
    fix: (
      <>
        Swap for <Code>{"<Heading level={1}>"}</Code> and drop the bespoke <Code>.title</Code>{" "}
        rule, keeping <Code>.subtitle</Code> as plain body text underneath.
      </>
    ),
    visual: (
      <div className="flex items-start gap-4 pt-1">
        <Tile tone="remove" label="HomePage.module.css:22" reimplemented>
          <HomeTitleLookalike>Install a DynaChrg charger</HomeTitleLookalike>
        </Tile>
        <Arrow />
        <Tile tone="target" label="Heading level={1}">
          <Heading level={1}>Install a DynaChrg charger</Heading>
        </Tile>
      </div>
    ),
  },
  {
    title: "OutcomePanel (molecule) hand-rolls its own title instead of composing Heading",
    body: (
      <>
        <Code>OutcomePanel</Code> is a molecule — by the atomic-design rule in CLAUDE.md §1 it may
        compose atoms, and Heading is exactly the atom this job calls for — but its title is a raw{" "}
        <Code>{"<h1>"}</Code> styled from its own CSS module rather than an imported{" "}
        <Code>{"<Heading>"}</Code>.
      </>
    ),
    bullets: [
      <>
        <Code>src/components/molecules/OutcomePanel.tsx:51</Code>{" "}
        <Note>{'<h1 className={styles.title}>'}</Note>
      </>,
      <>
        <Code>src/components/molecules/OutcomePanel.module.css:51-56</Code>{" "}
        <Note>the `.title` rule</Note>
      </>,
    ],
    fix: (
      <>
        Replace with <Code>{"<Heading level={1}>"}</Code> inside OutcomePanel; delete the{" "}
        <Code>.title</Code> rule. This is the clearest case — a molecule reimplementing an atom it
        is explicitly allowed to compose.
      </>
    ),
    visual: (
      <div className="flex items-start gap-4 pt-1">
        <Tile tone="remove" label="OutcomePanel.module.css:51" reimplemented>
          <OutcomeTitleLookalike>Installation complete</OutcomeTitleLookalike>
        </Tile>
        <Arrow />
        <Tile tone="target" label="Heading level={1}">
          <Heading level={1}>Installation complete</Heading>
        </Tile>
      </div>
    ),
  },
  {
    title: "HelpPage's group headings are a raw `<h2>` at a non-heading size",
    body: (
      <>
        Each FAQ group on the Help screen renders its label as a raw{" "}
        <Code>{"<h2 className={styles.groupTitle}>"}</Code> at 15px/700 — smaller than any real
        Heading level (the smallest, level 3, is 20px). This is a borderline case: it may genuinely
        want a size below what Heading currently offers, which is itself worth flagging rather
        than silently forcing it onto level 3.
      </>
    ),
    bullets: [
      <>
        <Code>src/pages/HelpPage.tsx:34</Code> <Note>{'<h2 className={styles.groupTitle}>'}</Note>
      </>,
      <>
        <Code>src/pages/HelpPage.module.css:33-37</Code> <Note>the `.groupTitle` rule</Note>
      </>,
    ],
    fix: (
      <>
        Either move it onto <Code>{"<Heading level={3}>"}</Code> (accepting the size bump to 20px
        and the Lato switch for consistency), or — if 15px is intentionally wanted for dense FAQ
        groups — that's a case for a 4th Heading level, not a reason to keep a parallel hand-rolled
        heading. Either way, decide and declare it; don't leave a silent 4th, undocumented heading
        style in the app.
      </>
    ),
    visual: (
      <div className="flex items-start gap-4 pt-1">
        <Tile tone="warn" label="HelpPage.module.css:33 · decide" reimplemented>
          <HelpGroupTitleLookalike>Installation questions</HelpGroupTitleLookalike>
        </Tile>
      </div>
    ),
  },
];

/* ------------------------------------------------------------------ */
/*  Storyboard                                                          */
/* ------------------------------------------------------------------ */

function DebtRowView({ row }: { row: DebtRow }) {
  return (
    <div className="grid grid-cols-[300px_1fr] gap-14 border-b border-neutral-800 py-8">
      <div className="text-[15px] font-semibold leading-snug text-neutral-50">{row.title}</div>
      <div className="flex flex-col gap-4">
        <div className="text-[13px] leading-relaxed text-neutral-400">{row.body}</div>
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
        description="Wordmark has exactly 1 real call site and no duplicated 'DYNA'/'DynaChrg' text was found anywhere outside Wordmark.tsx — no wordmark debt to report. Heading is different: 8 real call sites across 4 distinct source locations hand-roll a heading-style h1/h2 with page-local CSS instead of importing Heading, and none of them use the Lato heading font. Each row below cites file:line and a proposed fix; nothing here has been applied to prod."
      />

      <div className="flex flex-col">
        {ROWS.map((row) => (
          <DebtRowView key={row.title} row={row} />
        ))}
      </div>

      <div className="mt-8 max-w-[760px] rounded-lg border border-neutral-800 bg-neutral-900/50 px-5 py-4 text-[13px] leading-relaxed text-neutral-400">
        <span className="font-semibold text-neutral-200">Declare as you fix.</span> Migrating any
        row above onto <Code>Heading</Code> needs no new <Code>defineAsset</Code> — it's already
        declared on this canvas. The fix is purely deleting the page-local CSS rule and the raw
        tag, so the Lato/SF-Pro split in tokens.css actually holds everywhere a page has a
        heading, not just the 3 pages that already use the atom.
      </div>
    </PageFrame>
  );
}
