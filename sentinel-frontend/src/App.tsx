import React, { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSentinelStore } from "./store/useSentinelStore";

// Layout & Overlays
import { Sidebar } from "./components/layout/Sidebar";
import { TopBar } from "./components/layout/TopBar";
import { CommandCenter } from "./components/layout/CommandCenter";
import { InvestigationDrawer } from "./components/common/InvestigationDrawer";

// Feature Pages
import { LandingPage } from "./features/landing/LandingPage";
import { OverviewPage } from "./features/overview/OverviewPage";
import { LiveMonitorPage } from "./features/live-monitor/LiveMonitorPage";
import { TrafficAnalyzerPage } from "./features/traffic-analyzer/TrafficAnalyzerPage";
import { InvestigationsPage } from "./features/investigations/InvestigationsPage";
import { NetworkIntelligencePage } from "./features/network-intelligence/NetworkIntelligencePage";
import { SecurityAnalyticsPage } from "./features/analytics/SecurityAnalyticsPage";
import { DetectionHistoryPage } from "./features/history/DetectionHistoryPage";
import { ProjectWorkPage } from "./features/project-work/ProjectWorkPage";
import { DatasetExplorerPage } from "./features/dataset-explorer/DatasetExplorerPage";
import { ModelLaboratoryPage } from "./features/model-lab/ModelLaboratoryPage";
import { MethodologyPage } from "./features/methodology/MethodologyPage";
import { SettingsPage } from "./features/settings/SettingsPage";
import { AboutPage } from "./features/about/AboutPage";

export default function App() {
  const { isConsoleOpen, activePage, sidebarCollapsed } = useSentinelStore();
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 });
  }, [activePage]);

  // If console is not yet opened, show entry landing experience
  if (!isConsoleOpen) {
    return <LandingPage />;
  }

  const renderActivePage = () => {
    switch (activePage) {
      case "overview":
        return <OverviewPage />;
      case "live-monitor":
        return <LiveMonitorPage />;
      case "analyzer":
        return <TrafficAnalyzerPage />;
      case "investigations":
        return <InvestigationsPage />;
      case "intelligence":
        return <NetworkIntelligencePage />;
      case "analytics":
        return <SecurityAnalyticsPage />;
      case "history":
        return <DetectionHistoryPage />;
      case "project-work":
        return <ProjectWorkPage />;
      case "dataset-explorer":
        return <DatasetExplorerPage />;
      case "model-lab":
        return <ModelLaboratoryPage />;
      case "methodology":
        return <MethodologyPage />;
      case "settings":
        return <SettingsPage />;
      case "about":
        return <AboutPage />;
      default:
        return <OverviewPage />;
    }
  };

  return (
    <div className="min-h-screen bg-[#05080F] text-[#F4F7FC] relative selection:bg-[#00D5FF]/30 overflow-x-hidden font-sans">
      {/* Background Nocturne Aurora & Grid */}
      <div className="fixed inset-0 soc-grid-bg pointer-events-none z-0" />
      <div className="fixed -top-48 -left-48 w-96 h-96 rounded-full bg-[#00D5FF]/5 blur-[120px] pointer-events-none" />
      <div className="fixed -bottom-48 -right-48 w-96 h-96 rounded-full bg-[#7967FF]/8 blur-[140px] pointer-events-none" />

      {/* Collapsible Sidebar */}
      <Sidebar />

      {/* Main App Container */}
      <div
        className={`min-h-screen flex flex-col transition-all duration-300 relative z-10 ${
          sidebarCollapsed ? "pl-[72px]" : "pl-[260px]"
        }`}
      >
        {/* TopBar */}
        <TopBar />

        {/* Content View with Page Animation */}
        <main ref={mainRef} className="mt-16 h-[calc(100dvh-4rem)] shrink-0 overflow-y-auto p-6 sm:p-8 pt-8 max-w-[1600px] w-full mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              {renderActivePage()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Overlays & Modals */}
      <CommandCenter />
      <InvestigationDrawer />
    </div>
  );
}
