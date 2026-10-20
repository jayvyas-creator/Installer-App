import type { ReactNode } from "react";

/**
 * Shared storyboard chrome for the design-system canvas series. Every
 * storyboard on every canvas in the series renders inside <PageFrame> with a
 * <PageTitle>, so the whole series reads as one document.
 *
 * This project has no custom Tailwind theme (no text-label/text-body style
 * utilities) — only the default Tailwind v4 palette plus this app's own
 * tokens.css, imported globally into the canvas host. Chrome text below uses
 * arbitrary-value classes bound directly to the real custom properties
 * (var(--font-size-body), etc.) instead of inventing utility names that
 * don't exist in this codebase.
 */

interface PageFrameProps {
  children: ReactNode;
  dark?: boolean;
}

export function PageFrame({ children, dark }: PageFrameProps) {
  return (
    <div
      className={`${dark ? "bg-neutral-950 text-neutral-50" : "bg-white text-neutral-900"} min-h-full`}
      style={{ fontFamily: "var(--font-family-base)" }}
    >
      <div
        className={`flex h-[52px] items-center gap-3 border-b ${dark ? "border-neutral-800" : "border-neutral-200"} px-12`}
      >
        <div className="text-[11px] uppercase tracking-widest text-neutral-500">
          design system
        </div>
        <div className="text-[11px] text-neutral-400">·</div>
        <div className="text-[11px] uppercase tracking-widest text-neutral-400">
          typography &amp; brand
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
    <div className="flex flex-col gap-3 pb-10 max-w-[460px]">
      <h1 className="text-[22px] leading-[28px] font-semibold tracking-tight">
        {title}
      </h1>
      <p
        className="text-neutral-500 leading-relaxed"
        style={{ fontSize: "var(--font-size-body)", lineHeight: "var(--line-height-body)" }}
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
    <div className="grid grid-cols-[260px_1fr] gap-14 border-t border-neutral-100 py-10 first:border-t-0">
      <div className="flex flex-col gap-2 pt-2">
        <div
          className="font-medium text-neutral-900"
          style={{ fontSize: "var(--font-size-body)" }}
        >
          {name}
        </div>
        <div
          className="text-neutral-500 leading-snug"
          style={{ fontSize: "var(--font-size-caption)" }}
        >
          {description}
        </div>
      </div>
      <div className="flex min-h-[110px] min-w-0 flex-col justify-center gap-4 rounded-lg border border-neutral-200 bg-neutral-50 p-6">
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
      <div className="w-24 shrink-0 text-[11px] text-neutral-400">{label}</div>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}
