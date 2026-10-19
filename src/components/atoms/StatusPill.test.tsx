import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import { StatusPill } from "./StatusPill";

describe("StatusPill", () => {
  it("renders the status text", () => {
    render(<StatusPill tone="success">Ready</StatusPill>);
    expect(screen.getByText("Ready")).toBeInTheDocument();
  });

  it("hides the dot when showDot is false", () => {
    const { container } = render(
      <StatusPill tone="success" showDot={false}>
        Ready
      </StatusPill>,
    );
    expect(container.querySelector("[aria-hidden]")).not.toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<StatusPill tone="error">Needs attention</StatusPill>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
