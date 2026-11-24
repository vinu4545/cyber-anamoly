import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Sparkles } from 'lucide-react';
import birthdayConfig from '../data/birthdayConfig';

export default function CinematicIntro({ onCompleteIntro }) {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const targetTimeRef = useRef(0);
  const isSeekingRef = useRef(false);
  const animationFrameRef = useRef(null);
  const lastAssignedTimeRef = useRef(-1);

  const { videoIntro } = birthdayConfig;
  const scrollDistanceVh = videoIntro.scrollDistance || 380;

  // Check reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Initialize and pause video
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsVideoReady(true);
    }
  };

  // Video seeking coordinator via requestAnimationFrame
  const updateVideoFrame = useCallback(() => {
    const video = videoRef.current;
    if (!video || !video.duration || isNaN(video.duration) || videoError) {
      return;
    }

    const duration = video.duration;
    // Clamp target time safely
    const target = Math.max(0, Math.min(targetTimeRef.current, duration - 0.05));

    // Avoid unnecessary seek if already within a frame threshold
    const diff = Math.abs(video.currentTime - target);
    if (diff > 0.02 && Math.abs(lastAssignedTimeRef.current - target) > 0.01) {
      try {
        video.currentTime = target;
        lastAssignedTimeRef.current = target;
      } catch {
        // Ignore seek interruption
      }
    }
  }, [videoError]);

  // Scroll listener mapping normalized scroll position to video.currentTime
  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const totalScroll = container.offsetHeight - window.innerHeight;

      if (totalScroll <= 0) return;

      // Calculate progress between 0 and 1
      const currentScroll = -rect.top;
      const progress = Math.min(Math.max(currentScroll / totalScroll, 0), 1);

      setScrollProgress(progress);

      const video = videoRef.current;
      if (video && video.duration && !isNaN(video.duration)) {
        targetTimeRef.current = progress * video.duration;

        // Schedule smooth seek update
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        animationFrameRef.current = requestAnimationFrame(updateVideoFrame);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [updateVideoFrame]);

  // Phase opacities for text overlays based on scroll progress
  // Phase 1: 0.04 to 0.30
  const phase1Opacity =
    scrollProgress < 0.04
      ? 0
      : scrollProgress <= 0.12
      ? (scrollProgress - 0.04) / 0.08
      : scrollProgress <= 0.22
      ? 1
      : scrollProgress <= 0.32
      ? 1 - (scrollProgress - 0.22) / 0.1
      : 0;

  // Phase 2: 0.36 to 0.64
  const phase2Opacity =
    scrollProgress < 0.36
      ? 0
      : scrollProgress <= 0.44
      ? (scrollProgress - 0.36) / 0.08
      : scrollProgress <= 0.54
      ? 1
      : scrollProgress <= 0.64
      ? 1 - (scrollProgress - 0.54) / 0.1
      : 0;

  // Phase 3: 0.68 to 0.95
  const phase3Opacity =
    scrollProgress < 0.68
      ? 0
      : scrollProgress <= 0.76
      ? (scrollProgress - 0.68) / 0.08
      : scrollProgress <= 0.88
      ? 1
      : scrollProgress <= 0.96
      ? 1 - (scrollProgress - 0.88) / 0.08
      : 0;

  // Final glow transition into hero section
  const transitionGlow =
    scrollProgress > 0.82 ? Math.min(1, (scrollProgress - 0.82) / 0.18) : 0;

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-[#120C09]"
      style={{ height: `${scrollDistanceVh}vh` }}
    >
      {/* Sticky Fullscreen Pinned Viewport */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex items-center justify-center bg-[#120C09]">
        {/* Video Element */}
        <video
          ref={videoRef}
          src={videoIntro.videoPath}
          poster={videoIntro.posterPath}
          muted
          playsInline
          preload="auto"
          onLoadedMetadata={handleLoadedMetadata}
          onError={() => setVideoError(true)}
          className={`absolute inset-0 w-full h-full object-cover object-center pointer-events-none transition-opacity duration-700 ${
            isVideoReady ? 'opacity-100' : 'opacity-80'
          }`}
        />

        {/* Fallback Animated Gradient & Particles if video is loading or unsupported */}
        {videoError && (
          <div className="absolute inset-0 bg-gradient-to-b from-[#120C09] via-[#21150F] to-[#A94F20]/30 flex items-center justify-center">
            <div className="w-96 h-96 rounded-full bg-[#FFAD66]/15 blur-[120px] animate-pulse" />
          </div>
        )}

        {/* Ambient Dark-Orange Vignette & Depth Mask */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#120C09]/90 via-transparent to-[#120C09]/70 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(18,12,9,0.7)_100%)] pointer-events-none" />

        {/* Smooth Transition Glow into Hero (Scene 4 transition) */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-transparent via-[#A94F20]/30 to-[#21150F] pointer-events-none transition-opacity duration-300"
          style={{ opacity: transitionGlow }}
        />

        {/* Floating Ambient Sparks */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
          {[
            { top: '20%', left: '15%', size: 'w-2 h-2', delay: 0 },
            { top: '30%', right: '20%', size: 'w-2.5 h-2.5', delay: 1.5 },
            { top: '70%', left: '25%', size: 'w-1.5 h-1.5', delay: 0.8 },
            { top: '65%', right: '15%', size: 'w-2 h-2', delay: 2.2 },
          ].map((s, idx) => (
            <motion.div
              key={idx}
              className={`absolute ${s.size} rounded-full bg-[#FFE5B4] shadow-[0_0_10px_#FFAD66]`}
              style={{ top: s.top, left: s.left, right: s.right }}
              animate={{
                y: [-12, 12, -12],
                opacity: [0.3, 0.9, 0.3],
                scale: [0.9, 1.3, 0.9],
              }}
              transition={{
                duration: 4.5,
                delay: s.delay,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

        {/* Text Overlay Container */}
        <div className="relative z-20 max-w-4xl mx-auto px-6 text-center select-none pointer-events-none">
          {/* PHASE 1 OVERLAY */}
          <div
            className="transition-all duration-300 transform"
            style={{
              opacity: phase1Opacity,
              transform: `translateY(${(1 - phase1Opacity) * 20}px)`,
              display: phase1Opacity > 0 ? 'block' : 'none',
            }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#21150F]/80 border border-[#FFAD66]/30 text-xs font-mono uppercase tracking-[0.25em] text-[#FFD09B] mb-5 shadow-lg shadow-black/40 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-[#FFE5B4]" />
              <span>{videoIntro.overlays.tag}</span>
              <Sparkles className="w-3.5 h-3.5 text-[#FFE5B4]" />
            </div>

            <h2 className="font-serif-heading text-3xl sm:text-5xl md:text-6xl font-light text-[#FFE5B4] text-glow-champagne leading-tight">
              {videoIntro.overlays.phase1}
            </h2>
          </div>

          {/* PHASE 2 OVERLAY */}
          <div
            className="transition-all duration-300 transform"
            style={{
              opacity: phase2Opacity,
              transform: `translateY(${(1 - phase2Opacity) * 20}px)`,
              display: phase2Opacity > 0 ? 'block' : 'none',
            }}
          >
            <h2 className="font-serif-heading text-3xl sm:text-5xl md:text-6xl font-normal text-[#FFD09B] text-glow-amber leading-tight">
              "{videoIntro.overlays.phase2}"
            </h2>
            <p className="mt-4 text-xs sm:text-sm font-mono uppercase tracking-[0.2em] text-[#FFAD66]/80 font-light">
              Scroll forward to unwrap the magic
            </p>
          </div>

          {/* PHASE 3 OVERLAY (Climax) */}
          <div
            className="transition-all duration-300 transform"
            style={{
              opacity: phase3Opacity,
              transform: `translateY(${(1 - phase3Opacity) * 20}px)`,
              display: phase3Opacity > 0 ? 'block' : 'none',
            }}
          >
            <span className="text-xs uppercase font-mono tracking-[0.3em] text-[#FFAD66] font-semibold block mb-3">
              THE MOMENT HAS ARRIVED
            </span>
            <h2 className="font-serif-heading text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#FFE5B4] text-glow-champagne leading-none">
              {videoIntro.overlays.phase3}
            </h2>
          </div>
        </div>

        {/* Scroll Progress Bar at Bottom of Video */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none">
          {scrollProgress < 0.92 ? (
            <div className="flex flex-col items-center gap-2">
              <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#FFE5B4]/70">
                {videoIntro.overlays.scrollIndicator}
              </span>
              <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden border border-white/5">
                <div
                  className="h-full bg-gradient-to-r from-[#FFAD66] to-[#FFE5B4] transition-all duration-100 ease-out"
                  style={{ width: `${Math.round(scrollProgress * 100)}%` }}
                />
              </div>
              <motion.div
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              >
                <ChevronDown className="w-4 h-4 text-[#FFAD66]/80" />
              </motion.div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#FFE5B4] bg-[#21150F]/80 px-4 py-1.5 rounded-full border border-[#FFAD66]/40"
            >
              <span>ENTER CELEBRATION</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#FFAD66] animate-bounce" />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
