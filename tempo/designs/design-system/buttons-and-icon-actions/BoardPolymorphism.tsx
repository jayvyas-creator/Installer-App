import { ArrowRight, Headphones } from "lucide-react";
import { Button } from "../../../../src/components/atoms/Button";
import { IconButton } from "../../../../src/components/atoms/IconButton";
import { Demo, PageFrame, PageTitle, Row } from "./Chrome";

export function BoardPolymorphism() {
  return (
    <PageFrame>
      <PageTitle
        title="asChild Polymorphism"
        description="Both atoms just added asChild (Radix Slot), so a Button or IconButton can merge its classes and ARIA state onto a single child element — a router Link or a plain <a> — instead of always rendering its own <button>. In asChild mode the icon slots and loading spinner are skipped, since there's no longer fixed internal markup to place them in. Use this whenever an action is really a navigation (a real href) that should look like a Button."
      />

      <Row
        name="Button — button vs. asChild"
        description={'Default renders a real <button type="button">. With asChild, the same variant/size classes merge onto a child <a> — the DOM node is the anchor, not a button wrapping an anchor.'}
      >
        <Demo label="button">
          <Button variant="primary" trailingIcon={<ArrowRight size={18} />}>
            Continue
          </Button>
        </Demo>
        <Demo label="asChild → <a>">
          <Button asChild variant="primary">
            <a href="#help">
              Continue <ArrowRight size={18} style={{ marginLeft: 8, verticalAlign: "-3px" }} aria-hidden />
            </a>
          </Button>
        </Demo>
      </Row>

      <Row
        name="IconButton — button vs. asChild"
        description="IconButton has no internal markup to skip — asChild is a straight Comp = asChild ? Slot : 'button' swap, so the icon-only look is identical either way; only the rendered tag changes."
      >
        <Demo label="button">
          <IconButton aria-label="Help and support" tone="subtle">
            <Headphones size={20} />
          </IconButton>
        </Demo>
        <Demo label="asChild → <a>">
          <IconButton asChild aria-label="Help and support" tone="subtle">
            <a href="#help">
              <Headphones size={20} />
            </a>
          </IconButton>
        </Demo>
      </Row>
    </PageFrame>
  );
}
