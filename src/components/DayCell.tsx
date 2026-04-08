'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { isSameMonth, isSameDay } from '@/utils/dateUtils';

interface DayCellProps {
  day: Date;
  currentMonth: Date;
  isSelected: boolean;
  isInRange: boolean;
  isRangeStart: boolean;
  isRangeEnd: boolean;
  isToday: boolean;
  isHoliday: boolean;
  holidayName?: string;
  holidayEmoji?: string;
  hasNotes: boolean;
  onClick: (day: Date) => void;
}

export default function DayCell({
  day,
  currentMonth,
  isSelected,
  isInRange,
  isRangeStart,
  isRangeEnd,
  isToday,
  isHoliday,
  holidayName,
  holidayEmoji,
  hasNotes,
  onClick,
}: DayCellProps) {
  const isCurrentMonth = isSameMonth(day, currentMonth);
  const dayNumber = day.getDate();

  const getClassNames = () => {
    const base =
      'relative w-full aspect-square flex items-center justify-center rounded-xl text-sm font-medium cursor-pointer select-none transition-all duration-200 day-cell-shimmer tooltip-container';

    const classes = [base];

    if (!isCurrentMonth) {
      classes.push('text-text-muted/40 hover:text-text-muted/60');
    } else if (isRangeStart || isRangeEnd) {
      classes.push(
        'bg-accent text-white shadow-md hover:shadow-lg scale-105 hover:scale-110 z-10'
      );
    } else if (isInRange) {
      classes.push(
        'bg-range-bg text-foreground border border-range-border hover:bg-accent-light'
      );
    } else if (isToday) {
      classes.push(
        'ring-2 ring-accent text-accent font-bold hover:bg-accent-light'
      );
    } else if (isHoliday) {
      classes.push(
        'text-accent font-semibold hover:bg-accent-light'
      );
    } else {
      classes.push(
        'text-foreground hover:bg-surface-hover hover:shadow-sm'
      );
    }

    return classes.join(' ');
  };

  return (
    <motion.button
      id={`day-${day.toISOString().split('T')[0]}`}
      className={getClassNames()}
      onClick={() => onClick(day)}
      whileTap={{ scale: 0.92 }}
      initial={false}
      aria-label={`${dayNumber}${isHoliday ? ` - ${holidayName}` : ''}${hasNotes ? ' - Has notes' : ''}`}
    >
      {isHoliday && isCurrentMonth && (
        <span className="absolute -top-0.5 -right-0.5 text-[10px] leading-none">
          {holidayEmoji}
        </span>
      )}

      <span className={`relative z-10 ${!isCurrentMonth ? 'opacity-30' : ''}`}>
        {dayNumber}
      </span>

      {hasNotes && isCurrentMonth && <span className="note-indicator" />}

      {isHoliday && isCurrentMonth && holidayName && (
        <span className="tooltip-text">{holidayName}</span>
      )}
    </motion.button>
  );
}
