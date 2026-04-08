import { Holiday } from '@/types';

export const HOLIDAYS: Holiday[] = [
  { date: '01-01', name: "New Year's Day", emoji: '🎉' },
  { date: '01-26', name: 'Republic Day', emoji: '🇮🇳' },
  { date: '02-14', name: "Valentine's Day", emoji: '💕' },
  { date: '03-08', name: "Women's Day", emoji: '👩' },
  { date: '03-17', name: "St. Patrick's Day", emoji: '☘️' },
  { date: '04-01', name: "April Fools' Day", emoji: '🤡' },
  { date: '05-01', name: 'May Day', emoji: '🌸' },
  { date: '07-04', name: 'Independence Day (US)', emoji: '🇺🇸' },
  { date: '08-15', name: 'Independence Day (India)', emoji: '🇮🇳' },
  { date: '10-02', name: 'Gandhi Jayanti', emoji: '🕊️' },
  { date: '10-31', name: 'Halloween', emoji: '🎃' },
  { date: '11-14', name: "Children's Day", emoji: '👶' },
  { date: '12-25', name: 'Christmas', emoji: '🎄' },
  { date: '12-31', name: "New Year's Eve", emoji: '🎆' },
];

export const MONTH_HERO_THEMES: Record<number, { gradient: string; overlay: string }> = {
  0: { gradient: 'from-blue-900/40 to-cyan-900/30', overlay: 'Winter · January' },
  1: { gradient: 'from-pink-900/40 to-rose-900/30', overlay: 'Love · February' },
  2: { gradient: 'from-green-900/40 to-emerald-900/30', overlay: 'Spring · March' },
  3: { gradient: 'from-yellow-900/40 to-amber-900/30', overlay: 'Bloom · April' },
  4: { gradient: 'from-lime-900/40 to-green-900/30', overlay: 'Growth · May' },
  5: { gradient: 'from-orange-900/40 to-yellow-900/30', overlay: 'Summer · June' },
  6: { gradient: 'from-red-900/40 to-orange-900/30', overlay: 'Heat · July' },
  7: { gradient: 'from-amber-900/40 to-orange-900/30', overlay: 'Monsoon · August' },
  8: { gradient: 'from-teal-900/40 to-cyan-900/30', overlay: 'Autumn · September' },
  9: { gradient: 'from-orange-900/40 to-red-900/30', overlay: 'Harvest · October' },
  10: { gradient: 'from-purple-900/40 to-indigo-900/30', overlay: 'Frost · November' },
  11: { gradient: 'from-indigo-900/40 to-blue-900/30', overlay: 'Winter · December' },
};
