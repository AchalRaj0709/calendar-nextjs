export interface CalendarNote {
  id: string;
  startDate: string; // ISO date string YYYY-MM-DD
  endDate: string; // ISO date string YYYY-MM-DD
  text: string;
  createdAt: number;
  updatedAt: number;
}

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export interface Holiday {
  date: string; // MM-DD format
  name: string;
  emoji: string;
}
