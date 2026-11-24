import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Smile, RefreshCw, X, Heart, MessageCircle } from 'lucide-react';
import birthdayConfig from '../data/birthdayConfig';
import { sound } from '../utils/soundEffects';
import { triggerWishSparkles } from '../utils/confetti';

export default function SurpriseGenerator({ isOpen, onClose }) {
  const { messages, title } = birthdayConfig.smileGenerator;
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNextMessage = () => {
    sound.playSparkle();
    triggerWishSparkles();
    setCurrentIndex((prev) => (prev + 1) % messages.length);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative max-w-md w-full p-6 sm:p-8 rounded-3xl glass-card border border-[#FF8FAB]/40 shadow-2xl text-center overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/60 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Icon */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#FF8FAB] to-[#F5D58A] p-[2px] mx-auto mb-5 shadow-lg shadow-[#FF8FAB]/30">
            <div className="w-full h-full rounded-full bg-[#171126] flex items-center justify-center">
              <Smile className="w-8 h-8 text-[#F5D58A]" />
            </div>
          </div>

          <h3 className="font-serif-heading text-2xl font-bold text-[#FFF9FC] mb-2">
            {title}
          </h3>

          <p className="text-xs uppercase tracking-widest text-[#FFC2D1]/70 font-mono mb-6">
            A little dose of joy just for you
          </p>

          {/* Animated Message Card */}
          <div className="min-h-[120px] flex items-center justify-center p-5 rounded-2xl bg-[#171126]/80 border border-white/10 mb-6 relative">
            <motion.p
              key={currentIndex}
              initial={{ opacity: 0, y: 10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="font-serif text-lg text-[#FFF9FC] leading-relaxed italic"
            >
              "{messages[currentIndex]}"
            </motion.p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleNextMessage}
              className="w-full sm:w-auto px-6 py-3 rounded-full font-medium text-xs uppercase tracking-wider text-[#171126] bg-gradient-to-r from-[#FF8FAB] via-[#FFC2D1] to-[#F5D58A] shadow-[0_0_20px_rgba(255,143,171,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Another Smile Please!</span>
            </button>
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-3 rounded-full text-xs font-medium text-white/70 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
