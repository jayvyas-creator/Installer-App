import { render } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import { SuccessCheck } from "./SuccessCheck";

describe("SuccessCheck", () => {
  it("renders a decorative, hidden svg at the default size", () => {
    const { container } = render(<SuccessCheck />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-hidden");
    expect(svg).toHaveAttribute("width", "56");
    expect(svg).toHaveAttribute("height", "56");
  });

  it("respects a custom size", () => {
    const { container } = render(<SuccessCheck size={24} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "24");
    expect(svg).toHaveAttribute("height", "24");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<SuccessCheck />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
