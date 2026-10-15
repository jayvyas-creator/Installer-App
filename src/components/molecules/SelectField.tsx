import { Select, type SelectOption, type SelectProps } from "@/components/atoms/Select";

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
