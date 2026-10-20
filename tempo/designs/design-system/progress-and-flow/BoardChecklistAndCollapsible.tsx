import { ChecklistItem } from "@/components/molecules/ChecklistItem";
import { CollapsiblePanel } from "@/components/molecules/CollapsiblePanel";
import { Demo, PageFrame, PageTitle, Row } from "./Chrome";

export function BoardChecklistAndCollapsible() {
  return (
    <PageFrame>
      <PageTitle
        title="Checklist & Collapsible"
        description={
          <>
            <code className="mx-1 rounded bg-neutral-100 px-1 py-0.5 text-[12px]">
              ChecklistItem
            </code>{" "}
            wraps the Form Fields <code className="mx-1 rounded bg-neutral-100 px-1 py-0.5 text-[12px]">
              Checkbox
            </code>{" "}
            atom in a labeled, tappable row — used by Communication Checklist
            (3 items) and Physical Healthiness (30 items).{" "}
            <code className="mx-1 rounded bg-neutral-100 px-1 py-0.5 text-[12px]">
              CollapsiblePanel
            </code>{" "}
            is a simple accordion disclosure, chevron rotates on open — used
            per-connector on Connector Information Details and per-question on
            Help.
          </>
        }
      />

      <Row
        name="Communication Checklist — real copy"
        description="src/constants/mockData.ts COMMUNICATION_CHECKLIST_ITEMS, rendered by CommunicationChecklistPage. One item ships an installer-facing description; the other two are label-only."
      >
        <div className="flex flex-col gap-2">
          <ChecklistItem
            label="Rated current configuration is matching with wiring and circuit breaker and is properly configured on the charger"
            description="If charger has dial knob to adjust the current, it has to be properly configured by electrician."
            checked
            onToggle={() => {}}
          />
          <ChecklistItem
            label="Wifi and OCPP URL configuration updated as per instruction manual"
            checked={false}
            onToggle={() => {}}
          />
          <ChecklistItem
            label="Perform a hard reset of the charger and wait at least 2 minutes"
            checked={false}
            onToggle={() => {}}
          />
        </div>
      </Row>

      <Row
        name="Physical Healthiness — excerpt"
        description="src/constants/mockData.ts PHYSICAL_HEALTH_CHECKLIST_ITEMS is a 30-item list with label-only rows; shown here is a representative slice, mixed checked/unchecked as the installer works through it."
      >
        <div className="flex flex-col gap-2">
          <ChecklistItem label="Mounting & structure secure" checked onToggle={() => {}} />
          <ChecklistItem label="Correct charger model" checked onToggle={() => {}} />
          <ChecklistItem label="Grounding & bonding" checked={false} onToggle={() => {}} />
          <ChecklistItem label='Status LED "normal"' checked={false} onToggle={() => {}} />
        </div>
      </Row>

      <Row
        name="Disabled"
        description="disabled is a real prop on the molecule (it forwards to the underlying Checkbox and dims the row), but neither production checklist page exercises it today — both flows let every item be freely toggled."
      >
        <Demo label="disabled, checked">
          <ChecklistItem label="Mounting & structure secure" checked disabled onToggle={() => {}} />
        </Demo>
        <Demo label="disabled, unchecked">
          <ChecklistItem label="Grounding & bonding" checked={false} disabled onToggle={() => {}} />
        </Demo>
      </Row>

      <Row
        name="Collapsible — per-connector (Connector Information Details)"
        description="One panel per connector draft, defaultOpen only on the first. The trigger copy itself changes to flag a connector needing attention (i18n connectorInformationDetails.connectorNeedsAttention)."
      >
        <div className="flex flex-col gap-3">
          <CollapsiblePanel trigger="Connector 1" defaultOpen>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-body text-neutral-600">
              <span>Type 2</span>
              <span>AC</span>
              <span>Three Phase</span>
              <span>32A</span>
              <span>400V</span>
              <span>L1, L2, L3</span>
            </div>
          </CollapsiblePanel>
          <CollapsiblePanel trigger="Connector 2 — needs attention" defaultOpen={false}>
            <span className="text-body text-neutral-500">Incomplete — expand to finish this connector's details.</span>
          </CollapsiblePanel>
        </div>
      </Row>

      <Row
        name="Collapsible — FAQ (Help)"
        description="src/constants/helpContent.ts FAQ_GROUPS, one panel per question, rendered inside each group on the Help page."
      >
        <div className="flex flex-col gap-3">
          <CollapsiblePanel trigger="Where do I find the charger's token ID?" defaultOpen>
            <span className="text-body text-neutral-600">
              The token ID is printed on a label inside the charger's front
              access panel, directly beneath the serial number sticker.
            </span>
          </CollapsiblePanel>
          <CollapsiblePanel trigger="What happens if the OCPP test fails?" defaultOpen={false}>
            <span className="text-body text-neutral-600">
              You'll see exactly which step failed with a retry option. Most
              failures clear on a second attempt once the network connection
              stabilizes.
            </span>
          </CollapsiblePanel>
        </div>
      </Row>
    </PageFrame>
  );
}
