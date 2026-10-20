import { ChevronLeft, Headphones, X } from "lucide-react";
import { IconButton } from "../../../../src/components/atoms/IconButton";
import { Demo, PageFrame, PageTitle, Row } from "./Chrome";

export function BoardIconButtonTones() {
  return (
    <PageFrame>
      <PageTitle
        title="IconButton — Tones"
        description="A single tone axis picks the icon color (and hover/press fill) for the surface it sits on: default for a neutral card, subtle for chrome that already reads as secondary (the app header), onBrand for anything sitting on a filled brand-colored surface."
      />

      <Row
        name="default"
        description="Full-contrast icon color (--text-primary) on a plain card surface — the fallback when no tone is specified."
      >
        <Demo label="on card">
          <IconButton aria-label="Help and support">
            <Headphones size={20} />
          </IconButton>
        </Demo>
      </Row>

      <Row
        name="subtle — real usage: AppShell.tsx"
        description="AppShell.tsx:57 and :65 use tone=&quot;subtle&quot; for the header's back and help buttons, sitting on the translucent header bar (AppShell.module.css:18) rather than a plain card."
      >
        <div
          className="flex items-center justify-between px-3"
          style={{
            minHeight: 56,
            borderRadius: "var(--radius-md)",
            background: "color-mix(in srgb, var(--surface-page) 88%, transparent)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <IconButton aria-label="Go back" tone="subtle">
            <ChevronLeft size={22} />
          </IconButton>
          <div style={{ fontSize: "var(--font-size-body)", fontWeight: 600, color: "var(--text-primary)" }}>
            Site Information
          </div>
          <IconButton aria-label="Help and support" tone="subtle">
            <Headphones size={20} />
          </IconButton>
        </div>
      </Row>

      <Row
        name="onBrand — real usage: HomePage.tsx:188"
        description={
          'HomePage.tsx:188 uses tone="onBrand" for the QR-scanner overlay\'s close button, today on the dark scanner-overlay background (HomePage.module.css:85, --color-neutral-900) rather than a literal brand-colored surface. Shown below on both: the actual current background, and a brand-orange surface (--surface-brand) to verify contrast for any future onBrand-on-brand use.'
        }
      >
        <Demo label="overlay (actual)">
          <div
            className="flex items-center justify-center"
            style={{ width: 72, height: 56, borderRadius: "var(--radius-md)", background: "var(--color-neutral-900)" }}
          >
            <IconButton aria-label="Close scanner" tone="onBrand">
              <X size={20} />
            </IconButton>
          </div>
        </Demo>
        <Demo label="brand surface">
          <div
            className="flex items-center justify-center"
            style={{ width: 72, height: 56, borderRadius: "var(--radius-md)", background: "var(--surface-brand)" }}
          >
            <IconButton aria-label="Close scanner" tone="onBrand">
              <X size={20} />
            </IconButton>
          </div>
        </Demo>
      </Row>
    </PageFrame>
  );
}
