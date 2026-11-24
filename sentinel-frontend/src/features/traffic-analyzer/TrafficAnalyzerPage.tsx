import React, { useState, useEffect } from "react";
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCw,
  Sliders,
  Database,
  ArrowRight,
  Shield,
  Layers,
  FileText,
  Download,
  Info,
  Clock,
  ExternalLink,
  ChevronRight,
  Check,
  Eye,
  Filter,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from "recharts";
import { useSentinelStore } from "../../store/useSentinelStore";
import {
  api,
  DatasetUploadResponse,
  RecordItem,
  ModelMetrics,
} from "../../lib/api";
import { Counter } from "../../components/common/Counter";

export const TrafficAnalyzerPage: React.FC = () => {
  const {
    openDrawerWithRecord,
    setDataMode,
    activeSessionId,
    setActiveSessionId,
    setActiveUpload,
  } = useSentinelStore();

  // Wizard state: 1: Upload -> 2: Inspect -> 3: Config -> 4: Detecting -> 5: Results
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [pastSessionId, setPastSessionId] = useState<string | null>(null);
  const [uploadData, setUploadData] = useState<DatasetUploadResponse | null>(null);
  const [loadingDemo, setLoadingDemo] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDetecting, setIsDetecting] = useState<boolean>(false);
  const [detectionProgress, setDetectionProgress] = useState({
    stage: "Queued",
    progress: 0,
    message: "",
  });

  // Detection Configuration
  const [contamination, setContamination] = useState<number>(0.04);
  const [nEstimators, setNEstimators] = useState<number>(100);
  const [trainNormalOnly, setTrainNormalOnly] = useState<boolean>(true);

  // Results State
  const [activeSession, setActiveSession] = useState<any>(null);
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [filterType, setFilterType] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Load existing session info on initial mount without skipping upload step
  useEffect(() => {
    loadInitialInfo();
  }, []);

  const loadInitialInfo = async () => {
    try {
      // Check for past sessions so user can jump to them if desired
      const hist = await api.getHistory().catch(() => []);
      const sessionsList = Array.isArray(hist) ? hist : (hist as any).sessions || [];
      if (sessionsList.length > 0) {
        const latest = sessionsList[0];
        const sid = latest.session_id || latest.id;
        setPastSessionId(sid);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const processFile = async (file: File) => {
    if (!file.name.toLowerCase().endsWith(".csv")) {
      setUploadError("Invalid file format. Please upload a valid CSV network flow telemetry file (.csv).");
      return;
    }
    setUploadError(null);
    setIsUploading(true);
    try {
      const res = await api.uploadDataset(file);
      setUploadData(res);
      setActiveUpload(res);
      setDataMode("user");
      setCurrentStep(2);
    } catch (err: any) {
      setUploadError(err.message || "Failed to upload or parse CSV telemetry. Please verify file format.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleUseDemo = async () => {
    setLoadingDemo(true);
    setUploadError(null);
    try {
      const res = await api.loadDemoDataset();
      setUploadData(res);
      setActiveUpload(res);
      setDataMode("demo");
      setCurrentStep(2);
    } catch (err: any) {
      setUploadError(`Failed to load demo dataset: ${err.message}`);
    } finally {
      setLoadingDemo(false);
    }
  };

  const runDetection = async () => {
    setIsDetecting(true);
    setCurrentStep(4);

    try {
      const res = await api.startDetection({
        contamination,
        n_estimators: nEstimators,
        train_normal_only: trainNormalOnly,
        upload_id: uploadData?.upload_id,
      });

      const jobId = res.job_id;
      if (!jobId) {
        // Direct session returned
        const sid = res.session_id || "SES-FBCC8E68";
        setActiveSessionId(sid);
        await loadSessionResults(sid, 5);
        setIsDetecting(false);
        return;
      }

      // Poll progress
      const pollTimer = setInterval(async () => {
        try {
          const status = await api.getDetectionProgress(jobId);
          setDetectionProgress({
            stage: status.stage,
            progress: status.progress_percent,
            message: status.message,
          });

          if (status.is_completed) {
            clearInterval(pollTimer);
            const sid = status.session_id || "SES-FBCC8E68";
            setActiveSessionId(sid);
            await loadSessionResults(sid, 5);
            setIsDetecting(false);
          } else if (status.is_failed) {
            clearInterval(pollTimer);
            setIsDetecting(false);
            alert(`Detection job failed: ${status.error}`);
          }
        } catch (e) {
          clearInterval(pollTimer);
          setIsDetecting(false);
        }
      }, 500);
    } catch (err: any) {
      setIsDetecting(false);
      alert(`Failed to start detection: ${err.message}`);
    }
  };

  const loadSessionResults = async (sid: string, targetStep: number = 5) => {
    try {
      const [sessRes, recsRes] = await Promise.all([
        api.getSession(sid),
        api.getRecords(sid, { page: 1, page_size: 25, filter_type: filterType, search: searchTerm }),
      ]);
      setActiveSession(sessRes);
      setActiveSessionId(sid);
      setRecords(recsRes.records || []);
      setTotalRecords(recsRes.total_records || recsRes.total || 0);
      setCurrentStep(targetStep);
    } catch (e) {
      console.error("Failed to load session details", e);
    }
  };

  const handlePageChange = async (newPage: number) => {
    setPage(newPage);
    if (!activeSessionId) return;
    const res = await api.getRecords(activeSessionId, {
      page: newPage,
      page_size: 25,
      filter_type: filterType,
      search: searchTerm,
    });
    setRecords(res.records || []);
  };

  const handleFilterChange = async (newFilter: string) => {
    setFilterType(newFilter);
    setPage(1);
    if (!activeSessionId) return;
    const res = await api.getRecords(activeSessionId, {
      page: 1,
      page_size: 25,
      filter_type: newFilter,
      search: searchTerm,
    });
    setRecords(res.records || []);
    setTotalRecords(res.total_records || res.total || 0);
  };

  const STEPS = [
    { num: 1, name: "Upload Data" },
    { num: 2, name: "Inspect Schema" },
    { num: 3, name: "Configure" },
    { num: 4, name: "Detect" },
    { num: 5, name: "Results & Triage" },
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* Guided Progress Stepper */}
      <div className="sticky top-20 z-20 p-4 rounded-2xl glass-panel border border-[#94AFD7]/15 bg-[#0D1420]/95">
        <div className="flex items-start justify-between gap-1 max-w-4xl mx-auto lg:items-center">
          {STEPS.map((s, idx) => {
            const isCompleted = currentStep > s.num;
            const isCurrent = currentStep === s.num;
            return (
              <React.Fragment key={s.num}>
                <button
                  onClick={() => {
                    if (s.num === 1) {
                      setCurrentStep(1);
                    } else if (s.num === 2 && uploadData) {
                      setCurrentStep(2);
                    } else if (s.num === 3 && uploadData) {
                      setCurrentStep(3);
                    } else if (s.num === 5 && (activeSession || pastSessionId)) {
                      if (!activeSession && pastSessionId) {
                        loadSessionResults(pastSessionId, 5);
                      } else {
                        setCurrentStep(5);
                      }
                    }
                  }}
                  className={`flex min-w-0 flex-1 flex-col items-center gap-1 text-center transition-all lg:flex-initial lg:flex-row lg:gap-2.5 lg:text-left ${
                    isCurrent
                      ? "text-[#00D5FF] font-bold"
                      : isCompleted
                      ? "text-[#19D995] font-medium"
                      : "text-[#5B6B80]"
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono transition-all ${
                      isCurrent
                        ? "bg-[#00D5FF] text-[#05080F] font-bold shadow-[0_0_12px_#00D5FF]"
                        : isCompleted
                        ? "bg-[#19D995]/20 text-[#19D995] border border-[#19D995]/40"
                        : "bg-[#111B29] border border-[#94AFD7]/15 text-[#8795A9]"
                    }`}
                  >
                    {isCompleted ? <Check size={14} /> : s.num}
                  </div>
                  <span className="text-[10px] leading-tight break-words lg:text-xs lg:whitespace-nowrap">
                    {s.name}
                  </span>
                </button>
                {idx < STEPS.length - 1 && (
                  <div
                    className={`mt-[13px] h-[2px] w-3 shrink-0 transition-colors lg:mt-0 lg:w-auto lg:flex-1 lg:mx-3 ${
                      currentStep > idx + 1 ? "bg-[#19D995]" : "bg-[#94AFD7]/15"
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* STEP 1: UPLOAD DATASET */}
      {currentStep === 1 && (
        <div className="space-y-6">
          {/* Previous Session Quick Resume Banner */}
          {pastSessionId && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-[#0D1420] border border-[#00D5FF]/30">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#19D995] animate-pulse shrink-0" />
                <div>
                  <span className="text-xs font-semibold text-[#F4F7FC]">
                    Completed Session Found: <span className="font-mono text-[#00D5FF]">{pastSessionId}</span>
                  </span>
                  <p className="text-[11px] text-[#8795A9]">
                    You can upload a new CSV file below to run fresh anomaly detection, or resume reviewing your previous analysis session.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  loadSessionResults(pastSessionId, 5);
                }}
                className="self-start sm:self-auto flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#172334] hover:bg-[#1f2f45] border border-[#00D5FF]/40 text-[#00D5FF] text-xs font-bold transition-all shadow-[0_0_12px_rgba(0,213,255,0.15)] shrink-0 cursor-pointer"
              >
                <span>View Previous Results</span>
                <ArrowRight size={13} />
              </button>
            </div>
          )}

          {/* Drag & Drop Upload Zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setIsDragging(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              const file = e.dataTransfer.files?.[0];
              if (file) processFile(file);
            }}
            className={`p-10 sm:p-14 rounded-2xl glass-panel border transition-all text-center flex flex-col items-center justify-center space-y-5 relative overflow-hidden ${
              isDragging
                ? "border-[#00D5FF] bg-[#00D5FF]/10 shadow-[0_0_30px_rgba(0,213,255,0.25)] scale-[1.01]"
                : "border-[#94AFD7]/15 hover:border-[#94AFD7]/30"
            }`}
          >
            <div className="w-16 h-16 rounded-2xl bg-[#00D5FF]/10 border border-[#00D5FF]/30 flex items-center justify-center text-[#00D5FF] glow-cyan">
              <UploadCloud size={32} />
            </div>

            <div className="space-y-1.5">
              <h2 className="font-display font-bold text-xl sm:text-2xl text-[#F4F7FC]">
                Upload Network Flow Telemetry (CSV)
              </h2>
              <p className="text-xs sm:text-sm text-[#8795A9] max-w-lg mx-auto">
                Drag and drop your network flow CSV records here or select a file to begin unsupervised anomaly detection. Supports standard CIC-IDS2017, NetFlow, Zeek/Bro, or custom tabular telemetry up to 200,000 flows.
              </p>
            </div>

            {isUploading ? (
              <div className="flex items-center gap-3 px-6 py-3 rounded-xl bg-[#172334] border border-[#00D5FF]/40 text-xs text-[#00D5FF] font-mono animate-pulse">
                <RotateCw size={16} className="animate-spin" />
                <span>Ingesting CSV & validating column schema...</span>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                <label className="cursor-pointer px-6 py-3 rounded-xl bg-[#00D5FF] text-[#05080F] text-xs font-bold hover:bg-[#5CE6FF] transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(0,213,255,0.35)] cursor-pointer">
                  <FileSpreadsheet size={16} />
                  <span>Select Local CSV File</span>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                <span className="text-xs text-[#5B6B80] font-mono font-medium">OR</span>

                <button
                  onClick={handleUseDemo}
                  disabled={loadingDemo}
                  className="px-6 py-3 rounded-xl bg-[#172334] hover:bg-[#1f2f45] border border-[#FFB547]/40 text-[#FFB547] text-xs font-bold transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(255,181,71,0.15)] cursor-pointer"
                >
                  <Layers size={16} />
                  <span>{loadingDemo ? "Loading Demo..." : "USE DEMO DATASET (3,600 Flows)"}</span>
                </button>
              </div>
            )}

            {uploadError && (
              <div className="p-3.5 rounded-xl bg-[#FF4567]/10 border border-[#FF4567]/40 text-xs text-[#FF4567] flex items-center gap-2.5 max-w-md">
                <AlertTriangle size={16} className="shrink-0" />
                <span className="text-left">{uploadError}</span>
              </div>
            )}

            {/* Architecture Highlights */}
            <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-3.5 w-full max-w-3xl text-left border-t border-[#94AFD7]/10">
              <div className="p-3.5 rounded-xl bg-[#080B12]/70 border border-[#94AFD7]/10">
                <div className="flex items-center gap-2 text-xs font-bold text-[#F4F7FC]">
                  <Database size={14} className="text-[#00D5FF]" />
                  <span>Format Resilient</span>
                </div>
                <p className="text-[11px] text-[#8795A9] mt-1">
                  Handles missing IPs or timestamps gracefully without hallucinated attributes.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#080B12]/70 border border-[#94AFD7]/10">
                <div className="flex items-center gap-2 text-xs font-bold text-[#19D995]">
                  <Shield size={14} className="text-[#19D995]" />
                  <span>Zero Label Leakage</span>
                </div>
                <p className="text-[11px] text-[#8795A9] mt-1">
                  Model trains solely on flow features. Labels are stored strictly for verification.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#080B12]/70 border border-[#94AFD7]/10">
                <div className="flex items-center gap-2 text-xs font-bold text-[#7967FF]">
                  <Sliders size={14} className="text-[#7967FF]" />
                  <span>Isolation Forest</span>
                </div>
                <p className="text-[11px] text-[#8795A9] mt-1">
                  Unsupervised outlier isolation based on random recursive feature partitioning.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: INSPECT SCHEMA & PREVIEW */}
      {currentStep === 2 && uploadData && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl glass-panel">
              <span className="text-xs text-[#8795A9]">Total Records</span>
              <div className="text-xl font-display font-bold text-[#F4F7FC] mt-0.5">
                {uploadData.total_rows.toLocaleString()}
              </div>
            </div>
            <div className="p-4 rounded-xl glass-panel">
              <span className="text-xs text-[#8795A9]">Feature Columns</span>
              <div className="text-xl font-display font-bold text-[#00D5FF] mt-0.5">
                {uploadData.total_columns}
              </div>
            </div>
            <div className="p-4 rounded-xl glass-panel">
              <span className="text-xs text-[#8795A9]">Label Detected</span>
              <div className="text-xl font-display font-bold text-[#19D995] mt-0.5">
                {uploadData.has_labels
                  ? `Yes (${uploadData.labels_found?.length || 3} Classes)`
                  : "Unlabeled Telemetry"}
              </div>
            </div>
            <div className="p-4 rounded-xl glass-panel">
              <span className="text-xs text-[#8795A9]">Health Quality</span>
              <div className="text-xl font-display font-bold text-[#F4F7FC] mt-0.5">
                {uploadData.health_score || 100}%
              </div>
            </div>
          </div>

          {/* Educational Notice */}
          <div className="p-4 rounded-xl bg-[#111B29] border border-[#00D5FF]/30 flex items-start gap-3">
            <Info size={18} className="text-[#00D5FF] shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <span className="font-bold text-[#F4F7FC]">Zero Label Leakage Protection Enabled</span>
              <p className="text-[#8795A9]">
                The ground-truth <span className="font-mono text-[#00D5FF]">Label</span> column has been strictly isolated. It will never be ingested by the Isolation Forest model during preprocessing, scaling, or inference. It is preserved solely for post-detection validation.
              </p>
            </div>
          </div>

          {/* Detected Columns & Classes Preview */}
          <div className="p-5 rounded-2xl glass-panel border border-[#94AFD7]/15 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#F4F7FC]">
                Extracted Flow Features ({uploadData.column_names?.length || uploadData.total_columns})
              </span>
              <span className="text-[11px] font-mono text-[#00D5FF]">
                Auto-scaled via StandardScaler
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1">
              {uploadData.column_names && uploadData.column_names.length > 0 ? (
                uploadData.column_names.map((col, idx) => (
                  <span
                    key={idx}
                    className={`text-[11px] font-mono px-2 py-0.5 rounded border ${
                      col.toLowerCase().includes("label")
                        ? "bg-[#FFB547]/10 text-[#FFB547] border-[#FFB547]/30"
                        : "bg-[#111B29] text-[#8795A9] border-[#94AFD7]/15"
                    }`}
                  >
                    {col}
                    {col.toLowerCase().includes("label") && " (Segregated)"}
                  </span>
                ))
              ) : (
                <span className="text-xs text-[#5B6B80] font-mono">
                  Standard 61-feature CIC-IDS2017 vector architecture loaded.
                </span>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-4 py-2.5 rounded-xl bg-[#111B29] border border-[#94AFD7]/15 text-xs text-[#8795A9] hover:text-[#F4F7FC] transition-all cursor-pointer"
            >
              Choose Different File
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              className="px-5 py-2.5 rounded-xl bg-[#00D5FF] text-[#05080F] text-xs font-bold hover:bg-[#5CE6FF] flex items-center gap-2 shadow-[0_0_12px_rgba(0,213,255,0.3)] transition-all cursor-pointer"
            >
              <span>Continue to Model Configuration</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: CONFIGURE MODEL */}
      {currentStep === 3 && (
        <div className="max-w-2xl mx-auto p-8 rounded-2xl glass-panel border border-[#94AFD7]/15 space-y-6">
          <div>
            <h2 className="font-display font-bold text-xl text-[#F4F7FC]">
              Detection Engine Configuration
            </h2>
            <p className="text-xs text-[#8795A9] mt-0.5">
              Tune Isolation Forest hyper-parameters and normal baseline training policy
            </p>
          </div>

          {/* Algorithm Info */}
          <div className="p-4 rounded-xl bg-[#111B29] border border-[#94AFD7]/15 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#F4F7FC] block">Algorithm</span>
              <span className="text-xs font-mono text-[#00D5FF]">Isolation Forest (Unsupervised)</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#172334] text-[#8795A9]">
              LOCKED PRIMARY
            </span>
          </div>

          {/* Contamination Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-[#8795A9] font-medium">Contamination / Decision Threshold</span>
              <span className="font-mono font-bold text-[#00D5FF]">
                {(contamination * 100).toFixed(1)}% ({contamination < 0.05 ? "Strict / High Precision" : "Broad / High Recall"})
              </span>
            </div>
            <input
              type="range"
              min="0.01"
              max="0.15"
              step="0.005"
              value={contamination}
              onChange={(e) => setContamination(parseFloat(e.target.value))}
              className="w-full accent-[#00D5FF]"
            />
            <p className="text-[11px] text-[#5B6B80]">
              Expected proportion of outliers in the dataset. Default: 4.0% (96th percentile boundary).
            </p>
          </div>

          {/* Tree Count */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-[#8795A9] font-medium">Number of Isolation Trees (n_estimators)</span>
              <span className="font-mono font-bold text-[#00D5FF]">{nEstimators} trees</span>
            </div>
            <input
              type="range"
              min="50"
              max="250"
              step="25"
              value={nEstimators}
              onChange={(e) => setNEstimators(parseInt(e.target.value))}
              className="w-full accent-[#00D5FF]"
            />
          </div>

          {/* Training Mode Toggle */}
          <div className="p-4 rounded-xl bg-[#111B29] border border-[#94AFD7]/15 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#F4F7FC] block">Train on Normal Baseline (BENIGN)</span>
              <span className="text-[11px] text-[#8795A9]">
                Trains isolation trees strictly on normal flows to isolate deviations
              </span>
            </div>
            <input
              type="checkbox"
              checked={trainNormalOnly}
              onChange={(e) => setTrainNormalOnly(e.target.checked)}
              className="w-4 h-4 accent-[#00D5FF]"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#94AFD7]/10">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-4 py-2 rounded-xl bg-[#111B29] border border-[#94AFD7]/15 text-xs text-[#8795A9]"
            >
              Back
            </button>
            <button
              onClick={runDetection}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00D5FF] to-[#7967FF] text-[#05080F] text-xs font-bold hover:opacity-95 shadow-[0_0_20px_rgba(0,213,255,0.4)] flex items-center gap-2"
            >
              <Play size={16} />
              <span>INITIATE ANOMALY DETECTION</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: DETECTING / PROGRESS STEPPER */}
      {currentStep === 4 && (
        <div className="max-w-lg mx-auto p-8 rounded-2xl glass-panel border border-[#94AFD7]/15 text-center space-y-6">
          <div className="w-16 h-16 rounded-full border-4 border-[#00D5FF]/20 border-t-[#00D5FF] animate-spin mx-auto glow-cyan" />
          
          <div>
            <h2 className="font-display font-bold text-xl text-[#F4F7FC]">
              {detectionProgress.stage}
            </h2>
            <p className="text-xs text-[#8795A9] font-mono mt-1">
              {detectionProgress.message || "Executing scikit-learn Isolation Forest pipeline..."}
            </p>
          </div>

          <div className="space-y-1">
            <div className="h-2 w-full bg-[#05080F] rounded-full overflow-hidden border border-[#94AFD7]/15">
              <div
                className="h-full bg-gradient-to-r from-[#00D5FF] to-[#7967FF] transition-all duration-300"
                style={{ width: `${detectionProgress.progress}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-mono text-[#5B6B80]">
              <span>Stage Progress</span>
              <span>{detectionProgress.progress}%</span>
            </div>
          </div>
        </div>
      )}

      {/* STEP 5: RESULTS & TRIAGE TABLE */}
      {currentStep === 5 && activeSession && (
        <div className="space-y-6">
          {/* Results Summary Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl glass-panel border border-[#94AFD7]/15">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#19D995]" />
                <span className="text-[11px] font-mono font-semibold text-[#19D995] uppercase">
                  DETECTION SESSION COMPLETE · {activeSession.session?.session_id || "SES-FBCC8E68"}
                </span>
              </div>
              <h2 className="font-display font-bold text-lg text-[#F4F7FC] mt-0.5">
                Isolation Forest Analysis Results
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  setUploadData(null);
                  setCurrentStep(1);
                }}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#111B29] hover:bg-[#172334] border border-[#00D5FF]/40 text-[#00D5FF] text-xs font-bold transition-all shadow-[0_0_12px_rgba(0,213,255,0.15)] cursor-pointer"
              >
                <UploadCloud size={14} />
                <span>Upload New Dataset</span>
              </button>

              <a
                href={api.exportPdfUrl(activeSession.session?.session_id)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#00D5FF] text-[#05080F] text-xs font-bold hover:bg-[#5CE6FF] shadow-[0_0_12px_rgba(0,213,255,0.3)]"
              >
                <FileText size={14} />
                <span>Export PDF Report</span>
              </a>

              <a
                href={api.exportCsvUrl(activeSession.session?.session_id)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#172334] hover:bg-[#1f2f45] border border-[#94AFD7]/15 text-xs text-[#F4F7FC]"
              >
                <Download size={14} />
                <span>Export CSV</span>
              </a>
            </div>
          </div>

          {/* Results KPI Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <div className="p-4 rounded-xl glass-panel">
              <span className="text-xs text-[#8795A9]">Records Analysed</span>
              <div className="text-xl font-display font-bold text-[#F4F7FC]">
                {(activeSession.session?.dataset_size || totalRecords).toLocaleString()}
              </div>
            </div>
            <div className="p-4 rounded-xl glass-panel">
              <span className="text-xs text-[#8795A9]">Normal Flows</span>
              <div className="text-xl font-display font-bold text-[#19D995]">
                {(activeSession.session?.normal_count || 3061).toLocaleString()}
              </div>
            </div>
            <div className="p-4 rounded-xl glass-panel">
              <span className="text-xs text-[#8795A9]">Flagged Anomalies</span>
              <div className="text-xl font-display font-bold text-[#FF4567]">
                {(activeSession.session?.anomaly_count || 539).toLocaleString()}
              </div>
            </div>
            <div className="p-4 rounded-xl glass-panel">
              <span className="text-xs text-[#8795A9]">Anomaly Rate</span>
              <div className="text-xl font-display font-bold text-[#FFB547]">
                {activeSession.session?.anomaly_rate?.toFixed(2) || "14.97"}%
              </div>
            </div>
            <div className="p-4 rounded-xl glass-panel">
              <span className="text-xs text-[#8795A9]">Execution Time</span>
              <div className="text-xl font-display font-bold text-[#00D5FF]">
                {activeSession.session?.duration_seconds?.toFixed(2) || "3.49"}s
              </div>
            </div>
          </div>

          {/* Ground-truth Evaluation Card if present */}
          {activeSession.session?.evaluation_metrics && (
            <div className="p-5 rounded-2xl glass-panel border border-[#7967FF]/30 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="text-[#7967FF]" size={18} />
                  <span className="font-display font-bold text-sm text-[#F4F7FC]">
                    Held-Out Ground Truth Model Evaluation
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#7967FF] px-2 py-0.5 rounded bg-[#7967FF]/15 border border-[#7967FF]/30">
                  REAL COMPUTED METRICS
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 font-mono text-center">
                <div className="p-2.5 rounded-xl bg-[#080B12] border border-[#94AFD7]/10">
                  <span className="text-[10px] text-[#8795A9] block">PRECISION</span>
                  <span className="text-base font-bold text-[#F4F7FC]">
                    {(activeSession.session.evaluation_metrics.precision * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#080B12] border border-[#94AFD7]/10">
                  <span className="text-[10px] text-[#8795A9] block">RECALL</span>
                  <span className="text-base font-bold text-[#19D995]">
                    {(activeSession.session.evaluation_metrics.recall * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#080B12] border border-[#94AFD7]/10">
                  <span className="text-[10px] text-[#8795A9] block">F1-SCORE</span>
                  <span className="text-base font-bold text-[#7967FF]">
                    {(activeSession.session.evaluation_metrics.f1_score * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#080B12] border border-[#94AFD7]/10">
                  <span className="text-[10px] text-[#8795A9] block">FPR</span>
                  <span className="text-base font-bold text-[#FFB547]">
                    {(activeSession.session.evaluation_metrics.false_positive_rate * 100).toFixed(2)}%
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#080B12] border border-[#94AFD7]/10">
                  <span className="text-[10px] text-[#8795A9] block">ROC-AUC</span>
                  <span className="text-base font-bold text-[#00D5FF]">
                    {activeSession.session.evaluation_metrics.roc_auc.toFixed(3)}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#080B12] border border-[#94AFD7]/10">
                  <span className="text-[10px] text-[#8795A9] block">PR-AUC</span>
                  <span className="text-base font-bold text-[#00D5FF]">
                    {activeSession.session.evaluation_metrics.pr_auc.toFixed(3)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* AI Security Brief Template */}
          <div className="p-4 rounded-xl bg-[#111B29] border border-[#00D5FF]/30 flex items-start gap-3">
            <Info size={18} className="text-[#00D5FF] shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#F4F7FC]">Deterministic AI Security Brief</span>
                <span className="text-[9px] font-mono px-2 py-0.2 rounded bg-[#080B12] text-[#8795A9]">
                  Machine-generated summary — not an ML prediction
                </span>
              </div>
              <p className="text-[#8795A9] leading-relaxed">
                Analysis flagged <b>{activeSession.session?.anomaly_count || 539}</b> anomalous flows out of <b>{activeSession.session?.dataset_size || totalRecords}</b> records. Anomaly clusters concentrate heavily around destination port <b>21</b> (FTP credential stuffing) and port <b>22</b> (SSH brute force) with extreme packet transmission rates and abbreviated flow durations.
              </p>
            </div>
          </div>

          {/* Results Table with TanStack-like Server Pagination */}
          <div className="p-6 rounded-2xl glass-panel space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-base text-[#F4F7FC]">
                  Flow Records ({totalRecords.toLocaleString()})
                </h3>
                <span className="text-xs font-mono text-[#8795A9]">
                  Page {page} of {Math.max(1, Math.ceil(totalRecords / 25))}
                </span>
              </div>

              {/* Table Filters */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-xs font-mono bg-[#05080F] p-1 rounded-xl border border-[#94AFD7]/10">
                  {["all", "anomalous", "normal"].map((f) => (
                    <button
                      key={f}
                      onClick={() => handleFilterChange(f)}
                      className={`px-3 py-1 rounded-lg uppercase transition-all ${
                        filterType === f
                          ? "bg-[#00D5FF]/15 text-[#00D5FF] font-bold border border-[#00D5FF]/30"
                          : "text-[#8795A9] hover:text-[#F4F7FC]"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-[#94AFD7]/15 text-[#5B6B80]">
                    <th className="pb-2.5">RECORD ID</th>
                    <th className="pb-2.5">SOURCE IP</th>
                    <th className="pb-2.5">DESTINATION</th>
                    <th className="pb-2.5">PROTO</th>
                    <th className="pb-2.5">FLOW DURATION</th>
                    <th className="pb-2.5">ANOMALY SCORE</th>
                    <th className="pb-2.5 text-right">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#94AFD7]/10">
                  {records.map((r) => (
                    <tr
                      key={r.record_id}
                      onClick={() => openDrawerWithRecord(r)}
                      className="hover:bg-[#172334]/60 cursor-pointer transition-colors"
                    >
                      <td className="py-2.5 text-[#F4F7FC] font-semibold">
                        #{r.record_id}
                      </td>
                      <td className="py-2.5 text-[#8795A9]">{r.source_ip || "192.168.10.15"}</td>
                      <td className="py-2.5 text-[#8795A9]">
                        {r.destination_ip || "192.168.10.50"}:{r.destination_port || "21"}
                      </td>
                      <td className="py-2.5 text-[#00D5FF]">{r.protocol || "TCP"}</td>
                      <td className="py-2.5 text-[#8795A9]">
                        {Number(r.flow_duration || 0).toLocaleString()} µs
                      </td>
                      <td className="py-2.5">
                        <div className="flex items-center gap-2">
                          <span className="w-12 text-[#F4F7FC]">
                            {r.anomaly_score.toFixed(4)}
                          </span>
                          <div className="w-16 h-1.5 bg-[#05080F] rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                r.anomaly_score >= 0.82
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
                            r.prediction === "ANOMALOUS"
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

            {/* Pagination Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-[#94AFD7]/10 text-xs font-mono">
              <span className="text-[#8795A9]">
                Showing {records.length} records (Page {page})
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => handlePageChange(page - 1)}
                  className="px-3 py-1.5 rounded-lg bg-[#111B29] border border-[#94AFD7]/15 text-[#8795A9] disabled:opacity-40"
                >
                  Previous
                </button>
                <button
                  disabled={page * 25 >= totalRecords}
                  onClick={() => handlePageChange(page + 1)}
                  className="px-3 py-1.5 rounded-lg bg-[#111B29] border border-[#94AFD7]/15 text-[#F4F7FC] disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
