import type { CSSProperties, ReactNode } from "react";
import { QrCode } from "lucide-react";
import { Button } from "../../../../src/components/atoms/Button";
import { PageFrame, PageTitle } from "./Chrome";

/* ------------------------------------------------------------------ */
/*  Building blocks                                                    */
/* ------------------------------------------------------------------ */

function Code({ children }: { children: ReactNode }) {
  return (
    <code style={{ fontFamily: "monospace", fontSize: 13, color: "var(--color-neutral-200)" }}>{children}</code>
  );
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
  reimplemented,
  children,
}: {
  tone?: TileTone;
  label: string;
  /** Marks a tile whose contents are RECREATED for display because the
   * original lives inline in app page code and cannot be imported in
   * isolation (it depends on page-local state, refs and hooks). */
  reimplemented?: boolean;
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
          paddingTop: reimplemented ? 28 : undefined,
        }}
      >
        {children}
        {reimplemented && (
          <span
            className="absolute uppercase"
            style={{
              left: 8,
              top: 6,
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "0.06em",
              color: "#fbbf24",
            }}
          >
            reimplemented for display
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

/* ------------------------------------------------------------------ */
/*  Reimplemented-for-display look-alikes                              */
/*                                                                     */
/*  The originals are raw JSX inline in src/pages/HomePage.tsx. They   */
/*  depend on that page's local refs/state/handlers (scanTriggerRef,   */
/*  handleScanClick, qr.toggleTorch, ...) and cannot be imported and   */
/*  rendered in isolation. Each copy below exists ONLY to depict the   */
/*  debt on this storyboard and is labeled as such on its tile. Values */
/*  (colors, spacing, border style) are copied from                    */
/*  src/pages/HomePage.module.css so the shape is faithful. Nothing    */
/*  here is a component anyone should use.                             */
/* ------------------------------------------------------------------ */

/** Recreation of the manual-entry scan trigger at HomePage.tsx:152-160
 * (className={styles.scanTrigger}, styles at HomePage.module.css:59-79). */
function ScanTriggerLookalike() {
  return (
    <button
      type="button"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "var(--space-2)",
        width: 220,
        minHeight: 56,
        border: "1.5px dashed var(--border-strong)",
        borderRadius: "var(--radius-lg)",
        color: "var(--text-primary)",
        fontWeight: 700,
        fontSize: "var(--font-size-body)",
        background: "var(--surface-sunken)",
      }}
    >
      <QrCode size={20} aria-hidden />
      Scan QR code
    </button>
  );
}

/** Recreation of the scanner-overlay footer link trio at HomePage.tsx:225-240
 * (three separate className={styles.manualLink} buttons: cancel, torch
 * toggle, simulate-scan — styles at HomePage.module.css:185-192). */
function OverlayLinksLookalike() {
  const linkStyle: CSSProperties = {
    color: "var(--color-neutral-0)",
    fontSize: "var(--font-size-caption)",
    fontWeight: 700,
    textDecoration: "underline",
    textUnderlineOffset: 3,
    opacity: 0.9,
    background: "none",
    border: "none",
  };
  return (
    <div
      className="flex items-center gap-6 px-4 py-3"
      style={{ background: "var(--color-neutral-900)", borderRadius: "var(--radius-md)" }}
    >
      <button type="button" style={linkStyle}>
        Cancel
      </button>
      <button type="button" style={linkStyle}>
        Turn on torch
      </button>
      <button type="button" style={linkStyle}>
        Simulate scan
      </button>
    </div>
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
    title: "Four raw <button> elements on HomePage bypass Button/IconButton entirely",
    body: (
      <>
        <Code>src/pages/HomePage.tsx</Code> hand-rolls its own buttons instead
        of reaching for the atoms used everywhere else in the install flow —
        each one restyles a plain <Code>{'<button type="button">'}</Code> with
        a page-local CSS-module class instead of composing{" "}
        <Code>Button</Code> or <Code>IconButton</Code>. One more look an AI
        agent (or a developer) can copy by accident instead of the blessed
        atom.
      </>
    ),
    bullets: [
      <>
        <Code>HomePage.tsx:152-160</Code>{" "}
        <Note>
          — the "Scan QR code" manual-entry trigger,{" "}
          <Code>className={"{styles.scanTrigger}"}</Code>, icon + label, full
          width dashed card (styles at <Code>HomePage.module.css:59-79</Code>)
        </Note>
      </>,
      <>
        <Code>HomePage.tsx:225-227</Code>{" "}
        <Note>
          — scanner-overlay "Cancel" link, <Code>className={"{styles.manualLink}"}</Code>
        </Note>
      </>,
      <>
        <Code>HomePage.tsx:229-231</Code>{" "}
        <Note>
          — torch toggle (conditionally rendered on <Code>qr.torchSupported</Code>),
          same <Code>manualLink</Code> class
        </Note>
      </>,
      <>
        <Code>HomePage.tsx:234-240</Code>{" "}
        <Note>
          — "Simulate scan" dev escape-hatch button, same <Code>manualLink</Code> class
          (<Code>manualLink</Code> styles at <Code>HomePage.module.css:185-192</Code>)
        </Note>
      </>,
    ],
    fix: (
      <>
        The dashed scan-trigger card is a <Code>Button</Code>{" "}
        <Code>variant="secondary"</Code> (or a new outline/dashed look if that
        shape recurs) with a <Code>leadingIcon</Code>. The three footer links
        sitting on the dark overlay are icon-less, low-emphasis actions on a
        dark surface — a new subtle/link-style <Code>Button</Code> variant (or
        tone), not three more one-off <Code>{"<button>"}</Code>s. The torch
        toggle is icon-only in the mobile source; once it carries just an icon
        it becomes an <Code>IconButton</Code> with{" "}
        <Code>tone="onBrand"</Code>-equivalent styling for a dark surface. Do
        NOT refactor <Code>HomePage.tsx</Code> in this pass — proposal only.
      </>
    ),
    visual: (
      <div className="flex flex-col gap-5 pt-1">
        <div className="flex items-start gap-4">
          <Tile tone="remove" label="HomePage.tsx:152-160" reimplemented>
            <ScanTriggerLookalike />
          </Tile>
          <Arrow />
          <Tile tone="target" label='Button variant="secondary"'>
            <Button variant="secondary" leadingIcon={<QrCode size={18} />}>
              Scan QR code
            </Button>
          </Tile>
        </div>
        <div className="flex items-start gap-4">
          <Tile tone="remove" label="HomePage.tsx:225-240 (×3)" reimplemented>
            <OverlayLinksLookalike />
          </Tile>
          <Arrow />
          <Tile tone="target" label="proposed Button link/subtle variant">
            <div
              className="flex items-center gap-6 px-4 py-3"
              style={{ background: "var(--color-neutral-900)", borderRadius: "var(--radius-md)" }}
            >
              <Button variant="ghost" size="md">
                Cancel
              </Button>
              <Button variant="ghost" size="md">
                Turn on torch
              </Button>
            </div>
          </Tile>
        </div>
      </div>
    ),
  },
  {
    title: "IconButton.module.css:43 — a raw rgba() literal instead of a token",
    body: (
      <>
        Every other color in this codebase — brand, semantic, surface, text,
        border — goes through <Code>src/styles/tokens.css</Code>. The{" "}
        <Code>onBrand</Code> tone's hover/press background is the one
        exception: a literal <Code>rgba(255, 255, 255, 0.16)</Code> baked
        directly into the CSS module.
      </>
    ),
    bullets: [
      <>
        <Code>src/components/atoms/IconButton.module.css:43</Code>{" "}
        <Note>
          — <Code>{"background: rgba(255, 255, 255, 0.16);"}</Code> inside{" "}
          <Code>.onBrand:hover:not(:disabled)</Code>
        </Note>
      </>,
      <>
        <Note>
          every sibling rule in the same file (
        </Note>
        <Code>:1-41</Code>
        <Note>) already references a token (</Note>
        <Code>var(--text-primary)</Code>
        <Note>, </Note>
        <Code>var(--surface-sunken)</Code>
        <Note>, …)</Note>
      </>,
    ],
    fix: (
      <>
        Add a token to the real OKLCH-based scale in{" "}
        <Code>src/styles/tokens.css</Code> next to the other overlay token (
        <Code>--color-disabled-overlay</Code>) — e.g.{" "}
        <Code>--color-overlay-on-brand-hover: rgba(255, 255, 255, 0.16);</Code>{" "}
        — and reference it from <Code>IconButton.module.css:43</Code> instead
        of the literal. No visual change, just a named source of truth.
      </>
    ),
    visual: (
      <div className="flex items-start gap-4 pt-1">
        <Tile tone="remove" label="rgba(255,255,255,0.16) · literal">
          <div
            className="flex items-center justify-center"
            style={{ width: 56, height: 56, borderRadius: "var(--radius-md)", background: "var(--surface-brand)" }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "var(--radius-full)",
                background: "rgba(255, 255, 255, 0.16)",
              }}
            />
          </div>
        </Tile>
        <Arrow />
        <Tile tone="target" label="--color-overlay-on-brand-hover">
          <div
            className="flex items-center justify-center"
            style={{ width: 56, height: 56, borderRadius: "var(--radius-md)", background: "var(--surface-brand)" }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "var(--radius-full)",
                background: "rgba(255, 255, 255, 0.16)",
              }}
            />
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
        description="The other storyboards on this canvas depict the target end-state of Button and IconButton. This one lists real gaps between the atoms and how the app actually uses (or bypasses) them, each with file:line evidence and a proposed fix. Prod is deliberately NOT touched in this pass — every row is a proposal. Tiles marked 'reimplemented for display' recreate code that lives inline in HomePage.tsx and cannot be rendered in isolation; those recreations exist only on this storyboard."
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
        <span style={{ fontWeight: 700, color: "var(--color-neutral-200)" }}>Declare as you fix.</span>{" "}
        A component no canvas declares is invisible to the Assets tab and to
        agents. Fixing either row above should end with the migrated call
        sites, the token added to <Code>tokens.css</Code> with a matching doc
        alias if applicable, and this canvas's <Code>defineAsset</Code>{" "}
        variants kept in sync with whatever new variant/tone the fix
        introduces.
      </div>
    </PageFrame>
  );
}
