import "vitest";

interface CustomMatchers<T = unknown> {
  toHaveNoViolations(): T;
}

declare module "vitest" {
  interface Assertion<T = any> extends CustomMatchers<T> {}
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}
