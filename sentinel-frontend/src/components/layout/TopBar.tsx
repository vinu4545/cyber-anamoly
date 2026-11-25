import React, { useState, useEffect } from "react";
import {
  Search,
  Clock,
  Download,
  Bell,
  Cpu,
  Layers,
  FileText,
  Play,
} from "lucide-react";
import { useSentinelStore } from "../../store/useSentinelStore";
import { NAV_GROUPS } from "./Sidebar";
import { api } from "../../lib/api";

export const TopBar: React.FC = () => {
  const {
    activePage,
    dataMode,
    toggleCommandCenter,
    activeSessionId,
    replayIntro,
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
      className="relative flex min-h-16 w-full flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b border-[#94AFD7]/10 bg-[#080B12]/80 px-4 py-2 backdrop-blur-xl transition-all duration-300 sm:px-6"
    >
      {/* Breadcrumb */}
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex min-w-0 items-center gap-2 whitespace-nowrap text-[11px] text-[#8795A9] sm:text-xs">
          <span>Console</span>
          <span>/</span>
          <span className="max-w-[96px] truncate font-semibold text-[#F4F7FC] sm:max-w-none">
            {activeItem?.label || "Overview"}
          </span>
        </div>
      </div>

      {/* Middle: Command Center Trigger */}
      <div className="min-w-0 max-w-md flex-1 md:mx-6">
        <button
          onClick={toggleCommandCenter}
          className="group flex w-full items-center justify-center rounded-xl border border-[#94AFD7]/10 bg-[#111B29]/70 px-2 py-1.5 text-xs text-[#8795A9] transition-all hover:border-[#00D5FF]/40 hover:text-[#F4F7FC] sm:justify-between sm:px-3.5"
        >
          <div className="flex items-center gap-2">
            <Search
              size={15}
              className="text-[#8795A9] group-hover:text-[#00D5FF] transition-colors"
            />
            <span className="hidden sm:inline">Search IPs, Records, Threat IDs, Actions...</span>
          </div>
          <kbd className="hidden rounded border border-[#94AFD7]/15 bg-[#172334] px-1.5 py-0.5 font-mono text-[10px] text-[#8795A9] sm:inline">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right: Clock, Data Mode, Export, Health */}
      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
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
          <span className="hidden sm:inline">{dataMode === "demo" ? "DEMO DATA" : "YOUR DATA"}</span>
        </div>

        {/* Replay Cinematic Intro Button */}
        <button
          onClick={replayIntro}
          className="flex items-center gap-1.5 text-xs font-mono font-semibold px-2.5 py-1.5 rounded-lg bg-[#111B29] hover:bg-[#172334] border border-[#00D5FF]/30 hover:border-[#00D5FF] text-[#00D5FF] transition-all shadow-[0_0_12px_rgba(0,213,255,0.15)] cursor-pointer"
          title="Play Sentinel AI Cinematic Intro Video"
        >
          <Play size={12} className="fill-[#00D5FF]" />
          <span className="hidden sm:inline">INTRO</span>
        </button>

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
          <span className="hidden text-[10px] font-mono text-[#8795A9] sm:inline">
            {apiOnline ? "API OK" : "OFFLINE"}
          </span>
        </div>
      </div>
    </header>
  );
};
