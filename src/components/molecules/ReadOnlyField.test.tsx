import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import { ReadOnlyField } from "./ReadOnlyField";

describe("ReadOnlyField", () => {
  it("renders the label and value", () => {
    render(<ReadOnlyField label="Phase Voltage" value="230V" />);
    expect(screen.getByText("Phase Voltage")).toBeInTheDocument();
    expect(screen.getByText("230V")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<ReadOnlyField label="Phase Voltage" value="230V" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
