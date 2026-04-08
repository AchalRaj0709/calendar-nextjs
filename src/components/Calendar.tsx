'use client';

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DayCell from './DayCell';
import {
  getCalendarDays,
  isInRange,
  isRangeStart,
  isRangeEnd,
  isSameDay,
  addMonths,
  subMonths,
  formatMonthYear,
  formatDateKey,
  getHoliday,
} from '@/utils/dateUtils';
import { DateRange } from '@/types';

interface CalendarProps {
  currentMonth: Date;
  setCurrentMonth: (date: Date) => void;
  dateRange: DateRange;
  onDateClick: (day: Date) => void;
  hasNotesForDate: (dateKey: string) => boolean;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function Calendar({
  currentMonth,
  setCurrentMonth,
  dateRange,
  onDateClick,
  hasNotesForDate,
}: CalendarProps) {
  const [direction, setDirection] = useState(0);
  const today = new Date();

  const calendarDays = useMemo(() => getCalendarDays(currentMonth), [currentMonth]);

  const handlePrevMonth = () => {
    setDirection(-1);
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setDirection(1);
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleToday = () => {
    setDirection(0);
    setCurrentMonth(new Date());
  };

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0,
      rotateY: dir > 0 ? -5 : 5,
    }),
    center: {
      x: 0,
      opacity: 1,
      rotateY: 0,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -80 : 80,
      opacity: 0,
      rotateY: dir > 0 ? 5 : -5,
    }),
  };

  return (
    <div className="w-full" id="calendar-container">
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          id="prev-month-btn"
          onClick={handlePrevMonth}
          className="p-2.5 rounded-xl bg-surface hover:bg-surface-hover transition-all duration-200 hover:shadow-sm active:scale-95 group"
          aria-label="Previous month"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-text-secondary group-hover:text-foreground transition-colors"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex items-center gap-3">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.h2
              key={formatMonthYear(currentMonth)}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="text-xl md:text-2xl font-bold tracking-tight text-foreground"
              id="current-month-label"
            >
              {formatMonthYear(currentMonth)}
            </motion.h2>
          </AnimatePresence>
          <button
            id="today-btn"
            onClick={handleToday}
            className="px-3 py-1 text-xs font-medium rounded-lg bg-accent/10 text-accent hover:bg-accent/20 transition-all duration-200 active:scale-95"
          >
            Today
          </button>
        </div>

        <button
          id="next-month-btn"
          onClick={handleNextMonth}
          className="p-2.5 rounded-xl bg-surface hover:bg-surface-hover transition-all duration-200 hover:shadow-sm active:scale-95 group"
          aria-label="Next month"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-text-secondary group-hover:text-foreground transition-colors"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Selection Info */}
      {dateRange.start && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 px-4 py-2.5 rounded-xl bg-accent-light border border-range-border text-sm text-text-secondary"
          id="selection-info"
        >
          <span className="font-medium text-accent">
            {dateRange.end ? '📅 Range: ' : '📌 Start: '}
          </span>
          {dateRange.start.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })}
          {dateRange.end && (
            <>
              {' → '}
              {dateRange.end.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </>
          )}
          {!dateRange.end && (
            <span className="text-text-muted ml-2 text-xs">
              Click another date to set end
            </span>
          )}
        </motion.div>
      )}

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-semibold text-text-muted uppercase tracking-wider py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentMonth.toISOString()}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className="grid grid-cols-7 gap-1"
          id="calendar-grid"
        >
          {calendarDays.map((day, index) => {
            const dateKey = formatDateKey(day);
            const holiday = getHoliday(day);
            const todayMatch = isSameDay(day, today);
            const selected =
              (dateRange.start && isSameDay(day, dateRange.start)) ||
              (dateRange.end && isSameDay(day, dateRange.end));
            const inRange = isInRange(day, dateRange.start, dateRange.end);
            const rangeStart = isRangeStart(day, dateRange.start, dateRange.end);
            const rangeEnd = isRangeEnd(day, dateRange.start, dateRange.end);

            return (
              <motion.div
                key={dateKey}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: index * 0.008,
                  duration: 0.2,
                }}
              >
                <DayCell
                  day={day}
                  currentMonth={currentMonth}
                  isSelected={!!selected}
                  isInRange={inRange}
                  isRangeStart={rangeStart}
                  isRangeEnd={rangeEnd}
                  isToday={todayMatch}
                  isHoliday={!!holiday}
                  holidayName={holiday?.name}
                  holidayEmoji={holiday?.emoji}
                  hasNotes={hasNotesForDate(dateKey)}
                  onClick={onDateClick}
                />
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {/* Legend */}
      <div className="mt-5 flex flex-wrap gap-4 text-xs text-text-muted">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full ring-2 ring-accent" />
          <span>Today</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-accent" />
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-range-bg border border-range-border" />
          <span>In Range</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-accent/20" />
          <span>Holiday</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-note-dot" />
          <span>Has Notes</span>
        </div>
      </div>
    </div>
  );
}
