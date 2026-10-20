import type { ReactNode } from "react";

/**
 * Shared storyboard chrome for the "Buttons and Icon Actions" design-system
 * canvas. Every storyboard renders inside <PageFrame> with a <PageTitle>, so
 * the whole series reads as one document. Colors reference this app's real
 * tokens (src/styles/tokens.css) via CSS custom properties — never literals —
 * even though this file lives on the canvas, not in src/.
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
          buttons &amp; icon actions
        </div>
      </div>
      <div className="px-12 py-12">{children}</div>
    </div>
  );
}

interface PageTitleProps {
  title: string;
  description: string;
}

export function PageTitle({ title, description }: PageTitleProps) {
  return (
    <div className="flex flex-col gap-3 pb-10" style={{ maxWidth: 480 }}>
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

interface RowProps {
  name: string;
  description: string;
  children: ReactNode;
}

/** A labeled guideline row: name + description on the left, live demo panel on the right. */
export function Row({ name, description, children }: RowProps) {
  return (
    <div
      className="grid gap-14 py-10"
      style={{
        gridTemplateColumns: "260px 1fr",
        borderTop: "1px solid var(--border-subtle)",
      }}
    >
      <div className="flex flex-col gap-2 pt-2">
        <div style={{ fontSize: "var(--font-size-body)", fontWeight: 600, color: "var(--text-primary)" }}>
          {name}
        </div>
        <div
          style={{
            fontSize: "var(--font-size-body)",
            color: "var(--text-secondary)",
            lineHeight: "var(--line-height-body)",
          }}
        >
          {description}
        </div>
      </div>
      <div
        className="flex min-w-0 flex-col justify-center gap-4 p-6"
        style={{
          minHeight: 110,
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--border-subtle)",
          background: "var(--surface-sunken)",
        }}
      >
        {children}
      </div>
    </div>
  );
}

interface DemoProps {
  label: string;
  children: ReactNode;
}

/** One demo line inside a Row panel: a small label + the rendered examples. */
export function Demo({ label, children }: DemoProps) {
  return (
    <div className="flex items-center gap-6">
      <div
        className="shrink-0"
        style={{ width: 90, fontSize: "var(--font-size-caption)", color: "var(--text-tertiary)" }}
      >
        {label}
      </div>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
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
    <div
      className="p-4"
      style={{ borderRadius: "var(--radius-lg)", border: "1px solid var(--border-subtle)" }}
    >
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
