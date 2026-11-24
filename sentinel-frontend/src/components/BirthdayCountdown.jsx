import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, PartyPopper, Sparkles } from 'lucide-react';
import birthdayConfig from '../data/birthdayConfig';

export default function BirthdayCountdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    status: 'today', // 'today', 'upcoming', 'passed'
  });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      const bdayStr = birthdayConfig.birthdayDate;
      const [year, month, day] = bdayStr.split('-').map(Number);
      
      const targetDateThisYear = new Date(now.getFullYear(), month - 1, day, 0, 0, 0);
      const isToday =
        now.getMonth() === month - 1 &&
        now.getDate() === day;

      if (isToday) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, status: 'today' });
        return;
      }

      let diff = targetDateThisYear.getTime() - now.getTime();
      let status = 'upcoming';

      if (diff < 0) {
        // Passed this year, calculate for next year or show anniversary
        const targetNextYear = new Date(now.getFullYear() + 1, month - 1, day, 0, 0, 0);
        diff = targetNextYear.getTime() - now.getTime();
        status = 'passed';
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds, status });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mb-16">
      {timeLeft.status === 'today' ? (
        // Celebratory "Today is the Day" banner
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#251A3A] via-[#35224F] to-[#251A3A] border border-[#FF8FAB]/40 shadow-[0_0_35px_rgba(255,143,171,0.25)] text-center overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#FF8FAB]/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF8FAB]/20 text-[#FF8FAB] text-xs font-semibold tracking-widest uppercase mb-3 border border-[#FF8FAB]/30">
              <PartyPopper className="w-3.5 h-3.5" />
              SPECIAL OCCASION
            </span>
            <h3 className="font-serif-heading text-2xl sm:text-4xl font-bold text-[#FFF9FC] mb-2 text-glow-pink">
              🎉 IT'S TODAY! THE CELEBRATION IS LIVE! 🎉
            </h3>
            <p className="text-sm sm:text-base text-[#FFC2D1]/90 font-light max-w-xl">
              Today belongs entirely to you, {birthdayConfig.name}. May every second be drenched in laughter, joy, and cherished surprises.
            </p>
          </div>
        </motion.div>
      ) : (
        // Countdown Cards
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-6 sm:p-8 rounded-3xl glass-card text-center relative overflow-hidden"
        >
          <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-[#F5D58A] mb-3">
            <Clock className="w-4 h-4" />
            <span>
              {timeLeft.status === 'upcoming' ? 'Countdown to the Big Day' : 'Days Until the Next Magical Chapter'}
            </span>
            <Sparkles className="w-4 h-4" />
          </div>

          <h3 className="font-serif-heading text-2xl sm:text-3xl font-semibold text-[#FFF9FC] mb-6">
            {timeLeft.status === 'upcoming'
              ? `Counting Down Every Second for ${birthdayConfig.name}`
              : `Cherishing Every Beautiful Day With ${birthdayConfig.name}`}
          </h3>

          <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-lg mx-auto">
            {[
              { label: 'Days', val: timeLeft.days },
              { label: 'Hours', val: timeLeft.hours },
              { label: 'Minutes', val: timeLeft.minutes },
              { label: 'Seconds', val: timeLeft.seconds },
            ].map((unit, i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-[#171126]/60 border border-white/10 shadow-inner"
              >
                <span className="font-mono text-2xl sm:text-4xl font-bold text-[#FF8FAB]">
                  {String(unit.val).padStart(2, '0')}
                </span>
                <span className="text-[10px] sm:text-xs uppercase tracking-wider text-[#C8B6FF]/70 mt-1">
                  {unit.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
