import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ProgressRing } from "@/components/atoms/ProgressRing";
import dynachrgLogo from "@/assets/dynachrg-logo.png";
import styles from "./SplashPage.module.css";

const SPLASH_DURATION_MS = 1400;

export function SplashPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = window.setTimeout(() => navigate("/", { replace: true }), SPLASH_DURATION_MS);
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
