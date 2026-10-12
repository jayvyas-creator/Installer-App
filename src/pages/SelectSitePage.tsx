import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as RadioGroup from "@radix-ui/react-radio-group";
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
          <h1 id="select-site-heading" className={formStyles.heading}>
            This token covers multiple sites
          </h1>
          <p className={formStyles.subheading}>
            Choose which site {state.chargerId || "this charger"} is being installed at.
          </p>
        </div>

        <RadioGroup.Root
          className={formStyles.list}
          aria-labelledby="select-site-heading"
          value={selected ?? undefined}
          onValueChange={setSelected}
        >
          {MOCK_SITES.map((candidateSite) => (
            <RadioGroup.Item key={candidateSite.id} value={candidateSite.id} asChild>
              <button type="button" className={siteCardStyles.card}>
                <span className={siteCardStyles.cardTexts}>
                  <span className={siteCardStyles.cardName}>{candidateSite.name}</span>
                  <span className={siteCardStyles.cardMeta}>{candidateSite.address}</span>
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
      </div>
    </AppShell>
  );
}
