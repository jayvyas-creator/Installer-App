import { Check } from "lucide-react";
import { useId, type InputHTMLAttributes, type Ref } from "react";
import { defineControls } from "tempo-sdk/assets";
import styles from "./Checkbox.module.css";

/**
 * The canvas for this component is at
 * tempo/designs/design-system/form-fields/index.canvas.tsx. If you adjust
 * this component in any way, ensure the canvas and its asset declaration
 * stay consistent.
 */
export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "type"> {
  checked: boolean;
  ref?: Ref<HTMLInputElement>;
}

export function Checkbox({ checked, disabled, className, ref, ...rest }: CheckboxProps) {
  const id = useId();
  return (
    <span
      className={[styles.wrapper, className ?? ""].filter(Boolean).join(" ")}
      data-checked={checked || undefined}
      data-disabled={disabled || undefined}
    >
      <input
        ref={ref}
        id={id}
        type="checkbox"
        className={styles.input}
        checked={checked}
        disabled={disabled}
        {...rest}
      />
      <Check size={16} strokeWidth={3} className={styles.check} aria-hidden />
    </span>
  );
}

defineControls(Checkbox, {
  checked: { type: "boolean" },
  disabled: { type: "boolean" },
  onChange: false,
});
