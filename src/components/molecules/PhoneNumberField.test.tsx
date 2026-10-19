import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, expect, it, vi } from "vitest";
import { PhoneNumberField } from "./PhoneNumberField";

describe("PhoneNumberField", () => {
  it("renders the country code select and the phone number input", () => {
    render(
      <PhoneNumberField
        countryCode="+1"
        phoneNumber=""
        onCountryCodeChange={() => {}}
        onPhoneNumberChange={() => {}}
      />,
    );
    expect(screen.getByLabelText("Code")).toBeInTheDocument();
    expect(screen.getByLabelText("Mobile Number")).toBeInTheDocument();
  });

  it("calls onCountryCodeChange when a different code is picked", async () => {
    const user = userEvent.setup();
    const onCountryCodeChange = vi.fn();
    render(
      <PhoneNumberField
        countryCode="+1"
        phoneNumber=""
        onCountryCodeChange={onCountryCodeChange}
        onPhoneNumberChange={() => {}}
      />,
    );
    await user.selectOptions(screen.getByLabelText("Code"), "+44");
    expect(onCountryCodeChange).toHaveBeenCalledWith("+44");
  });

  it("calls onPhoneNumberChange as the user types", async () => {
    const user = userEvent.setup();
    const onPhoneNumberChange = vi.fn();
    render(
      <PhoneNumberField
        countryCode="+1"
        phoneNumber=""
        onCountryCodeChange={() => {}}
        onPhoneNumberChange={onPhoneNumberChange}
      />,
    );
    await user.type(screen.getByLabelText("Mobile Number"), "5");
    expect(onPhoneNumberChange).toHaveBeenCalledWith("5");
  });

  it("surfaces an error on the phone number field", () => {
    render(
      <PhoneNumberField
        countryCode="+1"
        phoneNumber=""
        onCountryCodeChange={() => {}}
        onPhoneNumberChange={() => {}}
        errorText="Enter a valid number"
      />,
    );
    expect(screen.getByText("Enter a valid number")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <PhoneNumberField
        countryCode="+1"
        phoneNumber="5551234567"
        onCountryCodeChange={() => {}}
        onPhoneNumberChange={() => {}}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
