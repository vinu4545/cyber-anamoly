import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, MessageCircleHeart, Camera, Compass, HeartHandshake, Milestone } from 'lucide-react';
import birthdayConfig from '../data/birthdayConfig';

const iconMap = {
  Sparkles: Sparkles,
  MessageCircleHeart: MessageCircleHeart,
  Camera: Camera,
  Compass: Compass,
  HeartHandshake: HeartHandshake,
};

export default function MemoryTimeline() {
  const { heading, subtitle, events } = birthdayConfig.timeline;

  return (
    <section id="timeline" className="py-24 px-4 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#251A3A]/40 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#251A3A] border border-[#F5D58A]/30 text-xs font-semibold uppercase tracking-widest text-[#F5D58A] mb-3"
          >
            <Milestone className="w-3.5 h-3.5" />
            STORY OF US
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

        {/* Timeline Container */}
        <div className="relative">
          {/* Central Vertical Connecting Line (Desktop: center, Mobile: left-6) */}
          <div className="absolute top-4 bottom-4 left-6 md:left-1/2 -translate-x-1/2 w-[2px] bg-gradient-to-b from-[#FF8FAB] via-[#F5D58A] to-[#C8B6FF] opacity-40 shadow-[0_0_12px_rgba(255,143,171,0.5)]" />

          <div className="space-y-12 sm:space-y-16">
            {events.map((event, index) => {
              const isEven = index % 2 === 0;
              const IconComponent = iconMap[event.icon] || Sparkles;

              return (
                <div
                  key={event.id}
                  className={`relative flex flex-col md:flex-row items-start md:items-center ${
                    isEven ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Central Node Badge */}
                  <div className="absolute left-6 md:left-1/2 -translate-x-1/2 flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-[#251A3A] to-[#392854] border-2 border-[#F5D58A] shadow-[0_0_20px_rgba(245,213,138,0.5)] z-20">
                    <IconComponent className="w-5 h-5 text-[#F5D58A]" />
                  </div>

                  {/* Content Card (Desktop: takes half width, Mobile: indented from left icon) */}
                  <motion.div
                    initial={{ opacity: 0, x: isEven ? 40 : -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className={`ml-16 md:ml-0 md:w-[45%] ${
                      isEven ? 'md:pl-10 text-left' : 'md:pr-10 md:text-right'
                    }`}
                  >
                    <div className="p-6 sm:p-7 rounded-3xl glass-card border border-white/10 hover:border-[#FF8FAB]/40 transition-all duration-300 shadow-xl group">
                      <div
                        className={`flex items-center gap-2 mb-2 ${
                          isEven ? 'justify-start' : 'md:justify-end justify-start'
                        }`}
                      >
                        <span className="px-3 py-0.5 rounded-full text-[11px] font-mono uppercase bg-[#FF8FAB]/20 text-[#FF8FAB] border border-[#FF8FAB]/30">
                          {event.highlight}
                        </span>
                      </div>

                      <h3 className="font-serif-heading text-xl sm:text-2xl font-semibold text-[#FFF9FC] group-hover:text-[#F5D58A] transition-colors mb-1">
                        {event.title}
                      </h3>

                      <h4 className="text-xs uppercase tracking-wider font-mono text-[#FFC2D1]/70 mb-3">
                        {event.subtitle}
                      </h4>

                      <p className="text-sm text-[#C8B6FF]/80 leading-relaxed font-light">
                        {event.description}
                      </p>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
