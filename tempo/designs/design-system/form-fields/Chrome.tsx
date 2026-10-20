import type { ReactNode } from "react";

/**
 * Shared storyboard chrome for the Form Fields design-system canvas. Every
 * storyboard renders inside <PageFrame> with a <PageTitle>, so the series
 * reads as one document (mirrors the Buttons reference canvas's Chrome.tsx).
 */

interface PageFrameProps {
  children: ReactNode;
  dark?: boolean;
}

export function PageFrame({ children, dark }: PageFrameProps) {
  return (
    <div
      className={`${dark ? "bg-neutral-950 text-neutral-50" : "bg-white text-neutral-900"} min-h-full font-sans`}
    >
      <div
        className={`flex h-[52px] items-center gap-3 border-b ${dark ? "border-neutral-800" : "border-neutral-200"} px-12`}
      >
        <div className="text-label uppercase tracking-widest text-neutral-500">
          design system
        </div>
        <div className="text-label text-neutral-400">·</div>
        <div className="text-label uppercase tracking-widest text-neutral-400">
          form fields
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
    <div className="flex flex-col gap-3 pb-10 max-w-[560px]">
      <h1 className="text-[22px] leading-[28px] font-semibold tracking-tight">
        {title}
      </h1>
      <p className="text-body text-neutral-500 leading-relaxed">
        {description}
      </p>
    </div>
  );
}

interface RowProps {
  name: string;
  description: ReactNode;
  children: ReactNode;
}

/** A labeled guideline row: name + description on the left, live demo panel on the right. */
export function Row({ name, description, children }: RowProps) {
  return (
    <div className="grid grid-cols-[260px_1fr] gap-14 border-t border-neutral-100 py-10 first:border-t-0">
      <div className="flex flex-col gap-2 pt-2">
        <div className="text-body font-medium text-neutral-900">{name}</div>
        <div className="text-body text-neutral-500 leading-snug">
          {description}
        </div>
      </div>
      <div className="flex min-h-[110px] min-w-0 flex-col justify-center gap-5 rounded-lg border border-neutral-200 bg-surface-container-lowest p-6">
        {children}
      </div>
    </div>
  );
}

interface DemoProps {
  label: string;
  children: ReactNode;
}

/** One demo line inside a Row panel: a small label + the rendered example(s). */
export function Demo({ label, children }: DemoProps) {
  return (
    <div className="flex items-start gap-6">
      <div className="w-24 shrink-0 pt-3 text-label text-text-tertiary">{label}</div>
      <div className="flex min-w-0 flex-1 flex-wrap items-start gap-4">{children}</div>
    </div>
  );
}
