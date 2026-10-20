import { Checkbox } from "@/components/atoms/Checkbox";
import { ChecklistItem } from "@/components/molecules/ChecklistItem";
import { Demo, PageFrame, PageTitle, Row } from "./Chrome";

export function BoardCheckbox() {
  return (
    <PageFrame>
      <PageTitle
        title="Checkbox"
        description={
          <>
            A custom-styled checkbox (a lucide <code>Check</code> glyph over a
            real, visually-hidden <code>&lt;input type=&quot;checkbox&quot;&gt;</code>) with
            checked, unchecked, and disabled states. Its only production
            caller today is the <code>ChecklistItem</code> molecule, used on
            Communication Checklist and Physical Healthiness.
          </>
        }
      />

      <Row
        name="Checked / unchecked"
        description="checked is a controlled boolean prop — there is no internal state."
      >
        <Demo label="unchecked">
          <Checkbox checked={false} aria-label="Power cable connected" />
        </Demo>
        <Demo label="checked">
          <Checkbox checked aria-label="Power cable connected" />
        </Demo>
      </Row>

      <Row name="Disabled" description="Disabled reads as a dimmed, inert checkmark — checked state still renders through it.">
        <Demo label="unchecked">
          <Checkbox checked={false} disabled aria-label="Grounding verified" />
        </Demo>
        <Demo label="checked">
          <Checkbox checked disabled aria-label="Grounding verified" />
        </Demo>
      </Row>

      <Row
        name="Real context"
        description={
          <>
            <code>ChecklistItem</code> (molecules) pairs the atom with a
            label + optional description, from Communication Checklist.
          </>
        }
      >
        <Demo label="item">
          <div className="w-full max-w-[380px]">
            <ChecklistItem
              label="Charger powered on"
              description="Indicator light is solid green"
              checked
              onToggle={() => {}}
            />
          </div>
        </Demo>
        <Demo label="disabled">
          <div className="w-full max-w-[380px]">
            <ChecklistItem
              label="OCPP connection confirmed"
              checked={false}
              disabled
              onToggle={() => {}}
            />
          </div>
        </Demo>
      </Row>
    </PageFrame>
  );
}
