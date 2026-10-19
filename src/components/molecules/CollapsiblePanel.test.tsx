import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import { CollapsiblePanel } from "./CollapsiblePanel";

describe("CollapsiblePanel", () => {
  it("is closed by default", () => {
    render(<CollapsiblePanel trigger="Connector 1">Details</CollapsiblePanel>);
    expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("Details")).not.toBeInTheDocument();
  });

  it("renders open when defaultOpen is true", () => {
    render(
      <CollapsiblePanel trigger="Connector 1" defaultOpen>
        Details
      </CollapsiblePanel>,
    );
    expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Details")).toBeInTheDocument();
  });

  it("toggles open and closed when the trigger is clicked", async () => {
    const user = userEvent.setup();
    render(<CollapsiblePanel trigger="Connector 1">Details</CollapsiblePanel>);
    const trigger = screen.getByRole("button");
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Details")).toBeInTheDocument();
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("Details")).not.toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <CollapsiblePanel trigger="Connector 1" defaultOpen>
        Details
      </CollapsiblePanel>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
