import React from "react";
import { FastForward, ArrowRight } from "lucide-react";

interface SkipIntroButtonProps {
  onSkip: () => void;
  isAccelerating: boolean;
  disabled: boolean;
}

export const SkipIntroButton: React.FC<SkipIntroButtonProps> = ({
  onSkip,
  isAccelerating,
  disabled,
}) => {
  return (
    <button
      onClick={onSkip}
      disabled={disabled || isAccelerating}
      className={`group fixed top-6 right-8 z-50 flex items-center gap-2.5 px-4 py-2 rounded-xl border backdrop-blur-md transition-all duration-300 font-mono text-xs select-none ${
        isAccelerating
          ? "bg-[#00D5FF]/10 border-[#00D5FF] text-[#00D5FF] cursor-wait shadow-[0_0_20px_rgba(0,213,255,0.3)]"
          : "bg-[#0D1420]/80 hover:bg-[#111B29] border-[#00D5FF]/40 hover:border-[#00D5FF] text-[#F4F7FC] hover:shadow-[0_0_15px_rgba(0,213,255,0.25)] cursor-pointer"
      }`}
    >
      <span className="tracking-widest uppercase font-semibold">
        {isAccelerating ? "INITIALIZING CORE..." : "SKIP INTRO"}
      </span>

      {isAccelerating ? (
        <FastForward size={14} className="text-[#00D5FF] animate-pulse" />
      ) : (
        <ArrowRight
          size={14}
          className="text-[#00D5FF] group-hover:translate-x-0.5 transition-transform duration-200"
        />
      )}
    </button>
  );
};
