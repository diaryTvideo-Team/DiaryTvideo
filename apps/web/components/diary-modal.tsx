'use client';

import { useEffect } from 'react';
import { X, Calendar } from 'lucide-react';
import type { DiaryEntry } from '@/lib/diary-store';
import { Language } from '@/lib/translations';
import { useFormattedDate } from '@/lib/formattedDate';

interface DiaryModalProps {
  entry: DiaryEntry | null;
  onClose: () => void;
  language: Language;
}

export function DiaryModal({ entry, onClose, language }: DiaryModalProps) {
  const formattedDate = useFormattedDate({ entry, language });

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (entry) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [entry, onClose]);

  if (!entry) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-xl bg-card shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between border-b border-border bg-card px-6 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            {formattedDate}
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div
          className="overflow-y-auto p-6"
          style={{ maxHeight: 'calc(85vh - 73px)' }}
        >
          <h2 className="font-serif text-2xl font-semibold text-foreground">
            {entry.title}
          </h2>
          <div className="mt-6 text-foreground/80 leading-relaxed whitespace-pre-wrap">
            {entry.content}
          </div>
        </div>
      </div>
    </div>
  );
}
