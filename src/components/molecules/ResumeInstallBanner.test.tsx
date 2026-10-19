import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, expect, it, vi } from "vitest";
import { ResumeInstallBanner } from "./ResumeInstallBanner";

describe("ResumeInstallBanner", () => {
  it("renders the charger id and installer name", () => {
    render(
      <ResumeInstallBanner
        chargerId="DC-12345"
        installerName="Jordan"
        onResume={() => {}}
        onDiscard={() => {}}
      />,
    );
    expect(screen.getByText(/DC-12345/)).toBeInTheDocument();
    expect(screen.getByText(/Jordan/)).toBeInTheDocument();
  });

  it("calls onResume when Resume is clicked", async () => {
    const user = userEvent.setup();
    const onResume = vi.fn();
    render(
      <ResumeInstallBanner
        chargerId="DC-12345"
        installerName="Jordan"
        onResume={onResume}
        onDiscard={() => {}}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Resume" }));
    expect(onResume).toHaveBeenCalledOnce();
  });

  it("calls onDiscard when Start new is clicked", async () => {
    const user = userEvent.setup();
    const onDiscard = vi.fn();
    render(
      <ResumeInstallBanner
        chargerId="DC-12345"
        installerName="Jordan"
        onResume={() => {}}
        onDiscard={onDiscard}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Start new" }));
    expect(onDiscard).toHaveBeenCalledOnce();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <ResumeInstallBanner
        chargerId="DC-12345"
        installerName="Jordan"
        onResume={() => {}}
        onDiscard={() => {}}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
