'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MONTH_HERO_THEMES } from '@/utils/constants';

interface HeroImageProps {
  currentMonth: Date;
}

export default function HeroImage({ currentMonth }: HeroImageProps) {
  const monthTheme = MONTH_HERO_THEMES[currentMonth.getMonth()];

  return (
    <div className="relative w-full h-48 md:h-full md:min-h-[300px] rounded-2xl overflow-hidden group">
      <Image
        src="/hero.png"
        alt="Calendar hero landscape"
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-105"
        priority
        sizes="(max-width: 768px) 100vw, 50vw"
      />

      {/* Gradient overlay that changes with month */}
      <motion.div
        key={currentMonth.getMonth()}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className={`absolute inset-0 bg-gradient-to-b ${monthTheme.gradient}`}
      />

      {/* Bottom gradient for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

      {/* Month theme text */}
      <motion.div
        key={`text-${currentMonth.getMonth()}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="absolute bottom-0 left-0 right-0 p-5 md:p-6"
      >
        <p className="text-white/70 text-xs font-medium tracking-[0.2em] uppercase mb-1">
          {monthTheme.overlay.split(' · ')[0]}
        </p>
        <h2 className="text-white text-2xl md:text-3xl font-bold tracking-tight">
          {monthTheme.overlay.split(' · ')[1]}
        </h2>
        <div className="mt-3 w-12 h-0.5 bg-white/40 rounded-full" />
      </motion.div>

      {/* Decorative corner accent */}
      <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-white/20 rounded-tr-lg" />
      <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-white/20 rounded-tl-lg" />
    </div>
  );
}
