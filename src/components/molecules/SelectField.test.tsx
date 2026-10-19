import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, expect, it, vi } from "vitest";
import { SelectField } from "./SelectField";

type Tone = "brand" | "success" | "error";

const OPTIONS: { value: Tone; label: string }[] = [
  { value: "brand", label: "Brand" },
  { value: "success", label: "Success" },
  { value: "error", label: "Error" },
];

describe("SelectField", () => {
  it("renders the typed options", () => {
    render(
      <SelectField<Tone> label="Tone" options={OPTIONS} value="brand" onValueChange={() => {}} />,
    );
    expect(screen.getByRole("option", { name: "Success" })).toBeInTheDocument();
  });

  it("calls onValueChange with the typed union value, not the raw event", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <SelectField<Tone>
        label="Tone"
        options={OPTIONS}
        value="brand"
        onValueChange={onValueChange}
      />,
    );
    await user.selectOptions(screen.getByLabelText("Tone"), "error");
    expect(onValueChange).toHaveBeenCalledWith("error");
  });

  it("forwards a ref through to the underlying select element", () => {
    const ref = createRef<HTMLSelectElement>();
    render(
      <SelectField<Tone>
        label="Tone"
        options={OPTIONS}
        value="brand"
        onValueChange={() => {}}
        ref={ref}
      />,
    );
    expect(ref.current).toBeInstanceOf(HTMLSelectElement);
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <SelectField<Tone> label="Tone" options={OPTIONS} value="brand" onValueChange={() => {}} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
