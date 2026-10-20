import { useState } from "react";
import { PhoneNumberField } from "@/components/molecules/PhoneNumberField";
import { ReadOnlyField } from "@/components/molecules/ReadOnlyField";
import { Demo, PageFrame, PageTitle, Row } from "./Chrome";

function PhoneNumberFieldDemo() {
  // Mirrors InstallerInformationPage.tsx's real wiring: country code +
  // number held as two draft fields, composed as one row.
  const [countryCode, setCountryCode] = useState("+1");
  const [phoneNumber, setPhoneNumber] = useState("");
  return (
    <PhoneNumberField
      countryCode={countryCode}
      phoneNumber={phoneNumber}
      onCountryCodeChange={setCountryCode}
      onPhoneNumberChange={setPhoneNumber}
      required
    />
  );
}

export function BoardComposite() {
  return (
    <PageFrame>
      <PageTitle
        title="Composite Fields"
        description={
          <>
            Two molecules compose the fused atoms rather than duplicating
            their chrome: <code>PhoneNumberField</code> pairs a{" "}
            <code>SelectField&lt;string&gt;</code> country-code picker with an{" "}
            <code>Input</code> in a fixed two-column row, and{" "}
            <code>ReadOnlyField</code> renders a locked label + value pair for
            data the installer can see but not edit.
          </>
        }
      />

      <Row
        name="PhoneNumberField"
        description={
          <>
            From Installer Information — a 6.5rem country-code column next to
            a flexible number field, both wired through the same{" "}
            <code>errorText</code>/<code>required</code> contract as a bare
            Input.
          </>
        }
      >
        <Demo label="editable">
          <div className="w-full max-w-[420px]">
            <PhoneNumberFieldDemo />
          </div>
        </Demo>
        <Demo label="error">
          <div className="w-full max-w-[420px]">
            <PhoneNumberField
              countryCode="+1"
              phoneNumber="555"
              onCountryCodeChange={() => {}}
              onPhoneNumberChange={() => {}}
              errorText="Enter a valid phone number"
              required
            />
          </div>
        </Demo>
      </Row>

      <Row
        name="ReadOnlyField"
        description={
          <>
            From Charger Electrical Information's "already installed" panel
            and Validate Charger Details — a lock icon, label, and value with
            no interactive control at all.
          </>
        }
      >
        <Demo label="examples">
          <div className="grid w-full max-w-[520px] grid-cols-2 gap-3">
            <ReadOnlyField label="Charger ID" value="CHG-20491" />
            <ReadOnlyField label="Voltage" value="400V" />
            <ReadOnlyField label="Number of phases" value="Three Phase" />
            <ReadOnlyField label="Rated power" value="12.80 kW" />
          </div>
        </Demo>
      </Row>
    </PageFrame>
  );
}
