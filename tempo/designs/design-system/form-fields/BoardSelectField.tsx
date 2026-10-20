import { useState } from "react";
import { SelectField } from "@/components/molecules/SelectField";
import type { PhaseAssignment, ChargerType } from "@/types";
import { Demo, PageFrame, PageTitle, Row } from "./Chrome";

const PHASE_ASSIGNMENT_OPTIONS: Array<{ value: PhaseAssignment; label: string }> = [
  { value: "A", label: "A" },
  { value: "B", label: "B" },
  { value: "C", label: "C" },
];

const CHARGER_TYPE_OPTIONS: Array<{ value: ChargerType; label: string }> = [
  { value: "AC", label: "AC" },
  { value: "DC", label: "DC" },
];

function PhaseAssignmentDemo() {
  // Mirrors ChargerElectricalInformationPage.tsx's real wiring:
  // SelectField<PhaseAssignment> with a typed value/onValueChange, no
  // ChangeEvent or string cast in the call site.
  const [value, setValue] = useState<PhaseAssignment | "">("");
  return (
    <SelectField<PhaseAssignment>
      label="Phase assignment"
      placeholder="Select assignment"
      options={PHASE_ASSIGNMENT_OPTIONS}
      value={value}
      onValueChange={setValue}
      required
    />
  );
}

function ChargerTypeDemo() {
  // Mirrors the same page's SelectField<ChargerType> usage.
  const [value, setValue] = useState<ChargerType | "">("");
  return (
    <SelectField<ChargerType>
      label="Charger type"
      placeholder="Select a charger type"
      options={CHARGER_TYPE_OPTIONS}
      value={value}
      onValueChange={setValue}
      required
    />
  );
}

export function BoardSelectField() {
  return (
    <PageFrame>
      <PageTitle
        title="SelectField<T>"
        description={
          <>
            <code>SelectField&lt;T extends string&gt;</code> wraps the{" "}
            <code>Select</code> atom: <code>value</code> is typed as{" "}
            <code>T | ""</code> and <code>onValueChange</code> hands back a{" "}
            <code>T</code> directly — the call site never sees a raw{" "}
            <code>ChangeEvent&lt;HTMLSelectElement&gt;</code> or writes a
            string cast. Both demos below use the actual{" "}
            <code>PhaseAssignment</code> and <code>ChargerType</code> unions
            from <code>src/types/index.ts</code>, wired exactly as{" "}
            <code>ChargerElectricalInformationPage.tsx</code> uses them.
          </>
        }
      />

      <Row
        name="PhaseAssignment union"
        description={
          <>
            <code>{'type PhaseAssignment = "A" | "B" | "C" | "AB" | "BC" | "CA" | "ABC"'}</code>
            {" "}— the options array here is a real subset
            (<code>phaseAssignmentOptionsForCharger</code> narrows it further
            at runtime based on the site area's own assignment).
          </>
        }
      >
        <Demo label="live">
          <div className="w-full max-w-[320px]">
            <PhaseAssignmentDemo />
          </div>
        </Demo>
      </Row>

      <Row
        name="ChargerType union"
        description={
          <>
            <code>{'type ChargerType = "AC" | "DC"'}</code> — the narrowest
            possible union, still routed through the same generic wrapper
            rather than a one-off AC/DC toggle.
          </>
        }
      >
        <Demo label="live">
          <div className="w-full max-w-[320px]">
            <ChargerTypeDemo />
          </div>
        </Demo>
      </Row>
    </PageFrame>
  );
}
