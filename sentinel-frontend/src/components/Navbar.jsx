import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, Menu, X, Music, Gift } from 'lucide-react';
import birthdayConfig from '../data/birthdayConfig';

export default function Navbar({ onOpenSurpriseModal }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Wish', href: '#cake' },
    { label: 'Scrapbook', href: '#gallery' },
    { label: 'Journey', href: '#timeline' },
    { label: 'The Letter', href: '#letter' },
    { label: 'Reasons', href: '#reasons' },
    { label: 'Wishes Wall', href: '#wishes' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'py-3 bg-[#171126]/85 backdrop-blur-md border-b border-white/10 shadow-lg shadow-black/20'
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand / Logo */}
        <a
          href="#"
          className="flex items-center gap-2.5 group cursor-pointer"
          title={`Celebrating ${birthdayConfig.name}`}
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#FF8FAB] to-[#C8B6FF] p-[1.5px] transition-transform duration-300 group-hover:scale-105 shadow-md shadow-[#FF8FAB]/20">
            <div className="w-full h-full rounded-full bg-[#171126] flex items-center justify-center">
              <Heart className="w-4 h-4 text-[#FF8FAB] fill-[#FF8FAB] group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-serif-heading font-semibold text-lg tracking-wider text-[#FFF9FC] flex items-center gap-1.5">
              {birthdayConfig.name}
              <Sparkles className="w-3.5 h-3.5 text-[#F5D58A] animate-pulse" />
            </span>
            <span className="text-[10px] tracking-widest uppercase font-medium text-[#FFC2D1]/70">
              {birthdayConfig.relationship}
            </span>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 bg-[#251A3A]/40 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 shadow-inner">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-xs uppercase tracking-wider font-medium text-[#FFF9FC]/75 hover:text-[#FF8FAB] px-3.5 py-1.5 rounded-full transition-all duration-200 hover:bg-white/5"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Action Button: Smile button & Mobile hamburger */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenSurpriseModal}
            className="flex items-center gap-1.5 text-xs font-medium px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#FF8FAB]/20 to-[#C8B6FF]/20 border border-[#FF8FAB]/40 text-[#FFF9FC] hover:border-[#FF8FAB] transition-all duration-200 hover:shadow-[0_0_15px_rgba(255,143,171,0.3)] active:scale-95"
            title="Get a little smile"
          >
            <Gift className="w-3.5 h-3.5 text-[#F5D58A]" />
            <span className="hidden sm:inline">Smile</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#FFF9FC]/80 hover:text-white rounded-lg focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#171126]/95 backdrop-blur-xl border-b border-white/10 overflow-hidden px-4 pt-3 pb-6"
          >
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium text-[#FFF9FC]/80 hover:text-[#FF8FAB] hover:bg-white/5 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
