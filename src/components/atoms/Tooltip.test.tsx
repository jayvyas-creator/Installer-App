import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import { Tooltip } from "./Tooltip";

describe("Tooltip", () => {
  it("does not render the bubble until triggered", () => {
    render(<Tooltip text="More info" />);
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("shows the bubble on focus and hides it on blur", async () => {
    const user = userEvent.setup();
    render(<Tooltip text="More info" />);
    await user.tab();
    expect(screen.getByRole("tooltip")).toHaveTextContent("More info");
    await user.tab();
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("links the trigger to the bubble via aria-describedby", async () => {
    const user = userEvent.setup();
    render(<Tooltip text="More info" />);
    const trigger = screen.getByRole("button");
    await user.tab();
    const bubble = screen.getByRole("tooltip");
    expect(trigger).toHaveAttribute("aria-describedby", bubble.id);
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Tooltip text="More info" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
