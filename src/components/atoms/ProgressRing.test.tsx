import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import { ProgressRing } from "./ProgressRing";

describe("ProgressRing", () => {
  it("renders an indeterminate spinner when no progress is given", () => {
    render(<ProgressRing />);
    expect(screen.getByRole("status", { name: "Loading" })).toBeInTheDocument();
  });

  it("renders a determinate progressbar with the given progress", () => {
    render(<ProgressRing progress={42} />);
    const ring = screen.getByRole("progressbar");
    expect(ring).toHaveAttribute("aria-valuenow", "42");
  });

  it("clamps progress above 100 down to 100", () => {
    render(<ProgressRing progress={150} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "100");
  });

  it("clamps negative progress up to 0", () => {
    render(<ProgressRing progress={-20} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "0");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<ProgressRing progress={50} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
