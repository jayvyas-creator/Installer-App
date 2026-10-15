import { useState } from "react";
import { AppLayout } from "@/components/templates/AppLayout";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { ErrorBanner } from "@/components/molecules/ErrorBanner";
import { useInstallFlow } from "@/state/InstallFlowContext";
import { useHistorySync } from "@/navigation/useHistorySync";
import { resolveRoute } from "@/navigation/resolveRoute";
import { getStatus } from "@/api/endpoints";
import { enterTokenFlow } from "@/flows/enterTokenFlow";
import { validateInstallerDraft } from "@/types";
import { FLOW_STEPS } from "@/constants/flowSteps";
import formStyles from "./shared/form.module.css";

// Result<T> (src/types/api.ts) only carries a plain error string, so the two
// internal calls enterTokenFlow makes (register token, then look up the
// charger) can't be told apart from the page's side (see enterTokenFlow.ts's
// own comment on this). This heuristic is what decides "charger/token
// rejected -> No EV Charger Found" vs. "something else -> stay here with an
// inline error", per DESIGN-HANDOFF.md §2.3's Next/Back rule.
const NOT_FOUND_PATTERN = /couldn't find|could not find|not found|invalid (token|charger)|rejected/i;

export function EnterTokenIdPage() {
  const navigate = useHistorySync();
  const { session, setTokenId, setRegistration, setChargerDetails, setStatus, markRegistered } =
    useInstallFlow();
  const [tokenValue, setTokenValue] = useState(session.tokenId);
  const [fieldError, setFieldError] = useState<string | undefined>();
  const [canRetry, setCanRetry] = useState(false);
  const [loading, setLoading] = useState(false);

  const installerCheck = validateInstallerDraft(session.installerDraft);
  const installerInvalid = installerCheck.errors !== null;

  async function runVerification(token: string) {
    setLoading(true);
    setFieldError(undefined);
    setCanRetry(false);

    const result = await enterTokenFlow(session.chargerId, token, session.installerDraft);
    if (!result.ok) {
      setLoading(false);
      if (NOT_FOUND_PATTERN.test(result.error)) {
        navigate("/no-charger-found");
        return;
      }
      setFieldError(result.error);
      setCanRetry(true);
      return;
    }

    setTokenId(token);
    setRegistration(result.data.tenantId, result.data.siteId);
    setChargerDetails(result.data.chargerDetails, result.data.siteAreas);
    markRegistered();

    const statusResult = await getStatus(session.chargerId, token);
    setLoading(false);
    if (!statusResult.ok) {
      if (NOT_FOUND_PATTERN.test(statusResult.error)) {
        navigate("/no-charger-found");
        return;
      }
      setFieldError("Failed to fetch charger status. Please try again later.");
      setCanRetry(true);
      return;
    }

    setStatus(statusResult.data);
    navigate(resolveRoute(statusResult.data, { siteAreaCount: result.data.siteAreas.length }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (installerInvalid || loading) return;
    const trimmed = tokenValue.trim();
    if (!trimmed) {
      setFieldError("Token ID is required.");
      setCanRetry(false);
      return;
    }
    void runVerification(trimmed);
  }

  function handleRetry() {
    const trimmed = tokenValue.trim();
    if (!trimmed || loading) return;
    void runVerification(trimmed);
  }

  return (
    <AppLayout
      title="Enter Token ID"
      onBack={() => navigate("/installer-info")}
      backDisabled={loading}
      stepper={{ steps: FLOW_STEPS, currentIndex: 1 }}
      footer={
        <Button
          type="submit"
          form="enter-token-form"
          fullWidth
          size="lg"
          loading={loading}
          disabled={installerInvalid}
        >
          {loading ? "Verifying…" : "Continue"}
        </Button>
      }
    >
      <form id="enter-token-form" className={formStyles.stack} onSubmit={handleSubmit} noValidate>
        <div className={formStyles.intro}>
          <h1 className={formStyles.heading}>Enter the installer token</h1>
          <p className={formStyles.subheading}>
            The app will check the charger, register the token, and find out where to continue.
          </p>
        </div>

        {installerInvalid && (
          <ErrorBanner
            tone="warning"
            title="Some installer information is missing or invalid. Go back and check it before continuing."
          />
        )}

        <Input
          label="Token ID"
          value={tokenValue}
          onChange={(e) => {
            setTokenValue(e.target.value);
            setFieldError(undefined);
            setCanRetry(false);
          }}
          helperText="Token ID will be provided on the work order."
          errorText={fieldError}
          disabled={loading || installerInvalid}
          required
        />

        {canRetry && (
          <Button type="button" variant="secondary" size="md" onClick={handleRetry} disabled={loading}>
            Retry
          </Button>
        )}
      </form>
    </AppLayout>
  );
}
