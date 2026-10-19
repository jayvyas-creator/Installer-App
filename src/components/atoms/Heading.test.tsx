import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import { Heading } from "./Heading";

describe("Heading", () => {
  it("renders an h1 by default", () => {
    render(<Heading>Title</Heading>);
    expect(screen.getByRole("heading", { level: 1, name: "Title" })).toBeInTheDocument();
  });

  it("renders an h2 for level 2", () => {
    render(<Heading level={2}>Title</Heading>);
    expect(screen.getByRole("heading", { level: 2, name: "Title" })).toBeInTheDocument();
  });

  it("renders an h3 for level 3", () => {
    render(<Heading level={3}>Title</Heading>);
    expect(screen.getByRole("heading", { level: 3, name: "Title" })).toBeInTheDocument();
  });

  it("merges a custom className with its own", () => {
    render(<Heading className="custom">Title</Heading>);
    expect(screen.getByRole("heading")).toHaveClass("custom");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Heading>Title</Heading>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
