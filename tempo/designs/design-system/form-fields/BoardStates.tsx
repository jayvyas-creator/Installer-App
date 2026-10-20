import { Lock, Mail } from "lucide-react";
import { Input } from "@/components/atoms/Input";
import { Select } from "@/components/atoms/Select";
import { Demo, PageFrame, PageTitle, Row } from "./Chrome";

const VOLTAGE_OPTIONS = [
  { value: "400", label: "400V" },
  { value: "230", label: "230V" },
  { value: "120", label: "120V" },
];

export function BoardStates() {
  return (
    <PageFrame>
      <PageTitle
        title="States"
        description={
          <>
            Both fused atoms share the same visual state machine: a default
            idle state, an optional <code>helperText</code> line, an{" "}
            <code>errorText</code> that replaces the helper and switches the
            field into its error visual (red border, alert icon), a{" "}
            <code>required</code> asterisk next to the label, and a{" "}
            <code>disabled</code> state. Real examples below are taken from
            Installer Information, Enter Token ID, and Charger Electrical
            Information.
          </>
        }
      />

      <Row
        name="Default"
        description="Idle state — label + control, no helper or error."
      >
        <Demo label="Input">
          <Input
            label="Company name"
            placeholder=""
            autoComplete="organization"
          />
        </Demo>
        <Demo label="Select">
          <Select
            label="Voltage"
            placeholder="Select voltage"
            options={VOLTAGE_OPTIONS}
          />
        </Demo>
      </Row>

      <Row
        name="Helper text"
        description={
          <>
            <code>helperText</code> renders below the control until an error
            replaces it — from Enter Token ID's token field.
          </>
        }
      >
        <Demo label="Input">
          <Input
            label="Token ID"
            helperText="Found on the sticker inside the charger door"
          />
        </Demo>
        <Demo label="Select">
          <Select
            label="Phase assignment"
            placeholder="Select assignment"
            helperText="Pick a number of phases first"
            disabled
            options={[]}
          />
        </Demo>
      </Row>

      <Row
        name="Error"
        description={
          <>
            <code>errorText</code> swaps in red border, red text, and an
            alert icon via <code>aria-invalid</code> + a describing message —
            from Installer Information's required fields.
          </>
        }
      >
        <Demo label="Input">
          <Input
            label="Email address"
            type="email"
            value="not-an-email"
            leadingIcon={<Mail size={16} />}
            errorText="Enter a valid email address"
            required
          />
        </Demo>
        <Demo label="Select">
          <Select
            label="Charger type"
            placeholder="Select a charger type"
            options={[
              { value: "AC", label: "AC" },
              { value: "DC", label: "DC" },
            ]}
            errorText="Select a charger type"
            required
          />
        </Demo>
      </Row>

      <Row
        name="Required"
        description="A required field shows an asterisk beside its label — no separate visual treatment until it's actually invalid."
      >
        <Demo label="Input">
          <Input label="First name" autoComplete="given-name" required />
        </Demo>
        <Demo label="Select">
          <Select
            label="Number of phases"
            placeholder="Select phases"
            options={[
              { value: "single", label: "Single Phase" },
              { value: "three", label: "Three Phase" },
            ]}
            required
          />
        </Demo>
      </Row>

      <Row
        name="Disabled"
        description={
          <>
            Charger Electrical Information disables Phase Assignment until
            Number of Phases is chosen — the same <code>disabled</code> prop
            as any native control, styled through the shared field chrome.
          </>
        }
      >
        <Demo label="Input">
          <Input
            label="Amp per phase"
            value="32"
            disabled
            trailingAdornment={<Lock size={14} />}
          />
        </Demo>
        <Demo label="Select">
          <Select
            label="Phase assignment"
            placeholder="Choose number of phases first"
            options={[]}
            disabled
            required
          />
        </Demo>
      </Row>
    </PageFrame>
  );
}
