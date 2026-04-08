'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarNote } from '@/types';

interface NotesPanelProps {
  selectedDateLabel: string;
  notes: CalendarNote[];
  onAddNote: (text: string) => void;
  onUpdateNote: (id: string, text: string) => void;
  onDeleteNote: (id: string) => void;
  isVisible: boolean;
}

export default function NotesPanel({
  selectedDateLabel,
  notes,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
  isVisible,
}: NotesPanelProps) {
  const [newNoteText, setNewNoteText] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const editRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editingId && editRef.current) {
      editRef.current.focus();
    }
  }, [editingId]);

  const handleAddNote = () => {
    if (newNoteText.trim()) {
      onAddNote(newNoteText.trim());
      setNewNoteText('');
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddNote();
    }
  };

  const startEditing = (note: CalendarNote) => {
    setEditingId(note.id);
    setEditText(note.text);
    setDeleteConfirmId(null);
  };

  const saveEdit = () => {
    if (editingId && editText.trim()) {
      onUpdateNote(editingId, editText.trim());
      setEditingId(null);
      setEditText('');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      saveEdit();
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  const handleDelete = (id: string) => {
    if (deleteConfirmId === id) {
      onDeleteNote(id);
      setDeleteConfirmId(null);
    } else {
      setDeleteConfirmId(id);
      setTimeout(() => setDeleteConfirmId(null), 3000);
    }
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="w-full"
      id="notes-panel"
    >
      <div className="rounded-2xl bg-card-bg border border-card-border shadow-md overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 bg-surface border-b border-card-border">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-accent"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Notes
          </h3>
          <p className="text-xs text-text-muted mt-1">{selectedDateLabel}</p>
        </div>

        {/* Add Note */}
        <div className="p-4 border-b border-card-border">
          <div className="flex gap-2">
            <textarea
              ref={inputRef}
              id="note-input"
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add a note..."
              rows={2}
              className="flex-1 px-3 py-2 rounded-xl bg-surface border border-card-border text-sm text-foreground placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all duration-200 resize-none"
            />
            <button
              id="add-note-btn"
              onClick={handleAddNote}
              disabled={!newNoteText.trim()}
              className="px-4 py-2 rounded-xl bg-accent text-white font-medium text-sm hover:bg-accent-hover transition-all duration-200 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 self-end"
            >
              Add
            </button>
          </div>
          <p className="text-[11px] text-text-muted mt-1.5">
            Press Enter to add · Shift+Enter for new line
          </p>
        </div>

        {/* Notes List */}
        <div className="max-h-[320px] overflow-y-auto">
          {notes.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-3xl mb-3">📝</div>
              <p className="text-sm text-text-muted">No notes yet</p>
              <p className="text-xs text-text-muted/60 mt-1">
                Select a date and add your first note
              </p>
            </div>
          ) : (
            <AnimatePresence>
              {notes.map((note) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="border-b border-card-border last:border-b-0 hover:bg-surface/50 transition-colors duration-200"
                  id={`note-${note.id}`}
                >
                  {editingId === note.id ? (
                    /* Edit Mode */
                    <div className="p-4">
                      <textarea
                        ref={editRef}
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyDown={handleEditKeyDown}
                        rows={3}
                        className="w-full px-3 py-2 rounded-xl bg-surface border border-accent/30 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none"
                      />
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={saveEdit}
                          className="px-3 py-1.5 rounded-lg bg-accent text-white text-xs font-medium hover:bg-accent-hover transition-all active:scale-95"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="px-3 py-1.5 rounded-lg bg-surface border border-card-border text-xs text-text-secondary hover:bg-surface-hover transition-all active:scale-95"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* View Mode */
                    <div className="p-4 group">
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-sm text-foreground whitespace-pre-wrap flex-1 leading-relaxed">
                          {note.text}
                        </p>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0">
                          <button
                            onClick={() => startEditing(note)}
                            className="p-1.5 rounded-lg hover:bg-surface transition-colors"
                            aria-label="Edit note"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3.5 w-3.5 text-text-muted hover:text-accent"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(note.id)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              deleteConfirmId === note.id
                                ? 'bg-danger/10 text-danger'
                                : 'hover:bg-danger/10 text-text-muted hover:text-danger'
                            }`}
                            aria-label={
                              deleteConfirmId === note.id
                                ? 'Confirm delete'
                                : 'Delete note'
                            }
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3.5 w-3.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[11px] text-text-muted">
                          {new Date(note.updatedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        {note.updatedAt !== note.createdAt && (
                          <span className="text-[10px] text-text-muted/60 italic">
                            (edited)
                          </span>
                        )}
                        {deleteConfirmId === note.id && (
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-[11px] text-danger font-medium"
                          >
                            Click again to delete
                          </motion.span>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </motion.div>
  );
}
