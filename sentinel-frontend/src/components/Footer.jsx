import React from 'react';
import { Heart, Sparkles } from 'lucide-react';
import birthdayConfig from '../data/birthdayConfig';
import { sound } from '../utils/soundEffects';

export default function Footer({ onOpenSecretModal }) {
  const handleSecretClick = () => {
    sound.playSparkle();
    if (onOpenSecretModal) onOpenSecretModal();
  };

  return (
    <footer className="py-12 px-4 border-t border-white/10 bg-[#120B1C] text-[#FFF9FC] relative overflow-hidden">
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
        {/* Monogram */}
        <div className="flex items-center gap-2 mb-4">
          <span className="font-serif-heading font-bold text-2xl tracking-widest text-[#FFF9FC]">
            {birthdayConfig.name.toUpperCase()}
          </span>
          {/* Subtle secret heart trigger */}
          <button
            onClick={handleSecretClick}
            className="group relative p-1.5 rounded-full hover:bg-white/5 transition-colors cursor-pointer"
            title="A secret awaits..."
          >
            <Sparkles className="w-4 h-4 text-[#F5D58A] group-hover:scale-125 transition-transform animate-spin" style={{ animationDuration: '8s' }} />
            <span className="sr-only">Secret easter egg</span>
          </button>
        </div>

        <p className="font-serif italic text-sm text-[#FFC2D1]/80 max-w-md mb-6">
          "Some moments are destined to become unforgettable memories."
        </p>

        <div className="flex items-center gap-2 text-xs font-mono text-[#C8B6FF]/70">
          <span>Crafted with</span>
          <button
            onClick={handleSecretClick}
            className="text-[#FF8FAB] hover:scale-125 transition-transform cursor-pointer"
            title="Click to discover the secret"
          >
            <Heart className="w-4 h-4 fill-[#FF8FAB] inline" />
          </button>
          <span>for {birthdayConfig.name} ({birthdayConfig.relationship})</span>
        </div>

        <div className="mt-4 text-[10px] uppercase tracking-widest text-white/30 font-mono">
          A LIFELONG CELEBRATION • {birthdayConfig.signatureName}
        </div>
      </div>
    </footer>
  );
}
