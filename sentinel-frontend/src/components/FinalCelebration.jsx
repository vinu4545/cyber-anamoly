import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, Gift, PartyPopper, Stars } from 'lucide-react';
import birthdayConfig from '../data/birthdayConfig';
import { triggerGrandFinale } from '../utils/confetti';
import { sound } from '../utils/soundEffects';

export default function FinalCelebration() {
  const [magicalTriggered, setMagicalTriggered] = useState(false);
  const { finale, relationship, relationshipEndings, signatureName } = birthdayConfig;

  const relationshipNote =
    relationshipEndings[relationship] || relationshipEndings.Default;

  const handleMakeMagical = () => {
    sound.playConfettiPop();
    triggerGrandFinale();
    setMagicalTriggered(true);
  };

  // Rising balloons definition
  const balloons = [
    { id: 1, color: 'from-[#FF8FAB] to-[#E84877]', left: '10%', delay: 0 },
    { id: 2, color: 'from-[#F5D58A] to-[#D4A346]', left: '25%', delay: 0.8 },
    { id: 3, color: 'from-[#C8B6FF] to-[#9B84E3]', left: '45%', delay: 0.3 },
    { id: 4, color: 'from-[#FFC2D1] to-[#FF8FAB]', left: '65%', delay: 1.1 },
    { id: 5, color: 'from-[#F5D58A] to-[#FF8FAB]', left: '80%', delay: 0.5 },
    { id: 6, color: 'from-[#C8B6FF] to-[#FF8FAB]', left: '92%', delay: 1.4 },
  ];

  return (
    <section className="py-28 px-4 relative overflow-hidden bg-gradient-to-b from-[#171126] via-[#241738] to-[#140E20]">
      {/* Cinematic Ambient Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] bg-gradient-to-tr from-[#FF8FAB]/20 via-[#F5D58A]/15 to-[#C8B6FF]/20 rounded-full blur-[170px] pointer-events-none" />

      {/* Floating rising balloons when magical is triggered */}
      <AnimatePresence>
        {magicalTriggered && (
          <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {balloons.map((b) => (
              <motion.div
                key={b.id}
                initial={{ y: '110vh', opacity: 0.9 }}
                animate={{ y: '-30vh', opacity: [0.9, 1, 0] }}
                transition={{
                  duration: 6.5,
                  delay: b.delay,
                  ease: 'easeOut',
                }}
                className="absolute flex flex-col items-center"
                style={{ left: b.left }}
              >
                {/* Balloon body */}
                <div
                  className={`w-14 h-18 sm:w-16 sm:h-22 rounded-full bg-gradient-to-t ${b.color} shadow-lg relative`}
                >
                  {/* Balloon reflection highlight */}
                  <div className="absolute top-3 left-3 w-3 h-5 bg-white/40 rounded-full rotate-[-20deg]" />
                  {/* Knot */}
                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2 h-2 bg-inherit rotate-45" />
                </div>
                {/* String */}
                <div className="w-[1px] h-20 bg-white/30" />
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center">
        {/* Header Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#251A3A] border border-[#FF8FAB]/30 text-xs font-semibold uppercase tracking-widest text-[#FFC2D1] mb-4"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#F5D58A]" />
          THE GRAND FINALE
        </motion.div>

        {/* Section Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-serif-heading text-4xl sm:text-6xl font-bold text-[#FFF9FC] mb-4 text-glow-gold"
        >
          {finale.heading}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-[#C8B6FF]/80 text-base sm:text-lg max-w-xl mx-auto font-light mb-10"
        >
          {finale.subtitle}
        </motion.p>

        {/* The Magic Button */}
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          onClick={handleMakeMagical}
          className="px-10 py-5 rounded-full font-serif-heading text-base sm:text-lg tracking-wider text-[#171126] font-bold bg-gradient-to-r from-[#FF8FAB] via-[#FFC2D1] to-[#F5D58A] shadow-[0_0_35px_rgba(255,143,171,0.6)] hover:shadow-[0_0_55px_rgba(255,143,171,0.9)] transition-all flex items-center gap-3 cursor-pointer mb-12"
        >
          <PartyPopper className="w-6 h-6 text-[#171126]" />
          <span>{finale.buttonText}</span>
          <Sparkles className="w-5 h-5 text-[#171126]" />
        </motion.button>

        {/* Personalized Relationship Ending Card (Revealed on click or displayed nicely) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="w-full max-w-2xl p-8 sm:p-10 rounded-3xl glass-card-gold border border-[#F5D58A]/30 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-[#F5D58A]/10 rounded-full blur-2xl pointer-events-none" />

          <Heart className="w-10 h-10 text-[#FF8FAB] fill-[#FF8FAB]/40 mx-auto mb-4 animate-gentle-pulse" />

          {/* Final Emotional Paragraph */}
          <p className="font-serif text-lg sm:text-xl text-[#FFF9FC] leading-relaxed italic mb-6">
            "{relationshipNote}"
          </p>

          <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-[#F5D58A] to-transparent mx-auto mb-6" />

          {/* Grand Farewell Quote */}
          <h3 className="font-serif-heading text-xl sm:text-2xl md:text-3xl font-semibold text-[#F5D58A] mb-4">
            {finale.finalHeading}
          </h3>

          <p className="font-mono text-xs uppercase tracking-widest text-[#FFC2D1]/70">
            {finale.madeWithLoveText} — {signatureName}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
