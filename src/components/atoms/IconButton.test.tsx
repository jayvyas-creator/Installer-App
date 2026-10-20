import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { X } from "lucide-react";
import { axe } from "jest-axe";
import { describe, expect, it, vi } from "vitest";
import { IconButton } from "./IconButton";

describe("IconButton", () => {
  it("exposes the required aria-label as its accessible name", () => {
    render(
      <IconButton aria-label="Close">
        <X />
      </IconButton>,
    );
    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <IconButton aria-label="Close" onClick={onClick}>
        <X />
      </IconButton>,
    );
    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("forwards a ref to the underlying button element", () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <IconButton aria-label="Close" ref={ref}>
        <X />
      </IconButton>,
    );
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <IconButton aria-label="Close">
        <X />
      </IconButton>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("renders its child element instead of a button when asChild is set", () => {
    render(
      <IconButton aria-label="Close" asChild>
        <a href="/home">
          <X />
        </a>
      </IconButton>,
    );
    const link = screen.getByRole("link", { name: "Close" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/home");
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
