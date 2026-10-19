import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, expect, it, vi } from "vitest";
import { ChecklistItem } from "./ChecklistItem";

describe("ChecklistItem", () => {
  it("renders the label and optional description", () => {
    render(<ChecklistItem label="Rated current" description="Set to 32A" checked={false} onToggle={() => {}} />);
    expect(screen.getByText("Rated current")).toBeInTheDocument();
    expect(screen.getByText("Set to 32A")).toBeInTheDocument();
  });

  it("exposes its checked state via the checkbox role", () => {
    render(<ChecklistItem label="Rated current" checked onToggle={() => {}} />);
    expect(screen.getByRole("checkbox", { name: "Rated current" })).toBeChecked();
  });

  it("calls onToggle when clicked", async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    render(<ChecklistItem label="Rated current" checked={false} onToggle={onToggle} />);
    await user.click(screen.getByRole("checkbox"));
    expect(onToggle).toHaveBeenCalledOnce();
  });

  it("does not call onToggle when disabled", async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    render(<ChecklistItem label="Rated current" checked={false} onToggle={onToggle} disabled />);
    await user.click(screen.getByRole("checkbox"));
    expect(onToggle).not.toHaveBeenCalled();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <ChecklistItem label="Rated current" description="Set to 32A" checked onToggle={() => {}} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
