import React from "react";

interface IntroProgressProps {
  progress: number;
  currentTime: number;
  duration: number;
}

export const IntroProgress: React.FC<IntroProgressProps> = ({
  progress,
  currentTime,
  duration,
}) => {
  const formatTime = (sec: number) => {
    const s = Math.min(duration, Math.max(0, sec));
    const mins = Math.floor(s / 60);
    const secs = (s % 60).toFixed(1);
    return `${mins.toString().padStart(2, "0")}:${secs.padStart(4, "0")}`;
  };

  return (
    <div className="fixed bottom-6 inset-x-0 mx-auto max-w-xl px-6 z-50 pointer-events-none select-none">
      <div className="flex items-center justify-between text-[11px] font-mono text-[#8795A9] mb-1.5 tracking-wider">
        <span className="flex items-center gap-2 text-[#00D5FF]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00D5FF] animate-pulse" />
          <span>NEURAL STREAM SCAN</span>
        </span>
        <span className="text-[#F4F7FC]/80">
          {formatTime(currentTime)} / {formatTime(duration)} SEC
        </span>
      </div>

      <div className="h-[2px] w-full bg-[#94AFD7]/20 rounded-full overflow-hidden backdrop-blur-sm">
        <div
          className="h-full bg-gradient-to-r from-[#00D5FF] via-[#7967FF] to-[#00D5FF] shadow-[0_0_12px_#00D5FF] transition-all duration-100 ease-linear"
          style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }}
        />
      </div>
    </div>
  );
};
