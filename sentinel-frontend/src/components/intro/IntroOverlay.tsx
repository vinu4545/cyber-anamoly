import React from "react";
import { motion } from "framer-motion";
import { Shield, Activity, Cpu } from "lucide-react";

interface IntroOverlayProps {
  currentTime: number;
  isAccelerating: boolean;
}

export const IntroOverlay: React.FC<IntroOverlayProps> = ({
  currentTime,
  isAccelerating,
}) => {
  // Show brand overlay gradually, reaching full focus in later scenes or when accelerating
  return (
    <div className="absolute inset-0 pointer-events-none select-none z-30 flex flex-col justify-between p-8 sm:p-12 overflow-hidden">
      {/* Top Left System Telemetry HUD */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.3 }}
        className="flex items-center gap-3 text-[11px] font-mono text-[#8795A9]"
      >
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0D1420]/70 border border-[#94AFD7]/15 backdrop-blur-md">
          <Shield size={13} className="text-[#00D5FF]" />
          <span className="text-[#F4F7FC] font-semibold tracking-wider">SENTINEL AI</span>
          <span className="text-[#94AFD7]/40">|</span>
          <span className="text-[#19D995] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#19D995] animate-ping" />
            CORE ACTIVE
          </span>
        </div>
      </motion.div>

      {/* Center Cinematic Title Overlay */}
      <div className="flex flex-col items-center justify-center text-center my-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, letterSpacing: "0.2em" }}
          animate={{
            opacity: currentTime > 0.8 || isAccelerating ? 1 : 0.4,
            scale: 1,
            letterSpacing: "0.3em",
          }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-3"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#00D5FF]/10 border border-[#00D5FF]/30 text-[#00D5FF] text-[10px] font-mono tracking-widest uppercase">
            <Activity size={12} className="animate-pulse" />
            <span>Autonomous Flow Anomaly Intelligence</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-extrabold text-[#F4F7FC] tracking-[0.25em] drop-shadow-[0_0_35px_rgba(0,213,255,0.4)] uppercase">
            SENTINEL <span className="text-[#00D5FF]">AI</span>
          </h1>

          <p className="text-xs sm:text-sm md:text-base font-mono text-[#8795A9] tracking-[0.3em] uppercase max-w-xl mx-auto drop-shadow-md">
            SEE BEYOND THE TRAFFIC. DETECT BEFORE THE THREAT.
          </p>
        </motion.div>
      </div>

      {/* Bottom Technical HUD Brackets */}
      <div className="flex items-end justify-between text-[10px] font-mono text-[#5B6B80]">
        <div className="space-y-0.5 hidden sm:block">
          <div>CLASSIFICATION: UNSUPERVISED ISOLATION FOREST</div>
          <div>MODEL PIPELINE: 61 DIMENSIONAL FLOW TENSORS</div>
        </div>

        <div className="space-y-0.5 text-right hidden sm:block">
          <div>ZERO LABEL LEAKAGE: ENFORCED</div>
          <div>LATENCY TARGET: &lt; 50MS STREAM INFERENCE</div>
        </div>
      </div>
    </div>
  );
};
