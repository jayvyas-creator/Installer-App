import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPinOff } from "lucide-react";
import { AppShell } from "@/components/organisms/AppShell";
import { Button } from "@/components/atoms/Button";
import { useInstallFlow } from "@/state/InstallFlowContext";
import { PHASE_CONFIG_LABELS } from "@/constants/electrical";
import formStyles from "./shared/form.module.css";
import styles from "./SiteInformationPage.module.css";

export function SiteInformationPage() {
  const navigate = useNavigate();
  const { state, setSelectedSiteArea, stepOrder } = useInstallFlow();

  const visibleAreas = useMemo(() => {
    if (state.failureMode === "NOAREA") return [];
    if (state.failureMode === "ONEAREA") return state.siteAreas.slice(0, 1);
    return state.siteAreas;
  }, [state.failureMode, state.siteAreas]);

  const [selected, setSelected] = useState<string | null>(state.selectedSiteAreaId);

  useEffect(() => {
    if (visibleAreas.length === 1 && !selected) {
      setSelected(visibleAreas[0].id);
    }
  }, [visibleAreas, selected]);

  function handleContinue() {
    if (!selected) return;
    setSelectedSiteArea(selected);
    navigate("/charger-electrical");
  }

  return (
    <AppShell
      title="Site information"
      onBack={() => navigate("/enter-token")}
      stepper={{ steps: [...stepOrder], currentIndex: 2 }}
      footer={
        <Button fullWidth size="lg" disabled={!selected} onClick={handleContinue}>
          Continue
        </Button>
      }
    >
      <div className={formStyles.stack}>
        <div className={formStyles.intro}>
          <h1 className={formStyles.heading}>Which site area is this?</h1>
          <p className={formStyles.subheading}>
            Electrical limits for the charger will be inherited from the area you pick.
          </p>
        </div>

        {visibleAreas.length === 0 ? (
          <div className={styles.emptyState}>
            <MapPinOff size={32} color="var(--text-tertiary)" aria-hidden />
            <span className={styles.emptyTitle}>No site areas configured</span>
            <p className={styles.emptyBody}>
              This location doesn't have any site areas set up yet. Ask the site manager to add
              one before continuing the install.
            </p>
          </div>
        ) : (
          <div className={formStyles.list}>
            {visibleAreas.length === 1 && (
              <span className={styles.note}>
                Only one site area is available for this location — it's been selected for you.
              </span>
            )}
            {visibleAreas.map((area) => (
              <button
                type="button"
                key={area.id}
                className={styles.card}
                data-selected={selected === area.id}
                onClick={() => setSelected(area.id)}
              >
                <span className={styles.cardTexts}>
                  <span className={styles.cardName}>{area.name}</span>
                  <span className={styles.cardMeta}>
                    {area.voltage}V · {PHASE_CONFIG_LABELS[area.phaseConfig]}
                  </span>
                </span>
                <span className={styles.radio}>
                  <span className={styles.radioDot} />
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
