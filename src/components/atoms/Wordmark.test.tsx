import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import { Wordmark } from "./Wordmark";

describe("Wordmark", () => {
  it("renders the DynaChrg wordmark text", () => {
    render(<Wordmark />);
    expect(screen.getByText("DYNA")).toBeInTheDocument();
    expect(screen.getByText("CHRG")).toBeInTheDocument();
  });

  it("applies a custom className alongside its size class", () => {
    render(<Wordmark className="custom" />);
    expect(screen.getByText("DYNA")).toHaveClass("custom");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Wordmark />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
