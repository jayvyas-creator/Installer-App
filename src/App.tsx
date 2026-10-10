import { AnimatePresence } from "framer-motion";
import { Route, Routes, useLocation } from "react-router-dom";
import { PageTransition } from "@/components/PageTransition";
import { InstallFlowProvider } from "@/state/InstallFlowContext";
import { HomePage } from "@/pages/HomePage";
import { NoEvChargerFoundPage } from "@/pages/NoEvChargerFoundPage";
import { InstallerInformationPage } from "@/pages/InstallerInformationPage";
import { EnterTokenIdPage } from "@/pages/EnterTokenIdPage";
import { ProcessingPage } from "@/pages/ProcessingPage";
import { SiteInformationPage } from "@/pages/SiteInformationPage";
import { ChargerElectricalInformationPage } from "@/pages/ChargerElectricalInformationPage";
import { ConnectorInformationDetailsPage } from "@/pages/ConnectorInformationDetailsPage";
import { InstallationSuccessPage } from "@/pages/InstallationSuccessPage";
import { CommunicationChecklistPage } from "@/pages/CommunicationChecklistPage";
import { PhysicalHealthinessPage } from "@/pages/PhysicalHealthinessPage";
import { AutomatedOcppTestingPage } from "@/pages/AutomatedOcppTestingPage";
import { ReadyToBeCommissionedPage } from "@/pages/ReadyToBeCommissionedPage";
import { ReadyToChargePage } from "@/pages/ReadyToChargePage";
import { HelpPage } from "@/pages/HelpPage";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
        <Route path="/no-charger-found" element={<PageTransition><NoEvChargerFoundPage /></PageTransition>} />
        <Route path="/installer-info" element={<PageTransition><InstallerInformationPage /></PageTransition>} />
        <Route path="/enter-token" element={<PageTransition><EnterTokenIdPage /></PageTransition>} />
        <Route path="/processing" element={<PageTransition><ProcessingPage /></PageTransition>} />
        <Route path="/site-information" element={<PageTransition><SiteInformationPage /></PageTransition>} />
        <Route path="/charger-electrical" element={<PageTransition><ChargerElectricalInformationPage /></PageTransition>} />
        <Route path="/connector-information" element={<PageTransition><ConnectorInformationDetailsPage /></PageTransition>} />
        <Route path="/installation-success" element={<PageTransition><InstallationSuccessPage /></PageTransition>} />
        <Route path="/communication-checklist" element={<PageTransition><CommunicationChecklistPage /></PageTransition>} />
        <Route path="/physical-healthiness" element={<PageTransition><PhysicalHealthinessPage /></PageTransition>} />
        <Route path="/ocpp-testing" element={<PageTransition><AutomatedOcppTestingPage /></PageTransition>} />
        <Route path="/ready-to-be-commissioned" element={<PageTransition><ReadyToBeCommissionedPage /></PageTransition>} />
        <Route path="/ready-to-charge" element={<PageTransition><ReadyToChargePage /></PageTransition>} />
        <Route path="/help" element={<PageTransition><HelpPage /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <InstallFlowProvider>
      <AnimatedRoutes />
    </InstallFlowProvider>
  );
}

export default App;
