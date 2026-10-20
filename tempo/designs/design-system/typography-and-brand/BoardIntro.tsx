import { Heading } from "@/components/atoms/Heading";
import { Wordmark } from "@/components/atoms/Wordmark";
import { PageFrame } from "./Chrome";

export function BoardIntro() {
  return (
    <PageFrame>
      <div className="flex max-w-[640px] flex-col gap-6">
        <div className="text-[11px] uppercase tracking-widest text-neutral-400">
          Components
        </div>
        <h1 className="text-[34px] font-semibold leading-[40px] tracking-tight">
          Typography &amp; Brand
        </h1>
        <p
          className="text-neutral-500 leading-relaxed"
          style={{ fontSize: "var(--font-size-body)", lineHeight: "var(--line-height-body)" }}
        >
          Two atoms: <strong>Heading</strong> (
          <code className="mx-1 rounded bg-neutral-100 px-1 py-0.5 text-[12px]">
            atoms/Heading.tsx
          </code>
          ), a 3-level page/section title, and <strong>Wordmark</strong> (
          <code className="mx-1 rounded bg-neutral-100 px-1 py-0.5 text-[12px]">
            atoms/Wordmark.tsx
          </code>
          ), the "DYNACHRG" brand logotype in 3 sizes.
        </p>
        <p
          className="text-neutral-500 leading-relaxed"
          style={{ fontSize: "var(--font-size-body)", lineHeight: "var(--line-height-body)" }}
        >
          Both draw on a <strong>confirmed-brand</strong> decision recorded directly in{" "}
          <code className="mx-1 rounded bg-neutral-100 px-1 py-0.5 text-[12px]">
            src/styles/tokens.css
          </code>
          : SF Pro (<code className="rounded bg-neutral-100 px-1 py-0.5 text-[12px]">
            --font-family-base
          </code>
          ) is the body/control font everywhere in the app, while Lato (
          <code className="rounded bg-neutral-100 px-1 py-0.5 text-[12px]">
            --font-family-heading
          </code>
          ) is reserved for the <strong>Heading</strong> atom only. The token file's own comment is
          explicit about this: it was <em>"verified against the PayG Installer App source
          directly (DESIGN-HANDOFF.md §1)"</em> — an earlier pass had the two faces swapped,
          sourced from the wrong repo, and was corrected.
        </p>

        <div className="flex flex-col gap-4 rounded-xl border border-neutral-200 p-6 pt-5">
          <div className="text-[11px] uppercase tracking-widest text-neutral-400">
            Live sample
          </div>
          <Heading level={1}>Site information</Heading>
          <p
            className="text-neutral-600"
            style={{ fontFamily: "var(--font-family-base)", fontSize: "var(--font-size-body)" }}
          >
            Body copy sits in SF Pro right under a Lato heading — the pairing in use on every
            page that has one.
          </p>
          <div className="pt-2">
            <Wordmark size="md" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 pt-6">
          <div className="rounded-xl border border-neutral-200 p-4">
            <div className="pb-2 text-[10px] uppercase tracking-widest text-neutral-400">
              Heading levels
            </div>
            <div className="text-[22px] font-semibold">3</div>
            <div className="pt-1 text-[11px] text-neutral-500">
              level 1 · 2 · 3 (h1/h2/h3)
            </div>
          </div>
          <div className="rounded-xl border border-neutral-200 p-4">
            <div className="pb-2 text-[10px] uppercase tracking-widest text-neutral-400">
              Heading call sites
            </div>
            <div className="text-[22px] font-semibold">3 files</div>
            <div className="pt-1 text-[11px] text-neutral-500">
              SiteInformationPage · ValidateChargerDetailsPage · CreateSiteAreaPage
            </div>
          </div>
          <div className="rounded-xl border border-neutral-200 p-4">
            <div className="pb-2 text-[10px] uppercase tracking-widest text-neutral-400">
              Wordmark call sites
            </div>
            <div className="text-[22px] font-semibold">1 file</div>
            <div className="pt-1 text-[11px] text-neutral-500">
              ProcessingPage (size="lg", on the commissioning screen)
            </div>
          </div>
        </div>

        <p className="pt-2 text-[12px] leading-relaxed text-neutral-400">
          The storyboards on this canvas show the two components as they exist today, plus the
          wider type scale they draw labels and sizes from. The Design System Debt storyboard
          lists the real places in the app that hand-roll a heading instead of using this
          component.
        </p>
      </div>
    </PageFrame>
  );
}
