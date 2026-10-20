import { ArrowRight, Plus, Trash2 } from "lucide-react";
import { Button } from "../../../../src/components/atoms/Button";
import { Demo, PageFrame, PageTitle, Row } from "./Chrome";

export function BoardVariants() {
  return (
    <PageFrame>
      <PageTitle
        title="Button — Variants, Sizes & States"
        description="Four variants carry the visual weight ladder — primary for the one main action per screen, secondary and ghost for supporting actions, danger for destructive ones. Two sizes (md/lg) cover every screen in the install flow; loading, disabled and fullWidth are built in, never hand-rolled per call site."
      />

      <Row
        name="Variants"
        description={'Real usage: primary is the default used on every "Continue" action (e.g. ChargerElectricalInformationPage.tsx:138); secondary pairs with it for Cancel (ValidateChargerDetailsPage.tsx:126); ghost is used sparingly (ResumeInstallBanner.tsx:36, OutcomePanel.tsx:67).'}
      >
        <Demo label="primary">
          <Button variant="primary">Continue</Button>
          <Button variant="primary" leadingIcon={<Plus size={18} />}>
            Create site area
          </Button>
        </Demo>
        <Demo label="secondary">
          <Button variant="secondary">Cancel</Button>
        </Demo>
        <Demo label="ghost">
          <Button variant="ghost">Discard</Button>
        </Demo>
        <Demo label="danger">
          <Button variant="danger" leadingIcon={<Trash2 size={18} />}>
            Remove connector
          </Button>
        </Demo>
      </Row>

      <Row
        name="Sizes"
        description={'lg (52px) is the default and the workhorse for primary screen actions — most Continue buttons never set a size prop. md (44px) is used for secondary, lower-emphasis actions sitting next to a primary (ResumeInstallBanner.tsx:33-36, EnterTokenIdPage.tsx:137).'}
      >
        <Demo label="md · 44px">
          <Button variant="primary" size="md">
            Resume
          </Button>
          <Button variant="secondary" size="md">
            Discard
          </Button>
        </Demo>
        <Demo label="lg · 52px">
          <Button variant="primary" size="lg">
            Continue
          </Button>
          <Button variant="secondary" size="lg">
            Cancel
          </Button>
        </Demo>
      </Row>

      <Row
        name="Full width"
        description="fullWidth is the common shape for primary screen actions docked to the bottom of a step (ChargerElectricalInformationPage.tsx:138, CommunicationChecklistPage.tsx:56, InstallerInformationPage.tsx:58)."
      >
        <div style={{ maxWidth: 360 }}>
          <Button variant="primary" size="lg" fullWidth>
            Continue
          </Button>
        </div>
      </Row>

      <Row
        name="States"
        description="disabled and loading are props, not opacity hacks or a swapped-in custom spinner — loading implies disabled and shows the built-in spinner in the leading-icon slot (ValidateChargerDetailsPage.tsx:155, AutomatedOcppTestingPage.tsx:112)."
      >
        <Demo label="disabled">
          <Button variant="primary" disabled>
            Continue
          </Button>
          <Button variant="secondary" disabled>
            Cancel
          </Button>
        </Demo>
        <Demo label="loading">
          <Button variant="primary" loading>
            Confirming…
          </Button>
        </Demo>
      </Row>

      <Row
        name="Icon slots"
        description="leadingIcon and trailingIcon pass any node through — leading for an affirmative/creation action, trailing for forward navigation (OutcomePanel.tsx uses a leading icon on its primary action)."
      >
        <Demo label="leading">
          <Button variant="primary" leadingIcon={<Plus size={18} />}>
            New file
          </Button>
        </Demo>
        <Demo label="trailing">
          <Button variant="ghost" trailingIcon={<ArrowRight size={18} />}>
            Learn more
          </Button>
        </Demo>
      </Row>
    </PageFrame>
  );
}
