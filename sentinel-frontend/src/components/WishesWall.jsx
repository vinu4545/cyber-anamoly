import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, Plus, Star } from 'lucide-react';
import birthdayConfig from '../data/birthdayConfig';
import { sound } from '../utils/soundEffects';
import { triggerWishSparkles } from '../utils/confetti';

export default function WishesWall() {
  const { heading, subtitle, wishes, revealButtonText } = birthdayConfig.wishesSection;
  
  // Show initial 6 wishes, let user reveal more one by one
  const [visibleCount, setVisibleCount] = useState(6);
  const [highlightedWish, setHighlightedWish] = useState(null);

  const handleRevealMore = () => {
    sound.playSparkle();
    triggerWishSparkles();

    if (visibleCount < wishes.length) {
      const nextIndex = visibleCount;
      setVisibleCount((prev) => prev + 1);
      setHighlightedWish(wishes[nextIndex]);
      setTimeout(() => setHighlightedWish(null), 3000);
    } else {
      // Pick a random wish to spotlight
      const randomWish = wishes[Math.floor(Math.random() * wishes.length)];
      setHighlightedWish(randomWish);
      setTimeout(() => setHighlightedWish(null), 3000);
    }
  };

  const colorVariants = {
    pink: 'border-[#FF8FAB]/30 bg-gradient-to-br from-[#2E1F3D] to-[#1E142B] text-[#FFC2D1]',
    gold: 'border-[#F5D58A]/30 bg-gradient-to-br from-[#33253A] to-[#1F1728] text-[#F5D58A]',
    lavender: 'border-[#C8B6FF]/30 bg-gradient-to-br from-[#261E3E] to-[#19132B] text-[#C8B6FF]',
    rose: 'border-[#FFC2D1]/30 bg-gradient-to-br from-[#301D38] to-[#1D1126] text-[#FF8FAB]',
  };

  return (
    <section id="wishes" className="py-24 px-4 relative overflow-hidden bg-[#171126]/60">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#C8B6FF]/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#251A3A] border border-[#F5D58A]/30 text-xs font-semibold uppercase tracking-widest text-[#F5D58A] mb-3"
          >
            <Star className="w-3.5 h-3.5" />
            CONSTELLATION OF BLESSINGS
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-serif-heading text-3xl sm:text-5xl font-bold text-[#FFF9FC] mb-4 text-glow-gold"
          >
            {heading}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-[#C8B6FF]/80 text-sm sm:text-base font-light"
          >
            {subtitle}
          </motion.p>
        </div>

        {/* Wishes Grid with Staggered Entrance */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {wishes.slice(0, visibleCount).map((wish, index) => {
            const isHighlighted = highlightedWish?.id === wish.id;
            const style = colorVariants[wish.color] || colorVariants.pink;

            return (
              <motion.div
                key={wish.id}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{
                  opacity: 1,
                  scale: isHighlighted ? 1.05 : 1,
                  y: 0,
                  boxShadow: isHighlighted ? '0 0 35px rgba(245,213,138,0.5)' : '',
                }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className={`p-6 sm:p-7 rounded-3xl border shadow-lg backdrop-blur-md transition-all duration-300 relative group overflow-hidden ${style}`}
              >
                {/* Sparkle badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] uppercase font-mono tracking-wider px-2.5 py-0.5 rounded-full bg-black/30 border border-white/10">
                    {wish.category}
                  </span>
                  <Heart className="w-4 h-4 text-[#FF8FAB] group-hover:scale-125 transition-transform" />
                </div>

                <p className="font-serif-heading text-lg sm:text-xl text-[#FFF9FC] leading-relaxed font-normal mb-2">
                  "{wish.text}"
                </p>

                <div className="text-[11px] font-mono text-[#F5D58A]/70 flex items-center gap-1 mt-4">
                  <Sparkles className="w-3 h-3 text-[#F5D58A]" />
                  <span>Blessing #{wish.id}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Action Button: Reveal One More Wish */}
        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRevealMore}
            className="px-8 py-3.5 rounded-full font-medium text-sm tracking-wider uppercase text-[#171126] bg-gradient-to-r from-[#F5D58A] via-[#FFC2D1] to-[#FF8FAB] shadow-[0_0_25px_rgba(245,213,138,0.4)] hover:shadow-[0_0_35px_rgba(245,213,138,0.7)] transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#171126]" />
            <span>{revealButtonText}</span>
            <Sparkles className="w-4 h-4 text-[#171126]" />
          </motion.button>
        </div>
      </div>
    </section>
  );
}
