import { Radio } from "lucide-react";
import { PulsingBadge } from "../../../../src/components/atoms/PulsingBadge";
import { Wordmark } from "../../../../src/components/atoms/Wordmark";
import { Demo, PageFrame, PageTitle, Row } from "./Chrome";

export function BoardPulsingBadge() {
  return (
    <PageFrame>
      <PageTitle
        title="PulsingBadge"
        description="A pulsing-ring wrapper around whatever is handed to it as children — a Wordmark, an icon — used on the two screens where the app is waiting on something external and needs to say so without blocking. Respects prefers-reduced-motion via the stylesheet rule, so the rings simply don't animate for installers who've asked for less motion."
      />

      <Row
        name="ProcessingPage.tsx:88-90"
        description="Wraps the brand Wordmark while the app polls charger status after token registration. aria-label resolves to “Processing” (i18n processing.processingAriaLabel)."
      >
        <Demo label="real usage">
          <PulsingBadge aria-label="Processing">
            <Wordmark size="lg" />
          </PulsingBadge>
        </Demo>
      </Row>

      <Row
        name="AutomatedOcppTestingPage.tsx:120-122"
        description="Wraps a lucide Radio icon while the hardware check runs. aria-label resolves to “Checking hardware” (i18n automatedOcppTesting.checkingHardwareAriaLabel)."
      >
        <Demo label="real usage">
          <PulsingBadge aria-label="Checking hardware">
            <Radio size={28} />
          </PulsingBadge>
        </Demo>
      </Row>
    </PageFrame>
  );
}
