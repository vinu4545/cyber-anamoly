import React from "react";
import {
  Shield,
  Info,
  Cpu,
  Layers,
  Code2,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Terminal,
  ExternalLink,
} from "lucide-react";

export const AboutPage: React.FC = () => {
  const stack = [
    { category: "Frontend Framework", name: "React 18 / 19 + TypeScript (Strict)" },
    { category: "Build Tool", name: "Vite 8" },
    { category: "Styling & Theme", name: "Tailwind CSS v4 (Nocturne SOC Palette)" },
    { category: "Motion & Animations", name: "Framer Motion (Hardware accelerated)" },
    { category: "Charts & Visualizations", name: "Recharts + Custom SVG Force Topology" },
    { category: "Backend Service", name: "FastAPI 0.165 + Uvicorn + Pydantic v2" },
    { category: "Machine Learning", name: "scikit-learn (IsolationForest, RobustScaler)" },
    { category: "Database", name: "SQLite (Relational Sessions & Investigations)" },
    { category: "PDF Generation", name: "ReportLab 5.1 (Enterprise Branded Reports)" },
  ];

  const limitations = [
    {
      title: "CIC-IDS2017 Schema Absence of IP/Timestamps in Raw ML Sets",
      desc: "Standard MachineLearningCSV files from CIC-IDS2017 exclude IP addresses and timestamps. When processing unaugmented files, the platform gracefully derives sequential indices and clearly denotes network topology as demo-only.",
    },
    {
      title: "Contextual Deviations are Not Isolation Paths",
      desc: "Feature deviations represent robust z-scores against normal baseline traffic medians and do not reconstruct the exact random hyper-plane decision path of the Isolation Forest ensemble.",
    },
    {
      title: "Heavy Offline Benchmarking for DBSCAN / SVM",
      desc: "One-Class SVM and DBSCAN have O(n²) to O(n³) scaling complexity. To ensure responsive user experience, comparison metrics reflect controlled subsampling on certified test splits.",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Brand Hero */}
      <div className="p-8 rounded-2xl glass-panel border border-[#00D5FF]/30 space-y-3 relative overflow-hidden">
        <div className="flex items-center gap-2">
          <Shield className="text-[#00D5FF]" size={22} />
          <span className="text-xs font-mono font-bold text-[#00D5FF] uppercase tracking-widest">
            ABOUT SENTINEL AI
          </span>
        </div>
        <h1 className="font-display font-bold text-2xl text-[#F4F7FC]">
          See Beyond the Traffic. Detect Before the Threat.
        </h1>
        <p className="text-xs text-[#8795A9] leading-relaxed max-w-2xl">
          SENTINEL AI is an analyst-grade network anomaly detection and threat investigation platform built for SOC analysts, network administrators, and ML security researchers. Powered by unsupervised Isolation Forest ensembling, it exposes abnormal flow dynamics without relying on brittle attack signatures.
        </p>
      </div>

      {/* Technology Stack Grid */}
      <div className="p-6 rounded-2xl glass-panel border border-[#94AFD7]/15 space-y-4">
        <h2 className="font-display font-bold text-base text-[#F4F7FC]">
          Production Architecture & Technology Stack
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
          {stack.map((item, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-[#080B12] border border-[#94AFD7]/10 space-y-0.5">
              <span className="text-[10px] text-[#5B6B80] block uppercase">{item.category}</span>
              <span className="text-xs font-semibold text-[#00D5FF] block">{item.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Honest Known Limitations */}
      <div className="p-6 rounded-2xl glass-panel border border-[#FFB547]/30 space-y-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="text-[#FFB547]" size={18} />
          <h2 className="font-display font-bold text-base text-[#F4F7FC]">
            Honest Limitations & Design Realities
          </h2>
        </div>
        <div className="space-y-3">
          {limitations.map((lim, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-[#080B12] border border-[#94AFD7]/10 space-y-1">
              <span className="font-mono text-xs font-bold text-[#FFB547] block">
                {lim.title}
              </span>
              <p className="text-xs text-[#8795A9] leading-relaxed">
                {lim.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Credits & Version */}
      <div className="p-6 rounded-2xl glass-panel border border-[#94AFD7]/15 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-[#8795A9] gap-4">
        <div>
          <span>SENTINEL AI Platform · Version 2.0.0 (Production Build)</span>
          <p className="text-[11px] text-[#5B6B80]">
            Autonomous Network Threat Investigation & Isolation Forest Engine
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded bg-[#111B29] text-[#19D995] border border-[#19D995]/30">
            SYSTEM OPERATIONAL
          </span>
        </div>
      </div>
    </div>
  );
};
