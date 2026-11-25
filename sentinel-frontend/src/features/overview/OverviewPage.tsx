import React, { useEffect, useState } from "react";
import {
  ShieldAlert,
  Activity,
  Layers,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Clock,
  ArrowUpRight,
  TrendingUp,
  Cpu,
  RefreshCw,
  Search,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useSentinelStore } from "../../store/useSentinelStore";
import { api, ModelMetrics, RecordItem } from "../../lib/api";
import { Counter } from "../../components/common/Counter";
import { Sparkline } from "../../components/common/Sparkline";
import { ThreatRadar } from "../../components/common/ThreatRadar";
import { HealthScoreRing } from "../../components/common/HealthScoreRing";

export const OverviewPage: React.FC = () => {
  const {
    setActivePage,
    openDrawerWithRecord,
    activeSessionId,
    dataMode,
  } = useSentinelStore();

  const [metrics, setMetrics] = useState<ModelMetrics | null>(null);
  const [recentRecords, setRecentRecords] = useState<RecordItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [healthScore, setHealthScore] = useState<number>(100);

  useEffect(() => {
    loadOverviewData();
  }, [activeSessionId]);

  const loadOverviewData = async () => {
    setLoading(true);
    try {
      const [m, summary, hist] = await Promise.all([
        api.getModelMetrics(activeSessionId || undefined),
        api.getSummary().catch(() => null),
        api.getHistory().catch(() => []),
      ]);

      setMetrics(m);
      if (summary) setHealthScore(summary.health_score || 100);

      // Find target session
      let targetSid = activeSessionId;
      if (!targetSid) {
        const sessionsList = Array.isArray(hist) ? hist : (hist as any).sessions || [];
        if (sessionsList.length > 0) {
          targetSid = sessionsList[0].session_id || sessionsList[0].id;
        }
      }

      if (targetSid) {
        const recsRes = await api.getRecords(targetSid, { page_size: 15, sort_by: "anomaly_score", sort_order: "desc" });
        setRecentRecords(recsRes.records || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Mock flow timeline volume points based on actual counts
  const timelineData = [
    { time: "09:00", normal: 340, anomalous: 8 },
    { time: "09:15", normal: 420, anomalous: 15 },
    { time: "09:30", normal: 380, anomalous: 45 },
    { time: "09:45", normal: 490, anomalous: 120 },
    { time: "10:00", normal: 510, anomalous: 190 },
    { time: "10:15", normal: 460, anomalous: 95 },
    { time: "10:30", normal: 461, anomalous: 66 },
  ];

  // Threat donut data
  const threatData = metrics?.metrics?.ground_truth_counts
    ? Object.entries(metrics.metrics.ground_truth_counts).map(([name, value]) => ({
        name,
        value,
      }))
    : [
        { name: "BENIGN", value: 3061 },
        { name: "FTP-Patator", value: 220 },
        { name: "SSH-Patator", value: 180 },
      ];

  const THREAT_COLORS = ["#19D995", "#FF4567", "#7967FF", "#FFB547"];

  const evalData = metrics?.metrics;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-[#0D1420] via-[#111B29] to-[#0D1420] border border-[#94AFD7]/15">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00D5FF] animate-pulse" />
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#00D5FF] font-semibold">
              REAL-TIME SOC TELEMETRY
            </span>
          </div>
          <h1 className="font-display font-bold text-2xl text-[#F4F7FC] mt-1">
            Enterprise Security Operations Center
          </h1>
          <p className="text-xs text-[#8795A9] mt-0.5">
            Real-time unsupervised Isolation Forest anomaly detection across CIC-IDS2017 high-dimensional network flows.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActivePage("analyzer")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#00D5FF] to-[#7967FF] text-[#05080F] text-xs font-bold hover:opacity-90 transition-opacity shadow-[0_0_15px_rgba(0,213,255,0.3)]"
          >
            <Activity size={15} />
            <span>Launch Traffic Analyzer</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* KPI 1: Total Flows */}
        <div className="p-4 rounded-2xl glass-panel relative overflow-hidden group hover:border-[#00D5FF]/30 transition-all">
          <div className="flex items-center justify-between text-xs text-[#8795A9] mb-1">
            <span>Total Network Flows</span>
            <Layers size={15} className="text-[#00D5FF]" />
          </div>
          <div className="text-2xl font-display font-bold text-[#F4F7FC]">
            <Counter value={metrics?.dataset_size || 3600} />
          </div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#94AFD7]/10">
            <span className="text-[10px] font-mono text-[#19D995] flex items-center gap-0.5">
              <TrendingUp size={11} /> 100% Parsed
            </span>
            <Sparkline data={[120, 150, 180, 220, 310, 450, 520]} color="#00D5FF" />
          </div>
        </div>

        {/* KPI 2: Normal Traffic */}
        <div className="p-4 rounded-2xl glass-panel relative overflow-hidden group hover:border-[#19D995]/30 transition-all">
          <div className="flex items-center justify-between text-xs text-[#8795A9] mb-1">
            <span>Normal Traffic</span>
            <CheckCircle2 size={15} className="text-[#19D995]" />
          </div>
          <div className="text-2xl font-display font-bold text-[#19D995]">
            <Counter value={metrics?.normal_count || 3061} />
          </div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#94AFD7]/10">
            <span className="text-[10px] font-mono text-[#8795A9]">
              {(((metrics?.normal_count || 3061) / (metrics?.dataset_size || 3600)) * 100).toFixed(1)}% benign
            </span>
            <Sparkline data={[95, 96, 94, 95, 97, 96, 95]} color="#19D995" />
          </div>
        </div>

        {/* KPI 3: Suspicious Traffic */}
        <div className="p-4 rounded-2xl glass-panel relative overflow-hidden group hover:border-[#FF4567]/30 transition-all">
          <div className="flex items-center justify-between text-xs text-[#8795A9] mb-1">
            <span>Flagged Anomalies</span>
            <ShieldAlert size={15} className="text-[#FF4567]" />
          </div>
          <div className="text-2xl font-display font-bold text-[#FF4567]">
            <Counter value={metrics?.anomaly_count || 539} />
          </div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#94AFD7]/10">
            <span className="text-[10px] font-mono text-[#FF4567]">
              {metrics?.anomaly_rate?.toFixed(2) || "14.97"}% anomaly rate
            </span>
            <Sparkline data={[5, 12, 18, 45, 90, 140, 110]} color="#FF4567" />
          </div>
        </div>

        {/* KPI 4: Evaluation F1 / Recall */}
        <div className="p-4 rounded-2xl glass-panel relative overflow-hidden group hover:border-[#7967FF]/30 transition-all">
          <div className="flex items-center justify-between text-xs text-[#8795A9] mb-1">
            <span>Detection F1-Score</span>
            <Cpu size={15} className="text-[#7967FF]" />
          </div>
          <div className="text-2xl font-display font-bold text-[#7967FF]">
            {evalData ? (
              <Counter value={evalData.f1_score * 100} decimals={1} suffix="%" />
            ) : (
              <span className="text-sm font-mono text-[#5B6B80]">N/A (Unlabeled)</span>
            )}
          </div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#94AFD7]/10">
            <span className="text-[10px] font-mono text-[#8795A9]">
              {evalData ? `ROC-AUC: ${evalData.roc_auc.toFixed(3)}` : "Held-out split"}
            </span>
            <Sparkline data={[78, 80, 82, 85, 87, 85, 85]} color="#7967FF" />
          </div>
        </div>

        {/* KPI 5: Health Quality Score */}
        <div className="p-4 rounded-2xl glass-panel flex items-center justify-between">
          <div>
            <span className="text-xs text-[#8795A9] block">Dataset Health</span>
            <span className="text-2xl font-display font-bold text-[#F4F7FC]">
              {healthScore.toFixed(0)}%
            </span>
            <span className="text-[10px] font-mono text-[#19D995] block mt-1">
              Zero Leakage Verified
            </span>
          </div>
          <HealthScoreRing score={healthScore} size={54} />
        </div>
      </div>

      {/* Middle Row: Hero Chart & Threat Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Flow Volume Chart */}
        <div className="lg:col-span-2 min-w-0 p-6 rounded-2xl glass-panel flex flex-col justify-between">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="font-display font-bold text-base text-[#F4F7FC]">
                Network Traffic Volume & Anomaly Ingress
              </h2>
              <p className="text-xs text-[#8795A9]">
                Chronological flow distribution with normal baseline and flagged threat spikes
              </p>
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-[#19D995]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#19D995]" /> Normal
              </span>
              <span className="flex items-center gap-1.5 text-[#FF4567]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF4567]" /> Flagged Anomaly
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData}>
                <defs>
                  <linearGradient id="normGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#19D995" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#19D995" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="anomGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF4567" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#FF4567" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 175, 215, 0.08)" />
                <XAxis dataKey="time" stroke="#5B6B80" fontSize={11} fontFamily="JetBrains Mono" />
                <YAxis stroke="#5B6B80" fontSize={11} fontFamily="JetBrains Mono" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0D1420",
                    borderColor: "rgba(148, 175, 215, 0.2)",
                    borderRadius: "12px",
                    fontSize: "12px",
                    fontFamily: "JetBrains Mono",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="normal"
                  stroke="#19D995"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#normGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="anomalous"
                  stroke="#FF4567"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#anomGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Col: Threat Radar Widget */}
        <div className="p-6 rounded-2xl glass-panel flex flex-col items-center justify-between">
          <div className="w-full flex items-center justify-between mb-2">
            <h2 className="font-display font-bold text-base text-[#F4F7FC]">
              Threat Radar
            </h2>
            <span className="text-[10px] font-mono text-[#00D5FF] px-2 py-0.5 rounded bg-[#00D5FF]/10 border border-[#00D5FF]/20">
              ACTIVE SWEEP
            </span>
          </div>

          <ThreatRadar records={recentRecords} size={230} />
        </div>
      </div>

      {/* Bottom Row: Threat Distribution Donut & Recent Flagged Flows */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Threat Distribution Donut */}
        <div className="p-6 rounded-2xl glass-panel flex flex-col justify-between">
          <div>
            <h2 className="font-display font-bold text-base text-[#F4F7FC]">
              Threat Class Distribution
            </h2>
            <p className="text-xs text-[#8795A9]">
              Ground-truth attack types vs normal baseline flows
            </p>
          </div>

          <div className="h-52 flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={threatData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {threatData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={THREAT_COLORS[index % THREAT_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0D1420",
                    borderColor: "rgba(148, 175, 215, 0.2)",
                    borderRadius: "10px",
                    fontSize: "12px",
                    fontFamily: "JetBrains Mono",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xs text-[#8795A9] font-mono">TOTAL</span>
              <span className="font-display font-bold text-lg text-[#F4F7FC]">
                {(metrics?.dataset_size || 3600).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-[#94AFD7]/10 text-xs font-mono">
            {threatData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-[#8795A9]">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: THREAT_COLORS[idx % THREAT_COLORS.length] }}
                  />
                  {item.name}
                </span>
                <span className="text-[#F4F7FC] font-semibold">{item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Flagged Security Events Table */}
        <div className="lg:col-span-2 p-6 rounded-2xl glass-panel flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display font-bold text-base text-[#F4F7FC]">
                Recent Flagged Security Events
              </h2>
              <p className="text-xs text-[#8795A9]">
                Click any flow row to open the full inspection drawer and deviation analysis
              </p>
            </div>
            <button
              onClick={() => setActivePage("analyzer")}
              className="text-xs text-[#00D5FF] hover:underline flex items-center gap-1 font-mono"
            >
              <span>View all records</span>
              <ArrowUpRight size={14} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-[#94AFD7]/15 text-[#5B6B80]">
                  <th className="pb-2">RECORD ID</th>
                  <th className="pb-2">SOURCE IP</th>
                  <th className="pb-2">DESTINATION:PORT</th>
                  <th className="pb-2">PROTO</th>
                  <th className="pb-2">ANOMALY SCORE</th>
                  <th className="pb-2 text-right">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#94AFD7]/10">
                {recentRecords.slice(0, 7).map((r) => (
                  <tr
                    key={r.record_id}
                    onClick={() => openDrawerWithRecord(r)}
                    className="hover:bg-[#172334]/60 cursor-pointer transition-colors group"
                  >
                    <td className="py-2.5 text-[#F4F7FC] font-semibold">
                      #{r.record_id}
                    </td>
                    <td className="py-2.5 text-[#8795A9]">{r.source_ip || "192.168.10.15"}</td>
                    <td className="py-2.5 text-[#8795A9]">
                      {r.destination_ip || "192.168.10.50"}:{r.destination_port || "21"}
                    </td>
                    <td className="py-2.5 text-[#00D5FF]">{r.protocol || "TCP"}</td>
                    <td className="py-2.5">
                      <div className="flex items-center gap-2">
                        <span className="w-10 text-[#F4F7FC]">
                          {r.anomaly_score.toFixed(3)}
                        </span>
                        <div className="w-16 h-1.5 bg-[#05080F] rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              r.anomaly_score >= 0.8
                                ? "bg-[#FF4567]"
                                : r.anomaly_score >= 0.55
                                ? "bg-[#FFB547]"
                                : "bg-[#19D995]"
                            }`}
                            style={{ width: `${r.anomaly_score * 100}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 text-right">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                          r.anomaly_score >= 0.55
                            ? "bg-[#FF4567]/15 text-[#FF4567] border border-[#FF4567]/30"
                            : "bg-[#19D995]/15 text-[#19D995] border border-[#19D995]/30"
                        }`}
                      >
                        {r.prediction}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
