import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { sound } from '../utils/soundEffects';

export default function FloatingHeartButton() {
  const [hearts, setHearts] = useState([]);

  const spawnHeart = () => {
    sound.playSparkle();
    const newHeart = {
      id: Date.now() + Math.random(),
      x: (Math.random() - 0.5) * 80, // slight random horizontal drift
      rotate: (Math.random() - 0.5) * 50,
      size: Math.floor(Math.random() * 12) + 18,
      color: ['#FF8FAB', '#FFC2D1', '#F5D58A', '#C8B6FF'][Math.floor(Math.random() * 4)],
    };

    setHearts((prev) => [...prev, newHeart]);

    // Cleanup after animation finishes
    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
    }, 2000);
  };

  return (
    <div className="fixed bottom-6 right-20 z-40 flex flex-col items-center">
      {/* Container for rising hearts */}
      <div className="relative pointer-events-none w-1 h-1">
        <AnimatePresence>
          {hearts.map((h) => (
            <motion.div
              key={h.id}
              initial={{ opacity: 1, y: 0, x: 0, scale: 0.6 }}
              animate={{
                opacity: 0,
                y: -140,
                x: h.x,
                scale: 1.2,
                rotate: h.rotate,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.8, ease: 'easeOut' }}
              className="absolute bottom-2 left-0 -translate-x-1/2 pointer-events-none"
              style={{ color: h.color }}
            >
              <Heart
                style={{ width: `${h.size}px`, height: `${h.size}px` }}
                className="fill-current drop-shadow-md"
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* The Floating Heart Button */}
      <motion.button
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.88 }}
        onClick={spawnHeart}
        className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#FF8FAB] to-[#FFC2D1] text-[#171126] shadow-[0_0_20px_rgba(255,143,171,0.5)] hover:shadow-[0_0_30px_rgba(255,143,171,0.8)] flex items-center justify-center cursor-pointer border border-white/40 transition-shadow"
        title="Send a heart with love ❤️"
        aria-label="Send Love"
      >
        <Heart className="w-5 h-5 fill-[#171126] text-[#171126]" />
      </motion.button>
    </div>
  );
}
