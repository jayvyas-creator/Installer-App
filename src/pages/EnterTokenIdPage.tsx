import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { KeyRound } from "lucide-react";
import { AppShell } from "@/components/organisms/AppShell";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { useInstallFlow } from "@/state/InstallFlowContext";
import type { ProcessingState } from "./ProcessingPage";
import formStyles from "./shared/form.module.css";

export function EnterTokenIdPage() {
  const navigate = useNavigate();
  const { state, setTokenId, stepOrder } = useInstallFlow();
  const [token, setToken] = useState(state.tokenId);
  const [error, setError] = useState<string | undefined>();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token.trim()) {
      setError("Enter the token ID from the charger's label.");
      return;
    }
    const trimmedToken = token.trim();
    setTokenId(trimmedToken);
    const isMultiSite = trimmedToken.toUpperCase().includes("MULTI");

    const processingState: ProcessingState = {
      label: "Validating charger details…",
      sublabel: `Matching token to ${state.chargerId}`,
      durationMs: 1700,
      next: isMultiSite ? "/select-site" : "/site-information",
      failure:
        state.failureMode === "INSTALLFAIL"
          ? {
              title: "Validation failed",
              description:
                "We couldn't match this token to the charger. Double-check the token ID and try again.",
              retryLabel: "Try again",
              secondaryLabel: "Re-enter token",
              secondaryTo: "/enter-token",
            }
          : undefined,
    };
    navigate("/processing", { state: processingState });
  }

  return (
    <AppShell
      title="Enter token ID"
      onBack={() => navigate("/installer-info")}
      stepper={{ steps: [...stepOrder], currentIndex: 1 }}
      footer={
        <Button type="submit" form="enter-token-form" fullWidth size="lg">
          Validate
        </Button>
      }
    >
      <form id="enter-token-form" className={formStyles.stack} onSubmit={handleSubmit}>
        <div className={formStyles.intro}>
          <h1 className={formStyles.heading}>Enter the charger's token</h1>
          <p className={formStyles.subheading}>
            Found on the inside panel label, directly beneath the serial number.
          </p>
        </div>

        <Input
          label="Token ID"
          placeholder="TKN-9F31-2287"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          errorText={error}
          leadingIcon={<KeyRound size={18} />}
          autoCapitalize="characters"
          required
        />
      </form>
    </AppShell>
  );
}
