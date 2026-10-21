import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AppLayout } from "@/components/templates/AppLayout";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { PhoneNumberField } from "@/components/molecules/PhoneNumberField";
import { useInstallFlow } from "@/state/InstallFlowContext";
import { useHistorySync } from "@/navigation/useHistorySync";
import { validateInstallerDraft, type InstallerDraftErrors } from "@/types";
import { FLOW_STEPS } from "@/constants/flowSteps";
import { findCountryByIso } from "@/constants/countries";
import formStyles from "./shared/form.module.css";

export function InstallerInformationPage() {
  const { t } = useTranslation();
  const navigate = useHistorySync();
  const { session, setInstallerDraft } = useInstallFlow();
  const [errors, setErrors] = useState<InstallerDraftErrors>({});
  const draft = session.installerDraft;

  function update(patch: Partial<typeof draft>) {
    setInstallerDraft({ ...draft, ...patch });
  }

  function handleCountryCodeChange(value: string) {
    update({ countryCode: value, countryName: findCountryByIso(value)?.name ?? value });
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
      title={t("installerInformation.title")}
      stepper={{ steps: FLOW_STEPS, currentIndex: 0 }}
      footer={
        <Button type="submit" form="installer-info-form" fullWidth size="lg">
          {t("installerInformation.continue")}
        </Button>
      }
    >
      <form id="installer-info-form" className={formStyles.stack} onSubmit={handleSubmit} noValidate>
        <div className={formStyles.intro}>
          <h1 className={formStyles.heading}>{t("installerInformation.heading")}</h1>
          <p className={formStyles.subheading}>{t("installerInformation.subheading")}</p>
        </div>

        <Input
          label={t("installerInformation.companyNameLabel")}
          value={draft.companyName}
          onChange={(e) => update({ companyName: e.target.value })}
          errorText={errors.companyName}
          autoComplete="organization"
          required
        />

        <div className={formStyles.fieldGrid}>
          <Input
            label={t("installerInformation.firstNameLabel")}
            value={draft.firstName}
            onChange={(e) => update({ firstName: e.target.value })}
            errorText={errors.firstName}
            autoComplete="given-name"
            required
          />
          <Input
            label={t("installerInformation.lastNameLabel")}
            value={draft.lastName}
            onChange={(e) => update({ lastName: e.target.value })}
            errorText={errors.lastName}
            autoComplete="family-name"
            required
          />
        </div>

        <Input
          label={t("installerInformation.licenseNumberLabel")}
          value={draft.licenseNumber}
          onChange={(e) => update({ licenseNumber: e.target.value })}
        />

        <Input
          label={t("installerInformation.evitpNumberLabel")}
          value={draft.evitpNumber}
          onChange={(e) => update({ evitpNumber: e.target.value })}
        />

        <Input
          label={t("installerInformation.emailLabel")}
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
