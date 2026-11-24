import React, { useState, useEffect } from "react";
import {
  Search,
  Clock,
  Download,
  Bell,
  Cpu,
  Layers,
  FileText,
} from "lucide-react";
import { useSentinelStore } from "../../store/useSentinelStore";
import { NAV_GROUPS } from "./Sidebar";
import { api } from "../../lib/api";

export const TopBar: React.FC = () => {
  const {
    activePage,
    sidebarCollapsed,
    dataMode,
    toggleCommandCenter,
    activeSessionId,
  } = useSentinelStore();

  const [currentTime, setCurrentTime] = useState<string>("");
  const [apiOnline, setApiOnline] = useState<boolean>(true);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }) + " UTC"
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    api
      .getHealth()
      .then(() => setApiOnline(true))
      .catch(() => setApiOnline(false));
  }, []);

  // Find active label
  const activeItem = NAV_GROUPS.flatMap((g) => g.items).find(
    (i) => i.id === activePage
  );

  return (
    <header
      className={`h-16 fixed top-0 right-0 z-20 flex items-center justify-between px-6 border-b border-[#94AFD7]/10 bg-[#080B12]/80 backdrop-blur-xl transition-all duration-300 ${
        sidebarCollapsed ? "left-[72px]" : "left-[260px]"
      }`}
    >
      {/* Breadcrumb */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-xs text-[#8795A9]">
          <span>Console</span>
          <span>/</span>
          <span className="font-semibold text-[#F4F7FC]">
            {activeItem?.label || "Overview"}
          </span>
        </div>
      </div>

      {/* Middle: Command Center Trigger */}
      <div className="flex-1 max-w-md mx-6">
        <button
          onClick={toggleCommandCenter}
          className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-xl bg-[#111B29]/70 border border-[#94AFD7]/10 hover:border-[#00D5FF]/40 text-xs text-[#8795A9] hover:text-[#F4F7FC] transition-all group"
        >
          <div className="flex items-center gap-2">
            <Search
              size={15}
              className="text-[#8795A9] group-hover:text-[#00D5FF] transition-colors"
            />
            <span>Search IPs, Records, Threat IDs, Actions...</span>
          </div>
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-[#172334] text-[#8795A9] rounded border border-[#94AFD7]/15">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right: Clock, Data Mode, Export, Health */}
      <div className="flex items-center gap-3">
        {/* Live Clock */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs font-mono text-[#8795A9] px-2.5 py-1 rounded-lg bg-[#111B29]/50 border border-[#94AFD7]/10">
          <Clock size={13} className="text-[#00D5FF]" />
          <span>{currentTime}</span>
        </div>

        {/* Data Mode Badge */}
        <div
          className={`flex items-center gap-1.5 text-[11px] font-mono font-semibold px-2.5 py-1 rounded-lg border ${
            dataMode === "demo"
              ? "bg-[#FFB547]/10 text-[#FFB547] border-[#FFB547]/30"
              : "bg-[#00D5FF]/10 text-[#00D5FF] border-[#00D5FF]/30"
          }`}
        >
          <Layers size={13} />
          <span>{dataMode === "demo" ? "DEMO DATA" : "YOUR DATA"}</span>
        </div>

        {/* Quick Export PDF */}
        <a
          href={api.exportPdfUrl(activeSessionId || undefined)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-[#172334] hover:bg-[#1f2f45] border border-[#94AFD7]/15 text-[#F4F7FC] transition-colors"
          title="Download latest PDF Threat Report"
        >
          <FileText size={14} className="text-[#00D5FF]" />
          <span className="hidden sm:inline">Export PDF</span>
        </a>

        {/* API Health Pill */}
        <div
          className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[#111B29] border border-[#94AFD7]/10"
          title={apiOnline ? "FastAPI Backend Connected" : "Backend Offline"}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              apiOnline ? "bg-[#19D995] animate-pulse" : "bg-[#FF4567]"
            }`}
          />
          <span className="text-[10px] font-mono text-[#8795A9]">
            {apiOnline ? "API OK" : "OFFLINE"}
          </span>
        </div>
      </div>
    </header>
  );
};
