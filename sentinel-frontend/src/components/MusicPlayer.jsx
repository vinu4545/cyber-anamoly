import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Volume2, VolumeX, Sparkles } from 'lucide-react';
import birthdayConfig from '../data/birthdayConfig';
import { sound } from '../utils/soundEffects';

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const audioRef = useRef(null);

  const toggleMusic = () => {
    if (isPlaying) {
      sound.stopAmbientMusic();
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
    } else {
      // Attempt local audio playback or use built-in celestial audio synthesizer
      sound.initContext();
      sound.startAmbientMusic();
      setIsPlaying(true);

      if (audioRef.current) {
        audioRef.current.play().catch(() => {
          // If external mp3 is missing, Web Audio synthesizer handles it automatically!
        });
      }
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-40 flex items-center gap-3">
      <audio
        ref={audioRef}
        src={birthdayConfig.music.audioPath}
        loop
        preload="none"
      />

      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={toggleMusic}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className={`relative p-3.5 rounded-full border shadow-lg transition-all duration-300 flex items-center justify-center cursor-pointer ${
            isPlaying
              ? 'bg-gradient-to-tr from-[#FF8FAB] to-[#F5D58A] border-[#FFF9FC] text-[#171126] shadow-[0_0_20px_rgba(255,143,171,0.6)]'
              : 'bg-[#251A3A]/90 hover:bg-[#32234D] border-white/15 text-white/80 shadow-black/40'
          }`}
          aria-label={isPlaying ? 'Pause Background Music' : 'Play Background Music'}
        >
          {isPlaying ? (
            <div className="flex items-center gap-1 h-5 w-5 justify-center">
              {/* Equalizer bars animation */}
              <span className="w-1 bg-[#171126] rounded-full animate-bounce" style={{ height: '60%', animationDelay: '0ms' }} />
              <span className="w-1 bg-[#171126] rounded-full animate-bounce" style={{ height: '100%', animationDelay: '150ms' }} />
              <span className="w-1 bg-[#171126] rounded-full animate-bounce" style={{ height: '40%', animationDelay: '300ms' }} />
            </div>
          ) : (
            <VolumeX className="w-5 h-5 text-white/70" />
          )}
        </motion.button>

        {/* Tooltip */}
        <AnimatePresence>
          {showTooltip && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute left-full ml-3 top-1/2 -translate-y-1/2 whitespace-nowrap px-3 py-1.5 rounded-xl bg-[#251A3A]/95 border border-white/10 text-xs text-[#FFF9FC] shadow-xl pointer-events-none z-50 flex items-center gap-1.5"
            >
              <Music className="w-3.5 h-3.5 text-[#FF8FAB]" />
              <span>{isPlaying ? 'Pause Melody' : 'Play Celestial Melody'}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating track info pill when playing */}
      {isPlaying && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-[#251A3A]/80 border border-white/10 text-[11px] font-mono text-[#F5D58A] backdrop-blur-md"
        >
          <Sparkles className="w-3 h-3 text-[#F5D58A] animate-spin" style={{ animationDuration: '4s' }} />
          <span>{birthdayConfig.music.title}</span>
        </motion.div>
      )}
    </div>
  );
}
