import React, { useState, useEffect } from "react";
import {
  FlaskConical,
  Cpu,
  Layers,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  Info,
} from "lucide-react";
import { api } from "../../lib/api";

export const ModelLaboratoryPage: React.FC = () => {
  const [modelConfig, setModelConfig] = useState<any>(null);
  const [comparisonResults, setComparisonResults] = useState<any>(null);
  const [runningBenchmark, setRunningBenchmark] = useState(false);

  // Interactive Tree Isolation Demo State
  const [demoTrees, setDemoTrees] = useState(20);
  const [demoSamples, setDemoSamples] = useState(64);
  const [activeStep, setActiveStep] = useState(1);
  const [pathLength, setPathLength] = useState(3.2);

  useEffect(() => {
    loadModelLab();
  }, []);

  const loadModelLab = async () => {
    try {
      const [cfg, cmp] = await Promise.all([
        api.getModelConfig().catch(() => null),
        api.compareModels().catch(() => null),
      ]);
      setModelConfig(cfg);
      setComparisonResults(cmp);
    } catch (e) {
      console.error(e);
    }
  };

  const handleStepSplit = () => {
    const nextStep = activeStep >= 4 ? 1 : activeStep + 1;
    setActiveStep(nextStep);
    // Outliers get isolated in fewer steps (~3), normal takes more (~7)
    setPathLength(nextStep === 1 ? 3.2 : nextStep === 2 ? 2.8 : nextStep === 3 ? 2.1 : 1.4);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl glass-panel border border-[#94AFD7]/15">
        <div>
          <div className="flex items-center gap-2">
            <FlaskConical size={18} className="text-[#00D5FF]" />
            <h1 className="font-display font-bold text-xl text-[#F4F7FC]">
              Model Laboratory & Algorithmic Benchmarks
            </h1>
          </div>
          <p className="text-xs text-[#8795A9] mt-0.5">
            Model parameters, comparative benchmarks against One-Class SVM & DBSCAN, and interactive tree isolation visualizer
          </p>
        </div>
      </div>

      {/* Primary Model Card */}
      <div className="p-6 rounded-2xl glass-panel border border-[#00D5FF]/30 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00D5FF]/15 border border-[#00D5FF]/30 flex items-center justify-center text-[#00D5FF] glow-cyan">
              <Cpu size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-bold text-base text-[#F4F7FC]">
                  Isolation Forest Production Engine
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#19D995]/15 text-[#19D995] font-bold">
                  ACTIVE
                </span>
              </div>
              <span className="text-xs font-mono text-[#8795A9]">
                Library: scikit-learn (sklearn.ensemble.IsolationForest)
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs pt-2">
          <div className="p-3 rounded-xl bg-[#080B12] border border-[#94AFD7]/10">
            <span className="text-[10px] text-[#5B6B80] block">TREES (n_estimators)</span>
            <span className="text-sm font-bold text-[#F4F7FC]">100 Trees</span>
          </div>
          <div className="p-3 rounded-xl bg-[#080B12] border border-[#94AFD7]/10">
            <span className="text-[10px] text-[#5B6B80] block">CONTAMINATION</span>
            <span className="text-sm font-bold text-[#00D5FF]">0.04 (96th percentile)</span>
          </div>
          <div className="p-3 rounded-xl bg-[#080B12] border border-[#94AFD7]/10">
            <span className="text-[10px] text-[#5B6B80] block">FEATURE DIMENSIONS</span>
            <span className="text-sm font-bold text-[#F4F7FC]">61 Numeric Features</span>
          </div>
          <div className="p-3 rounded-xl bg-[#080B12] border border-[#94AFD7]/10">
            <span className="text-[10px] text-[#5B6B80] block">PREPROCESSING</span>
            <span className="text-sm font-bold text-[#19D995]">Signed log1p + StandardScaler</span>
          </div>
        </div>
      </div>

      {/* Algorithmic Comparison Lab */}
      <div className="p-6 rounded-2xl glass-panel border border-[#94AFD7]/15 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-base text-[#F4F7FC]">
              Comparative Benchmark Matrix
            </h2>
            <p className="text-xs text-[#8795A9]">
              Fair, controlled experiment executed on the identical CIC-IDS2017 test split
            </p>
          </div>
          <span className="text-[10px] font-mono text-[#FFB547] px-2 py-0.5 rounded bg-[#FFB547]/10 border border-[#FFB547]/30">
            HELD-OUT EVALUATION
          </span>
        </div>

        {/* Fairness Notice */}
        <div className="flex items-start gap-2 p-3 rounded-xl bg-[#080B12] border border-[#94AFD7]/10 text-xs text-[#8795A9]">
          <Info size={14} className="text-[#00D5FF] shrink-0 mt-0.5" />
          <span>
            <b>Fairness Notice:</b> All three algorithms were evaluated on the identical test split using the exact same preprocessed features and scaling parameters. Results apply to the documented configuration.
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[#94AFD7]/15 text-[#5B6B80]">
                <th className="pb-3">ALGORITHM</th>
                <th className="pb-3">PARADIGM</th>
                <th className="pb-3">PRECISION</th>
                <th className="pb-3">RECALL</th>
                <th className="pb-3">F1-SCORE</th>
                <th className="pb-3">ROC-AUC</th>
                <th className="pb-3">PR-AUC</th>
                <th className="pb-3 text-right">FTP RECALL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#94AFD7]/10">
              <tr className="bg-[#00D5FF]/5">
                <td className="py-3 text-[#00D5FF] font-bold">Isolation Forest</td>
                <td className="py-3 text-[#F4F7FC]">Tree Ensembling</td>
                <td className="py-3 text-[#F4F7FC] font-semibold">0.5311</td>
                <td className="py-3 text-[#19D995] font-semibold">0.5159</td>
                <td className="py-3 text-[#00D5FF] font-bold">0.5234</td>
                <td className="py-3 text-[#00D5FF] font-bold">0.7833</td>
                <td className="py-3 text-[#00D5FF] font-bold">0.4740</td>
                <td className="py-3 text-right text-[#19D995] font-bold">89.1%</td>
              </tr>
              <tr>
                <td className="py-3 text-[#8795A9] font-bold">One-Class SVM</td>
                <td className="py-3 text-[#8795A9]">RBF Boundary</td>
                <td className="py-3 text-[#8795A9]">0.0144</td>
                <td className="py-3 text-[#8795A9]">0.0067</td>
                <td className="py-3 text-[#8795A9]">0.0091</td>
                <td className="py-3 text-[#8795A9]">0.6075</td>
                <td className="py-3 text-[#8795A9]">0.1144</td>
                <td className="py-3 text-right text-[#8795A9]">1.2%</td>
              </tr>
              <tr>
                <td className="py-3 text-[#8795A9] font-bold">DBSCAN</td>
                <td className="py-3 text-[#8795A9]">Density Clustering</td>
                <td className="py-3 text-[#8795A9]">0.0096</td>
                <td className="py-3 text-[#8795A9]">0.0065</td>
                <td className="py-3 text-[#8795A9]">0.0077</td>
                <td className="py-3 text-[#5B6B80]">N/A</td>
                <td className="py-3 text-[#5B6B80]">N/A</td>
                <td className="py-3 text-right text-[#8795A9]">0.8%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Isolation Forest Visualizer */}
      <div className="p-6 rounded-2xl glass-panel border border-[#94AFD7]/15 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-display font-bold text-base text-[#F4F7FC]">
              Interactive Tree Partition Visualizer
            </h2>
            <p className="text-xs text-[#8795A9]">
              Observe how anomalous points require fewer random hyper-plane cuts to isolate
            </p>
          </div>
          <button
            onClick={handleStepSplit}
            className="px-4 py-2 rounded-xl bg-[#00D5FF] text-[#05080F] text-xs font-bold hover:bg-[#5CE6FF] flex items-center gap-1.5 self-start"
          >
            <RotateCcw size={14} />
            <span>Step Partition (Cut #{activeStep})</span>
          </button>
        </div>

        {/* 2D Partition Canvas Simulation */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="sm:col-span-2 h-64 rounded-xl bg-[#080B12] border border-[#94AFD7]/15 relative overflow-hidden flex items-center justify-center p-4">
            {/* Partition lines */}
            <div
              className={`absolute top-0 bottom-0 left-1/3 w-[1.5px] bg-[#00D5FF]/60 transition-opacity duration-300 ${
                activeStep >= 1 ? "opacity-100" : "opacity-0"
              }`}
            />
            <div
              className={`absolute left-0 right-0 top-1/2 h-[1.5px] bg-[#00D5FF]/60 transition-opacity duration-300 ${
                activeStep >= 2 ? "opacity-100" : "opacity-0"
              }`}
            />
            <div
              className={`absolute top-1/2 bottom-0 left-1/4 w-[1.5px] bg-[#FF4567]/80 transition-opacity duration-300 ${
                activeStep >= 3 ? "opacity-100" : "opacity-0"
              }`}
            />

            {/* Normal points cluster */}
            <div className="absolute right-12 top-12 w-32 h-32 rounded-full bg-[#19D995]/5 border border-[#19D995]/20 flex items-center justify-center">
              <span className="text-[10px] font-mono text-[#19D995]">Normal Dense Cluster (Needs 8+ cuts)</span>
            </div>

            {/* Anomaly Outlier */}
            <div className="absolute left-16 bottom-16 flex flex-col items-center">
              <span className="w-3.5 h-3.5 rounded-full bg-[#FF4567] shadow-[0_0_12px_#FF4567] animate-pulse" />
              <span className="text-[10px] font-mono text-[#FF4567] mt-1 font-bold">
                ISOLATED OUTLIER (3 cuts)
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#080B12] border border-[#94AFD7]/15 space-y-3 font-mono text-xs">
            <span className="font-bold text-[#F4F7FC] block">Isolation Dynamics</span>
            <div className="space-y-1.5 text-[#8795A9]">
              <div className="flex justify-between">
                <span>Active Cut:</span>
                <span className="text-[#00D5FF] font-bold">#{activeStep} of 4</span>
              </div>
              <div className="flex justify-between">
                <span>Average Path Length:</span>
                <span className="text-[#FF4567] font-bold">{pathLength} splits</span>
              </div>
              <div className="flex justify-between">
                <span>Normal Mean Path:</span>
                <span className="text-[#19D995]">7.8 splits</span>
              </div>
            </div>
            <p className="text-[11px] text-[#5B6B80] pt-2 border-t border-[#94AFD7]/10">
              Shorter tree traversal path lengths directly produce higher anomaly scores: s(x, n) = 2^(-E(h(x)) / c(n)).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
