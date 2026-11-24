import React, { useState } from "react";
import { Info, CheckCircle2, AlertCircle } from "lucide-react";

interface HealthScoreRingProps {
  score: number;
  breakdown?: {
    missing_penalty?: number;
    inf_penalty?: number;
    duplicate_penalty?: number;
  };
  size?: number;
}

export const HealthScoreRing: React.FC<HealthScoreRingProps> = ({
  score = 100,
  breakdown,
  size = 120,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const normalizedScore = Math.max(0, Math.min(100, score));
  const offset = circumference - (normalizedScore / 100) * circumference;

  const color =
    normalizedScore >= 90
      ? "#19D995"
      : normalizedScore >= 75
      ? "#FFB547"
      : "#FF4567";

  return (
    <div className="relative inline-flex flex-col items-center">
      <div
        className="relative flex items-center justify-center cursor-pointer group"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        style={{ width: size, height: size }}
      >
        <svg width={size} height={size} className="rotate-[-90deg]">
          {/* Background Ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(148, 175, 215, 0.1)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Dynamic Progress Ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="font-display font-bold text-xl text-[#F4F7FC]">
            {normalizedScore.toFixed(0)}
          </span>
          <span className="text-[10px] font-mono text-[#8795A9] uppercase">
            HEALTH
          </span>
        </div>
      </div>

      {/* Breakdown Tooltip */}
      {showTooltip && (
        <div className="absolute top-full mt-2 z-30 w-56 p-3 rounded-xl bg-[#172334] border border-[#94AFD7]/20 shadow-xl text-left text-xs text-[#F4F7FC] space-y-2 pointer-events-none animate-in fade-in duration-150">
          <div className="flex items-center gap-1.5 font-semibold text-[#00D5FF] text-[11px] font-mono uppercase">
            <Info size={13} />
            <span>Health Quality Formula</span>
          </div>
          <p className="text-[11px] text-[#8795A9]">
            Calculated from schema integrity, null ratios, infinite flow values, and duplicate rows.
          </p>
          {breakdown && (
            <div className="space-y-1 text-[10px] font-mono pt-1 border-t border-[#94AFD7]/15">
              <div className="flex justify-between">
                <span>Missing value deduction:</span>
                <span className="text-[#FFB547]">-{breakdown.missing_penalty || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Infinite value deduction:</span>
                <span className="text-[#FFB547]">-{breakdown.inf_penalty || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Duplicates deduction:</span>
                <span className="text-[#FFB547]">-{breakdown.duplicate_penalty || 0}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
