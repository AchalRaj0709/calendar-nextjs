import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isWithinInterval,
  isBefore,
  addMonths,
  subMonths,
} from 'date-fns';
import { HOLIDAYS } from './constants';
import { Holiday } from '@/types';

export function getCalendarDays(date: Date): Date[] {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
}

export function isInRange(day: Date, start: Date | null, end: Date | null): boolean {
  if (!start || !end) return false;
  const rangeStart = isBefore(start, end) ? start : end;
  const rangeEnd = isBefore(start, end) ? end : start;
  return isWithinInterval(day, { start: rangeStart, end: rangeEnd });
}

export function isRangeStart(day: Date, start: Date | null, end: Date | null): boolean {
  if (!start || !end) return false;
  const rangeStart = isBefore(start, end) ? start : end;
  return isSameDay(day, rangeStart);
}

export function isRangeEnd(day: Date, start: Date | null, end: Date | null): boolean {
  if (!start || !end) return false;
  const rangeEnd = isBefore(start, end) ? end : start;
  return isSameDay(day, rangeEnd);
}

export function getHoliday(day: Date): Holiday | undefined {
  const mmdd = format(day, 'MM-dd');
  return HOLIDAYS.find((h) => h.date === mmdd);
}

export function formatDateKey(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function formatDisplayDate(date: Date): string {
  return format(date, 'MMM d, yyyy');
}

export function formatMonthYear(date: Date): string {
  return format(date, 'MMMM yyyy');
}

export { isSameMonth, isSameDay, addMonths, subMonths, format };
