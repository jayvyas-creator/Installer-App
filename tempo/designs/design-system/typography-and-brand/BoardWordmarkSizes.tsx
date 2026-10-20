import { PulsingBadge } from "@/components/atoms/PulsingBadge";
import { Wordmark } from "@/components/atoms/Wordmark";
import { Demo, PageFrame, PageTitle, Row } from "./Chrome";

export function BoardWordmarkSizes() {
  return (
    <PageFrame>
      <PageTitle
        title="Wordmark sizes"
        description='size="sm" | "md" | "lg" (default "md"). Renders "DYNA" in var(--text-primary) and "CHRG" in var(--color-primary) (the brand orange alias), both set in var(--font-family-heading) at font-weight 800.'
      />

      <Row
        name="The 3 sizes"
        description='sm uses --font-size-body (15px), md uses --font-size-title (22px), lg uses --font-size-display (28px) — the same type-scale tokens the rest of the app draws on, not wordmark-specific values.'
      >
        <Demo label="sm · 15px">
          <Wordmark size="sm" />
        </Demo>
        <Demo label="md · 22px">
          <Wordmark size="md" />
        </Demo>
        <Demo label="lg · 28px">
          <Wordmark size="lg" />
        </Demo>
      </Row>

      <Row
        name="Only production call site"
        description='ProcessingPage.tsx uses size="lg" exactly once, nested inside the PulsingBadge atom on the two commissioning-wait screens (after Communication Checklist and after Automated OCPP Testing). This is the real composition, rendered faithfully — the wordmark visibly overflows the 56px badge circle at this size, which is how it actually renders in the app today.'
      >
        <Demo label="real usage">
          <PulsingBadge aria-label="Processing">
            <Wordmark size="lg" />
          </PulsingBadge>
        </Demo>
      </Row>

      <Row
        name="On a brand surface"
        description="var(--surface-brand) (brand orange 500) behind the wordmark at md, for comparison against the white-page default above — not a confirmed production composition, just a contrast check since the only real brand-surface pairing (PulsingBadge, above) is at lg."
      >
        <div
          className="flex items-center justify-center rounded-xl px-8 py-6"
          style={{ background: "var(--surface-brand)" }}
        >
          <Wordmark size="md" />
        </div>
      </Row>
    </PageFrame>
  );
}
