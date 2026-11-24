import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart, ChevronDown, Gift } from 'lucide-react';
import birthdayConfig from '../data/birthdayConfig';
import { triggerCelebrationConfetti } from '../utils/confetti';
import { sound } from '../utils/soundEffects';

export default function Hero({ onOpenSurprise }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleOpenSurpriseClick = () => {
    sound.playConfettiPop();
    triggerCelebrationConfetti();
    if (onOpenSurprise) {
      onOpenSurprise();
    }
    // Smooth scroll to next section
    const target = document.getElementById('cake');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center pt-20 pb-16 px-4 overflow-hidden bg-gradient-to-b from-[#120C09] via-[#21150F] to-[#120C09]">
      {/* Cinematic Glowing Background Orbs in Amber & Champagne */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-[#A94F20]/25 via-[#FFAD66]/20 to-[#FFE5B4]/15 blur-[150px] pointer-events-none" />
      <div className="absolute top-10 right-10 w-96 h-96 rounded-full bg-[#D98236]/15 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-[#A94F20]/20 blur-[110px] pointer-events-none" />

      {/* Decorative Ribbon SVG in background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-35">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <motion.path
            d="M-100,200 C300,50 600,350 1200,100 C1500,-50 1800,250 2100,150"
            fill="none"
            stroke="url(#ribbonAmber1)"
            strokeWidth="2.5"
            strokeDasharray="8 12"
            animate={{ strokeDashoffset: [0, -100] }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          />
          <motion.path
            d="M-50,600 C400,450 700,750 1300,500 C1700,300 2000,650 2300,400"
            fill="none"
            stroke="url(#ribbonAmber2)"
            strokeWidth="2"
            strokeDasharray="6 10"
            animate={{ strokeDashoffset: [0, 80] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          />
          <defs>
            <linearGradient id="ribbonAmber1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#A94F20" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#FFE5B4" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#FFAD66" stopOpacity="0.5" />
            </linearGradient>
            <linearGradient id="ribbonAmber2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#D98236" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#FFD09B" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#FFE5B4" stopOpacity="0.6" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Floating Sparkles & Heart particles */}
      {[
        { top: '15%', left: '12%', size: 'w-5 h-5', delay: 0 },
        { top: '22%', right: '14%', size: 'w-6 h-6', delay: 1.2 },
        { top: '65%', left: '8%', size: 'w-7 h-7', delay: 0.8 },
        { top: '75%', right: '12%', size: 'w-5 h-5', delay: 1.8 },
      ].map((pos, idx) => (
        <motion.div
          key={idx}
          className={`absolute ${pos.size} text-[#FFE5B4]/60 pointer-events-none hidden sm:block`}
          style={{ top: pos.top, left: pos.left, right: pos.right }}
          animate={{
            y: [-10, 10, -10],
            rotate: [0, 15, -15, 0],
            opacity: [0.4, 0.9, 0.4],
          }}
          transition={{
            duration: 4.5,
            delay: pos.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {idx % 2 === 0 ? <Sparkles className="w-full h-full text-[#FFE5B4]" /> : <Heart className="w-full h-full text-[#FFAD66] fill-[#FFAD66]/40" />}
        </motion.div>
      ))}

      {/* Hero Content */}
      <div className="relative max-w-5xl mx-auto flex flex-col items-center text-center z-10">
        {/* Top Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#21150F]/80 border border-[#FFAD66]/30 shadow-[0_0_20px_rgba(217,130,54,0.3)] mb-6 backdrop-blur-md"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#FFE5B4] animate-spin" style={{ animationDuration: '6s' }} />
          <span className="text-xs uppercase tracking-[0.25em] font-medium text-[#FFD09B]">
            {birthdayConfig.hero.badge}
          </span>
          <Sparkles className="w-3.5 h-3.5 text-[#FFE5B4] animate-spin" style={{ animationDuration: '6s' }} />
        </motion.div>

        {/* Main Animated Birthday Heading */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif-heading text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-[#FFE5B4] mb-4 text-glow-champagne"
        >
          HAPPY BIRTHDAY,{' '}
          <span className="bg-gradient-to-r from-[#FFE5B4] via-[#FFD09B] to-[#FFAD66] bg-clip-text text-transparent">
            {birthdayConfig.name.toUpperCase()}!
          </span>
        </motion.h1>

        {/* Subtitle / Quote as requested */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="font-elegant text-xl sm:text-2xl md:text-3xl italic text-[#FFD09B] font-light max-w-2xl mb-2"
        >
          "{birthdayConfig.hero.subtitle}"
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="text-sm sm:text-base text-[#FFE5B4]/80 max-w-xl mb-10 leading-relaxed font-light"
        >
          {birthdayConfig.hero.universeQuote}
        </motion.p>

        {/* Profile Photograph inside Luxury Glowing Circular Frame */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, delay: 0.5, type: 'spring', damping: 18 }}
          className="relative mb-10 group"
        >
          {/* Animated decorative outer rings */}
          <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-[#A94F20]/40 via-[#FFAD66]/30 to-[#FFE5B4]/40 blur-lg group-hover:blur-xl transition-all duration-500 animate-pulse-glow" />
          
          <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-full p-[3px] bg-gradient-to-tr from-[#A94F20] via-[#FFAD66] to-[#FFE5B4] shadow-[0_10px_40px_rgba(217,130,54,0.4)] overflow-hidden">
            <div className="w-full h-full rounded-full overflow-hidden bg-[#21150F] relative">
              <img
                src={imgError ? birthdayConfig.profileFallback : birthdayConfig.profileImage}
                alt={birthdayConfig.name}
                onError={() => setImgError(true)}
                onLoad={() => setImgLoaded(true)}
                className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 ${
                  imgLoaded ? 'opacity-100' : 'opacity-0'
                }`}
              />
              {!imgLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#21150F]">
                  <Heart className="w-10 h-10 text-[#FFAD66] animate-pulse" />
                </div>
              )}
            </div>
          </div>

          {/* Floating Monogram / Birthday Badge */}
          <motion.div
            animate={{ y: [-4, 4, -4] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -bottom-3 right-4 sm:right-6 bg-gradient-to-r from-[#21150F] to-[#3D2214] border border-[#FFE5B4]/60 px-3.5 py-1.5 rounded-full shadow-lg shadow-black/50 flex items-center gap-1.5 backdrop-blur-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FFE5B4]" />
            <span className="text-xs font-semibold tracking-wider text-[#FFE5B4]">
              {birthdayConfig.nickname} ✨
            </span>
          </motion.div>
        </motion.div>

        {/* Main CTA Button: OPEN YOUR SURPRISE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <button
            onClick={handleOpenSurpriseClick}
            className="relative group px-8 py-4 rounded-full font-medium text-base tracking-wider uppercase text-[#120C09] bg-gradient-to-r from-[#FFAD66] via-[#FFD09B] to-[#FFE5B4] shadow-[0_0_30px_rgba(255,173,102,0.5)] hover:shadow-[0_0_45px_rgba(255,173,102,0.8)] transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2.5 overflow-hidden cursor-pointer"
          >
            {/* Shimmer line */}
            <div className="absolute top-0 left-0 w-full h-full bg-white/25 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
            <Gift className="w-5 h-5 text-[#120C09]" />
            <span className="font-semibold text-sm sm:text-base">
              {birthdayConfig.hero.buttonText}
            </span>
            <Sparkles className="w-4 h-4 text-[#120C09]" />
          </button>
        </motion.div>

        {/* Bottom Scroll Prompt */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-14 flex flex-col items-center gap-2 cursor-pointer group"
          onClick={() => {
            const cakeSec = document.getElementById('cake');
            if (cakeSec) cakeSec.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <span className="text-[11px] tracking-[0.25em] uppercase font-light text-[#FFD09B]/70 group-hover:text-[#FFE5B4] transition-colors">
            {birthdayConfig.hero.scrollPrompt}
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown className="w-5 h-5 text-[#FFAD66]/80 group-hover:text-[#FFE5B4] transition-colors" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
