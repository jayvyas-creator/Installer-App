import { Slot } from "@radix-ui/react-slot";
import type { ButtonHTMLAttributes, ReactNode, Ref } from "react";
import { defineControls } from "tempo-sdk/assets";
import styles from "./IconButton.module.css";

export interface IconButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  "aria-label": string;
  tone?: "default" | "subtle" | "onBrand";
  children: ReactNode;
  ref?: Ref<HTMLButtonElement>;
  /** Merge the icon button's classes and props onto a single child element (e.g. a router `Link`) instead of rendering a `<button>`. */
  asChild?: boolean;
}

/**
 * The canvas for this component is at
 * tempo/designs/design-system/buttons-and-icon-actions/index.canvas.tsx.
 * If you adjust this component in any way, ensure the canvas and its asset
 * declaration stay consistent.
 */
export function IconButton({
  tone = "default",
  className,
  children,
  ref,
  asChild = false,
  ...rest
}: IconButtonProps) {
  const toneClass =
    tone === "subtle" ? styles.subtle : tone === "onBrand" ? styles.onBrand : "";
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      ref={ref}
      className={[styles.iconButton, toneClass, className ?? ""]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {children}
    </Comp>
  );
}

defineControls(IconButton, {
  "aria-label": { type: "text" },
  tone: { type: "select" },
  asChild: { type: "boolean" },
  disabled: { type: "boolean" },
  children: false,
  className: false,
  onClick: false,
});
