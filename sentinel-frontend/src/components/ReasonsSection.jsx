import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, HelpCircle, CheckCircle2, Award } from 'lucide-react';
import birthdayConfig from '../data/birthdayConfig';
import { sound } from '../utils/soundEffects';
import { triggerWishSparkles, triggerCelebrationConfetti } from '../utils/confetti';

export default function ReasonsSection() {
  const { heading, subtitle, reasons } = birthdayConfig.reasonsSection;
  const [flippedCards, setFlippedCards] = useState({});

  const toggleFlip = (id) => {
    sound.playSparkle();
    const willBeFlipped = !flippedCards[id];
    setFlippedCards((prev) => {
      const updated = { ...prev, [id]: willBeFlipped };
      // Check if all unlocked
      const count = Object.values(updated).filter(Boolean).length;
      if (count === reasons.length && willBeFlipped) {
        setTimeout(() => {
          sound.playConfettiPop();
          triggerCelebrationConfetti();
        }, 400);
      }
      return updated;
    });

    if (willBeFlipped) {
      triggerWishSparkles();
    }
  };

  const unlockedCount = Object.values(flippedCards).filter(Boolean).length;

  return (
    <section id="reasons" className="py-24 px-4 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-[#FF8FAB]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-[#F5D58A]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#251A3A] border border-[#FF8FAB]/30 text-xs font-semibold uppercase tracking-widest text-[#FF8FAB] mb-3"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#F5D58A]" />
            UNLOCK THE MAGIC
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-serif-heading text-3xl sm:text-5xl font-bold text-[#FFF9FC] mb-4 text-glow-pink"
          >
            {heading}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-[#C8B6FF]/80 text-sm sm:text-base font-light mb-6"
          >
            {subtitle}
          </motion.p>

          {/* Progress Tracker Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1D1432] border border-white/10 text-xs font-mono">
            <span className="text-[#F5D58A]">Discovered:</span>
            <span className="font-bold text-[#FF8FAB]">
              {unlockedCount} / {reasons.length}
            </span>
            {unlockedCount === reasons.length && (
              <span className="text-[#F5D58A] flex items-center gap-1 font-sans ml-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> All Unlocked!
              </span>
            )}
          </div>
        </div>

        {/* 10 Interactive 3D Flip Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {reasons.map((item, index) => {
            const isFlipped = !!flippedCards[item.id];

            return (
              <div
                key={item.id}
                className="h-64 sm:h-72 cursor-pointer perspective-1000 select-none"
                onClick={() => toggleFlip(item.id)}
              >
                <motion.div
                  initial={false}
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                  className="w-full h-full relative transform-style-3d"
                >
                  {/* FRONT OF CARD (Mystery / Sealed) */}
                  <div className="absolute inset-0 w-full h-full rounded-2xl p-5 bg-gradient-to-br from-[#2E2047] via-[#241738] to-[#1A1129] border border-white/10 hover:border-[#FF8FAB]/50 shadow-xl flex flex-col items-center justify-between backface-hidden group transition-colors">
                    {/* Top mystery number */}
                    <div className="w-full flex justify-between items-center text-xs text-[#FFC2D1]/60 font-mono">
                      <span>REASON #{item.id}</span>
                      <Sparkles className="w-3.5 h-3.5 text-[#F5D58A]/60 group-hover:text-[#F5D58A] transition-colors" />
                    </div>

                    {/* Center question mark / mystery seal */}
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full bg-[#171126] border border-[#FF8FAB]/40 flex items-center justify-center group-hover:scale-110 group-hover:border-[#FF8FAB] transition-all shadow-inner">
                        <HelpCircle className="w-8 h-8 text-[#FF8FAB] group-hover:text-[#F5D58A] transition-colors" />
                      </div>
                      <span className="font-serif italic text-sm text-[#FFC2D1]/80 mt-3">
                        Tap to reveal
                      </span>
                    </div>

                    {/* Bottom subtle prompt */}
                    <div className="text-[10px] uppercase font-mono tracking-wider text-[#C8B6FF]/50">
                      Hidden Secret
                    </div>
                  </div>

                  {/* BACK OF CARD (Revealed Reason) */}
                  <div className="absolute inset-0 w-full h-full rounded-2xl p-5 bg-gradient-to-br from-[#382352] via-[#2D1B43] to-[#201332] border border-[#FF8FAB]/50 shadow-[0_10px_30px_rgba(255,143,171,0.25)] flex flex-col justify-between backface-hidden rotate-y-180">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[#FF8FAB]/20 text-[#FF8FAB] border border-[#FF8FAB]/30">
                        {item.tag}
                      </span>
                      <span className="text-xl">{item.emoji}</span>
                    </div>

                    <div className="my-auto">
                      <h4 className="font-serif-heading font-bold text-base sm:text-lg text-[#FFF9FC] mb-2 leading-snug">
                        {item.title}
                      </h4>
                      <p className="text-xs text-[#C8B6FF]/90 font-light leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[10px] font-mono text-[#F5D58A]">
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3 text-[#FF8FAB] fill-[#FF8FAB]" /> Reason #{item.id}
                      </span>
                      <span className="text-[#FFC2D1]/70">Flip back</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
