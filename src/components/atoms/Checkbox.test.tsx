import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import { Checkbox } from "./Checkbox";

describe("Checkbox", () => {
  it("reflects the checked prop", () => {
    render(<Checkbox checked aria-label="Accept terms" readOnly />);
    expect(screen.getByRole("checkbox", { name: "Accept terms" })).toBeChecked();
  });

  it("reflects the unchecked state", () => {
    render(<Checkbox checked={false} aria-label="Accept terms" readOnly />);
    expect(screen.getByRole("checkbox", { name: "Accept terms" })).not.toBeChecked();
  });

  it("forwards a ref to the underlying input element", () => {
    const ref = createRef<HTMLInputElement>();
    render(<Checkbox checked ref={ref} aria-label="Accept terms" readOnly />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Checkbox checked aria-label="Accept terms" readOnly />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
