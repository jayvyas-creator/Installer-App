import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppShell } from "@/components/organisms/AppShell";
import { Button } from "@/components/atoms/Button";
import { useInstallFlow } from "@/state/InstallFlowContext";
import { MOCK_SITES } from "@/constants/sites";
import formStyles from "./shared/form.module.css";
import siteCardStyles from "./shared/siteCard.module.css";

export function SelectSitePage() {
  const navigate = useNavigate();
  const { state, setSelectedSite, stepOrder } = useInstallFlow();
  const [selected, setSelected] = useState<string | null>(state.selectedSiteId);

  function handleContinue() {
    if (!selected) return;
    setSelectedSite(selected);
    navigate("/site-information");
  }

  return (
    <AppShell
      title="Select site"
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
          <h1 className={formStyles.heading}>This token covers multiple sites</h1>
          <p className={formStyles.subheading}>
            Choose which site {state.chargerId || "this charger"} is being installed at.
          </p>
        </div>

        <div className={formStyles.list}>
          {MOCK_SITES.map((candidateSite) => (
            <button
              type="button"
              key={candidateSite.id}
              className={siteCardStyles.card}
              data-selected={selected === candidateSite.id}
              onClick={() => setSelected(candidateSite.id)}
            >
              <span className={siteCardStyles.cardTexts}>
                <span className={siteCardStyles.cardName}>{candidateSite.name}</span>
                <span className={siteCardStyles.cardMeta}>{candidateSite.address}</span>
              </span>
              <span className={siteCardStyles.radio}>
                <span className={siteCardStyles.radioDot} />
              </span>
            </button>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
