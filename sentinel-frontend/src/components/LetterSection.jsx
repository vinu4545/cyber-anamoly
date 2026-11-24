import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Mail, Send, X, CornerRightDown } from 'lucide-react';
import birthdayConfig from '../data/birthdayConfig';
import { sound } from '../utils/soundEffects';
import { triggerWishSparkles } from '../utils/confetti';

export default function LetterSection() {
  const [isOpen, setIsOpen] = useState(false);
  const { letter } = birthdayConfig;

  const handleOpenLetter = () => {
    sound.playEnvelopeOpen();
    triggerWishSparkles();
    setIsOpen(true);
  };

  const handleCloseLetter = () => {
    sound.playSparkle();
    setIsOpen(false);
  };

  return (
    <section id="letter" className="py-24 px-4 relative overflow-hidden bg-[#1D1432]/30">
      {/* Background magical glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FF8FAB]/15 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#251A3A] border border-[#FF8FAB]/30 text-xs font-semibold uppercase tracking-widest text-[#FF8FAB] mb-3"
          >
            <Mail className="w-3.5 h-3.5" />
            FROM THE BOTTOM OF MY HEART
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-serif-heading text-3xl sm:text-5xl font-bold text-[#FFF9FC] mb-4 text-glow-pink"
          >
            {letter.heading}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-[#C8B6FF]/80 text-sm sm:text-base font-light"
          >
            {letter.subtitle}
          </motion.p>
        </div>

        {/* Envelope & Letter Interactive Showcase */}
        <div className="flex flex-col items-center">
          <AnimatePresence mode="wait">
            {!isOpen ? (
              // SEALED ENVELOPE VIEW
              <motion.div
                key="sealed-envelope"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center cursor-pointer group"
                onClick={handleOpenLetter}
              >
                {/* Floating envelope card */}
                <div className="relative w-80 sm:w-96 md:w-[460px] h-56 sm:h-64 rounded-3xl bg-gradient-to-br from-[#35224F] via-[#2A1A3E] to-[#1C122B] p-1 border border-[#F5D58A]/40 shadow-[0_20px_50px_rgba(0,0,0,0.6)] group-hover:shadow-[0_25px_60px_rgba(255,143,171,0.3)] transition-all duration-500 overflow-hidden envelope-shadow">
                  {/* Decorative gold envelope trims */}
                  <div className="absolute inset-2 border border-dashed border-[#F5D58A]/30 rounded-2xl pointer-events-none" />

                  {/* Envelope triangular flap design */}
                  <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-[#3E295E] to-[#2E1D47] border-b border-[#F5D58A]/40 [clip-path:polygon(0_0,100%_0,50%_100%)] flex items-start justify-center pt-2">
                    {/* Golden filigree highlight */}
                    <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-[#F5D58A] to-transparent" />
                  </div>

                  {/* Wax Seal with Heart in Center */}
                  <motion.div
                    whileHover={{ scale: 1.12 }}
                    className="absolute top-24 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center"
                  >
                    <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-gradient-to-tr from-[#9B1D40] via-[#C92A57] to-[#E84877] border-2 border-[#F5D58A] shadow-[0_0_20px_rgba(201,42,87,0.7)] flex items-center justify-center cursor-pointer">
                      <Heart className="w-8 h-8 text-[#FFF9FC] fill-[#FFF9FC] drop-shadow-md" />
                      <div className="absolute inset-0 rounded-full border border-white/40 pointer-events-none" />
                    </div>
                    <span className="text-[10px] uppercase font-mono tracking-widest text-[#F5D58A] mt-2 font-semibold">
                      WAX SEAL
                    </span>
                  </motion.div>

                  {/* Bottom Envelope Letter Preview Label */}
                  <div className="absolute bottom-4 inset-x-0 text-center">
                    <p className="font-serif italic text-sm text-[#FFC2D1]/90">
                      "{letter.envelopeLabel}"
                    </p>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#F5D58A]/80">
                      Private & Confidential For {birthdayConfig.name}
                    </span>
                  </div>
                </div>

                {/* Open Letter Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleOpenLetter}
                  className="mt-8 px-8 py-3.5 rounded-full font-medium text-sm tracking-wider uppercase text-[#171126] bg-gradient-to-r from-[#FF8FAB] via-[#FFC2D1] to-[#F5D58A] shadow-[0_0_25px_rgba(255,143,171,0.4)] hover:shadow-[0_0_40px_rgba(255,143,171,0.7)] transition-all flex items-center gap-2"
                >
                  <Mail className="w-4 h-4 text-[#171126]" />
                  <span>{letter.openButtonText}</span>
                  <Sparkles className="w-4 h-4 text-[#171126]" />
                </motion.button>
              </motion.div>
            ) : (
              // UNFOLDED HANDWRITTEN LETTER VIEW
              <motion.div
                key="unfolded-letter"
                initial={{ opacity: 0, y: 30, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full max-w-2xl"
              >
                {/* Floating ambient hearts around paper */}
                {[0, 1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    className="absolute text-[#FF8FAB]/60 pointer-events-none"
                    style={{
                      top: `${20 + i * 20}%`,
                      left: i % 2 === 0 ? '-24px' : 'auto',
                      right: i % 2 !== 0 ? '-24px' : 'auto',
                    }}
                    animate={{
                      y: [-8, 8, -8],
                      opacity: [0.3, 0.9, 0.3],
                    }}
                    transition={{
                      duration: 3 + i,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    <Heart className="w-5 h-5 fill-[#FF8FAB]/40" />
                  </motion.div>
                ))}

                {/* The Parchment / Letter Paper */}
                <div className="relative rounded-3xl paper-texture p-6 sm:p-12 text-[#2A1D34] shadow-[0_25px_70px_rgba(0,0,0,0.8)] border border-[#E0D0B8] relative overflow-hidden">
                  {/* Vintage Postal Stamp & Watermark in Corner */}
                  <div className="absolute top-6 right-6 flex flex-col items-center opacity-85 pointer-events-none">
                    <div className="w-16 h-20 border-2 border-dashed border-[#A04561] rounded-sm p-1 flex flex-col items-center justify-center bg-[#FFF1E8]">
                      <Heart className="w-6 h-6 text-[#A04561] fill-[#A04561]" />
                      <span className="text-[9px] font-mono uppercase text-[#A04561] font-bold mt-1">
                        AIR MAIL
                      </span>
                    </div>
                    <span className="text-[9px] font-mono tracking-widest text-[#666] mt-1">
                      POSTAGE PAID
                    </span>
                  </div>

                  {/* Letter Header */}
                  <div className="mb-6 pt-2">
                    <h3 className="font-handwriting text-3xl sm:text-4xl text-[#7E1A40] font-bold">
                      {letter.salutation}
                    </h3>
                  </div>

                  {/* Letter Paragraphs */}
                  <div className="space-y-4 font-serif text-base sm:text-lg text-[#32233D] leading-relaxed tracking-wide font-normal">
                    {letter.paragraphs.map((p, idx) => (
                      <motion.p
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 * idx }}
                      >
                        {p}
                      </motion.p>
                    ))}
                  </div>

                  {/* Letter Closing & Handwritten Signature */}
                  <div className="mt-8 pt-4 border-t border-[#DCCBB4] flex flex-col items-end">
                    <p className="font-serif italic text-base text-[#684C72]">
                      {letter.closing}
                    </p>
                    <p className="font-handwriting text-2xl sm:text-3xl font-bold text-[#A0284D] mt-1">
                      {letter.senderName}
                    </p>
                  </div>
                </div>

                {/* Re-fold Button */}
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={handleCloseLetter}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-mono uppercase tracking-wider text-[#FFF9FC]/80 bg-[#251A3A]/80 hover:bg-[#251A3A] border border-white/10 hover:border-white/30 transition-all cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>{letter.closeButtonText}</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
