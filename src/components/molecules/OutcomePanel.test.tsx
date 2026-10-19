import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, expect, it, vi } from "vitest";
import { OutcomePanel } from "./OutcomePanel";

describe("OutcomePanel", () => {
  it("renders the title and description", () => {
    render(<OutcomePanel tone="success" title="Installed" description="All checks passed." />);
    expect(screen.getByRole("heading", { name: "Installed" })).toBeInTheDocument();
    expect(screen.getByText("All checks passed.")).toBeInTheDocument();
  });

  it("uses an alert role for error and warning tones", () => {
    const { rerender } = render(<OutcomePanel tone="error" title="Failed" description="Retry." />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
    rerender(<OutcomePanel tone="warning" title="Needs attention" description="Retry." />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("uses a status role for success and pending tones", () => {
    const { rerender } = render(<OutcomePanel tone="success" title="Installed" description="Done." />);
    expect(screen.getByRole("status")).toBeInTheDocument();
    rerender(<OutcomePanel tone="pending" title="Working" description="Hold on." />);
    expect(screen.getAllByRole("status").length).toBeGreaterThan(0);
  });

  it("calls the primary and secondary action handlers", async () => {
    const user = userEvent.setup();
    const onPrimary = vi.fn();
    const onSecondary = vi.fn();
    render(
      <OutcomePanel
        tone="success"
        title="Installed"
        description="All checks passed."
        primaryAction={{ label: "Continue", onClick: onPrimary }}
        secondaryAction={{ label: "Back to Home", onClick: onSecondary }}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Continue" }));
    await user.click(screen.getByRole("button", { name: "Back to Home" }));
    expect(onPrimary).toHaveBeenCalledOnce();
    expect(onSecondary).toHaveBeenCalledOnce();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <OutcomePanel
        tone="success"
        title="Installed"
        description="All checks passed."
        primaryAction={{ label: "Continue", onClick: () => {} }}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
