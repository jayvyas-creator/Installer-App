import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import { PulsingBadge } from "./PulsingBadge";

describe("PulsingBadge", () => {
  it("renders its children", () => {
    render(<PulsingBadge aria-label="Processing">3s</PulsingBadge>);
    expect(screen.getByText("3s")).toBeInTheDocument();
  });

  it("exposes the aria-label on the image role wrapper", () => {
    render(<PulsingBadge aria-label="Processing">3s</PulsingBadge>);
    expect(screen.getByRole("img", { name: "Processing" })).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<PulsingBadge aria-label="Processing">3s</PulsingBadge>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
