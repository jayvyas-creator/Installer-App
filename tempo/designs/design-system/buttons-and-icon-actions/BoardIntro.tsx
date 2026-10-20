import { ArrowRight, Headphones, Plus, Trash2 } from "lucide-react";
import { Button } from "../../../../src/components/atoms/Button";
import { IconButton } from "../../../../src/components/atoms/IconButton";
import { PageFrame, StatCard } from "./Chrome";

export function BoardIntro() {
  return (
    <PageFrame>
      <div className="flex flex-col gap-6" style={{ maxWidth: 640 }}>
        <div
          className="uppercase tracking-widest"
          style={{
            fontSize: "var(--font-size-micro)",
            letterSpacing: "var(--tracking-micro)",
            color: "var(--text-tertiary)",
          }}
        >
          Components
        </div>
        <h1
          style={{
            fontSize: "var(--font-size-display)",
            lineHeight: "var(--line-height-display)",
            fontWeight: "var(--weight-display)" as unknown as number,
            letterSpacing: "-0.01em",
            margin: 0,
          }}
        >
          Buttons &amp; Icon Actions
        </h1>
        <p style={{ fontSize: "var(--font-size-body)", lineHeight: "var(--line-height-body)", color: "var(--text-secondary)", margin: 0 }}>
          <code style={{ background: "var(--surface-sunken)", borderRadius: 4, padding: "2px 6px", fontSize: "var(--font-size-caption)" }}>
            Button
          </code>{" "}
          and{" "}
          <code style={{ background: "var(--surface-sunken)", borderRadius: 4, padding: "2px 6px", fontSize: "var(--font-size-caption)" }}>
            IconButton
          </code>{" "}
          live at <code style={{ fontSize: "var(--font-size-caption)" }}>src/components/atoms/</code> and
          are the only two ways to trigger an action in this app. Both are fused
          atoms per this repo's atomic-design convention (CLAUDE.md §1): size and
          variant/tone are modeled as props on one component — never forked into
          separate components — so every call site shares one implementation and
          one CSS module built from <code style={{ fontSize: "var(--font-size-caption)" }}>src/styles/tokens.css</code>.
        </p>
        <p style={{ fontSize: "var(--font-size-body)", lineHeight: "var(--line-height-body)", color: "var(--text-secondary)", margin: 0 }}>
          <strong>Button</strong> carries two axes — <code style={{ fontSize: "var(--font-size-caption)" }}>variant</code>{" "}
          (primary / secondary / ghost / danger) and <code style={{ fontSize: "var(--font-size-caption)" }}>size</code>{" "}
          (md / lg) — plus built-in loading, full-width, and leading/trailing icon
          slots. <strong>IconButton</strong> carries a single <code style={{ fontSize: "var(--font-size-caption)" }}>tone</code>{" "}
          axis (default / subtle / onBrand) for icon-only actions that need a
          required <code style={{ fontSize: "var(--font-size-caption)" }}>aria-label</code>. Both just added{" "}
          <code style={{ fontSize: "var(--font-size-caption)" }}>asChild</code> — a Radix Slot prop that lets either
          component hand its classes and behavior to a single child element (a
          router <code style={{ fontSize: "var(--font-size-caption)" }}>{"<Link>"}</code> or <code style={{ fontSize: "var(--font-size-caption)" }}>{"<a>"}</code>)
          instead of rendering its own <code style={{ fontSize: "var(--font-size-caption)" }}>{"<button>"}</code> — see the{" "}
          <strong>asChild Polymorphism</strong> storyboard.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-4">
          <Button variant="primary" leadingIcon={<Plus size={18} />}>
            Create site area
          </Button>
          <Button variant="secondary">Cancel</Button>
          <Button variant="ghost" trailingIcon={<ArrowRight size={18} />}>
            Learn more
          </Button>
          <Button variant="danger" leadingIcon={<Trash2 size={18} />}>
            Remove connector
          </Button>
          <IconButton aria-label="Help and support" tone="subtle">
            <Headphones size={20} />
          </IconButton>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-6">
          <StatCard label="Button variants" value={4} detail="primary · secondary · ghost · danger" />
          <StatCard label="Button sizes" value={2} detail="md (44px) · lg (52px)" />
          <StatCard label="IconButton tones" value={3} detail="default · subtle · onBrand" />
          <StatCard label="Used across the app" value="12 / 2" detail="Button in 12 files · IconButton in 2 files" />
        </div>
      </div>
    </PageFrame>
  );
}
