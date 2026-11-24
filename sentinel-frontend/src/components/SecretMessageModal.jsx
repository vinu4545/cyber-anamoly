import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Key, Sparkles, X, Heart } from 'lucide-react';
import birthdayConfig from '../data/birthdayConfig';
import { sound } from '../utils/soundEffects';

export default function SecretMessageModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const { modalTitle, content } = birthdayConfig.secretMessage;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.85, rotate: -3 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.85, rotate: 3 }}
          transition={{ type: 'spring', damping: 20 }}
          className="relative max-w-md w-full p-6 sm:p-8 rounded-3xl glass-card-gold border border-[#F5D58A] shadow-[0_0_50px_rgba(245,213,138,0.3)] text-center overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/60 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Golden Key / Heart emblem */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#F5D58A] to-[#FF8FAB] p-[2px] mx-auto mb-4 shadow-lg shadow-[#F5D58A]/30">
            <div className="w-full h-full rounded-full bg-[#171126] flex items-center justify-center">
              <Key className="w-7 h-7 text-[#F5D58A]" />
            </div>
          </div>

          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#FF8FAB] font-semibold">
            EASTER EGG UNLOCKED
          </span>

          <h3 className="font-serif-heading text-2xl font-bold text-[#FFF9FC] mt-1 mb-4">
            {modalTitle}
          </h3>

          <div className="p-5 rounded-2xl bg-[#171126]/90 border border-white/10 mb-6 text-left">
            <p className="font-serif text-base text-[#FFC2D1] leading-relaxed italic">
              "{content}"
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-[#F5D58A] font-mono">
            <Heart className="w-3.5 h-3.5 fill-[#FF8FAB] text-[#FF8FAB]" />
            <span>Dedicated to {birthdayConfig.name}</span>
            <Sparkles className="w-3.5 h-3.5" />
          </div>

          <button
            onClick={onClose}
            className="mt-6 px-8 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider text-[#171126] bg-[#F5D58A] hover:bg-[#FBE2A8] transition-colors"
          >
            Keep the Secret Safe ✨
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
