import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Drawer } from "vaul";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { QrCode, X } from "lucide-react";
import { AppShell } from "@/components/organisms/AppShell";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { IconButton } from "@/components/atoms/IconButton";
import { ResumeInstallBanner } from "@/components/molecules/ResumeInstallBanner";
import { useInstallFlow } from "@/state/InstallFlowContext";
import { buildMockChargerDetails, resolveFailureMode } from "@/constants/mockData";
import type { ProcessingState } from "./ProcessingPage";
import dynachrgLogo from "@/assets/dynachrg-logo.png";
import styles from "./HomePage.module.css";

const DEMO_SCANNED_ID = "DC-48213";

function resumeRoute(state: ReturnType<typeof useInstallFlow>["state"]): string {
  if (state.selectedSiteAreaId) return "/charger-electrical";
  if (state.tokenId) {
    return state.tokenId.toUpperCase().includes("MULTI") ? "/select-site" : "/site-information";
  }
  if (state.installerInfo.fullName) return "/enter-token";
  return "/validate-charger-details";
}

export function HomePage() {
  const navigate = useNavigate();
  const { state, setChargerId, setChargerDetails, reset } = useInstallFlow();
  const [chargerId, setChargerIdInput] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [scanning, setScanning] = useState(false);
  const [showPermissionSheet, setShowPermissionSheet] = useState(false);

  const hasDraft =
    Boolean(state.chargerId) &&
    Boolean(state.installerInfo.fullName) &&
    state.failureMode !== "ACTIVE";

  function proceedWithId(id: string) {
    const trimmed = id.trim();
    if (!/^DC-/i.test(trimmed)) {
      setError("Enter a valid charger ID (starts with \"DC-\").");
      return;
    }
    setError(undefined);
    const failureMode = resolveFailureMode(trimmed);
    setChargerId(trimmed, failureMode);
    let next = "/validate-charger-details";
    if (failureMode === "NOTFOUND") {
      next = "/no-charger-found";
    } else if (failureMode === "ACTIVE") {
      next = "/ready-to-charge";
    } else {
      setChargerDetails(buildMockChargerDetails(trimmed));
    }
    const processingState: ProcessingState = {
      label: "Looking up charger…",
      sublabel: `Checking records for ${trimmed.toUpperCase()}`,
      durationMs: 1100,
      next,
    };
    navigate("/processing", { state: processingState });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    proceedWithId(chargerId);
  }

  function handleChargerIdBlur() {
    const trimmed = chargerId.trim();
    if (!trimmed) {
      setError(undefined);
      return;
    }
    setError(/^DC-/i.test(trimmed) ? undefined : "Enter a valid charger ID (starts with \"DC-\").");
  }

  function handleAllowCamera() {
    setShowPermissionSheet(false);
    setScanning(true);
  }

  function handleDenyCamera() {
    setShowPermissionSheet(false);
    toast("Please allow camera access to proceed further.");
  }

  function finishScan() {
    setScanning(false);
    setChargerIdInput(DEMO_SCANNED_ID);
    proceedWithId(DEMO_SCANNED_ID);
  }

  return (
    <AppShell showHelp>
      <div className={styles.wrap}>
        {hasDraft && (
          <ResumeInstallBanner
            chargerId={state.chargerId}
            installerName={state.installerInfo.fullName}
            onResume={() => navigate(resumeRoute(state))}
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
          <button
            type="button"
            className={styles.scanTrigger}
            onClick={() => setShowPermissionSheet(true)}
          >
            <QrCode size={20} aria-hidden />
            Scan QR code
          </button>

          <div className={styles.divider}>or enter it manually</div>

          <Input
            label="Charger ID"
            placeholder="DC-48213"
            value={chargerId}
            onChange={(e) => setChargerIdInput(e.target.value)}
            onBlur={handleChargerIdBlur}
            errorText={error}
            autoCapitalize="characters"
            autoCorrect="off"
            required
          />

          <Button type="submit" fullWidth size="lg">
            Continue
          </Button>
        </form>
      </div>

      <Drawer.Root open={showPermissionSheet} onOpenChange={setShowPermissionSheet}>
        <Drawer.Portal>
          <Drawer.Overlay className={styles.permissionOverlay} />
          <Drawer.Content className={styles.permissionCard}>
            <Drawer.Title className={styles.permissionTitle}>
              Allow camera access?
            </Drawer.Title>
            <Drawer.Description className={styles.permissionBody}>
              DynaChrg Installer needs your camera to scan the charger's QR code.
            </Drawer.Description>
            <div className={styles.permissionActions}>
              <Button fullWidth onClick={handleAllowCamera}>
                Allow
              </Button>
              <Button fullWidth variant="ghost" onClick={handleDenyCamera}>
                Don't Allow
              </Button>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>

      <AnimatePresence>
        {scanning && (
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className={styles.overlayHeader}>
              <IconButton
                aria-label="Close scanner"
                tone="onBrand"
                onClick={() => setScanning(false)}
              >
                <X size={20} />
              </IconButton>
            </div>
            <div className={styles.viewfinderWrap}>
              <div className={styles.viewfinder}>
                <span className={[styles.corner, styles.cornerTL].join(" ")} />
                <span className={[styles.corner, styles.cornerTR].join(" ")} />
                <span className={[styles.corner, styles.cornerBL].join(" ")} />
                <span className={[styles.corner, styles.cornerBR].join(" ")} />
                <span className={styles.scanLine} />
              </div>
            </div>
            <div className={styles.overlayFooter}>
              <span className={styles.overlayHint}>Point the camera at the QR code</span>
              <button type="button" className={styles.manualLink} onClick={finishScan}>
                Simulate a successful scan
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppShell>
  );
}
