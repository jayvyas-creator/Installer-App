import type { ElementType, HTMLAttributes } from "react";
import styles from "./Heading.module.css";

export type HeadingLevel = 1 | 2 | 3;

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level?: HeadingLevel;
}

const TAG: Record<HeadingLevel, ElementType> = { 1: "h1", 2: "h2", 3: "h3" };

// Uses --font-family-heading (Lato) — every other piece of text on the page
// uses --font-family-base (SF Pro) via the global body style.
export function Heading({ level = 1, className, children, ...rest }: HeadingProps) {
  const Tag = TAG[level];
  return (
    <Tag className={[styles.heading, styles[`level${level}`], className ?? ""].filter(Boolean).join(" ")} {...rest}>
      {children}
    </Tag>
  );
}
