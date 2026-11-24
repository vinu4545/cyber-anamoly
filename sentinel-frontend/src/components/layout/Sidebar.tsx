import React from "react";
import {
  LayoutDashboard,
  Radio,
  Activity,
  ShieldAlert,
  Network,
  BarChart3,
  History,
  FolderGit2,
  Database,
  FlaskConical,
  Workflow,
  Settings,
  Info,
  ChevronLeft,
  ChevronRight,
  Shield,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { useSentinelStore, PageId } from "../../store/useSentinelStore";

interface NavItem {
  id: PageId;
  label: string;
  icon: React.ElementType;
  badge?: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    title: "MAIN",
    items: [
      { id: "overview", label: "Overview", icon: LayoutDashboard },
      { id: "live-monitor", label: "Live Monitor", icon: Radio, badge: "SIM" },
      { id: "analyzer", label: "Traffic Analyzer", icon: Activity, badge: "CORE" },
      { id: "investigations", label: "Threat Investigations", icon: ShieldAlert },
      { id: "intelligence", label: "Network Intelligence", icon: Network },
    ],
  },
  {
    title: "ANALYTICS",
    items: [
      { id: "analytics", label: "Security Analytics", icon: BarChart3 },
      { id: "history", label: "Detection History", icon: History },
    ],
  },
  {
    title: "PROJECT WORKSPACE",
    items: [
      { id: "project-work", label: "Project Work", icon: FolderGit2 },
      { id: "dataset-explorer", label: "Dataset Explorer", icon: Database },
      { id: "model-lab", label: "Model Laboratory", icon: FlaskConical },
      { id: "methodology", label: "Methodology", icon: Workflow },
    ],
  },
  {
    title: "SYSTEM",
    items: [
      { id: "settings", label: "Settings", icon: Settings },
      { id: "about", label: "About SENTINEL", icon: Info },
    ],
  },
];

export const Sidebar: React.FC = () => {
  const {
    activePage,
    setActivePage,
    sidebarCollapsed,
    toggleSidebar,
    dataMode,
  } = useSentinelStore();

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-30 flex flex-col transition-all duration-300 ease-out bg-[#0D1420] border-r border-[#94AFD7]/10 ${
        sidebarCollapsed ? "w-[72px]" : "w-[260px]"
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-[#94AFD7]/10">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00D5FF] via-[#7967FF] to-[#C85BFF] p-[1.5px] shrink-0 flex items-center justify-center glow-cyan">
            <div className="w-full h-full bg-[#05080F] rounded-[10px] flex items-center justify-center">
              <Shield className="w-5 h-5 text-[#00D5FF]" />
            </div>
          </div>
          {!sidebarCollapsed && (
            <div className="flex flex-col">
              <span className="font-display font-bold text-sm tracking-wider text-[#F4F7FC]">
                SENTINEL<span className="text-[#00D5FF] ml-1">AI</span>
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#8795A9]">
                SOC INTELLIGENCE
              </span>
            </div>
          )}
        </div>

        <button
          onClick={toggleSidebar}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-[#8795A9] hover:text-[#F4F7FC] hover:bg-[#172334] transition-colors"
          title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {NAV_GROUPS.map((group) => (
          <div key={group.title} className="space-y-1">
            {!sidebarCollapsed && (
              <div className="px-3 text-[10px] font-mono uppercase tracking-wider text-[#5B6B80] mb-1 font-semibold">
                {group.title}
              </div>
            )}
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  className={`w-full group relative flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? "text-[#F4F7FC] bg-[#172334] shadow-sm border border-[#00D5FF]/30"
                      : "text-[#8795A9] hover:text-[#F4F7FC] hover:bg-[#111B29]"
                  }`}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  {/* Active Indicator Bar */}
                  {isActive && (
                    <div className="absolute left-0 top-2 bottom-2 w-1 bg-[#00D5FF] rounded-r-full shadow-[0_0_8px_#00D5FF]" />
                  )}

                  <Icon
                    size={18}
                    className={`shrink-0 transition-colors ${
                      isActive ? "text-[#00D5FF]" : "text-[#8795A9] group-hover:text-[#F4F7FC]"
                    }`}
                  />

                  {!sidebarCollapsed && (
                    <span className="truncate flex-1 text-left">{item.label}</span>
                  )}

                  {!sidebarCollapsed && item.badge && (
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full uppercase tracking-wider ${
                        item.badge === "CORE"
                          ? "bg-[#00D5FF]/15 text-[#00D5FF] border border-[#00D5FF]/30"
                          : "bg-[#FFB547]/15 text-[#FFB547] border border-[#FFB547]/30"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Sidebar Footer System Status */}
      <div className="p-3 border-t border-[#94AFD7]/10 bg-[#080B12]/60">
        <div
          className={`flex items-center gap-2 px-2 py-2 rounded-xl bg-[#111B29]/70 border border-[#94AFD7]/10 ${
            sidebarCollapsed ? "justify-center" : "justify-between"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#19D995] animate-pulse" />
            {!sidebarCollapsed && (
              <div className="flex flex-col">
                <span className="text-[11px] font-medium text-[#F4F7FC]">IF Engine</span>
                <span className="text-[9px] text-[#19D995] font-mono">ONLINE</span>
              </div>
            )}
          </div>

          {!sidebarCollapsed && (
            <span
              className={`text-[10px] font-mono uppercase font-semibold px-2 py-0.5 rounded-md ${
                dataMode === "demo"
                  ? "bg-[#FFB547]/15 text-[#FFB547] border border-[#FFB547]/30"
                  : "bg-[#00D5FF]/15 text-[#00D5FF] border border-[#00D5FF]/30"
              }`}
            >
              {dataMode === "demo" ? "DEMO DATA" : "YOUR DATA"}
            </span>
          )}
        </div>
      </div>
    </aside>
  );
};
