import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import { ErrorBanner } from "./ErrorBanner";

describe("ErrorBanner", () => {
  it("renders the title and description", () => {
    render(<ErrorBanner title="No heartbeat received" description="Check the network cable." />);
    expect(screen.getByText("No heartbeat received")).toBeInTheDocument();
    expect(screen.getByText("Check the network cable.")).toBeInTheDocument();
  });

  it("announces itself as an alert", () => {
    render(<ErrorBanner title="No heartbeat received" />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("defaults to the error tone", () => {
    render(<ErrorBanner title="No heartbeat received" />);
    expect(screen.getByRole("alert")).toHaveAttribute("data-tone", "error");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <ErrorBanner title="No heartbeat received" description="Check the network cable." />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
