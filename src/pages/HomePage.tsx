import { useEffect, useRef, useState } from "react";
import { ArrowRight, QrCode, X } from "lucide-react";
import { AppLayout } from "@/components/templates/AppLayout";
import { IconButton } from "@/components/atoms/IconButton";
import { Input } from "@/components/atoms/Input";
import { ErrorBanner } from "@/components/molecules/ErrorBanner";
import { ResumeInstallBanner } from "@/components/molecules/ResumeInstallBanner";
import { useInstallFlow, type InstallSession } from "@/state/InstallFlowContext";
import { useHistorySync } from "@/navigation/useHistorySync";
import { resolveRoute } from "@/navigation/resolveRoute";
import { useQrScanner, type QrScannerError } from "@/hooks/useQrScanner";
import dynachrgLogo from "@/assets/dynachrg-logo.png";
import styles from "./HomePage.module.css";

// Dev/mock-mode escape hatch: useQrScanner has no real decoder wired in yet
// (see its TODO), so this is what "Simulate a successful scan" produces.
const DEMO_SCANNED_ID = "DC-48213";

// DESIGN-HANDOFF.md §2.1 "Camera unavailable" copy, keyed by the hook's
// error states. The doc's table truncates every variant but the first with
// "…"; completed here the same way the HTTPS variant spells itself out in
// full ("You can enter the Charger ID below instead.").
const CAMERA_ERROR_MESSAGES: Record<QrScannerError, string> = {
  "insecure-context":
    "The camera only works over HTTPS (or on localhost). You can enter the Charger ID below instead.",
  "permission-denied":
    "Camera access was denied. Allow camera access in your browser settings to scan. You can enter the Charger ID below instead.",
  "no-camera": "No camera was found on this device. You can enter the Charger ID below instead.",
  "camera-busy":
    "The camera is being used by another app. Close it and try again. You can enter the Charger ID below instead.",
  unknown: "The camera couldn't be started in this browser. You can enter the Charger ID below instead.",
};

// Where "Resume" on the draft banner should land. Status-driven once Enter
// Token ID has run (resolveRoute, CLAUDE.md §6); otherwise a best guess from
// how far the session got, since there's no backend answer to route on yet.
function resumeRoute(session: InstallSession): string {
  if (session.status) {
    return resolveRoute(session.status, { siteAreaCount: session.siteAreas.length });
  }
  if (session.tokenId || session.installerDraft.firstName) return "/enter-token";
  return "/installer-info";
}

export function HomePage() {
  const navigate = useHistorySync();
  const { session, setChargerId, resetForNewChargerId, reset } = useInstallFlow();
  const [chargerId, setChargerIdInput] = useState("");
  const [fieldError, setFieldError] = useState<string | undefined>();
  const [scanRequested, setScanRequested] = useState(false);
  const scanTriggerRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const qr = useQrScanner({
    onResult: (value) => {
      setScanRequested(false);
      setChargerIdInput(value);
      proceedWithId(value);
    },
  });

  const hasDraft = Boolean(session.chargerId) && session.status?.status !== "Active";

  function proceedWithId(id: string) {
    const trimmed = id.trim();
    if (!trimmed) {
      setFieldError("Enter a Charger ID or scan the QR code on the charger.");
      return;
    }
    setFieldError(undefined);
    // No API call here (DESIGN-HANDOFF.md §2.1) — a new charger ID clears
    // everything downstream but keeps the installer's own details.
    if (trimmed.toUpperCase() === session.chargerId.trim().toUpperCase()) {
      setChargerId(trimmed);
    } else {
      resetForNewChargerId(trimmed);
    }
    navigate("/installer-info");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    proceedWithId(chargerId);
  }

  async function handleScanClick() {
    setFieldError(undefined);
    setScanRequested(true);
    await qr.start();
  }

  function handleCancelScan() {
    qr.stop();
    setScanRequested(false);
  }

  // The hook clears its own `error` at the start of every start() call, so
  // once it's set here the request has already failed and the overlay
  // should close itself instead of sitting on a dead camera view.
  useEffect(() => {
    if (qr.error) setScanRequested(false);
  }, [qr.error]);

  const showScanner = scanRequested && !qr.error;

  useEffect(() => {
    if (!showScanner) return;
    const trigger = scanTriggerRef.current;
    closeButtonRef.current?.focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") handleCancelScan();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      trigger?.focus();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showScanner]);

  const cameraMessage = qr.error ? CAMERA_ERROR_MESSAGES[qr.error] : undefined;
  const bannerMessage = cameraMessage ?? fieldError;

  return (
    <AppLayout showHelp>
      <div className={styles.wrap}>
        {hasDraft && (
          <ResumeInstallBanner
            chargerId={session.chargerId}
            installerName={
              `${session.installerDraft.firstName} ${session.installerDraft.lastName}`.trim() ||
              "an installer"
            }
            onResume={() => navigate(resumeRoute(session))}
            onDiscard={reset}
          />
        )}
        <div className={styles.hero}>
          <img className={styles.logoMark} src={dynachrgLogo} alt="DynaChrg" />
          <h1 className={styles.title}>Installer</h1>
          <p className={styles.subtitle}>
            Scan the charger's QR code or enter its ID to start the install.
          </p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {bannerMessage && <ErrorBanner tone="warning" title={bannerMessage} />}

          <Input
            label="Charger ID"
            placeholder="DC-48213"
            value={chargerId}
            onChange={(e) => setChargerIdInput(e.target.value)}
            autoCapitalize="characters"
            autoCorrect="off"
            trailingAdornment={
              <IconButton aria-label="Continue" type="submit" tone="subtle">
                <ArrowRight size={18} />
              </IconButton>
            }
            required
          />

          <div className={styles.divider}>or enter it manually</div>

          <button
            type="button"
            ref={scanTriggerRef}
            className={styles.scanTrigger}
            onClick={handleScanClick}
          >
            <QrCode size={20} aria-hidden />
            Scan QR code
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "var(--space-6)" }}>
          <p style={{ margin: 0, fontSize: "var(--font-size-caption)", color: "var(--text-secondary)" }}>
            Scan the QR code on the charger you are installing
          </p>
          <p
            style={{
              margin: "var(--space-1) 0 0",
              fontSize: "var(--font-size-caption)",
              color: "var(--text-secondary)",
              opacity: 0.7,
            }}
          >
            v1.0.0
          </p>
        </div>
      </div>

      {showScanner && (
        <div
          className={styles.overlay}
          role="dialog"
          aria-modal="true"
          aria-label="QR code scanner"
        >
          <div className={styles.overlayHeader}>
            <IconButton
              ref={closeButtonRef}
              aria-label="Close scanner"
              tone="onBrand"
              onClick={handleCancelScan}
            >
              <X size={20} />
            </IconButton>
          </div>
          <div className={styles.viewfinderWrap}>
            <div className={styles.viewfinder}>
              <video
                ref={qr.videoRef}
                autoPlay
                playsInline
                muted
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "var(--radius-md)",
                }}
              />
              <span className={[styles.corner, styles.cornerTL].join(" ")} />
              <span className={[styles.corner, styles.cornerTR].join(" ")} />
              <span className={[styles.corner, styles.cornerBL].join(" ")} />
              <span className={[styles.corner, styles.cornerBR].join(" ")} />
              <span className={styles.scanLine} />
            </div>
          </div>
          <div className={styles.overlayFooter}>
            <span className={styles.overlayHint}>
              {qr.isScanning ? "Point the camera at the QR code on the charger." : "Starting camera…"}
            </span>
            <div style={{ display: "flex", gap: "var(--space-5)" }}>
              <button type="button" className={styles.manualLink} onClick={handleCancelScan}>
                Cancel
              </button>
              {qr.torchSupported && (
                <button type="button" className={styles.manualLink} onClick={qr.toggleTorch}>
                  {qr.torchOn ? "Torch off" : "Torch on"}
                </button>
              )}
            </div>
            <button
              type="button"
              className={styles.manualLink}
              onClick={() => qr.simulateScan(DEMO_SCANNED_ID)}
            >
              Simulate a successful scan
            </button>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
