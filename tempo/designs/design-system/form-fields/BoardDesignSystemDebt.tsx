import type { ReactNode } from "react";
import { Plus } from "lucide-react";
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
        <li key={i} className="flex gap-2.5 text-body leading-relaxed">
          <span className="select-none text-neutral-600">•</span>
          <span className="text-neutral-400">{it}</span>
        </li>
      ))}
    </ul>
  );
}

function Fix({ children }: { children: ReactNode }) {
  return (
    <div className="text-body leading-relaxed text-neutral-300">
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
   * original is inline JSX in an app page and cannot be imported in isolation. */
  reimplemented?: boolean;
  children: ReactNode;
}) {
  const c = TILE[tone];
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`relative flex min-h-[64px] min-w-[220px] items-center justify-center rounded-xl px-4 py-3 ${reimplemented ? "pt-7" : ""}`}
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
/*                                                                     */
/*  The originals are inline <button> JSX inside SiteInformationPage   */
/*  and CreateSiteAreaPage — private to those files, not exported, and */
/*  so cannot be imported and rendered here in isolation. Each copy    */
/*  below exists ONLY to depict the debt on this storyboard and is     */
/*  labeled as such on its tile. Nothing here is a component to reuse. */
/* ------------------------------------------------------------------ */

/** Recreation of SiteInformationPage.tsx:211's inline dashed-add-row button. */
function DashedAddRowSiteInfoLookalike() {
  return (
    <button
      type="button"
      className="flex w-full min-h-[44px] items-center justify-center gap-2 rounded-lg px-4 py-3 text-[13px] font-semibold"
      style={{
        border: "1.5px dashed #a1a1aa",
        color: "#c2651c",
      }}
    >
      Create new site area
    </button>
  );
}

/** Recreation of CreateSiteAreaPage.tsx:148's inline dashed-add-row button
 * (same formStyles.dashedAddRow class, different copy and onClick target). */
function DashedAddRowCreateAreaLookalike() {
  return (
    <button
      type="button"
      className="flex w-full min-h-[44px] items-center justify-center gap-2 rounded-lg px-4 py-3 text-[13px] font-semibold"
      style={{
        border: "1.5px dashed #a1a1aa",
        color: "#c2651c",
      }}
    >
      Choose an existing site area instead
    </button>
  );
}

/** Proposed fix, option B: a small new molecule, AddRowButton, built from the
 * same tokens formStyles.dashedAddRow already uses (--border-strong,
 * --text-link, --color-brand-orange-50/500 on hover) instead of a second
 * hand-rolled copy of the same CSS module class. */
function AddRowButtonProposal({ children }: { children: ReactNode }) {
  return (
    <button
      type="button"
      className="flex w-full min-h-[44px] items-center justify-center gap-2 rounded-lg px-4 py-3 text-[13px] font-semibold transition-colors"
      style={{
        border: "1.5px dashed #a1a1aa",
        color: "#c2651c",
      }}
    >
      <Plus size={14} aria-hidden />
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Row                                                                 */
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
    title: "Dashed \"add row\" affordance — hand-rolled twice, identically",
    body: (
      <>
        Site Information and Create Site Area both need the same affordance —
        a full-width, dashed-border row that offers the opposite path through
        the site-area step (create a new area vs. pick an existing one). Both
        screens hand-roll it as a bare <Code>{'<button type="button">'}</Code> sharing
        one CSS module class, rather than either one importing a shared
        component. Two independent implementations of one concept, with zero
        shared component backing either.
      </>
    ),
    bullets: [
      <>
        <Code>src/pages/SiteInformationPage.tsx:211-213</Code>{" "}
        <Note>
          — <Code>{'<button type="button" className={formStyles.dashedAddRow} onClick={() => navigate("/site-area/new")}>'}</Code>,
          rendered only in the "several areas" branch, below the site-area{" "}
          <Code>SelectField&lt;string&gt;</Code> and its capacity panel
        </Note>
      </>,
      <>
        <Code>src/pages/CreateSiteAreaPage.tsx:148-150</Code>{" "}
        <Note>
          — <Code>{'<button type="button" className={formStyles.dashedAddRow} onClick={() => navigate("/site-information")}>'}</Code>,
          rendered only when <Code>hasExistingAreas</Code> is true, below the
          form's <Code>ReadOnlyField</Code> max-power preview
        </Note>
      </>,
      <>
        <Code>src/pages/shared/form.module.css:70-89</Code>{" "}
        <Note>
          — the one <Code>.dashedAddRow</Code> class both call sites import
          and apply by string, with no component wrapping it
        </Note>
      </>,
    ],
    fix: (
      <>
        Promote the pattern to a small molecule — <Code>AddRowButton</Code> (or,
        alternatively, a dashed/outline &quot;add&quot; variant on the existing{" "}
        <Code>Button</Code> atom, though its pill shape and sizing don't
        naturally fit a full-width dashed row). Either way: one component,
        declared with <Code>defineAsset</Code>, migrated into both pages, and
        the duplicated class deleted from <Code>form.module.css</Code> once
        nothing references it directly.
      </>
    ),
    visual: (
      <div className="flex flex-col gap-6 pt-1">
        <div className="flex items-start gap-4">
          <Tile tone="remove" label="SiteInformationPage.tsx:211" reimplemented>
            <DashedAddRowSiteInfoLookalike />
          </Tile>
          <Tile tone="remove" label="CreateSiteAreaPage.tsx:148" reimplemented>
            <DashedAddRowCreateAreaLookalike />
          </Tile>
        </div>
        <div className="flex items-start gap-4">
          <Arrow />
          <Tile tone="target" label="AddRowButton (proposed molecule)" reimplemented>
            <AddRowButtonProposal>Create new site area</AddRowButtonProposal>
          </Tile>
          <Tile tone="target" label="same component, different copy" reimplemented>
            <AddRowButtonProposal>Choose an existing site area instead</AddRowButtonProposal>
          </Tile>
        </div>
      </div>
    ),
  },
];

/* ------------------------------------------------------------------ */
/*  Storyboard                                                         */
/* ------------------------------------------------------------------ */

function DebtRowView({ row }: { row: DebtRow }) {
  return (
    <div className="grid grid-cols-[320px_1fr] gap-14 border-b border-neutral-800 py-8">
      <div className="text-body font-semibold leading-snug text-neutral-50">
        {row.title}
      </div>
      <div className="flex flex-col gap-4">
        <div className="text-body leading-relaxed text-neutral-400">
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
        description="The other storyboards on this canvas depict the fused-atom field system as it exists in production. This one documents a gap: a hand-rolled, duplicated pattern with zero shared component backing it. Prod is deliberately NOT touched in this pass — this is a proposal with evidence, not a done deed. Tiles marked 'reimplemented for display' recreate inline JSX that lives in app pages and cannot be rendered in isolation; those recreations exist only on this storyboard."
      />

      <div className="flex flex-col">
        {ROWS.map((row) => (
          <DebtRowView key={row.title} row={row} />
        ))}
      </div>

      <div className="mt-8 max-w-[720px] rounded-lg border border-neutral-800 bg-neutral-900/50 px-5 py-4 text-body leading-relaxed text-neutral-400">
        <span className="font-semibold text-neutral-200">
          Declare as you fix.
        </span>{" "}
        A component no canvas declares is invisible to the Assets tab and to
        agents. If <Code>AddRowButton</Code> (or a new <Code>Button</Code> variant)
        gets built, it should end with a <Code>defineAsset(Component, {"{…}"})</Code>{" "}
        declaration on this canvas — the component imported here, with a{" "}
        <Code>usageInstructions</Code> — plus the canvas-pointer docstring in
        the component&apos;s own file, so the fix becomes discoverable instead
        of a third hand-rolled copy.
      </div>
    </PageFrame>
  );
}
