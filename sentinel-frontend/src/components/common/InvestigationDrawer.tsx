import React, { useState } from "react";
import {
  X,
  ShieldAlert,
  AlertTriangle,
  CheckCircle,
  FileText,
  Download,
  ExternalLink,
  ChevronRight,
  Info,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { useSentinelStore } from "../../store/useSentinelStore";
import { api } from "../../lib/api";

export const InvestigationDrawer: React.FC = () => {
  const {
    isDrawerOpen,
    closeDrawer,
    activeRecordForDrawer,
    setActivePage,
  } = useSentinelStore();

  const [savingNotes, setSavingNotes] = useState(false);
  const [analystNotes, setAnalystNotes] = useState(
    "Flagged anomalous network flow signature. Initiated packet-level inspection."
  );
  const [investigationStatus, setInvestigationStatus] = useState<string>("Under Investigation");

  if (!isDrawerOpen || !activeRecordForDrawer) return null;

  const rec = activeRecordForDrawer;
  const isAnomalous = rec.prediction === "ANOMALOUS" || rec.anomaly_score >= 0.5;

  const handleUpdateStatus = async (newStatus: string) => {
    setInvestigationStatus(newStatus);
    // Find or create investigation entry
    const invId = `INV-${rec.record_id}`;
    try {
      await api.updateInvestigation(invId, {
        status: newStatus,
        analyst_notes: analystNotes,
      });
    } catch (e) {
      // Graceful fallback for demo
    }
  };

  const deviations = rec.top_deviations || rec.deviations || [];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-xl bg-[#0D1420] border-l border-[#94AFD7]/15 shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="p-6 border-b border-[#94AFD7]/10 bg-[#111B29]/70 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  isAnomalous
                    ? "bg-[#FF4567]/15 text-[#FF4567] border border-[#FF4567]/30 glow-critical"
                    : "bg-[#19D995]/15 text-[#19D995] border border-[#19D995]/30"
                }`}
              >
                {isAnomalous ? <ShieldAlert size={20} /> : <CheckCircle size={20} />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-display font-bold text-lg text-[#F4F7FC]">
                    Flow Inspection: #{rec.record_id}
                  </h2>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold uppercase ${
                      isAnomalous
                        ? "bg-[#FF4567]/15 text-[#FF4567] border border-[#FF4567]/30"
                        : "bg-[#19D995]/15 text-[#19D995] border border-[#19D995]/30"
                    }`}
                  >
                    {rec.prediction}
                  </span>
                </div>
                <p className="text-xs text-[#8795A9] font-mono mt-0.5">
                  Anomaly Score: {rec.anomaly_score.toFixed(4)}
                </p>
              </div>
            </div>

            <button
              onClick={closeDrawer}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#8795A9] hover:text-[#F4F7FC] hover:bg-[#172334] transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Score Metric Bar */}
            <div className="p-4 rounded-xl bg-[#111B29]/80 border border-[#94AFD7]/10">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-[#8795A9] font-medium">Anomaly Severity Score</span>
                <span className="font-mono font-bold text-[#F4F7FC]">
                  {(rec.anomaly_score * 100).toFixed(1)}%
                </span>
              </div>
              <div className="h-2 w-full bg-[#05080F] rounded-full overflow-hidden border border-[#94AFD7]/15">
                <div
                  className={`h-full transition-all duration-500 ${
                    rec.anomaly_score >= 0.82
                      ? "bg-gradient-to-r from-[#FFB547] to-[#FF4567]"
                      : rec.anomaly_score >= 0.55
                      ? "bg-gradient-to-r from-[#00D5FF] to-[#FFB547]"
                      : "bg-[#19D995]"
                  }`}
                  style={{ width: `${Math.min(rec.anomaly_score * 100, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-[#5B6B80] mt-1.5">
                <span>0.00 (Normal)</span>
                <span>0.50 (Threshold)</span>
                <span>1.00 (Outlier)</span>
              </div>
            </div>

            {/* Network Vector Metadata */}
            <div className="space-y-2">
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#8795A9]">
                Network Flow Telemetry
              </h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[#111B29]/60 border border-[#94AFD7]/10">
                  <span className="text-[#5B6B80] text-[11px] block">Source Endpoint</span>
                  <span className="font-mono text-[#F4F7FC] font-medium">
                    {rec.source_ip || "N/A"}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#111B29]/60 border border-[#94AFD7]/10">
                  <span className="text-[#5B6B80] text-[11px] block">Destination Endpoint</span>
                  <span className="font-mono text-[#F4F7FC] font-medium">
                    {rec.destination_ip || "N/A"}:{rec.destination_port || "—"}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#111B29]/60 border border-[#94AFD7]/10">
                  <span className="text-[#5B6B80] text-[11px] block">Protocol</span>
                  <span className="font-mono text-[#00D5FF] font-medium">
                    {rec.protocol || "TCP"}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#111B29]/60 border border-[#94AFD7]/10">
                  <span className="text-[#5B6B80] text-[11px] block">Ground Truth Label</span>
                  <span className="font-mono text-[#F4F7FC] font-medium">
                    {rec.ground_truth_label || rec.actual_label || "Unlabeled (User Data)"}
                  </span>
                </div>
              </div>
            </div>

            {/* Contextual Feature Deviations */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono uppercase tracking-wider text-[#8795A9]">
                  Top Feature Deviations vs Normal Baseline
                </h3>
              </div>

              {deviations.length === 0 ? (
                <div className="p-4 rounded-xl bg-[#111B29]/40 border border-[#94AFD7]/10 text-xs text-[#8795A9] text-center">
                  Flow matches normal baseline characteristics across all evaluated features.
                </div>
              ) : (
                <div className="space-y-2">
                  {deviations.map((d: any, idx: number) => {
                    const z = d.z_score || 0;
                    const isHigh = d.direction === "HIGHER" || z > 0;
                    return (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-[#111B29]/80 border border-[#94AFD7]/10 space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-xs text-[#F4F7FC]">
                            {d.feature}
                          </span>
                          <span
                            className={`flex items-center gap-1 font-mono text-[11px] font-semibold px-2 py-0.5 rounded ${
                              z > 3.0
                                ? "bg-[#FF4567]/15 text-[#FF4567] border border-[#FF4567]/30"
                                : "bg-[#FFB547]/15 text-[#FFB547] border border-[#FFB547]/30"
                            }`}
                          >
                            {isHigh ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                            {z.toFixed(2)}σ deviation
                          </span>
                        </div>
                        <div className="grid grid-cols-2 text-[11px] font-mono text-[#8795A9] pt-1">
                          <span>Observed: {Number(d.value).toLocaleString()}</span>
                          <span>Normal: {Number(d.baseline_median || d.typical_normal || 0).toLocaleString()}</span>
                        </div>
                        {d.narrative && (
                          <p className="text-[11px] text-[#8795A9] pt-1 border-t border-[#94AFD7]/10">
                            {d.narrative}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Explainability Disclaimer */}
              <div className="flex items-start gap-2 p-3 rounded-xl bg-[#080B12] border border-[#94AFD7]/10 text-[11px] text-[#5B6B80]">
                <Info size={14} className="shrink-0 text-[#00D5FF] mt-0.5" />
                <span>
                  <b>Disclaimer:</b> Feature deviations are contextual z-score indicators against normal baseline traffic, not an exact reconstruction of the Isolation Forest partition decision tree.
                </span>
              </div>
            </div>

            {/* Investigation Triage Workflow */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#8795A9]">
                Investigation Workflow Triage
              </h3>

              <div className="space-y-2">
                <label className="text-[11px] text-[#8795A9]">Triage Status</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "New",
                    "Under Investigation",
                    "Resolved",
                    "False Positive",
                  ].map((s) => (
                    <button
                      key={s}
                      onClick={() => handleUpdateStatus(s)}
                      className={`px-3 py-2 text-xs font-medium rounded-xl border transition-all text-center ${
                        investigationStatus.toLowerCase() === s.toLowerCase()
                          ? "bg-[#00D5FF]/15 text-[#00D5FF] border-[#00D5FF]/40 shadow-[0_0_12px_rgba(0,213,255,0.2)]"
                          : "bg-[#111B29] text-[#8795A9] border-[#94AFD7]/10 hover:text-[#F4F7FC]"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] text-[#8795A9]">Analyst Notes</label>
                <textarea
                  rows={3}
                  value={analystNotes}
                  onChange={(e) => setAnalystNotes(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#111B29] border border-[#94AFD7]/15 text-xs text-[#F4F7FC] placeholder-[#5B6B80] focus:outline-none focus:border-[#00D5FF]/40 font-sans"
                />
              </div>
            </div>
          </div>

          {/* Drawer Footer Actions */}
          <div className="p-4 border-t border-[#94AFD7]/10 bg-[#111B29]/70 flex items-center justify-between">
            <button
              onClick={() => {
                closeDrawer();
                setActivePage("investigations");
              }}
              className="flex items-center gap-2 text-xs font-medium text-[#00D5FF] hover:underline"
            >
              <span>View in Investigations Kanban</span>
              <ChevronRight size={14} />
            </button>

            <a
              href={api.exportPdfUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00D5FF] text-[#05080F] text-xs font-semibold hover:bg-[#5CE6FF] transition-colors"
            >
              <FileText size={14} />
              <span>Export PDF Report</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
