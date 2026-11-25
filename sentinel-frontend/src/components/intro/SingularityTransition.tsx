import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SingularityTransitionProps {
  onTransitionComplete: () => void;
}

export const SingularityTransition: React.FC<SingularityTransitionProps> = ({
  onTransitionComplete,
}) => {
  // Phases: 1 (0-300ms) -> 2 (300-700ms) -> 3 (700-1100ms) -> 4 (1100-1600ms)
  const [phase, setPhase] = useState<number>(1);

  useEffect(() => {
    const t2 = setTimeout(() => setPhase(2), 300);
    const t3 = setTimeout(() => setPhase(3), 700);
    const t4 = setTimeout(() => setPhase(4), 1100);
    const end = setTimeout(() => {
      onTransitionComplete();
    }, 1550);

    return () => {
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(end);
    };
  }, [onTransitionComplete]);

  return (
    <div className="fixed inset-0 z-40 pointer-events-none overflow-hidden">
      {/* Background Dimming & Convergence */}
      <motion.div
        className="absolute inset-0 bg-[#03050A]"
        initial={{ opacity: 0 }}
        animate={{
          opacity: phase < 3 ? 0.75 : 0,
        }}
        transition={{ duration: 0.4 }}
      />

      {/* Phase 1 & 2: Radial Collapse Rings & Energy Rings */}
      <AnimatePresence>
        {phase <= 2 && (
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Outer Converging Energy Ring */}
            <motion.div
              initial={{ scale: 2.2, opacity: 0, rotate: 0 }}
              animate={{
                scale: phase === 1 ? 1.3 : 0.08,
                opacity: phase === 1 ? 0.9 : 1,
                rotate: 180,
              }}
              transition={{
                duration: phase === 1 ? 0.3 : 0.4,
                ease: phase === 1 ? "easeOut" : "anticipate",
              }}
              className="w-72 h-72 rounded-full border-2 border-[#00D5FF] shadow-[0_0_50px_#00D5FF] flex items-center justify-center"
            >
              <div className="w-48 h-48 rounded-full border border-[#7967FF]/80 border-dashed animate-spin" />
            </motion.div>

            {/* Central Super-Luminous Intelligence Singularity */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0.6 }}
              animate={{
                scale: phase === 1 ? 1.6 : 2.8,
                opacity: 1,
                boxShadow: "0 0 80px 20px #00D5FF, 0 0 140px 40px #7967FF",
              }}
              transition={{ duration: 0.35 }}
              className="w-10 h-10 rounded-full bg-white absolute"
            />
          </div>
        )}
      </AnimatePresence>

      {/* Phase 3 & 4: Singularity Expansion Wave (Radial Reveal) */}
      <AnimatePresence>
        {phase >= 3 && (
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Concentric Shockwave Rings */}
            <motion.div
              initial={{ scale: 0.05, opacity: 1, borderWidth: "12px" }}
              animate={{
                scale: 24,
                opacity: 0,
                borderWidth: "1px",
              }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              className="w-32 h-32 rounded-full border-[#00D5FF] shadow-[0_0_100px_#00D5FF] absolute"
            />

            <motion.div
              initial={{ scale: 0.05, opacity: 0.9 }}
              animate={{
                scale: 18,
                opacity: 0,
              }}
              transition={{ duration: 0.65, delay: 0.05, ease: "easeOut" }}
              className="w-32 h-32 rounded-full border border-[#7967FF] absolute"
            />

            {/* Cyan Flash Veil Fading Out */}
            <motion.div
              initial={{ opacity: 0.7 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="absolute inset-0 bg-[#00D5FF]/20 backdrop-blur-sm"
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
