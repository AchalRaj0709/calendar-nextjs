'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import Calendar from '@/components/Calendar';
import NotesPanel from '@/components/NotesPanel';
import HeroImage from '@/components/HeroImage';
import ThemeToggle from '@/components/ThemeToggle';
import { useNotes } from '@/hooks/useNotes';
import { useTheme } from '@/hooks/useTheme';
import { DateRange } from '@/types';
import { isSameDay, isBefore } from 'date-fns';
import { formatDateKey, formatDisplayDate } from '@/utils/dateUtils';

export default function Home() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [dateRange, setDateRange] = useState<DateRange>({ start: null, end: null });
  const { theme, toggleTheme, mounted } = useTheme();
  const {
    addNote,
    updateNote,
    deleteNote,
    getNotesForDate,
    getNotesForDateRange,
    hasNotesForDate,
  } = useNotes();

  const handleDateClick = useCallback(
    (day: Date) => {
      if (!dateRange.start || (dateRange.start && dateRange.end)) {
        // No start selected, or both selected: start fresh
        setDateRange({ start: day, end: null });
      } else {
        // Start is selected, set end
        if (isSameDay(day, dateRange.start)) {
          // Same day clicked — treat as single day selection
          setDateRange({ start: day, end: day });
        } else {
          setDateRange({ start: dateRange.start, end: day });
        }
      }
    },
    [dateRange]
  );

  // Get notes for the current selection
  const currentNotes = useMemo(() => {
    if (!dateRange.start) return [];

    if (!dateRange.end || isSameDay(dateRange.start, dateRange.end)) {
      return getNotesForDate(formatDateKey(dateRange.start));
    }

    const start = isBefore(dateRange.start, dateRange.end)
      ? dateRange.start
      : dateRange.end;
    const end = isBefore(dateRange.start, dateRange.end)
      ? dateRange.end
      : dateRange.start;

    return getNotesForDateRange(formatDateKey(start), formatDateKey(end));
  }, [dateRange, getNotesForDate, getNotesForDateRange]);

  const selectedDateLabel = useMemo(() => {
    if (!dateRange.start) return 'Select a date';
    if (!dateRange.end || isSameDay(dateRange.start, dateRange.end)) {
      return formatDisplayDate(dateRange.start);
    }

    const start = isBefore(dateRange.start, dateRange.end)
      ? dateRange.start
      : dateRange.end;
    const end = isBefore(dateRange.start, dateRange.end)
      ? dateRange.end
      : dateRange.start;

    return `${formatDisplayDate(start)} — ${formatDisplayDate(end)}`;
  }, [dateRange]);

  const handleAddNote = useCallback(
    (text: string) => {
      if (!dateRange.start) return;
      const dateKey = formatDateKey(dateRange.start);
      addNote(dateKey, text);
    },
    [dateRange, addNote]
  );

  // Avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse-gentle text-4xl">📅</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background transition-colors duration-500">
      {/* Top Bar */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-card-border"
        id="header"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📅</span>
            <div>
              <h1 className="text-lg font-bold text-foreground tracking-tight">
                Kalender
              </h1>
              <p className="text-[11px] text-text-muted -mt-0.5">
                Interactive Calendar
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {dateRange.start && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                id="clear-selection-btn"
                onClick={() => setDateRange({ start: null, end: null })}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-text-secondary bg-surface hover:bg-surface-hover transition-all active:scale-95"
              >
                Clear Selection
              </motion.button>
            )}
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
          {/* Left Column: Hero + Notes */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <HeroImage currentMonth={currentMonth} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <NotesPanel
                selectedDateLabel={selectedDateLabel}
                notes={currentNotes}
                onAddNote={handleAddNote}
                onUpdateNote={updateNote}
                onDeleteNote={deleteNote}
                isVisible={true}
              />
            </motion.div>
          </div>

          {/* Right Column: Calendar */}
          <motion.div
            className="lg:col-span-7 xl:col-span-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <div className="rounded-2xl bg-card-bg border border-card-border shadow-lg p-5 md:p-8">
              {/* Decorative top bar */}
              <div className="flex justify-center gap-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-accent/20" />
                <div className="w-3 h-3 rounded-full bg-accent/40" />
                <div className="w-3 h-3 rounded-full bg-accent/60" />
              </div>

              <Calendar
                currentMonth={currentMonth}
                setCurrentMonth={setCurrentMonth}
                dateRange={dateRange}
                onDateClick={handleDateClick}
                hasNotesForDate={hasNotesForDate}
              />
            </div>

            {/* Stats bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-4 flex flex-wrap gap-3 justify-center"
            >
              <div className="px-4 py-2 rounded-xl bg-card-bg border border-card-border text-xs text-text-muted flex items-center gap-2">
                <span className="text-accent">✦</span>
                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </div>
              {dateRange.start && dateRange.end && (
                <div className="px-4 py-2 rounded-xl bg-accent-light border border-range-border text-xs text-accent font-medium flex items-center gap-2">
                  <span>📊</span>
                  {Math.abs(
                    Math.ceil(
                      (dateRange.end.getTime() - dateRange.start.getTime()) /
                        (1000 * 60 * 60 * 24)
                    )
                  ) + 1}{' '}
                  days selected
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-card-border mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center">
          <p className="text-xs text-text-muted">
            Built with ❤️ using Next.js · {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </main>
  );
}
