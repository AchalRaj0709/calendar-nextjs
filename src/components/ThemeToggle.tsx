'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ThemeToggleProps {
  theme: 'light' | 'dark';
  onToggle: () => void;
}

export default function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  return (
    <motion.button
      id="theme-toggle-btn"
      onClick={onToggle}
      className="relative w-14 h-7 rounded-full bg-surface border border-card-border transition-all duration-300 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-accent/30 group"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      whileTap={{ scale: 0.95 }}
    >
      {/* Track */}
      <motion.div
        className="absolute top-0.5 w-6 h-6 rounded-full bg-card-bg shadow-sm flex items-center justify-center transition-colors duration-300"
        animate={{
          left: theme === 'light' ? '2px' : '26px',
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      >
        <motion.span
          key={theme}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.3 }}
          className="text-sm leading-none"
        >
          {theme === 'light' ? '☀️' : '🌙'}
        </motion.span>
      </motion.div>
    </motion.button>
  );
}
