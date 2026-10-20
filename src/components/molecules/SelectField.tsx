import { Select, type SelectOption, type SelectProps } from "@/components/atoms/Select";
import { defineControls } from "tempo-sdk/assets";

/**
 * The canvas for this component is at
 * tempo/designs/design-system/form-fields/index.canvas.tsx. If you adjust
 * this component in any way, ensure the canvas and its asset declaration
 * stay consistent.
 */
export interface SelectFieldOption<T extends string> {
  value: T;
  label: string;
  disabled?: boolean;
}

export interface SelectFieldProps<T extends string>
  extends Omit<SelectProps, "options" | "value" | "onChange"> {
  options: SelectFieldOption<T>[];
  value: T | "";
  onValueChange: (value: T) => void;
}

// Type-safe wrapper around the atom: callers get a union-typed value instead
// of plumbing ChangeEvent<HTMLSelectElement> through every call site.
export function SelectField<T extends string>({
  options,
  value,
  onValueChange,
  ...rest
}: SelectFieldProps<T>) {
  const plainOptions: SelectOption[] = options;
  return (
    <Select
      {...rest}
      options={plainOptions}
      value={value}
      onChange={(event) => onValueChange(event.target.value as T)}
    />
  );
}

defineControls(SelectField, {
  label: { type: "text" },
  placeholder: { type: "text" },
  helperText: { type: "text" },
  errorText: { type: "text" },
  required: { type: "boolean" },
  disabled: { type: "boolean" },
  options: false,
  value: false,
  onValueChange: false,
});
