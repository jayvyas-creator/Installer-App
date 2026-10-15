import { describe, expect, it } from "vitest";
import { createInstallerDraft, validateInstallerDraft } from "./index";

describe("validateInstallerDraft", () => {
  it("rejects a blank draft with one error per required field", () => {
    const result = validateInstallerDraft(createInstallerDraft());
    expect(result.data).toBeNull();
    expect(result.errors).toMatchObject({
      companyName: expect.any(String),
      firstName: expect.any(String),
      lastName: expect.any(String),
      email: expect.any(String),
      phoneNumber: expect.any(String),
    });
  });

  it("rejects a malformed email without touching other fields", () => {
    const draft = { ...createInstallerDraft(), companyName: "Acme", firstName: "A", lastName: "B", phoneNumber: "5551234567", email: "not-an-email" };
    const result = validateInstallerDraft(draft);
    expect(result.data).toBeNull();
    expect(result.errors?.email).toBeDefined();
    expect(result.errors?.companyName).toBeUndefined();
  });

  it("rejects a phone number with fewer than 7 digits", () => {
    const draft = {
      ...createInstallerDraft(),
      companyName: "Acme",
      firstName: "A",
      lastName: "B",
      email: "a@b.com",
      phoneNumber: "12345",
    };
    expect(validateInstallerDraft(draft).errors?.phoneNumber).toBeDefined();
  });

  it("trims whitespace and returns InstallerData on a valid draft", () => {
    const draft = {
      ...createInstallerDraft(),
      companyName: "  Acme Corp  ",
      firstName: "Ada",
      lastName: "Lovelace",
      email: "ada@example.com",
      phoneNumber: "555-123-4567",
    };
    const result = validateInstallerDraft(draft);
    expect(result.errors).toBeNull();
    expect(result.data).toMatchObject({
      companyName: "Acme Corp",
      firstName: "Ada",
      lastName: "Lovelace",
      email: "ada@example.com",
    });
  });
});
