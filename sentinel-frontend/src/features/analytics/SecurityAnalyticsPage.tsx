import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  BarChart3,
  Download,
  Filter,
  CheckCircle,
  ShieldAlert,
  ArrowRight,
  Sliders,
} from "lucide-react";
import { useSentinelStore } from "../../store/useSentinelStore";

export const SecurityAnalyticsPage: React.FC = () => {
  const { setActivePage } = useSentinelStore();
  const [selectedFeature, setSelectedFeature] = useState<string>("Flow Duration");
  const [activeFilterNote, setActiveFilterNote] = useState<string | null>(null);

  const normalVsAnom = [
    { category: "Normal Baseline", count: 3061, fill: "#19D995" },
    { category: "Flagged Anomalies", count: 539, fill: "#FF4567" },
  ];

  const protocolData = [
    { name: "TCP (Transmission Control)", value: 3100, color: "#00D5FF" },
    { name: "UDP (User Datagram)", value: 500, color: "#7967FF" },
  ];

  const sourceIpData = [
    { ip: "172.16.0.1 (Attacker)", count: 280, anom: 274 },
    { ip: "192.168.10.12", count: 420, anom: 2 },
    { ip: "192.168.10.15", count: 310, anom: 0 },
    { ip: "172.16.0.5 (Attacker)", count: 120, anom: 120 },
    { ip: "192.168.10.22", count: 180, anom: 0 },
  ];

  const destinationPortData = [
    { port: "Port 443 (TLS)", count: 1420, anom: 12 },
    { port: "Port 80 (HTTP)", count: 1280, anom: 4 },
    { port: "Port 53 (DNS)", count: 500, anom: 0 },
    { port: "Port 21 (FTP)", count: 220, anom: 220 },
    { port: "Port 22 (SSH)", count: 180, anom: 180 },
  ];

  const scoreBins = [
    { bin: "0.0-0.1", count: 1200 },
    { bin: "0.1-0.2", count: 850 },
    { bin: "0.2-0.3", count: 520 },
    { bin: "0.3-0.4", count: 310 },
    { bin: "0.4-0.5", count: 181 },
    { bin: "0.5-0.6", count: 140 },
    { bin: "0.6-0.7", count: 160 },
    { bin: "0.7-0.8", count: 110 },
    { bin: "0.8-0.9", count: 89 },
    { bin: "0.9-1.0", count: 40 },
  ];

  const featureOverlayData = [
    { bin: "Low", normal: 2200, anomalous: 40 },
    { bin: "Medium", normal: 750, anomalous: 120 },
    { bin: "High", normal: 110, anomalous: 250 },
    { bin: "Extreme", normal: 1, anomalous: 129 },
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl glass-panel border border-[#94AFD7]/15">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 size={18} className="text-[#00D5FF]" />
            <h1 className="font-display font-bold text-xl text-[#F4F7FC]">
              Security Analytics Studio
            </h1>
          </div>
          <p className="text-xs text-[#8795A9] mt-0.5">
            Cross-filtered exploratory telemetry across flow vectors, protocols, endpoints, and scores
          </p>
        </div>

        {activeFilterNote && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#00D5FF]/10 border border-[#00D5FF]/30 text-xs font-mono text-[#00D5FF]">
            <span>Filter: {activeFilterNote}</span>
            <button onClick={() => setActiveFilterNote(null)} className="hover:text-white">✕</button>
          </div>
        )}
      </div>

      {/* 8-Chart Matrix Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Chart 1: Normal vs Anomalous */}
        <div className="p-5 rounded-2xl glass-panel space-y-3">
          <span className="text-xs font-mono font-bold text-[#F4F7FC] block">
            1. Normal vs Anomalous Traffic
          </span>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={normalVsAnom}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 175, 215, 0.08)" />
                <XAxis dataKey="category" stroke="#5B6B80" fontSize={10} fontFamily="JetBrains Mono" />
                <YAxis stroke="#5B6B80" fontSize={10} fontFamily="JetBrains Mono" />
                <Tooltip contentStyle={{ backgroundColor: "#0D1420", borderColor: "rgba(148,175,215,0.2)", borderRadius: "8px", fontSize: "11px" }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {normalVsAnom.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Protocol Breakdown */}
        <div className="p-5 rounded-2xl glass-panel space-y-3">
          <span className="text-xs font-mono font-bold text-[#F4F7FC] block">
            2. Transport Protocol Split
          </span>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={protocolData} cx="50%" cy="50%" innerRadius={42} outerRadius={62} dataKey="value" paddingAngle={5}>
                  {protocolData.map((e, i) => (
                    <Cell key={i} fill={e.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#0D1420", borderColor: "rgba(148,175,215,0.2)", borderRadius: "8px", fontSize: "11px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-between text-[10px] font-mono text-[#8795A9]">
            <span className="text-[#00D5FF]">TCP: 86.1%</span>
            <span className="text-[#7967FF]">UDP: 13.9%</span>
          </div>
        </div>

        {/* Chart 3: Anomaly Score Distribution Histogram */}
        <div className="p-5 rounded-2xl glass-panel space-y-3">
          <span className="text-xs font-mono font-bold text-[#F4F7FC] block">
            3. Anomaly Score Distribution
          </span>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreBins}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 175, 215, 0.08)" />
                <XAxis dataKey="bin" stroke="#5B6B80" fontSize={9} fontFamily="JetBrains Mono" />
                <YAxis stroke="#5B6B80" fontSize={9} fontFamily="JetBrains Mono" />
                <Tooltip contentStyle={{ backgroundColor: "#0D1420", borderColor: "rgba(148,175,215,0.2)", borderRadius: "8px", fontSize: "11px" }} />
                <Bar dataKey="count" fill="#00D5FF" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Feature Distribution Overlay */}
        <div className="p-5 rounded-2xl glass-panel space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-[#F4F7FC]">
              4. Feature Value Overlay
            </span>
            <select
              value={selectedFeature}
              onChange={(e) => setSelectedFeature(e.target.value)}
              className="bg-[#05080F] border border-[#94AFD7]/15 rounded text-[10px] font-mono text-[#00D5FF] px-1.5 py-0.5"
            >
              <option>Flow Duration</option>
              <option>Flow Packets/s</option>
              <option>Total Fwd Packets</option>
            </select>
          </div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={featureOverlayData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 175, 215, 0.08)" />
                <XAxis dataKey="bin" stroke="#5B6B80" fontSize={10} fontFamily="JetBrains Mono" />
                <YAxis stroke="#5B6B80" fontSize={10} fontFamily="JetBrains Mono" />
                <Tooltip contentStyle={{ backgroundColor: "#0D1420", borderColor: "rgba(148,175,215,0.2)", borderRadius: "8px", fontSize: "11px" }} />
                <Bar dataKey="normal" fill="#19D995" stackId="a" />
                <Bar dataKey="anomalous" fill="#FF4567" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 5: Source IP Activity */}
        <div className="lg:col-span-2 p-5 rounded-2xl glass-panel space-y-3">
          <span className="text-xs font-mono font-bold text-[#F4F7FC] block">
            5. Source IP Ingress Activity & Anomaly Ratio
          </span>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sourceIpData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 175, 215, 0.08)" />
                <XAxis type="number" stroke="#5B6B80" fontSize={10} fontFamily="JetBrains Mono" />
                <YAxis dataKey="ip" type="category" stroke="#5B6B80" fontSize={10} fontFamily="JetBrains Mono" width={140} />
                <Tooltip contentStyle={{ backgroundColor: "#0D1420", borderColor: "rgba(148,175,215,0.2)", borderRadius: "8px", fontSize: "11px" }} />
                <Bar dataKey="count" fill="#172334" stroke="#94AFD7" strokeWidth={1} name="Total Flows" />
                <Bar dataKey="anom" fill="#FF4567" name="Anomalies" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 6: Destination Port Activity */}
        <div className="lg:col-span-2 p-5 rounded-2xl glass-panel space-y-3">
          <span className="text-xs font-mono font-bold text-[#F4F7FC] block">
            6. Destination Service Ports Target Distribution
          </span>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={destinationPortData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 175, 215, 0.08)" />
                <XAxis type="number" stroke="#5B6B80" fontSize={10} fontFamily="JetBrains Mono" />
                <YAxis dataKey="port" type="category" stroke="#5B6B80" fontSize={10} fontFamily="JetBrains Mono" width={110} />
                <Tooltip contentStyle={{ backgroundColor: "#0D1420", borderColor: "rgba(148,175,215,0.2)", borderRadius: "8px", fontSize: "11px" }} />
                <Bar dataKey="count" fill="#172334" stroke="#00D5FF" strokeWidth={1} name="Total Flows" />
                <Bar dataKey="anom" fill="#FF4567" name="Anomalies" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
