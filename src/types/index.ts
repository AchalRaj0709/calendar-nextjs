export interface CalendarNote {
  id: string;
  date: string; // ISO date string YYYY-MM-DD
  text: string;
  createdAt: string;
  updatedAt: string;
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
