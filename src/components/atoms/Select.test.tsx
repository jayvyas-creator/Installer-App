import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, expect, it, vi } from "vitest";
import { Select } from "./Select";

const OPTIONS = [
  { value: "a", label: "Option A" },
  { value: "b", label: "Option B" },
];

describe("Select", () => {
  it("associates the label with the field and renders its options", () => {
    render(<Select label="Choice" options={OPTIONS} value="a" onChange={() => {}} />);
    const select = screen.getByLabelText("Choice");
    expect(select).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Option B" })).toBeInTheDocument();
  });

  it("shows the error state and message", () => {
    render(
      <Select label="Choice" options={OPTIONS} value="" onChange={() => {}} errorText="Required" />,
    );
    expect(screen.getByLabelText("Choice")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText("Required")).toBeInTheDocument();
  });

  it("calls onChange when a new option is selected", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Select label="Choice" options={OPTIONS} value="a" onChange={onChange} />);
    await user.selectOptions(screen.getByLabelText("Choice"), "b");
    expect(onChange).toHaveBeenCalled();
  });

  it("forwards a ref to the underlying select element", () => {
    const ref = createRef<HTMLSelectElement>();
    render(<Select label="Choice" options={OPTIONS} value="a" onChange={() => {}} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLSelectElement);
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <Select label="Choice" options={OPTIONS} value="a" onChange={() => {}} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
