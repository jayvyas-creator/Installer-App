import { Canvas, Storyboard } from "tempo-sdk/canvas";
import { defineAsset } from "tempo-sdk/assets";
import { BoardIntro as BoardIntro2 } from "./BoardIntro";
import { BoardStates as BoardStates2 } from "./BoardStates";
import { BoardCheckbox as BoardCheckbox2 } from "./BoardCheckbox";
import { BoardSelectField as BoardSelectField2 } from "./BoardSelectField";
import { BoardComposite as BoardComposite2 } from "./BoardComposite";
import { BoardDesignSystemDebt as BoardDesignSystemDebt2 } from "./BoardDesignSystemDebt";
import { Input } from "@/components/atoms/Input";
import { Select } from "@/components/atoms/Select";
import { Checkbox } from "@/components/atoms/Checkbox";
import { SelectField } from "@/components/molecules/SelectField";
import { PhoneNumberField } from "@/components/molecules/PhoneNumberField";
import { ReadOnlyField } from "@/components/molecules/ReadOnlyField";

export default function FormFieldsCanvas() {
  return (
    <Canvas name="Form Fields" backgroundColor="#232323">
      <Storyboard
        id="BoardIntro"
        name="Intro"
        component={BoardIntro2}
        layout={{ x: 0, y: 0, width: 900, height: 900, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="BoardStates"
        name="States"
        component={BoardStates2}
        layout={{ x: 950, y: 0, width: 1100, height: 1300, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="BoardCheckbox"
        name="Checkbox"
        component={BoardCheckbox2}
        layout={{ x: 2100, y: 0, width: 700, height: 500, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="BoardSelectField"
        name="SelectField<T>"
        component={BoardSelectField2}
        layout={{ x: 0, y: 1350, width: 900, height: 800, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="BoardComposite"
        name="Composite Fields"
        component={BoardComposite2}
        layout={{ x: 0, y: 2200, width: 900, height: 700, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="BoardDesignSystemDebt"
        name="Design System Debt"
        component={BoardDesignSystemDebt2}
        layout={{ x: 0, y: 2950, width: 2600, height: 2600, intrinsicSizing: "root-element" }}
      />
    </Canvas>
  );
}

defineAsset(Input, {
  libraries: ["Design System"],
  usageInstructions:
    "Fused label+control+helper+error text field atom (a documented deviation from a stricter atoms-only doc — see CLAUDE.md §1). Use for any untyped or string-valued field. Don't look for a separate bare <input> atom underneath it — there isn't one.",
  variants: {
    Default: { props: { label: "Company name", autoComplete: "organization" } },
    "Helper text": {
      props: {
        label: "Token ID",
        helperText: "Found on the sticker inside the charger door",
      },
    },
    Error: {
      props: {
        label: "Email address",
        type: "email",
        value: "not-an-email",
        errorText: "Enter a valid email address",
        required: true,
      },
    },
    Required: { props: { label: "First name", autoComplete: "given-name", required: true } },
    Disabled: { props: { label: "Amp per phase", value: "32", disabled: true } },
  },
});

defineAsset(Select, {
  libraries: ["Design System"],
  usageInstructions:
    "Fused label+control+helper+error dropdown atom, the Select-side twin of Input. For option values that are a specific string union (e.g. ChargerType, PhaseAssignment), prefer SelectField<T> instead so the call site gets a typed value/onValueChange.",
  variants: {
    Default: {
      props: {
        label: "Number of phases",
        placeholder: "Select phases",
        options: [
          { value: "single", label: "Single Phase" },
          { value: "three", label: "Three Phase" },
        ],
      },
    },
    Error: {
      props: {
        label: "Charger type",
        placeholder: "Select a charger type",
        options: [
          { value: "AC", label: "AC" },
          { value: "DC", label: "DC" },
        ],
        errorText: "Select a charger type",
        required: true,
      },
    },
    Disabled: {
      props: {
        label: "Phase assignment",
        placeholder: "Choose number of phases first",
        options: [],
        disabled: true,
        required: true,
      },
    },
  },
});

defineAsset(Checkbox, {
  libraries: ["Design System"],
  usageInstructions:
    "Custom-styled checkbox atom (a visually-hidden real <input type=\"checkbox\"> under a lucide Check glyph). checked is a controlled boolean — no internal state. Its only production caller today is the ChecklistItem molecule.",
  variants: {
    Unchecked: { props: { checked: false, "aria-label": "Power cable connected" } },
    Checked: { props: { checked: true, "aria-label": "Power cable connected" } },
    Disabled: { props: { checked: true, disabled: true, "aria-label": "Grounding verified" } },
  },
});

defineAsset(SelectField, {
  libraries: ["Design System"],
  usageInstructions:
    "Thin, generic, type-safe wrapper around the Select atom (molecules/SelectField.tsx) — use whenever the option values are a specific string union, so the call site gets a typed value/onValueChange instead of a ChangeEvent<HTMLSelectElement> and a string cast.",
  variants: {
    "Charger type": {
      props: {
        label: "Charger type",
        placeholder: "Select a charger type",
        options: [
          { value: "AC", label: "AC" },
          { value: "DC", label: "DC" },
        ],
        value: "",
        onValueChange: () => {},
        required: true,
      },
    },
    "Number of phases": {
      props: {
        label: "Number of phases",
        placeholder: "Select phases",
        options: [
          { value: "single", label: "Single Phase" },
          { value: "three", label: "Three Phase" },
        ],
        value: "",
        onValueChange: () => {},
        required: true,
      },
    },
  },
});

defineAsset(PhoneNumberField, {
  libraries: ["Design System"],
  usageInstructions:
    "Composite molecule from Installer Information: a 6.5rem country-code SelectField<string> next to a flexible Input in one row, sharing the same errorText/required contract as a bare Input.",
  variants: {
    Default: {
      props: {
        countryCode: "+1",
        phoneNumber: "",
        onCountryCodeChange: () => {},
        onPhoneNumberChange: () => {},
        required: true,
      },
    },
    Error: {
      props: {
        countryCode: "+1",
        phoneNumber: "555",
        onCountryCodeChange: () => {},
        onPhoneNumberChange: () => {},
        errorText: "Enter a valid phone number",
        required: true,
      },
    },
  },
});

defineAsset(ReadOnlyField, {
  libraries: ["Design System"],
  usageInstructions:
    "Display-only label+value molecule (lock icon, label, value) for data the installer can see but not edit, e.g. Charger Electrical Information's 'already installed' panel and Validate Charger Details. No controls — it has no interactive props to curate.",
  variants: {
    "Charger ID": { props: { label: "Charger ID", value: "CHG-20491" } },
    Voltage: { props: { label: "Voltage", value: "400V" } },
    "Number of phases": { props: { label: "Number of phases", value: "Three Phase" } },
  },
});
