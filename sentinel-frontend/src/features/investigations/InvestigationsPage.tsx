import React, { useState, useEffect } from "react";
import {
  ShieldAlert,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Filter,
  Search,
  Sliders,
  ChevronRight,
  Info,
  Calendar,
  Layers,
  LayoutGrid,
  List,
} from "lucide-react";
import { useSentinelStore } from "../../store/useSentinelStore";
import { api, InvestigationItem } from "../../lib/api";

export const InvestigationsPage: React.FC = () => {
  const { openDrawerWithRecord } = useSentinelStore();

  const [investigations, setInvestigations] = useState<InvestigationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [severityFilter, setSeverityFilter] = useState<string>("ALL");
  const [showPolicyPopover, setShowPolicyPopover] = useState<boolean>(false);

  useEffect(() => {
    loadInvestigations();
  }, [severityFilter, searchTerm]);

  const loadInvestigations = async () => {
    setLoading(true);
    try {
      const res = await api.getInvestigations(
        undefined,
        severityFilter === "ALL" ? undefined : severityFilter,
        searchTerm || undefined
      );
      const list = Array.isArray(res) ? res : (res as any).investigations || [];
      setInvestigations(list);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    // Optimistic UI update
    setInvestigations((prev) =>
      prev.map((inv) =>
        (inv.investigation_id === id || inv.id === id)
          ? { ...inv, status: newStatus as any }
          : inv
      )
    );

    try {
      await api.updateInvestigation(id, { status: newStatus });
    } catch (e) {
      // Revert on error
      loadInvestigations();
    }
  };

  const COLUMNS = [
    { id: "New", label: "New Alerts", color: "#FF4567" },
    { id: "Under Investigation", label: "Under Investigation", color: "#FFB547" },
    { id: "Resolved", label: "Resolved", color: "#19D995" },
    { id: "False Positive", label: "False Positive", color: "#8795A9" },
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl glass-panel border border-[#94AFD7]/15">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert size={18} className="text-[#FF4567]" />
            <h1 className="font-display font-bold text-xl text-[#F4F7FC]">
              Threat Investigation Board
            </h1>
          </div>
          <p className="text-xs text-[#8795A9] mt-0.5">
            Triage, investigate and track flagged anomaly workflows with audit trail persistence
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Policy Popover Trigger */}
          <button
            onClick={() => setShowPolicyPopover(!showPolicyPopover)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#111B29] border border-[#94AFD7]/15 text-xs text-[#8795A9] hover:text-[#F4F7FC]"
          >
            <Sliders size={14} className="text-[#00D5FF]" />
            <span>Severity Policy</span>
          </button>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-[#05080F] p-1 rounded-xl border border-[#94AFD7]/10">
            <button
              onClick={() => setViewMode("kanban")}
              className={`p-1.5 rounded-lg ${
                viewMode === "kanban"
                  ? "bg-[#172334] text-[#00D5FF]"
                  : "text-[#8795A9]"
              }`}
            >
              <LayoutGrid size={15} />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-lg ${
                viewMode === "table"
                  ? "bg-[#172334] text-[#00D5FF]"
                  : "text-[#8795A9]"
              }`}
            >
              <List size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Severity Policy Popover Modal */}
      {showPolicyPopover && (
        <div className="p-4 rounded-xl bg-[#172334] border border-[#00D5FF]/30 shadow-2xl text-xs space-y-2">
          <div className="flex justify-between items-center text-[#00D5FF] font-bold font-mono uppercase">
            <span>Configurable Triage Severity Policy</span>
            <button onClick={() => setShowPolicyPopover(false)}>✕</button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono pt-1">
            <div className="p-2.5 rounded bg-[#0D1420] border border-[#FF4567]/30">
              <span className="text-[#FF4567] font-bold block">CRITICAL</span>
              <span className="text-[#8795A9]">Score &gt;= 0.82 (Top 1%)</span>
            </div>
            <div className="p-2.5 rounded bg-[#0D1420] border border-[#FFB547]/30">
              <span className="text-[#FFB547] font-bold block">HIGH</span>
              <span className="text-[#8795A9]">Score &gt;= 0.70</span>
            </div>
            <div className="p-2.5 rounded bg-[#0D1420] border border-[#7967FF]/30">
              <span className="text-[#7967FF] font-bold block">MEDIUM</span>
              <span className="text-[#8795A9]">Score &gt;= 0.55</span>
            </div>
            <div className="p-2.5 rounded bg-[#0D1420] border border-[#19D995]/30">
              <span className="text-[#19D995] font-bold block">LOW</span>
              <span className="text-[#8795A9]">Score &lt; 0.55</span>
            </div>
          </div>
        </div>
      )}

      {/* Kanban Board View */}
      {viewMode === "kanban" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {COLUMNS.map((col) => {
            const items = investigations.filter(
              (i) => (i.status || "New").toLowerCase() === col.id.toLowerCase()
            );

            return (
              <div
                key={col.id}
                className="flex flex-col rounded-2xl glass-panel border border-[#94AFD7]/15 p-4 min-h-[500px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 border-b border-[#94AFD7]/10 mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: col.color }}
                    />
                    <span className="font-display font-bold text-sm text-[#F4F7FC]">
                      {col.label}
                    </span>
                  </div>
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-[#05080F] text-[#8795A9]">
                    {items.length}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="space-y-3 flex-1 overflow-y-auto">
                  {items.length === 0 ? (
                    <div className="h-32 flex items-center justify-center text-xs text-[#5B6B80] border border-dashed border-[#94AFD7]/10 rounded-xl">
                      No items
                    </div>
                  ) : (
                    items.map((inv) => {
                      const invId = inv.investigation_id || inv.id || "INV-000";
                      const score = inv.anomaly_score || inv.score || 0.6;
                      const sev = inv.severity || "HIGH";
                      const sevUpper = String(sev).toUpperCase();

                      return (
                        <div
                          key={invId}
                          className="p-3.5 rounded-xl bg-[#080B12] border border-[#94AFD7]/15 hover:border-[#00D5FF]/40 transition-all space-y-2 group shadow-md"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-xs font-bold text-[#F4F7FC]">
                              {invId}
                            </span>
                            <span
                              className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold uppercase ${
                                sevUpper === "CRITICAL" || sevUpper === "HIGH"
                                  ? "bg-[#FF4567]/15 text-[#FF4567] border border-[#FF4567]/30"
                                  : sevUpper === "MEDIUM"
                                  ? "bg-[#FFB547]/15 text-[#FFB547] border border-[#FFB547]/30"
                                  : "bg-[#19D995]/15 text-[#19D995] border border-[#19D995]/30"
                              }`}
                            >
                              {sev}
                            </span>
                          </div>

                          <div className="text-[11px] font-mono text-[#8795A9] space-y-0.5">
                            <div>Src: {inv.source_ip || "192.168.10.15"}</div>
                            <div>Dst: {inv.destination_ip || "192.168.10.50"}:{inv.destination_port || "21"}</div>
                            <div className="text-[#00D5FF]">Score: {score.toFixed(4)}</div>
                          </div>

                          {/* Quick Status Mover Buttons */}
                          <div className="pt-2 border-t border-[#94AFD7]/10 flex items-center justify-between">
                            <button
                              onClick={() =>
                                openDrawerWithRecord({
                                  record_id: inv.record_id,
                                  anomaly_score: score,
                                  prediction: "ANOMALOUS",
                                  source_ip: inv.source_ip,
                                  destination_ip: inv.destination_ip,
                                  destination_port: inv.destination_port,
                                  protocol: inv.protocol,
                                })
                              }
                              className="text-[10px] text-[#00D5FF] hover:underline"
                            >
                              Inspect Flow
                            </button>

                            <select
                              value={col.id}
                              onChange={(e) => handleStatusChange(invId, e.target.value)}
                              className="bg-[#111B29] border border-[#94AFD7]/15 rounded text-[10px] font-mono text-[#8795A9] px-1.5 py-0.5"
                            >
                              {COLUMNS.map((c) => (
                                <option key={c.id} value={c.id}>
                                  → {c.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table View */}
      {viewMode === "table" && (
        <div className="p-6 rounded-2xl glass-panel overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[#94AFD7]/15 text-[#5B6B80]">
                <th className="pb-3">INVESTIGATION ID</th>
                <th className="pb-3">FLOW RECORD</th>
                <th className="pb-3">SOURCE IP</th>
                <th className="pb-3">DESTINATION</th>
                <th className="pb-3">SCORE</th>
                <th className="pb-3">SEVERITY</th>
                <th className="pb-3">STATUS</th>
                <th className="pb-3 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#94AFD7]/10">
              {investigations.map((inv) => {
                const invId = inv.investigation_id || inv.id || "INV-000";
                const score = inv.anomaly_score || inv.score || 0.6;
                const status = inv.status || "New";

                return (
                  <tr key={invId} className="hover:bg-[#172334]/60 transition-colors">
                    <td className="py-3 text-[#F4F7FC] font-bold">{invId}</td>
                    <td className="py-3 text-[#00D5FF]">#{inv.record_id}</td>
                    <td className="py-3 text-[#8795A9]">{inv.source_ip || "192.168.10.15"}</td>
                    <td className="py-3 text-[#8795A9]">
                      {inv.destination_ip || "192.168.10.50"}:{inv.destination_port || "21"}
                    </td>
                    <td className="py-3 font-bold text-[#F4F7FC]">{score.toFixed(4)}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#FF4567]/15 text-[#FF4567] border border-[#FF4567]/30">
                        {inv.severity || "HIGH"}
                      </span>
                    </td>
                    <td className="py-3">
                      <select
                        value={status}
                        onChange={(e) => handleStatusChange(invId, e.target.value)}
                        className="bg-[#111B29] border border-[#94AFD7]/15 rounded text-xs font-mono text-[#F4F7FC] px-2 py-1"
                      >
                        {COLUMNS.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() =>
                          openDrawerWithRecord({
                            record_id: inv.record_id,
                            anomaly_score: score,
                            prediction: "ANOMALOUS",
                            source_ip: inv.source_ip,
                            destination_ip: inv.destination_ip,
                            destination_port: inv.destination_port,
                            protocol: inv.protocol,
                          })
                        }
                        className="text-[#00D5FF] hover:underline"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
