import { Mail } from "lucide-react";
import { Input } from "@/components/atoms/Input";
import { Select } from "@/components/atoms/Select";
import { Checkbox } from "@/components/atoms/Checkbox";
import { PageFrame } from "./Chrome";

export function BoardIntro() {
  return (
    <PageFrame>
      <div className="flex max-w-[680px] flex-col gap-6">
        <div className="text-label uppercase tracking-widest text-neutral-400">
          Components
        </div>
        <h1 className="text-[34px] font-semibold leading-[40px] tracking-tight">
          Form Fields
        </h1>
        <p className="text-body leading-relaxed text-neutral-500">
          <code className="mx-1 rounded bg-neutral-100 px-1 py-0.5 text-[12px]">
            Input
          </code>{" "}
          and{" "}
          <code className="mx-1 rounded bg-neutral-100 px-1 py-0.5 text-[12px]">
            Select
          </code>{" "}
          are <strong>fused atoms</strong> — each already combines label,
          control, helper text, and error message in one component. This is a
          deliberate, documented deviation (CLAUDE.md §1 "Known deviation:
          Input/Select are fused 'field' atoms, not strict atom-only
          primitives") from a stricter source doc that described separate bare
          atoms (<code className="mx-1 rounded bg-neutral-100 px-1 py-0.5 text-[12px]">input</code>/
          <code className="mx-1 rounded bg-neutral-100 px-1 py-0.5 text-[12px]">select</code>) plus
          molecule-tier <code className="mx-1 rounded bg-neutral-100 px-1 py-0.5 text-[12px]">TextField</code>/
          <code className="mx-1 rounded bg-neutral-100 px-1 py-0.5 text-[12px]">SelectField</code> wrappers.
          That split was never built — there is no bare, unlabeled
          <code className="mx-1 rounded bg-neutral-100 px-1 py-0.5 text-[12px]">{"<input>"}</code>/
          <code className="mx-1 rounded bg-neutral-100 px-1 py-0.5 text-[12px]">{"<select>"}</code>{" "}
          underneath these to reach for instead.
        </p>
        <p className="text-body leading-relaxed text-neutral-500">
          <code className="mx-1 rounded bg-neutral-100 px-1 py-0.5 text-[12px]">
            SelectField&lt;T&gt;
          </code>{" "}
          is the real tier boundary above the fused atom: a thin,
          generic, type-safe wrapper around <code className="mx-1 rounded bg-neutral-100 px-1 py-0.5 text-[12px]">Select</code> that
          gives call sites a union-typed <code className="mx-1 rounded bg-neutral-100 px-1 py-0.5 text-[12px]">value</code>/
          <code className="mx-1 rounded bg-neutral-100 px-1 py-0.5 text-[12px]">onValueChange</code>{" "}
          instead of plumbing a raw <code className="mx-1 rounded bg-neutral-100 px-1 py-0.5 text-[12px]">ChangeEvent&lt;HTMLSelectElement&gt;</code>{" "}
          and string casts through every page. Reach for{" "}
          <code className="mx-1 rounded bg-neutral-100 px-1 py-0.5 text-[12px]">Input</code>/
          <code className="mx-1 rounded bg-neutral-100 px-1 py-0.5 text-[12px]">Select</code> directly for
          untyped or string-valued fields, and <code className="mx-1 rounded bg-neutral-100 px-1 py-0.5 text-[12px]">SelectField&lt;T&gt;</code> whenever
          the option values are a specific string union.
        </p>

        <div className="flex flex-col gap-4 rounded-xl border border-neutral-200 bg-surface-container-lowest p-6 pt-5">
          <div className="text-micro uppercase tracking-widest text-neutral-400">
            Live sample
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              leadingIcon={<Mail size={16} />}
              required
            />
            <Select
              label="Number of phases"
              placeholder="Select phases"
              options={[
                { value: "single", label: "Single Phase" },
                { value: "three", label: "Three Phase" },
              ]}
              required
            />
          </div>
          <Checkbox checked readOnly aria-label="I confirm the above is correct" />
        </div>

        <div className="grid grid-cols-3 gap-3 pt-2">
          <div className="rounded-xl border border-neutral-200 p-4">
            <div className="pb-2 text-micro uppercase tracking-widest text-neutral-400">
              Input
            </div>
            <div className="text-title-2 font-semibold">7</div>
            <div className="pt-1 text-label text-neutral-500">
              call sites across src/pages + PhoneNumberField
            </div>
          </div>
          <div className="rounded-xl border border-neutral-200 p-4">
            <div className="pb-2 text-micro uppercase tracking-widest text-neutral-400">
              Select / SelectField
            </div>
            <div className="text-title-2 font-semibold">5</div>
            <div className="pt-1 text-label text-neutral-500">
              pages rendering a dropdown field
            </div>
          </div>
          <div className="rounded-xl border border-neutral-200 p-4">
            <div className="pb-2 text-micro uppercase tracking-widest text-neutral-400">
              Checkbox
            </div>
            <div className="text-title-2 font-semibold">1</div>
            <div className="pt-1 text-label text-neutral-500">
              caller — ChecklistItem molecule
            </div>
          </div>
        </div>
      </div>
    </PageFrame>
  );
}
