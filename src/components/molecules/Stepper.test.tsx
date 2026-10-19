import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import { Stepper } from "./Stepper";

const STEPS = ["Installer Information", "Validate Charger", "Site Information"];

describe("Stepper", () => {
  it("announces the current step in its accessible name", () => {
    render(<Stepper steps={STEPS} currentIndex={1} />);
    expect(
      screen.getByRole("group", { name: "Step 2 of 3: Validate Charger" }),
    ).toBeInTheDocument();
  });

  it("marks steps before the current index as done and after as upcoming", () => {
    const { container } = render(<Stepper steps={STEPS} currentIndex={1} />);
    const segments = container.querySelectorAll("[data-state]");
    expect(segments[0]).toHaveAttribute("data-state", "done");
    expect(segments[1]).toHaveAttribute("data-state", "current");
    expect(segments[2]).toHaveAttribute("data-state", "upcoming");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Stepper steps={STEPS} currentIndex={0} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
