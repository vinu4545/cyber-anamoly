import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';
import birthdayConfig from '../data/birthdayConfig';

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 400);
          return 100;
        }
        // Smooth logarithmic feel
        const step = Math.max(2, Math.floor((100 - prev) * 0.18));
        return Math.min(100, prev + step);
      });
    }, 60);

    return () => clearInterval(timer);
  }, [onComplete]);

  // Floating background stars
  const stars = Array.from({ length: 24 }).map((_, i) => ({
    id: i,
    x: (i * 37) % 95 + 2,
    y: (i * 53) % 90 + 5,
    size: (i % 3) + 2,
    delay: (i * 0.2) % 2,
  }));

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#171126] text-[#FFF9FC] overflow-hidden select-none"
    >
      {/* Ambient background glows */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-[#FF8FAB]/15 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full bg-[#C8B6FF]/15 blur-[100px] pointer-events-none" />

      {/* Floating starry particles */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-[#FFF9FC]"
          style={{
            top: `${star.y}%`,
            left: `${star.x}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
          }}
          animate={{
            opacity: [0.2, 0.9, 0.2],
            scale: [0.8, 1.4, 0.8],
          }}
          transition={{
            duration: 2.2 + star.delay,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: star.delay,
          }}
        />
      ))}

      {/* Center glowing heart container */}
      <div className="relative flex flex-col items-center z-10 px-6 max-w-sm text-center">
        <div className="relative mb-8 flex items-center justify-center">
          {/* Radial soft glow */}
          <motion.div
            className="absolute w-28 h-28 rounded-full bg-[#FF8FAB]/25 blur-xl"
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Pulsing heart ring */}
          <motion.div
            className="relative flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-tr from-[#251A3A] to-[#392854] border border-[#FF8FAB]/40 shadow-[0_0_30px_rgba(255,143,171,0.4)]"
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Heart className="w-10 h-10 text-[#FF8FAB] fill-[#FF8FAB] drop-shadow-[0_0_12px_rgba(255,143,171,0.8)]" />
          </motion.div>

          {/* Sparkle badge */}
          <motion.div
            className="absolute -top-1 -right-1"
            animate={{ rotate: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          >
            <Sparkles className="w-6 h-6 text-[#F5D58A]" />
          </motion.div>
        </div>

        {/* Personalized Welcome loading message */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl md:text-2xl font-serif-heading font-medium tracking-wide text-[#FFF9FC] mb-2"
        >
          Preparing something special for {birthdayConfig.name}...
        </motion.h2>

        <p className="text-sm text-[#C8B6FF]/80 font-light mb-8">
          Crafting a moment made purely of love & memories
        </p>

        {/* Progress Bar Container */}
        <div className="w-full max-w-xs">
          <div className="relative h-1.5 w-full bg-[#251A3A] rounded-full overflow-hidden border border-white/5">
            <motion.div
              className="h-full bg-gradient-to-r from-[#FF8FAB] via-[#C8B6FF] to-[#F5D58A] rounded-full shadow-[0_0_12px_rgba(255,143,171,0.6)]"
              style={{ width: `${progress}%` }}
              transition={{ ease: 'easeOut', duration: 0.1 }}
            />
          </div>
          
          <div className="flex justify-between items-center mt-2.5 text-xs text-[#FFC2D1]/70 font-mono">
            <span>Loading magic</span>
            <span>{progress}%</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
