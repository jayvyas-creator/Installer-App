import { AnimatePresence } from "motion/react";
import { useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { PageTransition } from "@/components/PageTransition";
import { InstallFlowProvider } from "@/state/InstallFlowContext";
import { SplashPage } from "@/pages/SplashPage";
import { HomePage } from "@/pages/HomePage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { NoEvChargerFoundPage } from "@/pages/NoEvChargerFoundPage";
import { ValidateChargerDetailsPage } from "@/pages/ValidateChargerDetailsPage";
import { InstallerInformationPage } from "@/pages/InstallerInformationPage";
import { EnterTokenIdPage } from "@/pages/EnterTokenIdPage";
import { SelectSitePage } from "@/pages/SelectSitePage";
import { ProcessingPage } from "@/pages/ProcessingPage";
import { SiteInformationPage } from "@/pages/SiteInformationPage";
import { CreateSiteAreaPage } from "@/pages/CreateSiteAreaPage";
import { ChargerElectricalInformationPage } from "@/pages/ChargerElectricalInformationPage";
import { ConnectorInformationDetailsPage } from "@/pages/ConnectorInformationDetailsPage";
import { InstallationSuccessPage } from "@/pages/InstallationSuccessPage";
import { CommunicationChecklistPage } from "@/pages/CommunicationChecklistPage";
import { PhysicalHealthinessPage } from "@/pages/PhysicalHealthinessPage";
import { AutomatedOcppTestingPage } from "@/pages/AutomatedOcppTestingPage";
import { ReadyToBeCommissionedPage } from "@/pages/ReadyToBeCommissionedPage";
import { ReadyToChargePage } from "@/pages/ReadyToChargePage";
import { HelpPage } from "@/pages/HelpPage";

// Set once a standalone-launch splash has been shown, so it only plays once
// per browser session (not on every back-navigation to "/").
const SPLASH_SHOWN_KEY = "dynachrg-splash-shown";

function shouldShowStandaloneSplash(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }
  const isStandaloneLaunch = window.matchMedia("(display-mode: standalone)").matches;
  if (!isStandaloneLaunch) {
    return false;
  }
  if (window.sessionStorage.getItem(SPLASH_SHOWN_KEY)) {
    return false;
  }
  window.sessionStorage.setItem(SPLASH_SHOWN_KEY, "1");
  return true;
}

// Root route gate: on a standalone (installed PWA) cold launch, hands off to
// the splash screen first; otherwise renders Home directly. The check runs
// once per mount via the lazy useState initializer, so a regular browser
// visit never renders an extra frame for it.
function RootRoute() {
  const [showSplash] = useState(shouldShowStandaloneSplash);

  if (showSplash) {
    return <Navigate to="/splash" replace />;
  }

  return <HomePage />;
}

function AnimatedRoutes() {
  const location = useLocation();

  // popLayout overlaps the outgoing and incoming page animations instead of
  // running them in sequence — this is a 16-step wizard, and mode="wait"
  // was adding ~640ms of pure animation to every step.
  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/splash" element={<PageTransition ease="expo"><SplashPage /></PageTransition>} />
        <Route path="/" element={<PageTransition><RootRoute /></PageTransition>} />
        <Route path="/no-charger-found" element={<PageTransition><NoEvChargerFoundPage /></PageTransition>} />
        <Route path="/validate-charger-details" element={<PageTransition><ValidateChargerDetailsPage /></PageTransition>} />
        <Route path="/installer-info" element={<PageTransition><InstallerInformationPage /></PageTransition>} />
        <Route path="/enter-token" element={<PageTransition><EnterTokenIdPage /></PageTransition>} />
        <Route path="/select-site" element={<PageTransition><SelectSitePage /></PageTransition>} />
        <Route path="/processing" element={<PageTransition><ProcessingPage /></PageTransition>} />
        <Route path="/site-information" element={<PageTransition><SiteInformationPage /></PageTransition>} />
        <Route path="/site-area/new" element={<PageTransition><CreateSiteAreaPage /></PageTransition>} />
        <Route path="/charger-electrical" element={<PageTransition><ChargerElectricalInformationPage /></PageTransition>} />
        <Route path="/connector-information" element={<PageTransition><ConnectorInformationDetailsPage /></PageTransition>} />
        <Route path="/installation-success" element={<PageTransition><InstallationSuccessPage /></PageTransition>} />
        <Route path="/communication-checklist" element={<PageTransition><CommunicationChecklistPage /></PageTransition>} />
        <Route path="/physical-healthiness" element={<PageTransition><PhysicalHealthinessPage /></PageTransition>} />
        <Route path="/ocpp-testing" element={<PageTransition><AutomatedOcppTestingPage /></PageTransition>} />
        <Route path="/ready-to-be-commissioned" element={<PageTransition><ReadyToBeCommissionedPage /></PageTransition>} />
        <Route path="/ready-to-charge" element={<PageTransition><ReadyToChargePage /></PageTransition>} />
        <Route path="/help" element={<PageTransition><HelpPage /></PageTransition>} />
        <Route path="*" element={<PageTransition><NotFoundPage /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <InstallFlowProvider>
      {/* Placed inside InstallFlowProvider, wrapping only the route tree:
          a render error is almost always one page's problem, not the
          install-flow state itself. "Try again" only remounts the routes,
          so an in-progress install survives a recovered error instead of
          being wiped the way a boundary placed above the provider would
          wipe it. */}
      <ErrorBoundary>
        <AnimatedRoutes />
      </ErrorBoundary>
    </InstallFlowProvider>
  );
}

export default App;
