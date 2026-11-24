import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, ChevronLeft, ChevronRight, Maximize2, Heart } from 'lucide-react';
import birthdayConfig from '../data/birthdayConfig';
import { sound } from '../utils/soundEffects';

export default function PhotoGallery() {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);
  const photos = birthdayConfig.gallery.photos;

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedPhotoIndex === null) return;
      if (e.key === 'Escape') setSelectedPhotoIndex(null);
      if (e.key === 'ArrowRight') {
        setSelectedPhotoIndex((prev) => (prev + 1) % photos.length);
      }
      if (e.key === 'ArrowLeft') {
        setSelectedPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhotoIndex, photos.length]);

  const openLightbox = (index) => {
    sound.playSparkle();
    setSelectedPhotoIndex(index);
  };

  const nextPhoto = (e) => {
    e.stopPropagation();
    setSelectedPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = (e) => {
    e.stopPropagation();
    setSelectedPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  return (
    <section id="gallery" className="py-24 px-4 relative overflow-hidden bg-[#1D1432]/50">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#FF8FAB]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-[#C8B6FF]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#251A3A] border border-[#FF8FAB]/30 text-xs font-semibold uppercase tracking-widest text-[#FFC2D1] mb-3"
          >
            <Heart className="w-3.5 h-3.5 text-[#FF8FAB] fill-[#FF8FAB]" />
            A SCRAPBOOK OF SMILES
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-serif-heading text-3xl sm:text-5xl font-bold text-[#FFF9FC] mb-4 text-glow-pink"
          >
            {birthdayConfig.gallery.heading}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-[#C8B6FF]/80 text-sm sm:text-base font-light"
          >
            {birthdayConfig.gallery.subtitle}
          </motion.p>
        </div>

        {/* Scrapbook Asymmetrical Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {photos.map((item, index) => {
            // Slight tilt effect for scrapbook feeling
            const tilts = ['-rotate-1', 'rotate-1', 'rotate-2', '-rotate-2'];
            const tilt = tilts[index % tilts.length];

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: (index % 4) * 0.15 }}
                whileHover={{ y: -8, scale: 1.02 }}
                onClick={() => openLightbox(index)}
                className={`group cursor-pointer rounded-2xl bg-gradient-to-b from-[#2E2047] to-[#201535] p-3 border border-white/10 shadow-xl hover:shadow-[0_15px_35px_rgba(255,143,171,0.25)] transition-all duration-300 relative ${tilt}`}
              >
                {/* Washi tape sticker simulation at top */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 bg-[#F5D58A]/35 backdrop-blur-sm rounded-sm border border-white/20 transform -rotate-2 z-10 pointer-events-none" />

                {/* Photo frame */}
                <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-[#171126] mb-3">
                  <img
                    src={item.url}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#171126]/90 via-[#171126]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-medium text-[#FFF9FC] flex items-center gap-1">
                        <Maximize2 className="w-3.5 h-3.5 text-[#F5D58A]" /> View Memory
                      </span>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-black/40 text-[#FFC2D1]">
                        {item.tag}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Scrapbook Caption Card */}
                <div className="px-1 pb-1">
                  <div className="flex items-center justify-between text-[11px] text-[#F5D58A] font-mono mb-1">
                    <span>{item.date}</span>
                    <Heart className="w-3 h-3 text-[#FF8FAB] fill-[#FF8FAB]/40" />
                  </div>
                  <h4 className="font-serif-heading font-medium text-sm text-[#FFF9FC] group-hover:text-[#FF8FAB] transition-colors truncate">
                    {item.title}
                  </h4>
                  <p className="text-xs text-[#C8B6FF]/70 font-light italic mt-0.5 line-clamp-2">
                    "{item.caption}"
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedPhotoIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhotoIndex(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/85 backdrop-blur-xl"
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedPhotoIndex(null)}
              className="absolute top-5 right-5 sm:top-8 sm:right-8 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label="Close Lightbox"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Nav Arrows */}
            <button
              onClick={prevPhoto}
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors cursor-pointer"
              aria-label="Previous Photo"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={nextPhoto}
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors cursor-pointer"
              aria-label="Next Photo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Modal Content */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full max-h-[88vh] rounded-3xl overflow-hidden glass-card flex flex-col md:flex-row border border-[#FF8FAB]/30 shadow-2xl"
            >
              {/* Image side */}
              <div className="w-full md:w-3/5 bg-black flex items-center justify-center overflow-hidden max-h-[50vh] md:max-h-[85vh]">
                <img
                  src={photos[selectedPhotoIndex].url}
                  alt={photos[selectedPhotoIndex].title}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Memory details side */}
              <div className="w-full md:w-2/5 p-6 sm:p-8 flex flex-col justify-between bg-[#251A3A]/90">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-full text-xs font-mono uppercase bg-[#FF8FAB]/20 text-[#FF8FAB] border border-[#FF8FAB]/30">
                      {photos[selectedPhotoIndex].tag}
                    </span>
                    <span className="text-xs text-[#F5D58A] font-mono">
                      {photos[selectedPhotoIndex].date}
                    </span>
                  </div>

                  <h3 className="font-serif-heading text-2xl font-bold text-[#FFF9FC] mb-3">
                    {photos[selectedPhotoIndex].title}
                  </h3>

                  <p className="font-elegant italic text-lg sm:text-xl text-[#FFC2D1] mb-6 leading-relaxed">
                    "{photos[selectedPhotoIndex].caption}"
                  </p>

                  <div className="h-[1px] w-full bg-white/10 mb-6" />

                  <p className="text-xs text-[#C8B6FF]/80 leading-relaxed font-light">
                    Every shared moment with you turns into a lifelong memory. Thank you for making ordinary days feel like chapters of pure magic.
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between text-xs text-white/50">
                  <span>Photo {selectedPhotoIndex + 1} of {photos.length}</span>
                  <span className="flex items-center gap-1 text-[#FF8FAB]">
                    <Heart className="w-3.5 h-3.5 fill-[#FF8FAB]" /> Cherished Memory
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
