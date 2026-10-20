import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { AppLayout } from "@/components/templates/AppLayout";
import { Button } from "@/components/atoms/Button";
import { Heading } from "@/components/atoms/Heading";
import { ErrorBanner } from "@/components/molecules/ErrorBanner";
import { ReadOnlyField } from "@/components/molecules/ReadOnlyField";
import { useInstallFlow } from "@/state/InstallFlowContext";
import { useHistorySync } from "@/navigation/useHistorySync";
import { getChargerByToken } from "@/api/endpoints";
import { mapChargerLookupToDetails } from "@/api/mappers";
import { validateChargerFlow } from "@/flows/commissioningFlow";
import { FLOW_STEPS } from "@/constants/flowSteps";
import type { ChargerDetails } from "@/types";
import formStyles from "./shared/form.module.css";
import styles from "./ValidateChargerDetailsPage.module.css";

// A 3-state subset of RequestState<T> (src/types/api.ts): this page always
// starts loading on mount, so the "idle" member would be unreachable dead
// code every branch below would still have to account for.
type LoadState =
  | { status: "loading" }
  | { status: "success"; data: ChargerDetails }
  | { status: "error"; error: string };

// DESIGN-HANDOFF.md §2.4: this screen independently re-fetches the charger
// record (CLAUDE.md endpoint 2 lists both `ValidateCharger.js` and
// `tokenId.js` as callers), rather than only trusting whatever Enter Token
// ID already put in the session — a refresh or a resumed session should
// still show the current backend record, not stale local state.
export function ValidateChargerDetailsPage() {
  const { t } = useTranslation();
  const navigate = useHistorySync();
  const { session, setChargerDetails, markRegistered, reset } = useInstallFlow();

  const [loadState, setLoadState] = useState<LoadState>({ status: "loading" });
  const [confirming, setConfirming] = useState(false);
  const [confirmError, setConfirmError] = useState<string | null>(null);

  // The session is missing what this screen needs to even attempt the
  // lookup (established earlier, on Installer Information / Enter Token ID).
  const hasSessionData = Boolean(session.chargerId && session.tenantId && session.siteId);

  const loadDetails = useCallback(async () => {
    if (!hasSessionData) return;
    setLoadState({ status: "loading" });
    const result = await getChargerByToken(
      session.chargerId,
      session.tenantId ?? "",
      session.siteId ?? "",
      session.installerToken ?? "",
    );
    if (!result.ok) {
      setLoadState({ status: "error", error: result.error });
      return;
    }
    const details = mapChargerLookupToDetails(result.data);
    setChargerDetails(details, result.data.site.siteAreas);
    setLoadState({ status: "success", data: details });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasSessionData, session.chargerId, session.tenantId, session.siteId, session.installerToken]);

  useEffect(() => {
    if (hasSessionData) loadDetails();
    // Only ever run again if the identity of the request itself changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasSessionData, session.chargerId, session.tenantId, session.siteId]);

  function handleCancel() {
    reset();
    navigate("/");
  }

  async function handleConfirm() {
    setConfirming(true);
    setConfirmError(null);
    const result = await validateChargerFlow(
      session.chargerId,
      session.installerToken ?? "",
      session.siteAreas.length,
    );
    if (!result.ok) {
      setConfirmError(result.error);
      setConfirming(false);
      return;
    }
    markRegistered();
    navigate(result.data);
  }

  if (!hasSessionData) {
    return (
      <AppLayout
        title={t("validateChargerDetails.title")}
        stepper={{ steps: FLOW_STEPS, currentIndex: 2 }}
        footer={
          <Button fullWidth onClick={handleCancel}>
            {t("validateChargerDetails.cancel")}
          </Button>
        }
      >
        <ErrorBanner title={t("validateChargerDetails.sessionMissing")} />
      </AppLayout>
    );
  }

  if (loadState.status === "loading") {
    return (
      <AppLayout title={t("validateChargerDetails.title")} stepper={{ steps: FLOW_STEPS, currentIndex: 2 }}>
        <p className={styles.loadingRow} role="status">
          <Loader2 className="spin" size={20} aria-hidden />
          {t("validateChargerDetails.loading")}
        </p>
      </AppLayout>
    );
  }

  if (loadState.status === "error") {
    return (
      <AppLayout
        title={t("validateChargerDetails.title")}
        stepper={{ steps: FLOW_STEPS, currentIndex: 2 }}
        footer={
          <div className={styles.footerRow}>
            <Button variant="secondary" fullWidth onClick={handleCancel}>
              {t("validateChargerDetails.cancel")}
            </Button>
            <Button fullWidth onClick={loadDetails}>
              {t("validateChargerDetails.retry")}
            </Button>
          </div>
        }
      >
        <ErrorBanner title={loadState.error || t("validateChargerDetails.loadError")} />
      </AppLayout>
    );
  }

  const details = loadState.data;
  const connectorLabel = (index: number) =>
    details.connectorTypes.length > 1
      ? t("validateChargerDetails.connectorTypeIndexedLabel", { index: index + 1 })
      : t("validateChargerDetails.connectorTypeLabel");

  return (
    <AppLayout
      title={t("validateChargerDetails.title")}
      stepper={{ steps: FLOW_STEPS, currentIndex: 2 }}
      footer={
        <div className={styles.footerRow}>
          <Button variant="secondary" fullWidth disabled={confirming} onClick={handleCancel}>
            {t("validateChargerDetails.cancel")}
          </Button>
          <Button fullWidth loading={confirming} onClick={handleConfirm}>
            {confirming ? t("validateChargerDetails.confirming") : t("validateChargerDetails.confirm")}
          </Button>
        </div>
      }
    >
      <div className={formStyles.stack}>
        <Heading level={1}>{t("validateChargerDetails.heading")}</Heading>

        <div className={formStyles.section}>
          <ReadOnlyField label={t("validateChargerDetails.chargerIdLabel")} value={details.chargerId} />
          <ReadOnlyField label={t("validateChargerDetails.qrCodeUrlLabel")} value={details.qrCodeUrl} />
          <ReadOnlyField label={t("validateChargerDetails.serialNumberLabel")} value={details.serialNumber} />
          {details.connectorTypes.map((connectorType, index) => (
            <ReadOnlyField key={index} label={connectorLabel(index)} value={connectorType} />
          ))}
          <ReadOnlyField
            label={t("validateChargerDetails.noOfConnectorsLabel")}
            value={String(details.noOfConnectors)}
          />
        </div>

        <ErrorBanner
          tone="warning"
          title={t("validateChargerDetails.doNotProceedTitle")}
          description={t("validateChargerDetails.doNotProceedDescription")}
        />

        {confirmError && <ErrorBanner title={confirmError} />}
      </div>
    </AppLayout>
  );
}
