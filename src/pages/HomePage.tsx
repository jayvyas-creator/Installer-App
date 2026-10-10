import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { QrCode, X, Zap } from "lucide-react";
import { AppShell } from "@/components/organisms/AppShell";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { IconButton } from "@/components/atoms/IconButton";
import { Toast } from "@/components/molecules/Toast";
import { useInstallFlow } from "@/state/InstallFlowContext";
import { resolveFailureMode } from "@/constants/mockData";
import type { ProcessingState } from "./ProcessingPage";
import styles from "./HomePage.module.css";

const DEMO_SCANNED_ID = "DC-48213";

export function HomePage() {
  const navigate = useNavigate();
  const { setChargerId } = useInstallFlow();
  const [chargerId, setChargerIdInput] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [scanning, setScanning] = useState(false);
  const [showPermissionSheet, setShowPermissionSheet] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (!showPermissionSheet) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setShowPermissionSheet(false);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showPermissionSheet]);

  function proceedWithId(id: string) {
    const trimmed = id.trim();
    if (!/^DC-/i.test(trimmed)) {
      setError("Enter a valid charger ID (starts with \"DC-\").");
      return;
    }
    setError(undefined);
    const failureMode = resolveFailureMode(trimmed);
    setChargerId(trimmed, failureMode);
    const next = failureMode === "ACTIVE" ? "/ready-to-charge" : "/installer-info";
    const state: ProcessingState = {
      label: "Looking up charger…",
      sublabel: `Checking records for ${trimmed.toUpperCase()}`,
      durationMs: 1100,
      next,
    };
    navigate("/processing", { state });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    proceedWithId(chargerId);
  }

  function handleAllowCamera() {
    setShowPermissionSheet(false);
    setScanning(true);
  }

  function handleDenyCamera() {
    setShowPermissionSheet(false);
    setShowToast(true);
    window.setTimeout(() => setShowToast(false), 3200);
  }

  function finishScan() {
    setScanning(false);
    setChargerIdInput(DEMO_SCANNED_ID);
    proceedWithId(DEMO_SCANNED_ID);
  }

  return (
    <AppShell showHelp>
      <div className={styles.wrap}>
        <div className={styles.hero}>
          <div className={styles.logoMark}>
            <Zap size={28} fill="currentColor" strokeWidth={0} />
          </div>
          <h1 className={styles.title}>DynaChrg Installer</h1>
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

      <AnimatePresence>
        {showPermissionSheet && (
          <motion.div
            className={styles.permissionSheet}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPermissionSheet(false)}
          >
            <motion.div
              className={styles.permissionCard}
              initial={{ y: 48 }}
              animate={{ y: 0 }}
              exit={{ y: 48 }}
              transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <span className={styles.permissionTitle}>Allow camera access?</span>
              <span className={styles.permissionBody}>
                DynaChrg Installer needs your camera to scan the charger's QR code.
              </span>
              <div className={styles.permissionActions}>
                <Button fullWidth onClick={handleAllowCamera}>
                  Allow
                </Button>
                <Button fullWidth variant="ghost" onClick={handleDenyCamera}>
                  Don't Allow
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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

      <Toast open={showToast} message="Please allow camera access to proceed further." />
    </AppShell>
  );
}
