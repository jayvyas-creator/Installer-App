import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, expect } from "vitest";
import { toHaveNoViolations } from "jest-axe";
import "@/i18n";

expect.extend(toHaveNoViolations);

afterEach(() => {
  cleanup();
});
