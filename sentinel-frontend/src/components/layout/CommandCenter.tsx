import React, { useState, useEffect } from "react";
import {
  Search,
  X,
  Play,
  FileText,
  Download,
  LayoutDashboard,
  Activity,
  ShieldAlert,
  BarChart3,
  Database,
  FlaskConical,
  Radio,
  Network,
} from "lucide-react";
import { useSentinelStore, PageId } from "../../store/useSentinelStore";
import { api } from "../../lib/api";

export const CommandCenter: React.FC = () => {
  const {
    isCommandCenterOpen,
    setCommandCenterOpen,
    setActivePage,
  } = useSentinelStore();

  const [query, setQuery] = useState("");
  const [dbResults, setDbResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Global keydown listener for Command+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandCenterOpen(!isCommandCenterOpen);
      }
      if (e.key === "Escape" && isCommandCenterOpen) {
        setCommandCenterOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCommandCenterOpen, setCommandCenterOpen]);

  // Live search debounced
  useEffect(() => {
    if (!query.trim()) {
      setDbResults([]);
      return;
    }
    const timer = setTimeout(() => {
      setLoading(true);
      api
        .search(query)
        .then((res) => {
          setDbResults(res.results || []);
        })
        .catch(() => setDbResults([]))
        .finally(() => setLoading(false));
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isCommandCenterOpen) return null;

  const defaultActions = [
    {
      title: "Initiate Anomaly Detection",
      subtitle: "Launch Isolation Forest flow analysis",
      icon: Play,
      action: () => {
        setActivePage("analyzer");
        setCommandCenterOpen(false);
      },
    },
    {
      title: "Export Latest PDF Threat Report",
      subtitle: "Executive SOC report via ReportLab",
      icon: FileText,
      action: () => {
        window.open(api.exportPdfUrl(), "_blank");
        setCommandCenterOpen(false);
      },
    },
    {
      title: "Export Records CSV",
      subtitle: "Download raw scored flow data",
      icon: Download,
      action: () => {
        window.open(api.exportCsvUrl(), "_blank");
        setCommandCenterOpen(false);
      },
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-xl bg-[#0D1420] border border-[#94AFD7]/20 rounded-2xl shadow-2xl shadow-black/80 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="flex items-center px-4 py-3 border-b border-[#94AFD7]/15 bg-[#111B29]/70">
          <Search size={18} className="text-[#00D5FF] mr-3 shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, IP address, record ID, or search..."
            className="w-full bg-transparent text-sm text-[#F4F7FC] placeholder-[#5B6B80] focus:outline-none font-sans"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-[#8795A9] hover:text-[#F4F7FC] mr-2"
            >
              <X size={15} />
            </button>
          )}
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-[#172334] text-[#8795A9] rounded border border-[#94AFD7]/15">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-3">
          {/* Default Quick Actions */}
          {!query && (
            <div>
              <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-[#5B6B80]">
                Quick Actions
              </div>
              <div className="space-y-1 mt-1">
                {defaultActions.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={idx}
                      onClick={item.action}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left hover:bg-[#172334] transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#111B29] border border-[#94AFD7]/10 flex items-center justify-center text-[#00D5FF] group-hover:border-[#00D5FF]/40">
                        <Icon size={16} />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-semibold text-[#F4F7FC]">
                          {item.title}
                        </div>
                        <div className="text-[11px] text-[#8795A9]">
                          {item.subtitle}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Search Query Results */}
          {query && (
            <div>
              <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-[#5B6B80]">
                Matching Results ({dbResults.length})
              </div>
              {loading ? (
                <div className="p-4 text-center text-xs text-[#8795A9]">
                  Searching platform intelligence...
                </div>
              ) : dbResults.length === 0 ? (
                <div className="p-6 text-center text-xs text-[#8795A9]">
                  No matching flows, investigations, or actions found for "{query}".
                </div>
              ) : (
                <div className="space-y-1 mt-1">
                  {dbResults.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        if (item.path) {
                          if (item.path.startsWith("/analyzer")) setActivePage("analyzer");
                          else if (item.path.startsWith("/investigations")) setActivePage("investigations");
                          else if (item.path.startsWith("/live-monitor")) setActivePage("live-monitor");
                          else if (item.path.startsWith("/analytics")) setActivePage("analytics");
                        }
                        setCommandCenterOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left hover:bg-[#172334] transition-colors"
                    >
                      <div>
                        <div className="text-xs font-semibold text-[#F4F7FC]">
                          {item.title}
                        </div>
                        <div className="text-[11px] text-[#8795A9] font-mono mt-0.5">
                          {item.subtitle}
                        </div>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#111B29] text-[#00D5FF] border border-[#00D5FF]/20 uppercase">
                        {item.type}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-[#94AFD7]/10 bg-[#080B12]/80 flex items-center justify-between text-[11px] text-[#5B6B80] font-mono">
          <span>Security Command Center</span>
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
          </div>
        </div>
      </div>
    </div>
  );
};
