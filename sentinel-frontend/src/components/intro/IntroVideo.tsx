import React, { useRef, useEffect, useImperativeHandle, forwardRef } from "react";

export interface IntroVideoHandle {
  accelerateToFinalFrame: (onComplete: () => void) => void;
  toggleMute: () => boolean;
  getVideoElement: () => HTMLVideoElement | null;
}

interface IntroVideoProps {
  onTimeUpdate: (currentTime: number, progress: number, duration: number) => void;
  onVideoEnded: () => void;
  onError: (err: any) => void;
  onCanPlay: () => void;
  isMuted: boolean;
}

export const IntroVideo = forwardRef<IntroVideoHandle, IntroVideoProps>(
  ({ onTimeUpdate, onVideoEnded, onError, onCanPlay, isMuted }, ref) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const isAcceleratingRef = useRef<boolean>(false);
    const animationFrameRef = useRef<number | null>(null);

    useImperativeHandle(ref, () => ({
      accelerateToFinalFrame: (onComplete: () => void) => {
        if (!videoRef.current || isAcceleratingRef.current) return;
        isAcceleratingRef.current = true;

        const video = videoRef.current;
        video.pause();

        const startPos = video.currentTime;
        const duration = video.duration > 0 ? video.duration : 10.0;
        const targetPos = Math.max(startPos, duration - 0.05);
        const accelerationDurationMs = 480; // 480ms per spec (450–500ms)
        const startTime = performance.now();

        const scrubFrame = (now: number) => {
          const elapsed = now - startTime;
          const progress = Math.min(1.0, elapsed / accelerationDurationMs);

          // Cubic out acceleration curve: rapid progression settling into final frame
          const eased = 1 - Math.pow(1 - progress, 3);
          const currentScrubPos = startPos + (targetPos - startPos) * eased;

          if (videoRef.current) {
            videoRef.current.currentTime = currentScrubPos;
          }

          if (progress < 1.0) {
            animationFrameRef.current = requestAnimationFrame(scrubFrame);
          } else {
            if (videoRef.current) {
              videoRef.current.currentTime = targetPos;
            }
            isAcceleratingRef.current = false;
            onComplete();
          }
        };

        animationFrameRef.current = requestAnimationFrame(scrubFrame);
      },
      toggleMute: () => {
        if (videoRef.current) {
          videoRef.current.muted = !videoRef.current.muted;
          return videoRef.current.muted;
        }
        return true;
      },
      getVideoElement: () => videoRef.current,
    }));

    useEffect(() => {
      const video = videoRef.current;
      if (!video) return;

      const attemptPlay = async () => {
        try {
          video.muted = isMuted;
          await video.play();
        } catch (err) {
          console.warn("Autoplay with sound blocked or initial play failed, attempting muted:", err);
          try {
            video.muted = true;
            await video.play();
          } catch (mutedErr) {
            console.error("Autoplay failed completely:", mutedErr);
            onError(mutedErr);
          }
        }
      };

      attemptPlay();

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }, []);

    const handleTimeUpdate = () => {
      if (!videoRef.current) return;
      const cur = videoRef.current.currentTime;
      const dur = videoRef.current.duration || 10.0;
      const prog = dur > 0 ? cur / dur : 0;
      onTimeUpdate(cur, prog, dur);
    };

    return (
      <div className="relative w-full h-full overflow-hidden bg-[#03050A]">
        <video
          ref={videoRef}
          className="w-full h-full object-cover object-center select-none"
          playsInline
          muted={isMuted}
          preload="auto"
          poster="/assets/images/sentinel-intro-poster.webp"
          onTimeUpdate={handleTimeUpdate}
          onEnded={onVideoEnded}
          onError={onError}
          onCanPlay={onCanPlay}
        >
          <source src="/assets/videos/gemini_generated_video_e39df147.mp4" type="video/mp4" />
          <source src="/assets/videos/sentinel-intro.mp4" type="video/mp4" />
          <source src="/assets/videos/gemini_generated_video_e39df147.webm" type="video/webm" />
          <source src="/assets/videos/sentinel-intro.webm" type="video/webm" />
          Your browser does not support HTML5 cinematic video.
        </video>

        {/* Subtle cinematic vignette */}
        <div className="absolute inset-0 pointer-events-none bg-radial-gradient from-transparent via-[#03050A]/20 to-[#03050A]/70" />
      </div>
    );
  }
);
