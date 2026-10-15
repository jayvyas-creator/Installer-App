import { useState } from "react";
import { AppLayout } from "@/components/templates/AppLayout";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { PhoneNumberField } from "@/components/molecules/PhoneNumberField";
import { useInstallFlow } from "@/state/InstallFlowContext";
import { useHistorySync } from "@/navigation/useHistorySync";
import { validateInstallerDraft, type InstallerDraftErrors } from "@/types";
import { FLOW_STEPS } from "@/constants/flowSteps";
import formStyles from "./shared/form.module.css";

// DESIGN-HANDOFF.md §2.2's dropdown lists every country as "+1 United
// States"; PhoneNumberField (a shared molecule, not owned by this page) only
// offers this smaller set today. Mapping code -> name here keeps
// InstallerDraft.countryName in sync without touching that molecule.
const COUNTRY_NAMES: Record<string, string> = {
  "+1": "United States",
  "+44": "United Kingdom",
  "+61": "Australia",
  "+91": "India",
};

export function InstallerInformationPage() {
  const navigate = useHistorySync();
  const { session, setInstallerDraft } = useInstallFlow();
  const [errors, setErrors] = useState<InstallerDraftErrors>({});
  const draft = session.installerDraft;

  function update(patch: Partial<typeof draft>) {
    setInstallerDraft({ ...draft, ...patch });
  }

  function handleCountryCodeChange(value: string) {
    update({ countryCode: value, countryName: COUNTRY_NAMES[value] ?? value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // DESIGN-HANDOFF.md §2.2: "Errors appear only after Continue is
    // pressed, and are checked again on the next press" — no live/onBlur
    // validation, just re-check the whole form on every submit attempt.
    const result = validateInstallerDraft(draft);
    if (result.errors) {
      setErrors(result.errors);
      return;
    }
    setErrors({});
    navigate("/enter-token");
  }

  return (
    <AppLayout
      title="Installer information"
      stepper={{ steps: FLOW_STEPS, currentIndex: 0 }}
      footer={
        <Button type="submit" form="installer-info-form" fullWidth size="lg">
          Continue
        </Button>
      }
    >
      <form id="installer-info-form" className={formStyles.stack} onSubmit={handleSubmit} noValidate>
        <div className={formStyles.intro}>
          <h1 className={formStyles.heading}>Who's doing this install?</h1>
          <p className={formStyles.subheading}>
            We'll attach your details to this installation record for the site owner.
          </p>
        </div>

        <Input
          label="Company Name"
          value={draft.companyName}
          onChange={(e) => update({ companyName: e.target.value })}
          errorText={errors.companyName}
          autoComplete="organization"
          required
        />

        <div className={formStyles.fieldGrid}>
          <Input
            label="First Name"
            value={draft.firstName}
            onChange={(e) => update({ firstName: e.target.value })}
            errorText={errors.firstName}
            autoComplete="given-name"
            required
          />
          <Input
            label="Last Name"
            value={draft.lastName}
            onChange={(e) => update({ lastName: e.target.value })}
            errorText={errors.lastName}
            autoComplete="family-name"
            required
          />
        </div>

        <Input
          label="C-License Number"
          value={draft.licenseNumber}
          onChange={(e) => update({ licenseNumber: e.target.value })}
        />

        <Input
          label="EVITP Certification Number"
          value={draft.evitpNumber}
          onChange={(e) => update({ evitpNumber: e.target.value })}
        />

        <Input
          label="Email ID"
          type="email"
          value={draft.email}
          onChange={(e) => update({ email: e.target.value })}
          errorText={errors.email}
          autoComplete="email"
          required
        />

        <PhoneNumberField
          countryCode={draft.countryCode}
          phoneNumber={draft.phoneNumber}
          onCountryCodeChange={handleCountryCodeChange}
          onPhoneNumberChange={(value) => update({ phoneNumber: value })}
          errorText={errors.phoneNumber}
          required
        />
      </form>
    </AppLayout>
  );
}
