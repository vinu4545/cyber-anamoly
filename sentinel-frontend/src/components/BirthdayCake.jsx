import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Flame, Wind, Heart, RotateCcw } from 'lucide-react';
import birthdayConfig from '../data/birthdayConfig';
import { sound } from '../utils/soundEffects';
import { triggerWishSparkles } from '../utils/confetti';

export default function BirthdayCake() {
  const [candlesLit, setCandlesLit] = useState(true);
  const [isBlowing, setIsBlowing] = useState(false);
  const [wishRevealed, setWishRevealed] = useState(false);

  const handleMakeAWish = () => {
    if (!candlesLit || isBlowing) return;

    setIsBlowing(true);
    sound.playCandleBlow();

    // After brief blowing animation, blow out candles
    setTimeout(() => {
      setCandlesLit(false);
      setIsBlowing(false);
      setWishRevealed(true);
      triggerWishSparkles();
      sound.playSparkle();
    }, 900);
  };

  const handleRelight = () => {
    sound.playSparkle();
    setCandlesLit(true);
    setWishRevealed(false);
  };

  return (
    <section id="cake" className="py-20 px-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#FF8FAB]/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-4xl mx-auto flex flex-col items-center text-center relative z-10">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <span className="text-xs font-semibold tracking-widest uppercase text-[#FF8FAB] inline-flex items-center gap-1.5 mb-2">
            <Sparkles className="w-4 h-4 text-[#F5D58A]" />
            MOMENT OF WONDER
          </span>
          <h2 className="font-serif-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#FFF9FC] mb-3">
            {birthdayConfig.cake.title}
          </h2>
          <p className="text-[#C8B6FF]/80 max-w-lg mx-auto text-sm sm:text-base font-light">
            {birthdayConfig.cake.instruction}
          </p>
        </motion.div>

        {/* The Animated Birthday Cake Visual */}
        <div className="relative my-8 flex flex-col items-center">
          {/* Blowing wind visual indicator */}
          <AnimatePresence>
            {isBlowing && (
              <motion.div
                initial={{ opacity: 0, x: -80, scale: 0.5 }}
                animate={{ opacity: 0.8, x: 0, scale: 1.1 }}
                exit={{ opacity: 0, x: 80 }}
                transition={{ duration: 0.8 }}
                className="absolute -top-12 z-30 flex items-center gap-2 text-[#FFF9FC] pointer-events-none"
              >
                <Wind className="w-12 h-12 text-[#C8B6FF] animate-pulse" />
                <span className="font-serif italic text-lg text-[#F5D58A]">Blowing...</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Candle Flames & Smoke */}
          <div className="flex gap-8 sm:gap-12 mb-1 z-20">
            {[0, 1, 2].map((idx) => (
              <div key={idx} className="relative flex flex-col items-center">
                {/* Flame or Smoke */}
                <AnimatePresence mode="wait">
                  {candlesLit ? (
                    <motion.div
                      key="flame"
                      initial={{ scale: 0 }}
                      animate={{ scale: [1, 1.15, 0.95, 1], y: [0, -2, 0] }}
                      exit={{ scale: 0, opacity: 0, y: -10 }}
                      transition={{
                        scale: { duration: 0.8 + idx * 0.2, repeat: Infinity, ease: 'easeInOut' },
                        exit: { duration: 0.3 },
                      }}
                      className="relative cursor-pointer"
                      onClick={handleMakeAWish}
                      title="Click to blow out"
                    >
                      {/* Glow halo */}
                      <div className="absolute -inset-2 rounded-full bg-[#F5D58A]/40 blur-md" />
                      <div className="w-5 h-8 sm:w-6 sm:h-9 bg-gradient-to-t from-[#FF8FAB] via-[#F5D58A] to-[#FFF9FC] rounded-full rounded-t-full shadow-[0_0_15px_#F5D58A] flame-active" />
                    </motion.div>
                  ) : (
                    // Smoke puff after blowing out
                    <motion.div
                      key="smoke"
                      initial={{ opacity: 0.8, y: 0, scale: 0.4 }}
                      animate={{ opacity: 0, y: -40, scale: 1.8 }}
                      transition={{ duration: 1.8, ease: 'easeOut' }}
                      className="w-3 h-6 rounded-full bg-white/40 blur-sm pointer-events-none"
                    />
                  )}
                </AnimatePresence>

                {/* Candle body */}
                <div className="w-3.5 sm:w-4 h-12 sm:h-14 bg-gradient-to-b from-[#FFF9FC] to-[#FFC2D1] rounded-t-sm shadow-md border-t border-white relative overflow-hidden">
                  {/* Candle stripes */}
                  <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_4px,rgba(255,143,171,0.4)_4px,rgba(255,143,171,0.4)_8px)]" />
                </div>
              </div>
            ))}
          </div>

          {/* Cake Layers */}
          <div className="relative flex flex-col items-center">
            {/* Top Frosting / Layer 1 */}
            <div className="relative w-44 sm:w-56 h-14 bg-gradient-to-b from-[#FFC2D1] to-[#FF8FAB] rounded-t-2xl shadow-lg border-t-2 border-white/60 flex items-center justify-around px-4">
              {/* Dripping frosting scallops */}
              <div className="absolute -bottom-3 inset-x-0 flex justify-between px-2 overflow-hidden pointer-events-none">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="w-4 h-4 rounded-full bg-[#FF8FAB]" />
                ))}
              </div>
              {/* Strawberry/Cherry gems */}
              <div className="w-3 h-3 rounded-full bg-[#F5D58A] shadow-sm animate-pulse" />
              <div className="w-3.5 h-3.5 rounded-full bg-[#FFF9FC] shadow-sm" />
              <div className="w-3 h-3 rounded-full bg-[#F5D58A] shadow-sm animate-pulse" />
            </div>

            {/* Middle Cream Divider */}
            <div className="w-56 sm:w-68 h-2 bg-gradient-to-r from-[#FFF9FC] via-[#F5D58A] to-[#FFF9FC] rounded-full z-10 shadow-sm" />

            {/* Bottom Layer 2 */}
            <div className="relative w-56 sm:w-72 h-20 bg-gradient-to-b from-[#392854] via-[#2A1D40] to-[#1E1430] rounded-b-3xl shadow-2xl border-t border-white/10 flex items-center justify-center overflow-hidden">
              {/* Decorative gold filigree ribbons */}
              <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,transparent,transparent_12px,rgba(245,213,138,0.12)_12px,rgba(245,213,138,0.12)_14px)]" />
              <span className="font-serif-heading font-medium tracking-widest text-xs uppercase text-[#F5D58A] drop-shadow-md z-10">
                ★ {birthdayConfig.name} ★
              </span>
            </div>

            {/* Cake Stand / Plate */}
            <div className="w-68 sm:w-88 h-4 bg-gradient-to-r from-[#C8B6FF]/40 via-[#FFF9FC]/70 to-[#C8B6FF]/40 rounded-full shadow-[0_15px_30px_rgba(0,0,0,0.6)] mt-0.5 border-t border-white/50" />
            <div className="w-24 sm:w-28 h-6 bg-gradient-to-b from-[#251A3A] to-[#171126] rounded-b-xl border border-white/10" />
          </div>
        </div>

        {/* Action Button & Wish Outcome Message */}
        <div className="mt-6 flex flex-col items-center min-h-[90px]">
          <AnimatePresence mode="wait">
            {candlesLit ? (
              <motion.button
                key="make-wish-btn"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleMakeAWish}
                disabled={isBlowing}
                className="px-8 py-3.5 rounded-full font-medium tracking-wider text-sm uppercase text-[#171126] bg-gradient-to-r from-[#F5D58A] via-[#FF8FAB] to-[#FFC2D1] shadow-[0_0_25px_rgba(245,213,138,0.4)] hover:shadow-[0_0_35px_rgba(245,213,138,0.7)] transition-all flex items-center gap-2 cursor-pointer"
              >
                <Flame className="w-4 h-4 text-[#171126] fill-[#171126]" />
                <span>{birthdayConfig.cake.buttonText}</span>
                <Sparkles className="w-4 h-4 text-[#171126]" />
              </motion.button>
            ) : (
              <motion.div
                key="wish-message"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="flex flex-col items-center gap-4"
              >
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#251A3A] to-[#392854] border border-[#F5D58A]/50 shadow-[0_0_30px_rgba(245,213,138,0.25)] max-w-lg">
                  <p className="font-serif text-lg sm:text-xl text-[#F5D58A] font-medium italic">
                    {birthdayConfig.cake.wishGrantedMessage}
                  </p>
                </div>

                <button
                  onClick={handleRelight}
                  className="inline-flex items-center gap-1.5 text-xs text-[#FFC2D1]/80 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/10"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{birthdayConfig.cake.relightButton}</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
