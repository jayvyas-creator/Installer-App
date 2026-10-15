import { describe, expect, it } from "vitest";
import { resolveRoute } from "./resolveRoute";

describe("resolveRoute", () => {
  it("routes Active chargers to Ready to Charge", () => {
    expect(resolveRoute({ status: "Active", installationStep: null }, { siteAreaCount: 1 })).toBe(
      "/ready-to-charge",
    );
  });

  it("routes Connected chargers to Ready to be Commissioned", () => {
    expect(
      resolveRoute({ status: "Connected", installationStep: null }, { siteAreaCount: 1 }),
    ).toBe("/ready-to-be-commissioned");
  });

  it("routes a Registered charger past CD check with no site areas to create a new one", () => {
    expect(
      resolveRoute(
        { status: "Registered", installationStep: "CDCheckComplete" },
        { siteAreaCount: 0 },
      ),
    ).toBe("/site-area/new");
  });

  it("routes a Registered charger past CD check with existing site areas to Site Information", () => {
    expect(
      resolveRoute(
        { status: "Registered", installationStep: "CDCheckComplete" },
        { siteAreaCount: 3 },
      ),
    ).toBe("/site-information");
  });

  it("routes a Registered charger with no completed step to Validate Charger Details", () => {
    expect(
      resolveRoute({ status: "Registered", installationStep: null }, { siteAreaCount: 0 }),
    ).toBe("/validate-charger-details");
  });

  it("routes an Installed charger past the comm check to Physical Healthiness", () => {
    expect(
      resolveRoute(
        { status: "Installed", installationStep: "ChargerCommCheckComplete" },
        { siteAreaCount: 1 },
      ),
    ).toBe("/physical-healthiness");
  });

  it("routes an Installed charger past the hardware check to OCPP Testing", () => {
    expect(
      resolveRoute(
        { status: "Installed", installationStep: "ChargerHWCheckComplete" },
        { siteAreaCount: 1 },
      ),
    ).toBe("/ocpp-testing");
  });

  it("routes a freshly Installed charger to the Communication Checklist", () => {
    expect(
      resolveRoute({ status: "Installed", installationStep: null }, { siteAreaCount: 1 }),
    ).toBe("/communication-checklist");
  });
});
