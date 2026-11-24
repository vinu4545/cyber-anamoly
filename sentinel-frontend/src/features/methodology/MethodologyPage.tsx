import React, { useState } from "react";
import {
  Workflow,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  Layers,
  Database,
  Sliders,
  Cpu,
  BarChart3,
  ShieldAlert,
  FileText,
} from "lucide-react";
import { useSentinelStore, PageId } from "../../store/useSentinelStore";

interface Stage {
  num: number;
  title: string;
  subtitle: string;
  linkPage?: PageId;
  linkText?: string;
  details: string[];
}

export const MethodologyPage: React.FC = () => {
  const { setActivePage } = useSentinelStore();
  const [expandedStage, setExpandedStage] = useState<number | null>(1);

  const STAGES: Stage[] = [
    {
      num: 1,
      title: "Problem Identification",
      subtitle: "Enterprise telemetry volume explosion & failure of signature IDS",
      linkPage: "overview",
      linkText: "View Overview Dashboard",
      details: [
        "Network flow logs exceed millions of records hourly in enterprise SOCs.",
        "Zero-day attacks and brute-force mutations bypass static signature-matching rules.",
        "Need for an unsupervised baseline that flags atypical flow structures without prior attack signatures.",
      ],
    },
    {
      num: 2,
      title: "Literature & Algorithm Review",
      subtitle: "Unsupervised anomaly detection across network flow vectors",
      linkPage: "model-lab",
      linkText: "Open Model Laboratory",
      details: [
        "Surveyed proximity-based (k-NN), density-based (DBSCAN), boundary-based (One-Class SVM), and isolation-based models.",
        "Identified Liu, Ting & Zhou (2008) Isolation Forest as the optimal high-dimensional ensembling algorithm.",
      ],
    },
    {
      num: 3,
      title: "Dataset Collection & Ground Truth",
      subtitle: "Benchmark CIC-IDS2017 Tuesday flow captures",
      linkPage: "dataset-explorer",
      linkText: "Explore Dataset Columns",
      details: [
        "Selected Canadian Institute for Cybersecurity CIC-IDS2017 capture.",
        "Tuesday traffic includes 432k BENIGN flows, 7.9k FTP-Patator, and 5.8k SSH-Patator brute-force records.",
      ],
    },
    {
      num: 4,
      title: "Preprocessing & Data Cleansing",
      subtitle: "Handling infinite flow rates, null imputation, and zero label leakage",
      linkPage: "analyzer",
      linkText: "View Preprocessing Stepper",
      details: [
        "Target Label strictly isolated for post-inference evaluation with zero model leakage.",
        "Replaced +/- infinite values resulting from zero-duration division with column medians.",
        "Stripped identifier columns (IPs, Ports, Timestamps) to prevent spatial or chronological shortcut bias.",
      ],
    },
    {
      num: 5,
      title: "Feature Engineering & Scaling",
      subtitle: "Signed log1p transformation and StandardScaler normalization",
      linkPage: "dataset-explorer",
      linkText: "View Feature Heatmap",
      details: [
        "Applied signed log1p: sign(x) * log1p(|x|) to compress massive flow volume distributions.",
        "Fitted StandardScaler strictly on normal baseline traffic.",
      ],
    },
    {
      num: 6,
      title: "Algorithm Selection & Complexity",
      subtitle: "Linear O(n log n) scaling of tree isolation vs O(n³) SVM kernels",
      linkPage: "model-lab",
      linkText: "Compare Algorithms",
      details: [
        "Isolation Forest chosen for linear runtime complexity, sub-sampling efficiency, and immunity to distance degradation in 61 dimensions.",
      ],
    },
    {
      num: 7,
      title: "Model Development & Training",
      subtitle: "Normal-only baseline training with 100 random partition trees",
      linkPage: "analyzer",
      linkText: "Run Model Detection",
      details: [
        "Ensemble of 100 isolation trees trained on normal flows with random sub-sampling.",
        "Calibrated scoring mapping raw path lengths to normalized [0.0, 1.0] severity scores.",
      ],
    },
    {
      num: 8,
      title: "Testing & Validation",
      subtitle: "Rigorous unit testing for zero leakage, schema invariants, and determinism",
      details: [
        "Automated pytest suite verifying Label exclusion, handling of NaN/inf, and deterministic outputs with fixed random_state.",
      ],
    },
    {
      num: 9,
      title: "Quantitative Model Evaluation",
      subtitle: "Precision, Recall, F1, PR-AUC, and ROC-AUC on held-out test split",
      linkPage: "analytics",
      linkText: "Inspect Security Analytics",
      details: [
        "Computed 89.1% detection recall on FTP-Patator brute force flows.",
        "Area under the Precision-Recall curve achieved 0.4740 on heavily imbalanced 97:3 test data.",
      ],
    },
    {
      num: 10,
      title: "Deployment & SOC Investigation Workflow",
      subtitle: "Interactive triage Kanban, contextual explainability, and PDF reporting",
      linkPage: "investigations",
      linkText: "Open Investigations Kanban",
      details: [
        "FastAPI backend with SQLite persistence for investigation lifecycle tracking.",
        "Contextual robust z-score deviation indicators with explicit disclaimers.",
        "Executive PDF threat reports generated via ReportLab.",
      ],
    },
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl glass-panel border border-[#94AFD7]/15">
        <div>
          <div className="flex items-center gap-2">
            <Workflow size={18} className="text-[#00D5FF]" />
            <h1 className="font-display font-bold text-xl text-[#F4F7FC]">
              10-Stage Research & Engineering Methodology
            </h1>
          </div>
          <p className="text-xs text-[#8795A9] mt-0.5">
            Systematic end-to-end engineering pipeline from mathematical formulation to enterprise SOC deployment
          </p>
        </div>
      </div>

      {/* 10 Stages Stepper Accordion */}
      <div className="space-y-3">
        {STAGES.map((stage) => {
          const isExpanded = expandedStage === stage.num;

          return (
            <div
              key={stage.num}
              className={`rounded-2xl border transition-all overflow-hidden ${
                isExpanded
                  ? "bg-[#0D1420] border-[#00D5FF]/40 shadow-xl"
                  : "glass-panel border-[#94AFD7]/15 hover:border-[#94AFD7]/30"
              }`}
            >
              {/* Stage Header */}
              <button
                onClick={() => setExpandedStage(isExpanded ? null : stage.num)}
                className="w-full p-4 flex items-center justify-between text-left transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono text-xs font-bold ${
                      isExpanded
                        ? "bg-[#00D5FF] text-[#05080F] shadow-[0_0_12px_#00D5FF]"
                        : "bg-[#111B29] text-[#00D5FF] border border-[#00D5FF]/30"
                    }`}
                  >
                    {stage.num}
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-sm text-[#F4F7FC]">
                      {stage.title}
                    </h3>
                    <p className="text-xs text-[#8795A9] mt-0.5">
                      {stage.subtitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-[#19D995] hidden sm:inline">
                    VERIFIED
                  </span>
                  {isExpanded ? <ChevronDown size={18} className="text-[#00D5FF]" /> : <ChevronRight size={18} className="text-[#8795A9]" />}
                </div>
              </button>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="px-6 pb-6 pt-2 border-t border-[#94AFD7]/10 space-y-4 text-xs font-mono">
                  <div className="space-y-2 text-[#8795A9] pt-2">
                    {stage.details.map((d, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle2 size={14} className="text-[#19D995] shrink-0 mt-0.5" />
                        <span className="text-[#F4F7FC]">{d}</span>
                      </div>
                    ))}
                  </div>

                  {stage.linkPage && (
                    <div className="pt-2">
                      <button
                        onClick={() => setActivePage(stage.linkPage!)}
                        className="flex items-center gap-1.5 text-xs font-bold text-[#00D5FF] hover:underline"
                      >
                        <span>{stage.linkText || "View Console Module"}</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
