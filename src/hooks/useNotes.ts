'use client';

import { useState, useEffect, useCallback } from 'react';
import { CalendarNote } from '@/types';

const STORAGE_KEY = 'calendar-notes';

export function useNotes() {
  const [notes, setNotes] = useState<CalendarNote[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load notes from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setNotes(JSON.parse(stored));
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

  const addNote = useCallback((dateKey: string, text: string) => {
    const newNote: CalendarNote = {
      id: crypto.randomUUID(),
      date: dateKey,
      text,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setNotes((prev) => [...prev, newNote]);
  }, []);

  const updateNote = useCallback((id: string, text: string) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id
          ? { ...note, text, updatedAt: new Date().toISOString() }
          : note
      )
    );
  }, []);

  const deleteNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
  }, []);

  const getNotesForDate = useCallback(
    (dateKey: string) => {
      return notes.filter((note) => note.date === dateKey);
    },
    [notes]
  );

  const getNotesForDateRange = useCallback(
    (startKey: string, endKey: string) => {
      return notes.filter((note) => note.date >= startKey && note.date <= endKey);
    },
    [notes]
  );

  const hasNotesForDate = useCallback(
    (dateKey: string) => {
      return notes.some((note) => note.date === dateKey);
    },
    [notes]
  );

  return {
    notes,
    isLoaded,
    addNote,
    updateNote,
    deleteNote,
    getNotesForDate,
    getNotesForDateRange,
    hasNotesForDate,
  };
}
