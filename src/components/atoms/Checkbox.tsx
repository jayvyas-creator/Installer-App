import { Check } from "lucide-react";
import { useId, type InputHTMLAttributes, type Ref } from "react";
import styles from "./Checkbox.module.css";

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
