import React, { useState } from "react";
import {
  Network,
  Server,
  Laptop,
  ShieldAlert,
  ArrowRight,
  Info,
  Activity,
  Layers,
  Cpu,
} from "lucide-react";
import { useSentinelStore } from "../../store/useSentinelStore";

interface NodeItem {
  id: string;
  label: string;
  type: "client" | "server" | "attacker";
  ip: string;
  x: number;
  y: number;
  flows: number;
  anomalies: number;
}

export const NetworkIntelligencePage: React.FC = () => {
  const { openDrawerWithRecord } = useSentinelStore();
  const [selectedNode, setSelectedNode] = useState<NodeItem | null>(null);

  // High-dimensional network topology mapping
  const nodes: NodeItem[] = [
    // Target Servers
    { id: "srv-ftp", label: "FTP Server (Port 21)", type: "server", ip: "192.168.10.50", x: 480, y: 160, flows: 220, anomalies: 220 },
    { id: "srv-ssh", label: "SSH Gateway (Port 22)", type: "server", ip: "192.168.10.51", x: 480, y: 320, flows: 180, anomalies: 180 },
    { id: "srv-web", label: "Web Portal (Port 443)", type: "server", ip: "192.168.10.52", x: 520, y: 480, flows: 1420, anomalies: 12 },
    { id: "srv-dns", label: "DNS Resolver (Port 53)", type: "server", ip: "8.8.8.8", x: 550, y: 80, flows: 680, anomalies: 0 },

    // Attackers
    { id: "att-1", label: "Attacker Node Alpha", type: "attacker", ip: "172.16.0.1", x: 120, y: 180, flows: 280, anomalies: 274 },
    { id: "att-2", label: "Attacker Node Beta", type: "attacker", ip: "172.16.0.5", x: 120, y: 300, flows: 120, anomalies: 120 },

    // Benign Clients
    { id: "cli-1", label: "Workstation 10.12", type: "client", ip: "192.168.10.12", x: 150, y: 440, flows: 420, anomalies: 2 },
    { id: "cli-2", label: "Workstation 10.15", type: "client", ip: "192.168.10.15", x: 160, y: 550, flows: 310, anomalies: 0 },
    { id: "cli-3", label: "Workstation 10.22", type: "client", ip: "192.168.10.22", x: 140, y: 80, flows: 180, anomalies: 0 },
  ];

  const edges = [
    { from: "att-1", to: "srv-ftp", suspicious: true, label: "FTP Brute Force (Port 21)" },
    { from: "att-1", to: "srv-ssh", suspicious: true, label: "SSH Brute Force (Port 22)" },
    { from: "att-2", to: "srv-ftp", suspicious: true, label: "FTP Credential Stuffing" },
    { from: "cli-1", to: "srv-web", suspicious: false, label: "HTTPS Web Session" },
    { from: "cli-2", to: "srv-web", suspicious: false, label: "HTTPS API Calls" },
    { from: "cli-3", to: "srv-dns", suspicious: false, label: "DNS Queries" },
  ];

  const ports = [
    { port: 80, proto: "HTTP", count: 1280, anomalies: 4, share: "35.5%" },
    { port: 443, proto: "HTTPS/TLS", count: 1420, anomalies: 12, share: "39.4%" },
    { port: 21, proto: "FTP Control", count: 220, anomalies: 220, share: "6.1%", alert: true },
    { port: 22, proto: "SSH Remote", count: 180, anomalies: 180, share: "5.0%", alert: true },
    { port: 53, proto: "DNS Query", count: 500, anomalies: 0, share: "13.9%" },
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl glass-panel border border-[#94AFD7]/15">
        <div>
          <div className="flex items-center gap-2">
            <Network size={18} className="text-[#00D5FF]" />
            <h1 className="font-display font-bold text-xl text-[#F4F7FC]">
              Network Intelligence & Topology
            </h1>
          </div>
          <p className="text-xs text-[#8795A9] mt-0.5">
            Interactive topological relationship graph mapping communicating endpoints and anomaly blast radius
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="flex items-center gap-1.5 text-[#FF4567]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF4567] animate-pulse" /> Anomalous Vector
          </span>
          <span className="flex items-center gap-1.5 text-[#19D995] ml-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#19D995]" /> Baseline Flow
          </span>
        </div>
      </div>

      {/* Main Grid: Interactive Topology Graph & Inspector Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive SVG Topology Graph */}
        <div className="lg:col-span-2 rounded-2xl glass-panel border border-[#94AFD7]/15 p-6 flex flex-col justify-between relative overflow-hidden min-h-[580px]">
          <div className="flex items-center justify-between z-10">
            <span className="text-xs font-mono text-[#8795A9]">
              COMMUNICATION GRAPH · CLICK NODE TO INSPECT
            </span>
          </div>

          <svg className="w-full h-[520px] overflow-visible">
            {/* Edges with animated packets */}
            {edges.map((e, idx) => {
              const fromNode = nodes.find((n) => n.id === e.from);
              const toNode = nodes.find((n) => n.id === e.to);
              if (!fromNode || !toNode) return null;

              return (
                <g key={idx}>
                  <line
                    x1={fromNode.x}
                    y1={fromNode.y}
                    x2={toNode.x}
                    y2={toNode.y}
                    stroke={e.suspicious ? "#FF4567" : "rgba(148, 175, 215, 0.25)"}
                    strokeWidth={e.suspicious ? 2.5 : 1.5}
                    strokeDasharray={e.suspicious ? "6 3" : undefined}
                  />
                  {/* Floating packet dot on path */}
                  <circle
                    r={e.suspicious ? 3.5 : 2.5}
                    fill={e.suspicious ? "#FF4567" : "#00D5FF"}
                  >
                    <animateMotion
                      path={`M${fromNode.x},${fromNode.y} L${toNode.x},${toNode.y}`}
                      dur={e.suspicious ? "1.8s" : "3.2s"}
                      repeatCount="indefinite"
                    />
                  </circle>
                </g>
              );
            })}

            {/* Nodes */}
            {nodes.map((n) => {
              const isSelected = selectedNode?.id === n.id;
              const isAttacker = n.type === "attacker";
              const isServer = n.type === "server";

              return (
                <g
                  key={n.id}
                  onClick={() => setSelectedNode(n)}
                  className="cursor-pointer group"
                >
                  {/* Halo */}
                  {n.anomalies > 50 && (
                    <circle
                      cx={n.x}
                      cy={n.y}
                      r={24}
                      fill="none"
                      stroke="#FF4567"
                      strokeWidth={1}
                      className="animate-ping opacity-30"
                    />
                  )}
                  {/* Outer Ring */}
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={18}
                    fill="#080B12"
                    stroke={
                      isAttacker
                        ? "#FF4567"
                        : isServer
                        ? "#00D5FF"
                        : "#19D995"
                    }
                    strokeWidth={isSelected ? 3 : 2}
                    className="transition-all group-hover:scale-125"
                  />
                  {/* Center Dot */}
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={6}
                    fill={
                      isAttacker
                        ? "#FF4567"
                        : isServer
                        ? "#00D5FF"
                        : "#19D995"
                    }
                  />
                  {/* Text Label */}
                  <text
                    x={n.x}
                    y={n.y + 30}
                    textAnchor="middle"
                    fill="#F4F7FC"
                    fontSize={11}
                    fontFamily="JetBrains Mono"
                    className="font-semibold select-none"
                  >
                    {n.label}
                  </text>
                  <text
                    x={n.x}
                    y={n.y + 42}
                    textAnchor="middle"
                    fill="#8795A9"
                    fontSize={9}
                    fontFamily="JetBrains Mono"
                    className="select-none"
                  >
                    {n.ip}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Right Col: Node Inspector Panel & Port Breakdown */}
        <div className="space-y-6">
          {/* Node Inspector */}
          <div className="p-5 rounded-2xl glass-panel space-y-4">
            <h2 className="font-display font-bold text-sm text-[#F4F7FC]">
              Endpoint Profile Inspector
            </h2>

            {selectedNode ? (
              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 rounded-xl bg-[#080B12] border border-[#94AFD7]/10 space-y-1">
                  <span className="text-[10px] text-[#5B6B80] block">HOSTNAME / ROLE</span>
                  <span className="text-sm font-bold text-[#F4F7FC] block">
                    {selectedNode.label}
                  </span>
                  <span className="text-xs text-[#00D5FF]">{selectedNode.ip}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="p-2.5 rounded-lg bg-[#111B29]">
                    <span className="text-[10px] text-[#8795A9] block">TOTAL FLOWS</span>
                    <span className="text-sm font-bold text-[#F4F7FC]">
                      {selectedNode.flows}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#111B29]">
                    <span className="text-[10px] text-[#8795A9] block">ANOMALIES</span>
                    <span
                      className={`text-sm font-bold ${
                        selectedNode.anomalies > 0 ? "text-[#FF4567]" : "text-[#19D995]"
                      }`}
                    >
                      {selectedNode.anomalies}
                    </span>
                  </div>
                </div>

                <div className="pt-2 text-[11px] text-[#8795A9] leading-relaxed">
                  {selectedNode.anomalies > 50 ? (
                    <span className="text-[#FF4567]">
                      High threat blast radius: Multiple automated brute force cycles initiated targeting authentication daemons.
                    </span>
                  ) : (
                    <span>Normal conversational flow patterns adhering to standard protocol baselines.</span>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-[#5B6B80] border border-dashed border-[#94AFD7]/15 rounded-xl">
                Click any endpoint node in the graph above to view session flows and blast radius.
              </div>
            )}
          </div>

          {/* Port & Protocol Distribution Leaderboard */}
          <div className="p-5 rounded-2xl glass-panel space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#F4F7FC]">Target Port Distribution</span>
              <span className="text-[10px] text-[#8795A9]">CIC-IDS2017</span>
            </div>

            <div className="space-y-2">
              {ports.map((p) => (
                <div
                  key={p.port}
                  className={`p-2.5 rounded-xl border flex items-center justify-between ${
                    p.alert
                      ? "bg-[#FF4567]/10 border-[#FF4567]/30 text-[#FF4567]"
                      : "bg-[#111B29]/60 border-[#94AFD7]/10 text-[#F4F7FC]"
                  }`}
                >
                  <div>
                    <span className="font-bold">Port {p.port}</span>
                    <span className="text-[#8795A9] ml-1.5 text-[11px]">({p.proto})</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold">{p.count} flows</span>
                    <span className="text-[10px] text-[#8795A9] block">
                      {p.anomalies > 0 ? `${p.anomalies} flagged` : "0 anomalies"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
