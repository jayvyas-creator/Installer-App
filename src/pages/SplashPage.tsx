import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ProgressRing } from "@/components/atoms/ProgressRing";
import dynachrgLogo from "@/assets/dynachrg-logo.png";
import styles from "./SplashPage.module.css";

// Matches --duration-slow in tokens.css. This is a branded launch beat for
// a standalone (installed PWA) cold start, not a loading wait, so it stays
// well under --duration-standard-max (1000ms), the ceiling reserved for the
// biggest choreographed moments like the commissioning success sequence,
// not a one-time brand flash.
const SPLASH_HOLD_MS = 560;

export function SplashPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = window.setTimeout(() => navigate("/", { replace: true }), SPLASH_HOLD_MS);
    return () => window.clearTimeout(timer);
  }, [navigate]);

  return (
    <div className={styles.wrap}>
      <img className={styles.logoMark} src={dynachrgLogo} alt="DynaChrg Installer" />
      <div className={styles.ring}>
        <ProgressRing size={28} strokeWidth={3} tone="brand" />
      </div>
    </div>
  );
}
