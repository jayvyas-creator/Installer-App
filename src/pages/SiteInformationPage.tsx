import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPinOff, Plus } from "lucide-react";
import * as RadioGroup from "@radix-ui/react-radio-group";
import { AppShell } from "@/components/organisms/AppShell";
import { Button } from "@/components/atoms/Button";
import { useInstallFlow } from "@/state/InstallFlowContext";
import { PHASE_CONFIG_LABELS } from "@/constants/electrical";
import { MOCK_SITES } from "@/constants/sites";
import formStyles from "./shared/form.module.css";
import siteCardStyles from "./shared/siteCard.module.css";
import styles from "./SiteInformationPage.module.css";

export function SiteInformationPage() {
  const navigate = useNavigate();
  const { state, setSelectedSiteArea, stepOrder } = useInstallFlow();

  const site = useMemo(
    () => MOCK_SITES.find((candidate) => candidate.id === state.selectedSiteId) ?? null,
    [state.selectedSiteId],
  );

  const visibleAreas = useMemo(() => {
    const areas = site
      ? state.siteAreas.filter(
          (area) => site.areaIds.includes(area.id) || area.id === state.selectedSiteAreaId,
        )
      : state.siteAreas;
    if (state.failureMode === "NOAREA") return [];
    if (state.failureMode === "ONEAREA") return areas.slice(0, 1);
    return areas;
  }, [state.failureMode, state.siteAreas, state.selectedSiteAreaId, site]);

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
      onBack={() => navigate(state.selectedSiteId ? "/select-site" : "/enter-token")}
      stepper={{ steps: [...stepOrder], currentIndex: 2 }}
      footer={
        <Button fullWidth size="lg" disabled={!selected} onClick={handleContinue}>
          Continue
        </Button>
      }
    >
      <div className={formStyles.stack}>
        <div className={formStyles.intro}>
          <h1 id="site-area-heading" className={formStyles.heading}>
            Which site area is this?
          </h1>
          <p className={formStyles.subheading}>
            {site
              ? `Pick the area within ${site.name} where this charger lives.`
              : "Electrical limits for the charger will be inherited from the area you pick."}
          </p>
        </div>

        {visibleAreas.length === 0 ? (
          <div className={styles.emptyState}>
            <MapPinOff size={32} color="var(--text-tertiary)" aria-hidden />
            <span className={styles.emptyTitle}>No site areas configured</span>
            <p className={styles.emptyBody}>
              This location doesn't have any site areas set up yet. Add one now to continue the
              install.
            </p>
            <Button
              variant="secondary"
              leadingIcon={<Plus size={18} />}
              onClick={() => navigate("/site-area/new")}
            >
              Add site area
            </Button>
          </div>
        ) : (
          <div className={formStyles.list}>
            {visibleAreas.length === 1 && (
              <span className={siteCardStyles.note}>
                Only one site area is available for this location. It's been selected for you.
              </span>
            )}
            <RadioGroup.Root
              className={formStyles.list}
              aria-labelledby="site-area-heading"
              value={selected ?? undefined}
              onValueChange={setSelected}
            >
              {visibleAreas.map((area) => (
                <RadioGroup.Item key={area.id} value={area.id} asChild>
                  <button type="button" className={siteCardStyles.card}>
                    <span className={siteCardStyles.cardTexts}>
                      <span className={siteCardStyles.cardName}>{area.name}</span>
                      <span className={siteCardStyles.cardMeta}>
                        {area.voltage}V · {PHASE_CONFIG_LABELS[area.phaseConfig]}
                      </span>
                    </span>
                    <span className={siteCardStyles.radio}>
                      <RadioGroup.Indicator forceMount asChild>
                        <span className={siteCardStyles.radioDot} />
                      </RadioGroup.Indicator>
                    </span>
                  </button>
                </RadioGroup.Item>
              ))}
            </RadioGroup.Root>
            <button
              type="button"
              className={styles.addAreaRow}
              onClick={() => navigate("/site-area/new")}
            >
              <Plus size={18} aria-hidden />
              Add a different site area
            </button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
