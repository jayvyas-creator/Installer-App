import { Heading } from "@/components/atoms/Heading";
import { Demo, PageFrame, PageTitle, Row } from "./Chrome";

const TYPE_SCALE = [
  { token: "--font-size-display", px: "28px", weight: 800, usedBy: "raw text only — HomePage.module.css .title" },
  { token: "--font-size-title", px: "22px", weight: 700, usedBy: "raw text only — form.module.css .heading, OutcomePanel .title" },
  { token: "--font-size-headline", px: "17px", weight: 700, usedBy: "raw text, not seen on a Heading/body call site in this audit" },
  { token: "--font-size-body-lg", px: "16px", weight: 500, usedBy: "raw text in molecules/pages" },
  { token: "--font-size-body", px: "15px", weight: 400, usedBy: "the global body default (global.css)" },
  { token: "--font-size-caption", px: "13px", weight: 500, usedBy: "raw text — helper/meta copy" },
  { token: "--font-size-micro", px: "11px", weight: 700, usedBy: "raw text — badges, labels" },
];

export function BoardHeadingLevels() {
  return (
    <PageFrame>
      <PageTitle
        title="Heading levels"
        description='Heading exposes exactly 3 discrete levels — level={1|2|3}, default 1 — rendering h1/h2/h3. Its own CSS module hardcodes the 3 sizes (30px / 24px / 20px, DESIGN-HANDOFF.md §1) rather than pulling from the tokens.css type scale, and always renders in var(--font-family-heading) (Lato) at font-weight 600.'
      />

      <Row
        name="level 1 (default)"
        description="h1 · 30px · weight 600 · Lato. Page-title tier — used for the main heading on SiteInformationPage, ValidateChargerDetailsPage, CreateSiteAreaPage."
      >
        <Demo label="rendered">
          <Heading level={1}>Site information</Heading>
        </Demo>
      </Row>

      <Row
        name="level 2"
        description="h2 · 24px · weight 600 · Lato. Sub-section heading — used on SiteInformationPage for the per-site-area heading nested under the level-1 page title."
      >
        <Demo label="rendered">
          <Heading level={2}>North Lot — Area A</Heading>
        </Demo>
      </Row>

      <Row
        name="level 3"
        description="h3 · 20px · weight 600 · Lato. Declared on the component but has no production call site in this audit — available for a smaller in-page heading tier."
      >
        <Demo label="rendered">
          <Heading level={3}>Connector details</Heading>
        </Demo>
      </Row>

      <Row
        name="All 3, together"
        description="Side by side at their real rendered sizes, so the step between levels is visible in context."
      >
        <div className="flex flex-col gap-3">
          <Heading level={1}>Heading level 1 — 30px</Heading>
          <Heading level={2}>Heading level 2 — 24px</Heading>
          <Heading level={3}>Heading level 3 — 20px</Heading>
        </div>
      </Row>

      <div className="flex flex-col gap-4 pt-4">
        <div className="text-[11px] uppercase tracking-widest text-neutral-400">
          The full type scale (tokens.css)
        </div>
        <p className="max-w-[640px] text-[13px] leading-relaxed text-neutral-500">
          Heading's 3 levels are a curated slice of a larger 7-step type scale defined in{" "}
          <code className="rounded bg-neutral-100 px-1 py-0.5 text-[12px]">
            src/styles/tokens.css
          </code>
          . The other steps — display, headline, body-lg, body, caption, micro — aren't exposed
          as a Heading prop; they're reached directly as raw text with an inline font-size token
          reference in pages and molecules (body copy, helper text, badges, stat labels). This is
          an honest gap, not a hidden prop: Heading intentionally covers only the "this is a
          titled section" tier, not the full scale.
        </p>
        <div className="overflow-hidden rounded-lg border border-neutral-200">
          <table className="w-full border-collapse text-left text-[13px]">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-4 py-2 font-medium text-neutral-500">Token</th>
                <th className="px-4 py-2 font-medium text-neutral-500">Size</th>
                <th className="px-4 py-2 font-medium text-neutral-500">Weight</th>
                <th className="px-4 py-2 font-medium text-neutral-500">Used today as</th>
              </tr>
            </thead>
            <tbody>
              {TYPE_SCALE.map((row) => (
                <tr key={row.token} className="border-b border-neutral-100 last:border-b-0">
                  <td className="px-4 py-2 font-mono text-[12px] text-neutral-700">
                    {row.token}
                  </td>
                  <td className="px-4 py-2 text-neutral-600">{row.px}</td>
                  <td className="px-4 py-2 text-neutral-600">{row.weight}</td>
                  <td className="px-4 py-2 text-neutral-500">{row.usedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageFrame>
  );
}
