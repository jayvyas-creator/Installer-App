import type { ElementType, HTMLAttributes } from "react";
import { defineControls } from "tempo-sdk/assets";
import styles from "./Heading.module.css";

export type HeadingLevel = 1 | 2 | 3;

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level?: HeadingLevel;
}

const TAG: Record<HeadingLevel, ElementType> = { 1: "h1", 2: "h2", 3: "h3" };

// Uses --font-family-heading (Lato) — every other piece of text on the page
// uses --font-family-base (SF Pro) via the global body style.
//
// The canvas for this component is at
// tempo/designs/design-system/typography-and-brand/index.canvas.tsx. If you
// adjust this component in any way, ensure the canvas and its asset
// declaration stay consistent.
export function Heading({ level = 1, className, children, ...rest }: HeadingProps) {
  const Tag = TAG[level];
  return (
    <Tag className={[styles.heading, styles[`level${level}`], className ?? ""].filter(Boolean).join(" ")} {...rest}>
      {children}
    </Tag>
  );
}

defineControls(Heading, {
  level: { type: "select" },
  children: { type: "text" },
  className: false,
});
