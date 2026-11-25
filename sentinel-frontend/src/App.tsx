import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSentinelStore } from "./store/useSentinelStore";

// Cinematic Video Intro Transition
import { CinematicIntroTransition } from "./components/intro/CinematicIntroTransition";

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
  const {
    isConsoleOpen,
    activePage,
    sidebarCollapsed,
    showIntro,
    setShowIntro,
  } = useSentinelStore();

  const [introScrollProgress, setIntroScrollProgress] = useState<number>(0);

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
    <>
      {/* 1. Cinematic Video Intro Layer with smooth upward scroll */}
      {showIntro && (
        <CinematicIntroTransition
          onProgressChange={(prog) => setIntroScrollProgress(prog)}
          onTransitionComplete={() => {
            setShowIntro(false);
            setIntroScrollProgress(1.0);
          }}
        />
      )}

      {/* 2. Core Application Surface: Mounted and active underneath from the start */}
      {!isConsoleOpen ? (
        <LandingPage />
      ) : (
        <div
          style={{
            "--sidebar-width": sidebarCollapsed ? "72px" : "260px",
            opacity: showIntro ? Math.min(1.0, 0.75 + 0.25 * introScrollProgress) : 1,
            transform: showIntro ? `scale(${0.98 + 0.02 * introScrollProgress})` : "none",
            transformOrigin: "center top",
            transition: showIntro ? "transform 0.08s linear, opacity 0.08s linear" : undefined,
          } as React.CSSProperties}
          data-sidebar-collapsed={sidebarCollapsed}
          className="sentinel-app-shell min-h-screen bg-[#05080F] text-[#F4F7FC] relative selection:bg-[#00D5FF]/30 font-sans"
        >
          {/* Background Nocturne Aurora & Grid */}
          <div aria-hidden="true" className="sentinel-background">
            <div className="absolute inset-0 soc-grid-bg" />
            <div className="absolute -top-48 -left-48 w-96 h-96 rounded-full bg-[#00D5FF]/5 blur-[120px]" />
            <div className="absolute -bottom-48 -right-48 w-96 h-96 rounded-full bg-[#7967FF]/8 blur-[140px]" />
          </div>

          {/* Collapsible Sidebar with coordinated entrance */}
          <div
            className="sentinel-sidebar-slot"
            style={{
              transform: showIntro
                ? `translate3d(${(1 - introScrollProgress) * -25}px, 0, 0)`
                : "none",
              opacity: showIntro ? Math.min(1.0, 0.6 + 0.4 * introScrollProgress) : 1,
              transition: showIntro ? "transform 0.08s linear, opacity 0.08s linear" : undefined,
            }}
          >
            <Sidebar />
          </div>

          {/* Main App Container */}
          <div className="sentinel-main-column relative z-10">
            {/* TopBar with coordinated entrance */}
            <div
              className="sentinel-topbar-slot"
              style={{
                transform: showIntro
                  ? `translate3d(0, ${(1 - introScrollProgress) * -15}px, 0)`
                  : "none",
                opacity: showIntro ? Math.min(1.0, 0.6 + 0.4 * introScrollProgress) : 1,
                transition: showIntro ? "transform 0.08s linear, opacity 0.08s linear" : undefined,
              }}
            >
              <TopBar />
            </div>

            {/* Content View with Page Animation */}
            <main
              style={{
                transform: showIntro
                  ? `translate3d(0, ${(1 - introScrollProgress) * 20}px, 0)`
                  : "none",
                opacity: showIntro ? Math.min(1.0, 0.5 + 0.5 * introScrollProgress) : 1,
                transition: showIntro ? "transform 0.08s linear, opacity 0.08s linear" : undefined,
              }}
              className="sentinel-page-content"
            >
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
      )}
    </>
  );
}
