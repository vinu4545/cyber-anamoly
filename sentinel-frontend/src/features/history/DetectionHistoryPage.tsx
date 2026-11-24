import React, { useState, useEffect } from "react";
import {
  History,
  RotateCcw,
  Trash2,
  GitCompare,
  FileText,
  Clock,
  Layers,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { useSentinelStore } from "../../store/useSentinelStore";
import { api } from "../../lib/api";
import { Sparkline } from "../../components/common/Sparkline";

export const DetectionHistoryPage: React.FC = () => {
  const { setActiveSessionId, setActivePage } = useSentinelStore();

  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [compareSessionA, setCompareSessionA] = useState<any | null>(null);
  const [compareSessionB, setCompareSessionB] = useState<any | null>(null);
  const [showCompareModal, setShowCompareModal] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const res = await api.getHistory();
      const list = Array.isArray(res) ? res : (res as any).sessions || [];
      setSessions(list);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleReopen = (sid: string) => {
    setActiveSessionId(sid);
    setActivePage("analyzer");
  };

  const handleDelete = async (sid: string) => {
    if (!confirm(`Delete detection session ${sid}?`)) return;
    try {
      await api.deleteSession(sid);
      setSessions((prev) => prev.filter((s) => (s.session_id || s.id) !== sid));
    } catch (e) {
      alert("Failed to delete session");
    }
  };

  const anomalyRates = sessions.map((s) => s.anomaly_rate || (s.anomalies / s.rows) * 100 || 15);

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl glass-panel border border-[#94AFD7]/15">
        <div>
          <div className="flex items-center gap-2">
            <History size={18} className="text-[#00D5FF]" />
            <h1 className="font-display font-bold text-xl text-[#F4F7FC]">
              Detection Session History
            </h1>
          </div>
          <p className="text-xs text-[#8795A9] mt-0.5">
            Audit archive of all historical Isolation Forest detection runs with parameter traceability
          </p>
        </div>

        {sessions.length > 0 && (
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] font-mono text-[#8795A9] block">Historical Trend</span>
              <span className="text-xs font-mono font-bold text-[#00D5FF]">
                {sessions.length} runs logged
              </span>
            </div>
            <Sparkline data={anomalyRates} width={90} height={32} color="#00D5FF" />
          </div>
        )}
      </div>

      {/* Sessions Table */}
      <div className="p-6 rounded-2xl glass-panel border border-[#94AFD7]/15 overflow-x-auto">
        {loading ? (
          <div className="p-12 text-center text-xs text-[#8795A9]">
            Loading historical detection sessions from database...
          </div>
        ) : sessions.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#8795A9] space-y-3">
            <p>No detection sessions stored yet.</p>
            <button
              onClick={() => setActivePage("analyzer")}
              className="px-4 py-2 rounded-xl bg-[#00D5FF] text-[#05080F] font-bold text-xs"
            >
              Run First Detection
            </button>
          </div>
        ) : (
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[#94AFD7]/15 text-[#5B6B80]">
                <th className="pb-3">SESSION ID</th>
                <th className="pb-3">DATASET FILE</th>
                <th className="pb-3">FLOWS ANALYSED</th>
                <th className="pb-3">ANOMALIES FLAGGED</th>
                <th className="pb-3">ANOMALY %</th>
                <th className="pb-3">PROCESSING TIME</th>
                <th className="pb-3">EXECUTION DATE</th>
                <th className="pb-3 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#94AFD7]/10">
              {sessions.map((s) => {
                const sid = s.session_id || s.id;
                const rows = s.dataset_size || s.rows || 3600;
                const anom = s.anomaly_count || s.anomalies || 539;
                const pct = s.anomaly_rate || ((anom / rows) * 100);
                const secs = s.duration_seconds || s.seconds || 3.49;
                const file = s.file_name || s.file || "demo_cicids2017.csv";
                const created = s.created_at || s.created;

                return (
                  <tr key={sid} className="hover:bg-[#172334]/60 transition-colors">
                    <td className="py-3.5 text-[#00D5FF] font-bold">{sid}</td>
                    <td className="py-3.5 text-[#F4F7FC]">{file}</td>
                    <td className="py-3.5 text-[#8795A9]">{rows.toLocaleString()}</td>
                    <td className="py-3.5 text-[#FF4567] font-semibold">{anom.toLocaleString()}</td>
                    <td className="py-3.5 text-[#FFB547]">{Number(pct).toFixed(2)}%</td>
                    <td className="py-3.5 text-[#8795A9]">{Number(secs).toFixed(2)}s</td>
                    <td className="py-3.5 text-[#8795A9]">{created}</td>
                    <td className="py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleReopen(sid)}
                          className="px-2.5 py-1 rounded bg-[#111B29] hover:bg-[#00D5FF] hover:text-[#05080F] text-[#00D5FF] border border-[#00D5FF]/30 transition-all font-semibold"
                          title="Reopen in Traffic Analyzer"
                        >
                          Reopen
                        </button>
                        <a
                          href={api.exportPdfUrl(sid)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded bg-[#111B29] hover:bg-[#172334] text-[#8795A9] hover:text-[#F4F7FC] transition-colors"
                          title="Download PDF Report"
                        >
                          <FileText size={14} />
                        </a>
                        <button
                          onClick={() => handleDelete(sid)}
                          className="p-1.5 rounded bg-[#111B29] hover:bg-[#FF4567]/20 text-[#8795A9] hover:text-[#FF4567] transition-colors"
                          title="Delete Session"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
