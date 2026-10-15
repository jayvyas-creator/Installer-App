# DynaChrg Installer (web): ops test guide

This guide walks you through testing the web installer against the EVES backend. You don't need any technical knowledge to follow it.

Each step says three things:

- **Enter:** what to type or click,
- **You should see:** what the page should show,
- **Sent to the backend:** what the app records in EVES at that point.

If what you see doesn't match, report it using the template in *How to report an issue* near the end of this guide.

---

## Before you start

You need:

| What | Where to get it |
|---|---|
| The staging URL of the web installer | *Ask the EVES backend team* (placeholder: `https://<staging-installer-url>`) |
| A **charger ID** whose status in EVES is **Registered** with no installation step | *Ask the EVES backend team* |
| The **installer token** (Token ID) for that charger | *Ask the EVES backend team* |
| Access to the **EVES portal**, to check the charger's status after each run | *Ask the EVES backend team* |
| A phone or laptop with a camera (for QR scanning) and an up-to-date Chrome, Safari or Edge | — |

**Tips:**

- **One charger per run.** A finished run changes the charger's status in EVES. You can't run the happy path twice on the same charger unless the backend team resets it.
- **Use made-up installer details** (name, email, phone) that are clearly test data, e.g. "Test Ops".
- **Keep the token private.** Never put it in a screenshot, ticket or chat message. Refer to the charger by its ID instead.
- **Use HTTPS.** The camera only works when the page is opened over HTTPS.

---

## Happy path

Start each run from the Home screen. The steps below are in the order the app shows them.

### 1. Home: enter the charger ID

- **Enter:** type the charger ID in the "Enter Charger ID" box and press the arrow button. *Or* press **Scan QR Code** and point the camera at the charger's QR code. The scanner has Torch and Cancel buttons.
- **You should see:** the Installer Information screen.
  - If you press the arrow with the box empty, you should see "Enter a Charger ID or scan the QR code on the charger."
- **Sent to the backend:** nothing yet.

### 2. Installer Information

- **Enter:**
  - **Required:** Company Name, First Name, Last Name, Email ID, and Mobile Number (pick the country first; it defaults to +1 United States).
  - **Optional:** C-License Number and EVITP Certification Number.
- **Then:** press **Continue**.
- **You should see:** the Enter Token ID screen.
  - Missing or invalid fields show a red message under the field after you press Continue, e.g. "Enter a valid email address." or "Enter a valid mobile number for the selected country."
- **Sent to the backend:** nothing yet. These details are sent together with the token on the next screen.

### 3. Enter Token ID

- **Enter:** the installer token, then press **Continue**. The button reads "Verifying…" while it works.
- **You should see:** the **Validate Charger Details** screen. That is the expected screen for a charger in *Registered* status with no step.
- **Sent to the backend:**
  1. The app checks the charger's current status.
  2. It registers your installer details against the token.
  3. It reads the status again to decide which screen comes next.

### 4. Validate Charger Details

- **You should see:**
  - "Loading charger details…" first.
  - Then the charger ID, Serial Number, QR Code URL, number of connectors and the connector types.
  - The warning "Do not proceed if info is incorrect".
- **Enter:** check that the details match the physical charger, then press **Confirm** (it reads "Confirming…" while working).
- **You should see:** the Site Information screen.
- **Sent to the backend:** the charger's installation step is set to **"charger details checked"** (*CDCheckComplete*).
- **Note:** pressing **Cancel** on this screen ends the session and returns to Home.

### 5. Site Information

The screen depends on how many site areas the charger's site already has:

| Site has | You should see | Enter |
|---|---|---|
| **No** site areas | A **Create Site Area** form | Area Name, Supply Voltage (V), Number of Phases, Phase Assignment and Amps Per Phase (A). Max Power (kW) is calculated for you. |
| **One** site area | "Site Area: *name*" with its capacity, read-only | Nothing. Press **Next**. |
| **Several** site areas | A "Select Site Area" dropdown | Pick one, then press **Next**. Next stays disabled until you choose an area. |

- **Creating a new area when the site already has some:** use the link "Can't find your site area? Create new site area". To go back to the list, use "Choose an existing site area instead".
- **Duplicate names:** a name already used on the site shows "That site name's already taken. Try a different one." The check ignores upper/lower case.
- **Sent to the backend:** nothing yet. The chosen or new site area is sent with the install in step 7.

### 6. Charger Electrical Information

- **Enter:**
  - Type of Charger (AC/DC)
  - Supply Voltage (V), which starts at the site area's voltage
  - Number of Connected Phase
  - Phase Assignment
  - Amp Per Phase (A), between 1 and 1000
- **You should see:** Rated Power (kW) is calculated as you type. Press **Next** to reach Connector Information.
  - A single-phase site only offers single-phase charger options.
- **Sent to the backend:** nothing yet.

### 7. Connector Information Details

- **Enter:**
  - The number of connectors (1–6; it starts at the charger's own count).
  - For each connector: Connector Type, Current Type, Number of Connected Phase, Phase Assignment, Total Amperage (A) (1–1000) and Supply Voltage (V) (1–9999).
  - The choices limit each other. If you change one, any choice that no longer fits is cleared.
- **Then:** press **Next**. It reads "Submitting…".
- **You should see:** the Installation Success screen.
- **Sent to the backend:** the **full installation**: the site area (new or existing), the charger's electrical details and every connector. The charger's status in EVES becomes **Installed**.

### 8. Installation Success

- **You should see:** "Charger successfully installed" and a **Next** button. There is **no Back button** here, on purpose.
- **Sent to the backend:** nothing.

### 9. Communication Checklist

- **Enter:** tick all three boxes once the work is done on the charger:
  1. Rated current configuration matches the wiring and circuit breaker…
  2. Wifi and OCPP URL configuration updated…
  3. Perform a hard reset of the charger and wait at least 2 minutes.
- **You should see:** **Next** becomes enabled only when all three are ticked.

### 10. Processing (communication check)

- **You should see:**
  - "Please stay on this screen while we complete the process…"
  - A running "Elapsed" timer.
  - No buttons, and the browser Back button does nothing.
  - After a few seconds the app moves on by itself to Physical Healthiness.
- **Sent to the backend:** the installation step is set to **"communication check complete"** (*ChargerCommCheckComplete*).

### 11. Physical Healthiness

- **Enter:** tick **all 30** checks (from "Mounting & structure secure" to "Documentation noted"), then press **Next**.
- **Sent to the backend:** nothing on this screen.

### 12. Automated OCPP Testing

- **You should see:** "Processing... this may take a few minutes." The **Next** button reads "Checking…" and is disabled until the hardware check finishes, then it becomes enabled.
- **Sent to the backend:** as soon as the screen opens, the installation step is set to **"hardware check complete"** (*ChargerHWCheckComplete*).
- **Enter:** press **Next**. A Processing screen appears again for a few seconds.
- **Sent to the backend:** the final OCPP step.
  - **Known placeholder:** the app currently sends the same value as the communication check (*ChargerCommCheckComplete*), copied from the mobile app. The backend team still has to confirm the correct value. See [KNOWN-LIMITATIONS.md](KNOWN-LIMITATIONS.md).

### 13. Ready to be commissioned

- **You should see:** "All tasks are successfully completed" and a **Back to Home** button.
- **Then:** press **Back to Home**. This clears the session and returns to the Home screen.

---

## Resume scenarios

If an installation was interrupted, entering the same charger ID and token again opens the right screen for where the charger is in EVES. To test this, ask the backend team for chargers in each state, or stop a run part-way and start again.

| Charger status in EVES | Installation step | Should open on |
|---|---|---|
| Registered | *(none)* | Validate Charger Details |
| Registered | charger details checked (*CDCheckComplete*) | Site Information |
| Installed | *(none)* | Communication Checklist |
| Installed | communication check complete (*ChargerCommCheckComplete*) | Physical Healthiness |
| Installed | hardware check complete (*ChargerHWCheckComplete*) | Automated OCPP Testing |
| Connected | any | Ready to be commissioned |
| Active | any | Ready to Charge (a page with links to the DynaChrg PayG app) |
| Charger not found, or the token is rejected | — | No EV Charger Found |
| Any other combination | — | Stays on Enter Token ID with "Unexpected charger status: …" |

On a resumed **Installed** charger, going **Back** to the site, electrical or connector screens shows the values read-only with the note "This charger is already installed. Contact support to change these details."

---

## Error scenarios to try

| # | Scenario | How to do it | Expected result |
|---|---|---|---|
| E1 | **Wrong token** | Enter a valid charger ID with a made-up token. | "No EV Charger Found", or a message on Enter Token ID such as "The token ID is invalid. Please re-enter and try again." **Try again** returns to Enter Token ID with your details still filled in. |
| E2 | **Unknown charger** | Enter a charger ID that doesn't exist. | "No EV Charger Found" with the support number. **Back to Home** clears everything. |
| E3 | **Voltage higher than the site's** | On Charger Electrical Information, enter a Supply Voltage above the site area's voltage. | Straight away: "The selected voltage (…V) exceeds the previously stored voltage (…V). Please select a lower voltage." **Next** stays disabled. |
| E4 | **Amps out of range** | Enter 0 or 1001 in Amp Per Phase (charger) or Total Amperage (connector). For Amps Per Phase when creating a site area, enter 0 or 10000. | "Enter a whole number between 1 and 1000." (charger and connector) or "…between 1 and 9999." (site area). **Next** stays disabled. |
| E5 | **Duplicate site area name** | Create a site area with the same name as an existing one. | "That site name's already taken. Try a different one." |
| E6 | **Network off on Enter Token ID** | Turn off Wi-Fi or mobile data, then press Continue. | The error "Unable to reach the server. Check your connection and try again." and a **Retry** button. You stay on the page and are *not* sent to No Charger Found. Turn the network back on and press Retry: the flow continues. |
| E7 | **Network off while loading charger details** | On Site Information, turn the network off, then use the browser Back button to return to Validate Charger Details. | "Could not load charger details. Please try again." with **Cancel** and **Retry**. |
| E8 | **Network off on OCPP Testing** | On Physical Healthiness, tick all boxes, turn the network off, then press Next. | An error with **Retry**. **Next** stays disabled until the check passes. |
| E9 | **Communication check fails** | Happens when the backend rejects the communication step. In mock mode (`VITE_USE_MOCKS=true`), use a charger ID containing `COMMFAIL`. | Returns to Communication Checklist with the **"No Heartbeat Received!"** panel, tips and "contact your CPO at (323) 488-2092". **Try again** re-runs the check; **Cancel** closes the panel. |
| E10 | **OCPP check fails** | Happens when the backend rejects the final OCPP step. In mock mode, use a charger ID containing `OCPPFAIL`. | The **"OCPP Testing Failed"** panel with "contact your support team at (323) 488-2092". **Try again** and **Cancel** behave as in E9. |
| E11 | **Browser Back** | Use the browser's Back button at different steps. | You go back one screen with your entries kept. Back does nothing on a Processing screen. After the install, the site, electrical and connector screens are read-only. No step is sent to the backend twice. |
| E12 | **Refresh** | Press F5 or pull to refresh on any screen. | The same screen comes back with your entries. |
| E13 | **Switch to another charger** | Part-way through, go Home and enter a **different** charger ID. | A fresh start for the new charger, with no data from the old one. Your installer details (name, email, phone) are still filled in. Browser Back can't return to the old charger's screens. |
| E14 | **Cancel** | Press **Cancel** on Validate Charger Details. | The session is cleared and you are back on Home. |
| E15 | **Already-installed charger** | Enter a charger that is already Installed, then use Back to reach Connector Information. | Values are read-only with "This charger is already installed. Contact support to change these details." Next moves on without resubmitting. |

See the [README](../README.md#mock-mode) for the full list of mock-mode charger ID keywords, if you're testing in mock mode rather than against the real dev backend.

---

## What to check in the EVES portal

After each run, or at the checkpoints below, look up the charger in the EVES portal and note its **status** and **installation step**:

| After | Status | Installation step |
|---|---|---|
| Validate Charger Details → Confirm | Registered | CDCheckComplete |
| Connector Information → Next (install) | Installed | *(none)* |
| Processing (communication check) | Installed | ChargerCommCheckComplete |
| Opening Automated OCPP Testing | Installed | ChargerHWCheckComplete |
| Final OCPP check | *Record what you see.* This step is a known placeholder (see above). | *Record what you see.* |

Also check that the **site area** (and, for a new one, its name, voltage and phases), the **charger electrical details** and the **connectors** in the portal match what you entered.

---

## How to report an issue

Include:

- the **charger ID** (never the token),
- the **screen / step** where it happened (use the step names above),
- the **date and time**, with your time zone,
- a **screenshot** of the screen, with the token not visible,
- your **browser and device** (e.g. Chrome 141 on Android, Safari on iPhone 15),
- **what you did**, **what you expected** and **what happened**.

Copy this template:

```
Title: [Installer web] <short description>

Charger ID:
Screen / step:
Date & time (time zone):
Browser & device:
Environment: staging / dev

Steps:
1.
2.
3.

Expected:
Actual:
Screenshot attached: yes / no
EVES portal status / step after the issue:
```

---

## Results

Fill in one row per scenario. Copy the table for each test round.

| Scenario | Expected | Actual | Pass / Fail | Notes |
|---|---|---|---|---|
| Happy path, site with no site areas (create area) | Reaches "Ready to be commissioned"; portal matches | | | |
| Happy path, site with one site area | Reaches "Ready to be commissioned"; portal matches | | | |
| Happy path, site with several site areas | Reaches "Ready to be commissioned"; portal matches | | | |
| Happy path using QR scan | QR fills the charger ID; flow continues | | | |
| Resume: Registered + CDCheckComplete | Opens Site Information | | | |
| Resume: Installed, no step | Opens Communication Checklist | | | |
| Resume: Installed + ChargerCommCheckComplete | Opens Physical Healthiness | | | |
| Resume: Installed + ChargerHWCheckComplete | Opens Automated OCPP Testing | | | |
| Resume: Connected | Opens Ready to be commissioned | | | |
| Resume: Active | Opens Ready to Charge | | | |
| E1 Wrong token | No EV Charger Found / token error | | | |
| E2 Unknown charger | No EV Charger Found | | | |
| E3 Voltage higher than site | Inline error; Next disabled | | | |
| E4 Amps out of range | Inline error; Next disabled | | | |
| E5 Duplicate site area name | Inline error | | | |
| E6 Network off on Enter Token ID | Error + Retry; Retry works | | | |
| E7 Network off loading charger details | Error + Cancel/Retry | | | |
| E8 Network off on OCPP Testing | Error + Retry; Next disabled | | | |
| E9 Communication check fails | "No Heartbeat Received!" panel | | | |
| E10 OCPP check fails | "OCPP Testing Failed" panel | | | |
| E11 Browser Back | Previous screen; no duplicate steps | | | |
| E12 Refresh | Same screen and entries | | | |
| E13 Switch charger | Fresh session; installer details kept | | | |
| E14 Cancel | Back on Home; session cleared | | | |
| E15 Already-installed charger | Read-only install screens | | | |
