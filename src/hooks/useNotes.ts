'use client';

import { useState, useEffect, useCallback } from 'react';
import { CalendarNote } from '@/types';

const STORAGE_KEY = 'calendar-notes';

export function useNotes() {
  const [notes, setNotes] = useState<CalendarNote[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load notes from localStorage on mount and handle backwards compatibility
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        
        // Backward compatibility migration mapper
        const migratedNotes = parsed.map((note: any) => {
          if (note.date) {
            // It's the old format
            return {
              id: note.id || crypto.randomUUID(),
              startDate: note.date,
              endDate: note.date,
              text: note.text,
              createdAt: new Date(note.createdAt || Date.now()).getTime(),
              updatedAt: new Date(note.updatedAt || Date.now()).getTime(),
            };
          }
          return note; // Already new format
        });
        
        setNotes(migratedNotes);
      }
    } catch (e) {
      console.error('Failed to load notes:', e);
    }
    setIsLoaded(true);
  }, []);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
      } catch (e) {
        console.error('Failed to save notes:', e);
      }
    }
  }, [notes, isLoaded]);

  const addNote = useCallback((startDate: string, endDate: string, text: string) => {
    // Normalization: Ensure startDate is always earlier than or equal to endDate
    let finalStart = startDate;
    let finalEnd = endDate;
    
    if (startDate > endDate) {
      finalStart = endDate;
      finalEnd = startDate;
    }

    const newNote: CalendarNote = {
      id: crypto.randomUUID(),
      startDate: finalStart,
      endDate: finalEnd,
      text,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setNotes((prev) => [...prev, newNote]);
  }, []);

  const updateNote = useCallback((id: string, text: string) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id
          ? { ...note, text, updatedAt: Date.now() }
          : note
      )
    );
  }, []);

  const deleteNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
  }, []);

  // Simplified fetching logic - grabs any notes overlapping the currently selected logic range
  const getNotesForCurrentSelection = useCallback(
    (startKey: string, endKey: string) => {
      let rangeStart = startKey;
      let rangeEnd = endKey;
      
      if (startKey > endKey) {
        rangeStart = endKey;
        rangeEnd = startKey;
      }

      return notes.filter((note) => {
        // A note should be visible if its [startDate, endDate] overlaps with the selection [rangeStart, rangeEnd]
        // Overlap math: max(start1, start2) <= min(end1, end2)
        const overlapStart = note.startDate > rangeStart ? note.startDate : rangeStart;
        const overlapEnd = note.endDate < rangeEnd ? note.endDate : rangeEnd;
        return overlapStart <= overlapEnd;
      });
    },
    [notes]
  );

  const hasNotesForDate = useCallback(
    (dateKey: string) => {
      // Return true if the specific dateKey falls inclusive within ANY note's range
      return notes.some((note) => note.startDate <= dateKey && note.endDate >= dateKey);
    },
    [notes]
  );

  return {
    notes,
    isLoaded,
    addNote,
    updateNote,
    deleteNote,
    getNotesForCurrentSelection,
    hasNotesForDate,
  };
}
