import React, { useState } from "react";
import {
  Settings,
  Sliders,
  Shield,
  Layers,
  Save,
  Trash2,
  CheckCircle2,
  Info,
  Palette,
} from "lucide-react";
import { useSentinelStore } from "../../store/useSentinelStore";
import { api } from "../../lib/api";

export const SettingsPage: React.FC = () => {
  const { severityThresholds, setSeverityThresholds } = useSentinelStore();
  const backendUrl = import.meta.env.VITE_API_URL?.replace(/\/+$/, "");

  const [criticalThresh, setCriticalThresh] = useState(severityThresholds.critical);
  const [highThresh, setHighThresh] = useState(severityThresholds.high);
  const [mediumThresh, setMediumThresh] = useState(severityThresholds.medium);
  const [defaultContam, setDefaultContam] = useState(0.04);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSeverityThresholds({
      critical: criticalThresh,
      high: highThresh,
      medium: mediumThresh,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between p-5 rounded-2xl glass-panel border border-[#94AFD7]/15">
        <div className="flex items-center gap-2">
          <Settings size={18} className="text-[#00D5FF]" />
          <h1 className="font-display font-bold text-xl text-[#F4F7FC]">
            Platform Settings & Triage Policies
          </h1>
        </div>

        {savedSuccess && (
          <span className="flex items-center gap-1.5 text-xs font-mono text-[#19D995] bg-[#19D995]/10 px-3 py-1 rounded-lg border border-[#19D995]/30">
            <CheckCircle2 size={13} /> Saved
          </span>
        )}
      </div>

      {/* Severity Policy Configuration */}
      <div className="p-6 rounded-2xl glass-panel border border-[#94AFD7]/15 space-y-4">
        <div>
          <h2 className="font-display font-bold text-base text-[#F4F7FC]">
            Anomaly Severity Percentile Thresholds
          </h2>
          <p className="text-xs text-[#8795A9]">
            Adjust calibrated score bands for automated investigation triage assignment
          </p>
        </div>

        <div className="space-y-4 font-mono text-xs">
          {/* Critical */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-[#FF4567] font-bold">CRITICAL SEVERITY (Top 1%)</span>
              <span className="text-[#F4F7FC]">Score &gt;= {criticalThresh.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.75"
              max="0.95"
              step="0.01"
              value={criticalThresh}
              onChange={(e) => setCriticalThresh(parseFloat(e.target.value))}
              className="w-full accent-[#FF4567]"
            />
          </div>

          {/* High */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-[#FFB547] font-bold">HIGH SEVERITY</span>
              <span className="text-[#F4F7FC]">Score &gt;= {highThresh.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.60"
              max="0.80"
              step="0.01"
              value={highThresh}
              onChange={(e) => setHighThresh(parseFloat(e.target.value))}
              className="w-full accent-[#FFB547]"
            />
          </div>

          {/* Medium */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-[#7967FF] font-bold">MEDIUM SEVERITY</span>
              <span className="text-[#F4F7FC]">Score &gt;= {mediumThresh.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.45"
              max="0.65"
              step="0.01"
              value={mediumThresh}
              onChange={(e) => setMediumThresh(parseFloat(e.target.value))}
              className="w-full accent-[#7967FF]"
            />
          </div>
        </div>
      </div>

      {/* Model & Interface Defaults */}
      <div className="p-6 rounded-2xl glass-panel border border-[#94AFD7]/15 space-y-4">
        <h2 className="font-display font-bold text-base text-[#F4F7FC]">
          Engine Defaults & Telemetry Storage
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-3.5 rounded-xl bg-[#080B12] border border-[#94AFD7]/10 space-y-1">
            <span className="text-[#5B6B80] text-[10px] block">FASTAPI BACKEND ENDPOINT</span>
            <span className="break-all font-bold text-[#00D5FF]">
              {backendUrl ? `${backendUrl}/api` : "Same origin (/api)"}
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-[#080B12] border border-[#94AFD7]/10 space-y-1">
            <span className="text-[#5B6B80] text-[10px] block">DATABASE PERSISTENCE</span>
            <span className="break-all font-bold text-[#19D995]">SQLite (/backend/data/sentinel.db)</span>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <button
          onClick={handleSave}
          className="px-6 py-2.5 rounded-xl bg-[#00D5FF] text-[#05080F] text-xs font-bold hover:bg-[#5CE6FF] flex items-center gap-2 shadow-[0_0_15px_rgba(0,213,255,0.3)]"
        >
          <Save size={15} />
          <span>Save System Settings</span>
        </button>
      </div>
    </div>
  );
};
