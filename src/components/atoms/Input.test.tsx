import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, expect, it, vi } from "vitest";
import { Input } from "./Input";

describe("Input", () => {
  it("associates the label with the field", () => {
    render(<Input label="Email" />);
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });

  it("shows helper text when provided", () => {
    render(<Input label="Email" helperText="We'll never share this." />);
    expect(screen.getByText("We'll never share this.")).toBeInTheDocument();
  });

  it("switches to the error state and replaces the helper text", () => {
    render(<Input label="Email" helperText="Helper" errorText="Required" />);
    const field = screen.getByLabelText("Email");
    expect(field).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText("Required")).toBeInTheDocument();
    expect(screen.queryByText("Helper")).not.toBeInTheDocument();
  });

  it("calls onChange as the user types", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Input label="Email" value="" onChange={onChange} />);
    await user.type(screen.getByLabelText("Email"), "a");
    expect(onChange).toHaveBeenCalled();
  });

  it("forwards a ref to the underlying input element", () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input label="Email" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Input label="Email" helperText="Helper text" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
