import type { ReactNode } from "react";

/**
 * Shared storyboard chrome for the "Foundations" design-system canvas. Every
 * storyboard renders inside <PageFrame> with a <PageTitle>, so the whole
 * series reads as one document. Colors reference this app's real tokens
 * (src/styles/tokens.css) via CSS custom properties — never literals — even
 * though this file lives on the canvas, not in src/.
 */

interface PageFrameProps {
  children: ReactNode;
  dark?: boolean;
}

export function PageFrame({ children, dark }: PageFrameProps) {
  return (
    <div
      className="min-h-full"
      style={{
        fontFamily: "var(--font-family-base)",
        background: dark ? "var(--color-neutral-900)" : "var(--surface-page)",
        color: dark ? "var(--color-neutral-0)" : "var(--text-primary)",
      }}
    >
      <div
        className="flex items-center gap-3 px-12"
        style={{
          height: 52,
          borderBottom: `1px solid ${dark ? "var(--color-neutral-800)" : "var(--border-subtle)"}`,
        }}
      >
        <div
          className="uppercase tracking-widest"
          style={{
            fontSize: "var(--font-size-micro)",
            letterSpacing: "var(--tracking-micro)",
            color: dark ? "var(--color-neutral-500)" : "var(--text-tertiary)",
          }}
        >
          design system
        </div>
        <div style={{ color: "var(--color-neutral-400)" }}>·</div>
        <div
          className="uppercase tracking-widest"
          style={{
            fontSize: "var(--font-size-micro)",
            letterSpacing: "var(--tracking-micro)",
            color: dark ? "var(--color-neutral-600)" : "var(--text-tertiary)",
            opacity: 0.8,
          }}
        >
          foundations
        </div>
      </div>
      <div className="px-12 py-12">{children}</div>
    </div>
  );
}

interface PageTitleProps {
  title: string;
  description: ReactNode;
}

export function PageTitle({ title, description }: PageTitleProps) {
  return (
    <div className="flex flex-col gap-3 pb-10" style={{ maxWidth: 620 }}>
      <h1
        style={{
          fontSize: "var(--font-size-title)",
          lineHeight: "var(--line-height-title)",
          fontWeight: "var(--weight-title)" as unknown as number,
          letterSpacing: "-0.01em",
          margin: 0,
        }}
      >
        {title}
      </h1>
      <p
        style={{
          fontSize: "var(--font-size-body)",
          lineHeight: "var(--line-height-body)",
          color: "var(--text-secondary)",
          margin: 0,
        }}
      >
        {description}
      </p>
    </div>
  );
}

interface SectionProps {
  title: string;
  description?: ReactNode;
  children: ReactNode;
}

/** A labeled section heading above a block of swatches/specimens. */
export function Section({ title, description, children }: SectionProps) {
  return (
    <div className="flex flex-col gap-5 py-8" style={{ borderTop: "1px solid var(--border-subtle)" }}>
      <div className="flex flex-col gap-1.5">
        <div style={{ fontSize: "var(--font-size-headline)", fontWeight: 700, color: "var(--text-primary)" }}>
          {title}
        </div>
        {description && (
          <div
            style={{
              fontSize: "var(--font-size-body)",
              lineHeight: "var(--line-height-body)",
              color: "var(--text-secondary)",
              maxWidth: 760,
            }}
          >
            {description}
          </div>
        )}
      </div>
      {children}
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: ReactNode;
  detail: string;
}

export function StatCard({ label, value, detail }: StatCardProps) {
  return (
    <div className="p-4" style={{ borderRadius: "var(--radius-lg)", border: "1px solid var(--border-subtle)" }}>
      <div
        className="pb-2 uppercase"
        style={{
          fontSize: "var(--font-size-micro)",
          letterSpacing: "var(--tracking-micro)",
          color: "var(--text-tertiary)",
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: "var(--font-size-title)", fontWeight: 700, color: "var(--text-primary)" }}>
        {value}
      </div>
      <div className="pt-1" style={{ fontSize: "var(--font-size-caption)", color: "var(--text-secondary)" }}>
        {detail}
      </div>
    </div>
  );
}

export function Code({ children }: { children: ReactNode }) {
  return (
    <code
      style={{
        fontFamily: "monospace",
        fontSize: 12.5,
        color: "var(--text-primary)",
        background: "var(--surface-sunken)",
        borderRadius: "var(--radius-sm)",
        padding: "1px 5px",
      }}
    >
      {children}
    </code>
  );
}

interface SwatchProps {
  /** The CSS custom property name, e.g. "--color-brand-orange-500". */
  varName: string;
  /** The literal value as authored in tokens.css, shown as the real source-of-truth string. */
  rawValue: string;
  /** Optional extra label under the raw value, e.g. an alias note. */
  note?: ReactNode;
  /** Text color to use on top of the swatch for contrast (defaults to white). */
  onColor?: string;
}

/** A real color swatch: background IS var(--varName), with its name + raw value as text underneath. */
export function Swatch({ varName, rawValue, note, onColor }: SwatchProps) {
  return (
    <div className="flex flex-col gap-2" style={{ width: 148 }}>
      <div
        className="flex items-end p-2.5"
        style={{
          height: 72,
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--border-subtle)",
          background: `var(${varName})`,
        }}
      >
        <span style={{ fontSize: 10, fontFamily: "monospace", color: onColor ?? "rgba(255,255,255,0.85)" }}>
          {rawValue}
        </span>
      </div>
      <div className="flex flex-col gap-0.5">
        <Code>{varName}</Code>
        {note && (
          <span style={{ fontSize: "var(--font-size-caption)", color: "var(--text-tertiary)" }}>{note}</span>
        )}
      </div>
    </div>
  );
}
