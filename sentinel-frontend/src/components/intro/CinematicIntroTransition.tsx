import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, ShieldAlert, Play } from "lucide-react";
import { IntroVideo, IntroVideoHandle } from "./IntroVideo";
import { IntroOverlay } from "./IntroOverlay";
import { SkipIntroButton } from "./SkipIntroButton";
import { IntroProgress } from "./IntroProgress";

export type IntroTransitionState =
  | "LOADING"
  | "PLAYING"
  | "TRANSITIONING"
  | "DASHBOARD_REVEALED";

interface CinematicIntroTransitionProps {
  onTransitionComplete: () => void;
  onProgressChange?: (progress: number) => void;
}

export const CinematicIntroTransition: React.FC<CinematicIntroTransitionProps> = ({
  onTransitionComplete,
  onProgressChange,
}) => {
  const [state, setState] = useState<IntroTransitionState>("LOADING");
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [videoProgress, setVideoProgress] = useState<number>(0);
  const [duration, setDuration] = useState<number>(10.0);
  const [scrollProgress, setScrollProgress] = useState<number>(0); // 0.0 (translateY 0) to 1.0 (translateY -100vh)
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [requiresUserInteraction, setRequiresUserInteraction] = useState<boolean>(false);

  const videoHandleRef = useRef<IntroVideoHandle | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isTransitioningRef = useRef<boolean>(false);
  const isCompletedRef = useRef<boolean>(false);
  const animationFrameRef = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  // Notify parent of scroll progress for coordinated dashboard reveal
  const updateScrollProgress = useCallback(
    (prog: number) => {
      const clamped = Math.min(1.0, Math.max(0, prog));
      setScrollProgress(clamped);
      if (onProgressChange) {
        onProgressChange(clamped);
      }
    },
    [onProgressChange]
  );

  const completeTransition = useCallback(() => {
    if (isCompletedRef.current) return;
    isCompletedRef.current = true;
    setState("DASHBOARD_REVEALED");
    try {
      sessionStorage.setItem("sentinel_intro_seen", "true");
    } catch (e) {
      // storage unavailable in some private modes
    }
    updateScrollProgress(1.0);
    onTransitionComplete();
  }, [onTransitionComplete, updateScrollProgress]);

  // Unified 480ms accelerated transition (used by Skip, Manual Scroll, and End-of-Video)
  const triggerUpwardScrollTransition = useCallback(
    (durationMs = 480) => {
      if (isCompletedRef.current || isTransitioningRef.current) return;
      isTransitioningRef.current = true;
      setState("TRANSITIONING");

      const videoEl = videoHandleRef.current?.getVideoElement();
      if (videoEl && !videoEl.paused) {
        videoEl.pause();
      }

      const startVideoTime = videoEl ? videoEl.currentTime : currentTime;
      const targetVideoTime = duration > 0 ? duration : 10.0;
      const startScroll = scrollProgress;
      const targetScroll = 1.0;
      const startTime = performance.now();

      const runFrame = (now: number) => {
        const elapsed = now - startTime;
        const norm = Math.min(1.0, elapsed / durationMs);

        // Smooth cubic out easing for cinematic upward glide
        const eased = 1 - Math.pow(1 - norm, 3);

        const currentVideoPos = startVideoTime + (targetVideoTime - startVideoTime) * eased;
        if (videoEl) {
          videoEl.currentTime = currentVideoPos;
        }

        const currentScrollPos = startScroll + (targetScroll - startScroll) * eased;
        updateScrollProgress(currentScrollPos);

        if (norm < 1.0) {
          animationFrameRef.current = requestAnimationFrame(runFrame);
        } else {
          if (videoEl) {
            videoEl.currentTime = targetVideoTime;
          }
          completeTransition();
        }
      };

      animationFrameRef.current = requestAnimationFrame(runFrame);
    },
    [currentTime, duration, scrollProgress, updateScrollProgress, completeTransition]
  );

  // Monitor normal playback for automatic scroll transition during the final 1.5s (8.5s - 10.0s)
  useEffect(() => {
    if (state !== "PLAYING" || isTransitioningRef.current || isCompletedRef.current) {
      return;
    }

    const checkNaturalProgress = () => {
      const videoEl = videoHandleRef.current?.getVideoElement();
      if (!videoEl) return;

      const cur = videoEl.currentTime;
      const dur = duration > 0 ? duration : 10.0;
      const transitionStartTime = Math.max(0, dur - 1.5); // 8.5s for a 10s video

      if (cur >= transitionStartTime) {
        // We are in the final 1.5 seconds: compute natural upward scroll progress
        const rawProgress = (cur - transitionStartTime) / (dur - transitionStartTime);
        const clamped = Math.min(1.0, Math.max(0, rawProgress));

        // Smoothstep easing for organic deceleration into final frame
        const eased = clamped * clamped * (3 - 2 * clamped);
        updateScrollProgress(eased);

        if (clamped >= 0.99 || cur >= dur - 0.05) {
          completeTransition();
          return;
        }
      }

      if (!isCompletedRef.current && !isTransitioningRef.current) {
        animationFrameRef.current = requestAnimationFrame(checkNaturalProgress);
      }
    };

    animationFrameRef.current = requestAnimationFrame(checkNaturalProgress);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [state, duration, updateScrollProgress, completeTransition]);

  // Video Event Handlers
  const handleTimeUpdate = (cur: number, prog: number, dur: number) => {
    setCurrentTime(cur);
    setVideoProgress(prog);
    if (dur > 0 && Math.abs(dur - duration) > 0.1) {
      setDuration(dur);
    }
  };

  const handleVideoEnded = () => {
    if (!isCompletedRef.current) {
      completeTransition();
    }
  };

  const handleCanPlay = () => {
    if (state === "LOADING") {
      setState("PLAYING");
    }
  };

  const handleVideoError = (err: any) => {
    console.error("Intro video error:", err);
    setHasError(true);
    // Gracefully transition upward after short notification so user is never stuck
    setTimeout(() => {
      triggerUpwardScrollTransition(600);
    }, 1000);
  };

  // Skip button click handler
  const handleSkip = () => {
    triggerUpwardScrollTransition(480);
  };

  // Sound toggle handler
  const toggleSound = () => {
    if (videoHandleRef.current) {
      const newMuted = videoHandleRef.current.toggleMute();
      setIsMuted(newMuted);
    } else {
      setIsMuted(!isMuted);
    }
  };

  // User manual scroll interaction: wheel & touch events
  const handleWheel = (e: React.WheelEvent) => {
    if (isCompletedRef.current || isTransitioningRef.current) return;
    if (e.deltaY > 18) {
      // User is scrolling downward to enter the site -> trigger upward scroll transition!
      triggerUpwardScrollTransition(500);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartY.current === null || isCompletedRef.current || isTransitioningRef.current) return;
    const currentY = e.touches[0].clientY;
    const diff = touchStartY.current - currentY;
    if (diff > 35) {
      // Swiped upward by >35px -> trigger upward scroll transition!
      triggerUpwardScrollTransition(500);
      touchStartY.current = null;
    }
  };

  // Keyboard accessibility: Escape or Space to skip
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.code === "Space") {
        e.preventDefault();
        handleSkip();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSkip]);

  if (state === "DASHBOARD_REVEALED") {
    return null;
  }

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      style={{
        transform: `translate3d(0, -${scrollProgress * 100}%, 0)`,
        willChange: "transform",
      }}
      className="fixed inset-0 z-50 w-screen h-screen bg-[#03050A] text-[#F4F7FC] overflow-hidden select-none border-b border-[#00D5FF]/30 shadow-[0_30px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(0,213,255,0.25)]"
    >
      {/* 1. Fullscreen Video Engine */}
      <div className="w-full h-full relative">
        <IntroVideo
          ref={videoHandleRef}
          onTimeUpdate={handleTimeUpdate}
          onVideoEnded={handleVideoEnded}
          onError={handleVideoError}
          onCanPlay={handleCanPlay}
          isMuted={isMuted}
        />
      </div>

      {/* 2. Loading State Fallback */}
      <AnimatePresence>
        {state === "LOADING" && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 bg-[#03050A] flex flex-col items-center justify-center space-y-4 z-40"
          >
            <div className="w-14 h-14 rounded-full border-2 border-[#00D5FF]/20 border-t-[#00D5FF] animate-spin shadow-[0_0_20px_#00D5FF]" />
            <div className="font-mono text-xs text-[#00D5FF] tracking-widest uppercase animate-pulse">
              INITIALIZING CYBER INTELLIGENCE FEED...
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Autoplay Blocked Fallback Action Button */}
      {requiresUserInteraction && (
        <div className="absolute inset-0 bg-[#03050A]/80 backdrop-blur-md flex flex-col items-center justify-center space-y-4 z-45">
          <button
            onClick={() => {
              setRequiresUserInteraction(false);
              videoHandleRef.current?.getVideoElement()?.play();
            }}
            className="flex items-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-[#00D5FF] to-[#7967FF] text-[#05080F] text-xs font-bold shadow-[0_0_25px_rgba(0,213,255,0.5)] cursor-pointer"
          >
            <Play size={16} className="fill-[#05080F]" />
            <span>ENTER SENTINEL SOC</span>
          </button>
        </div>
      )}

      {/* Error State Notice */}
      {hasError && (
        <div className="absolute top-8 inset-x-0 mx-auto max-w-md p-3.5 rounded-xl bg-[#0D1420]/90 border border-[#FF365E]/40 text-xs font-mono text-[#FF365E] flex items-center gap-2.5 z-50 backdrop-blur-md">
          <ShieldAlert size={16} />
          <span>Transitioning into SOC Command Center...</span>
        </div>
      )}

      {/* 3. HTML Brand Overlay */}
      <IntroOverlay
        currentTime={currentTime}
        isAccelerating={state === "TRANSITIONING"}
      />

      {/* 4. Controls: Sound Toggle (Top-Left) */}
      <div className="fixed top-6 left-8 z-50 flex items-center gap-2">
        <button
          onClick={toggleSound}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#0D1420]/80 hover:bg-[#111B29] border border-[#94AFD7]/20 hover:border-[#00D5FF]/50 text-[#8795A9] hover:text-[#00D5FF] backdrop-blur-md transition-all text-xs font-mono cursor-pointer"
          title={isMuted ? "Unmute Audio" : "Mute Audio"}
        >
          {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} className="text-[#00D5FF]" />}
          <span className="hidden sm:inline">{isMuted ? "UNMUTE" : "AUDIO ON"}</span>
        </button>
      </div>

      {/* 5. Skip Button (Top-Right) */}
      <SkipIntroButton
        onSkip={handleSkip}
        isAccelerating={state === "TRANSITIONING"}
        disabled={state === "LOADING" || state === "TRANSITIONING"}
      />

      {/* 6. Progress Indicator (Bottom) */}
      <IntroProgress
        progress={videoProgress}
        currentTime={currentTime}
        duration={duration}
      />

      {/* 7. Bottom Edge Atmospheric Glow & Drop Shadow Curtain */}
      <div className="absolute bottom-0 inset-x-0 h-16 pointer-events-none bg-gradient-to-t from-[#00D5FF]/10 to-transparent" />
    </div>
  );
};
