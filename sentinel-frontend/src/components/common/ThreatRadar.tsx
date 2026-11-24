import React, { useState } from "react";
import { ShieldAlert, Crosshair, Info } from "lucide-react";
import { useSentinelStore } from "../../store/useSentinelStore";
import { RecordItem } from "../../lib/api";

interface ThreatRadarProps {
  records?: RecordItem[];
  size?: number;
}

export const ThreatRadar: React.FC<ThreatRadarProps> = ({
  records = [],
  size = 280,
}) => {
  const { openDrawerWithRecord } = useSentinelStore();
  const [hoveredBlip, setHoveredBlip] = useState<RecordItem | null>(null);

  const radius = size / 2;
  const center = radius;

  // Filter anomalies or top scored records
  const blips = records
    .filter((r) => r.anomaly_score >= 0.5 || r.prediction === "ANOMALOUS")
    .slice(0, 35);

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative overflow-hidden rounded-full border border-[#00D5FF]/30 bg-[#080B12] shadow-2xl shadow-cyan-950/20"
        style={{ width: size, height: size }}
      >
        {/* Concentric rings */}
        {[0.25, 0.5, 0.75, 1.0].map((r, i) => (
          <div
            key={i}
            className={`absolute rounded-full border ${
              r === 0.5
                ? "border-[#00D5FF]/50 border-dashed"
                : "border-[#94AFD7]/15"
            }`}
            style={{
              width: `${r * 100}%`,
              height: `${r * 100}%`,
              top: `${(1 - r) * 50}%`,
              left: `${(1 - r) * 50}%`,
            }}
          />
        ))}

        {/* Crosshair grid lines */}
        <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-[#94AFD7]/15 -translate-x-1/2" />
        <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-[#94AFD7]/15 -translate-y-1/2" />

        {/* Rotating sweep line */}
        <div
          className="absolute inset-0 origin-center animate-radar-sweep pointer-events-none"
          style={{
            background:
              "conic-gradient(from 0deg, rgba(0, 213, 255, 0.28) 0deg, rgba(0, 213, 255, 0.0) 60deg, transparent 60deg)",
          }}
        />

        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-[#00D5FF] -translate-x-1/2 -translate-y-1/2 shadow-[0_0_8px_#00D5FF]" />

        {/* Plotted Threat Blips */}
        {blips.map((item, idx) => {
          // Angle based on record index / deterministic seed
          const angle = (idx * 37.5) * (Math.PI / 180);
          // Distance from center mapped from anomaly_score (0.5 -> 1.0 maps to 0.45 -> 0.95 radius)
          const distNorm = Math.min(Math.max((item.anomaly_score - 0.4) / 0.6, 0.2), 0.92);
          const rBlip = distNorm * (radius - 12);
          const x = center + rBlip * Math.cos(angle);
          const y = center + rBlip * Math.sin(angle);

          const isCritical = item.anomaly_score >= 0.82;

          return (
            <button
              key={idx}
              onClick={() => openDrawerWithRecord(item)}
              onMouseEnter={() => setHoveredBlip(item)}
              onMouseLeave={() => setHoveredBlip(null)}
              className="absolute -translate-x-1/2 -translate-y-1/2 group z-10 cursor-pointer focus:outline-none"
              style={{ left: x, top: y }}
              title={`Flow #${item.record_id} - Score ${item.anomaly_score.toFixed(3)}`}
            >
              <span
                className={`block w-2.5 h-2.5 rounded-full transition-transform group-hover:scale-150 ${
                  isCritical
                    ? "bg-[#FF4567] shadow-[0_0_10px_#FF4567]"
                    : "bg-[#FFB547] shadow-[0_0_8px_#FFB547]"
                }`}
              />
              <span
                className={`absolute inset-0 rounded-full animate-ping opacity-75 ${
                  isCritical ? "bg-[#FF4567]" : "bg-[#FFB547]"
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* Hover Information Pill */}
      <div className="mt-3 text-center min-h-[32px]">
        {hoveredBlip ? (
          <div className="text-xs font-mono text-[#F4F7FC] bg-[#111B29] px-3 py-1 rounded-full border border-[#00D5FF]/30 inline-flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF4567] animate-pulse" />
            <span>#{hoveredBlip.record_id}</span>
            <span className="text-[#8795A9]">·</span>
            <span>Score: {hoveredBlip.anomaly_score.toFixed(3)}</span>
            <span className="text-[#00D5FF]">Click to inspect</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-[11px] text-[#5B6B80]">
            <Info size={12} className="text-[#00D5FF]" />
            <span>Radial geometric threat mapping. Blips pulse by severity.</span>
          </div>
        )}
      </div>
    </div>
  );
};
