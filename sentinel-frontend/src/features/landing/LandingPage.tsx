import React, { useState, useEffect } from "react";
import {
  Shield,
  ArrowRight,
  Activity,
  Layers,
  Cpu,
  Lock,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Play,
  Terminal,
} from "lucide-react";
import { useSentinelStore } from "../../store/useSentinelStore";

export const LandingPage: React.FC = () => {
  const { setConsoleOpen, setActivePage } = useSentinelStore();

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [cyclingIndex, setCyclingIndex] = useState(0);

  // Auto-cycling preview of flows
  const previewFlows = [
    { time: "10:14:02", ip: "192.168.10.12 → 104.21.35.12:443", proto: "TCP", score: 0.124, status: "NORMAL" },
    { time: "10:14:04", ip: "192.168.10.15 → 8.8.8.8:53", proto: "UDP", score: 0.182, status: "NORMAL" },
    { time: "10:14:06", ip: "172.16.0.1 → 192.168.10.50:21", proto: "TCP", score: 0.894, status: "CRITICAL", alert: "FTP-Patator" },
    { time: "10:14:07", ip: "172.16.0.1 → 192.168.10.51:22", proto: "TCP", score: 0.781, status: "SUSPICIOUS", alert: "SSH-Patator" },
    { time: "10:14:09", ip: "192.168.10.22 → 192.168.10.52:80", proto: "TCP", score: 0.205, status: "NORMAL" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCyclingIndex((prev) => (prev + 1) % previewFlows.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleLaunchConsole = () => {
    setConsoleOpen(true);
    setActivePage("overview");
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="min-h-screen bg-[#05080F] text-[#F4F7FC] relative overflow-hidden flex flex-col justify-between selection:bg-[#00D5FF]/30"
    >
      {/* Background Aurora Blobs */}
      <div
        className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-[#00D5FF]/10 blur-[140px] pointer-events-none transition-transform duration-700 ease-out"
        style={{
          transform: `translate(${mousePos.x * 0.03}px, ${mousePos.y * 0.03}px)`,
        }}
      />
      <div
        className="absolute -bottom-40 -right-40 w-[700px] h-[700px] rounded-full bg-[#7967FF]/15 blur-[160px] pointer-events-none transition-transform duration-700 ease-out"
        style={{
          transform: `translate(${-mousePos.x * 0.02}px, ${-mousePos.y * 0.02}px)`,
        }}
      />
      <div className="absolute inset-0 soc-grid-bg pointer-events-none" />

      {/* Top Navbar */}
      <header className="h-20 px-8 flex items-center justify-between z-20 border-b border-[#94AFD7]/10 bg-[#05080F]/50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00D5FF] via-[#7967FF] to-[#C85BFF] p-[1.5px] shrink-0 flex items-center justify-center glow-cyan">
            <div className="w-full h-full bg-[#05080F] rounded-[10px] flex items-center justify-center">
              <Shield className="w-5 h-5 text-[#00D5FF]" />
            </div>
          </div>
          <span className="font-display font-bold text-base tracking-wider text-[#F4F7FC]">
            SENTINEL<span className="text-[#00D5FF] ml-1">AI</span>
          </span>
        </div>

        <button
          onClick={handleLaunchConsole}
          className="px-4 py-2 rounded-xl bg-[#172334] hover:bg-[#1f2f45] border border-[#00D5FF]/40 text-xs font-semibold text-[#00D5FF] transition-all flex items-center gap-2"
        >
          <span>Open Console</span>
          <ArrowRight size={14} />
        </button>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16 z-10 max-w-5xl mx-auto space-y-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111B29]/90 border border-[#00D5FF]/30 text-xs font-mono glow-cyan">
          <span className="w-2 h-2 rounded-full bg-[#00D5FF] animate-pulse" />
          <span className="text-[#F4F7FC]">UNSUPERVISED NETWORK ANOMALY DETECTION</span>
        </div>

        <h1 className="font-display font-bold text-4xl sm:text-6xl tracking-tight max-w-3xl leading-[1.15]">
          Every Network Flow Tells a Story.{" "}
          <span className="text-brand-gradient">We Find the Anomalies.</span>
        </h1>

        <p className="text-sm sm:text-base text-[#8795A9] max-w-2xl leading-relaxed">
          Intelligent network anomaly detection powered by Isolation Forest. Ingest high-dimensional network telemetry, isolate suspicious flow patterns, investigate threat vectors, and export analyst-grade executive reports.
        </p>

        {/* Hero CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
          <button
            onClick={handleLaunchConsole}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#00D5FF] via-[#7967FF] to-[#C85BFF] text-[#05080F] text-sm font-bold shadow-[0_0_25px_rgba(0,213,255,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5"
          >
            <Activity size={18} />
            <span>LAUNCH SECURITY CONSOLE</span>
            <ArrowRight size={16} />
          </button>

          <button
            onClick={() => {
              setConsoleOpen(true);
              setActivePage("model-lab");
            }}
            className="px-6 py-3.5 rounded-xl bg-[#111B29]/70 hover:bg-[#172334] border border-[#94AFD7]/15 text-xs font-semibold text-[#F4F7FC] transition-colors flex items-center gap-2"
          >
            <Cpu size={16} className="text-[#00D5FF]" />
            <span>Explore Detection Engine</span>
          </button>
        </div>

        {/* Live Mini Preview Card */}
        <div className="w-full max-w-xl p-4 rounded-2xl glass-panel border border-[#94AFD7]/20 text-left font-mono text-xs space-y-2 mt-8 shadow-2xl">
          <div className="flex items-center justify-between pb-2 border-b border-[#94AFD7]/10 text-[10px] text-[#8795A9]">
            <span className="flex items-center gap-1.5 text-[#00D5FF]">
              <span className="w-2 h-2 rounded-full bg-[#19D995] animate-pulse" />
              LIVE TELEMETRY STREAM PREVIEW (DEMO)
            </span>
            <span>MODEL: ISOLATION FOREST</span>
          </div>

          <div className="space-y-1.5">
            {previewFlows.map((f, i) => {
              const isCurrent = i === cyclingIndex;
              return (
                <div
                  key={i}
                  className={`p-2 rounded-lg flex items-center justify-between transition-all ${
                    isCurrent
                      ? f.status === "CRITICAL"
                        ? "bg-[#FF4567]/20 border border-[#FF4567]/40 text-[#FF4567]"
                        : "bg-[#00D5FF]/15 border border-[#00D5FF]/30 text-[#00D5FF]"
                      : "opacity-40 text-[#8795A9]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#5B6B80]">{f.time}</span>
                    <span>{f.ip}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>{f.score.toFixed(3)}</span>
                    <span className="font-bold uppercase text-[9px] px-1.5 py-0.5 rounded bg-black/40">
                      {f.alert || f.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Trust Strip Footer */}
      <footer className="h-16 px-8 border-t border-[#94AFD7]/10 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-[#5B6B80] gap-2 z-10 bg-[#05080F]/70">
        <div>SENTINEL AI · Intelligent Network Anomaly Detection</div>
        <div className="flex items-center gap-4">
          <span>Zero Label Leakage</span>
          <span>·</span>
          <span>Strict Determinism</span>
          <span>·</span>
          <span>CIC-IDS2017 Tested</span>
        </div>
      </footer>
    </div>
  );
};
