import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppShell } from "@/components/organisms/AppShell";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { useInstallFlow } from "@/state/InstallFlowContext";
import formStyles from "./shared/form.module.css";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function InstallerInformationPage() {
  const navigate = useNavigate();
  const { state, setInstallerInfo, stepOrder } = useInstallFlow();
  const [fullName, setFullName] = useState(state.installerInfo.fullName);
  const [phone, setPhone] = useState(state.installerInfo.phone);
  const [email, setEmail] = useState(state.installerInfo.email);
  const [errors, setErrors] = useState<{ fullName?: string; phone?: string; email?: string }>({});

  function validateField(field: "fullName" | "phone" | "email") {
    setErrors((prev) => {
      const next = { ...prev };
      if (field === "fullName") next.fullName = fullName.trim() ? undefined : "Enter your full name.";
      if (field === "phone") next.phone = phone.trim() ? undefined : "Enter a phone number.";
      if (field === "email")
        next.email = EMAIL_PATTERN.test(email.trim()) ? undefined : "Enter a valid email address.";
      return next;
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nextErrors: typeof errors = {};
    if (!fullName.trim()) nextErrors.fullName = "Enter your full name.";
    if (!phone.trim()) nextErrors.phone = "Enter a phone number.";
    if (!EMAIL_PATTERN.test(email.trim())) nextErrors.email = "Enter a valid email address.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setInstallerInfo({ fullName: fullName.trim(), phone: phone.trim(), email: email.trim() });
    navigate("/enter-token");
  }

  return (
    <AppShell
      title="Installer information"
      onBack={() => navigate("/")}
      stepper={{ steps: [...stepOrder], currentIndex: 0 }}
      footer={
        <Button type="submit" form="installer-info-form" fullWidth size="lg">
          Continue
        </Button>
      }
    >
      <form id="installer-info-form" className={formStyles.stack} onSubmit={handleSubmit}>
        <div className={formStyles.intro}>
          <h1 className={formStyles.heading}>Who's doing this install?</h1>
          <p className={formStyles.subheading}>
            We'll attach your details to this installation record for the site owner.
          </p>
        </div>

        <Input
          label="Full name"
          placeholder="Jordan Avery"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          onBlur={() => validateField("fullName")}
          errorText={errors.fullName}
          autoComplete="name"
          required
        />
        <Input
          label="Phone number"
          type="tel"
          placeholder="(555) 010-0199"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          onBlur={() => validateField("phone")}
          errorText={errors.phone}
          autoComplete="tel"
          required
        />
        <Input
          label="Email address"
          type="email"
          placeholder="jordan@fieldcrew.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => validateField("email")}
          errorText={errors.email}
          autoComplete="email"
          required
        />
      </form>
    </AppShell>
  );
}
