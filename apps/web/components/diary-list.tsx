'use client';

import { useState, useEffect, useMemo } from 'react';
import { DiaryCard } from './diary-card';
import { ViewToggle } from './view-toggle';
import { DiaryFilter } from './diary-filter';
import { DiaryCalendar } from './diary-calendar';
import { DiaryModal } from './diary-modal';
import { getEntries, deleteEntry, type DiaryEntry } from '@/lib/diary-store';
import { BookOpen } from 'lucide-react';
import { translations, type Language } from '@/lib/translations';

export function DiaryList({ language = 'en' }: { language?: Language }) {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [view, setView] = useState<'video' | 'text'>('text');
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(null);

  const t = translations[language];

  useEffect(() => {
    setMounted(true);
    setEntries(getEntries());
  }, []);

  const handleDelete = (id: string) => {
    deleteEntry(id);
    setEntries(getEntries());
  };

  const handleView = (entry: DiaryEntry) => {
    setSelectedEntry(entry);
  };

  const entryDates = useMemo(() => {
    return entries.map((entry) => new Date(entry.createdAt));
  }, [entries]);

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const matchesSearch =
        searchQuery === '' ||
        entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.content.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDate =
        !selectedDate ||
        new Date(entry.createdAt).toDateString() ===
          selectedDate.toDateString();

      return matchesSearch && matchesDate;
    });
  }, [entries, searchQuery, selectedDate]);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="rounded-full bg-secondary p-4">
          <BookOpen className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="mt-4 font-serif text-xl font-semibold text-foreground">
          {t.noEntriesYet}
        </h3>
        <p className="mt-2 text-muted-foreground">{t.startWritingFirst}</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar with calendar */}
        <aside className="lg:w-72 shrink-0">
          <div className="lg:sticky lg:top-8 space-y-4">
            <DiaryCalendar
              entryDates={entryDates}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              language={language}
            />
          </div>
        </aside>

        {/* Main content area */}
        <div className="flex-1 min-w-0">
          <div className="mb-6 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            <div className="flex-1 max-w-md">
              <DiaryFilter
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                language={language}
              />
            </div>
            <div className="flex items-center gap-4">
              <p className="text-sm text-muted-foreground">
                {filteredEntries.length}{' '}
                {filteredEntries.length === 1 ? t.entry : t.entries}
                {(searchQuery || selectedDate) && ` (${t.filtered})`}
              </p>
              <ViewToggle
                view={view}
                onViewChange={setView}
                language={language}
              />
            </div>
          </div>

          {filteredEntries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground">{t.noEntriesMatch}</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedDate(null);
                }}
                className="mt-2 text-sm text-primary hover:underline"
              >
                {t.clearAllFilters}
              </button>
            </div>
          ) : (
            <div
              className={
                view === 'video'
                  ? 'grid gap-5 sm:grid-cols-2'
                  : 'flex flex-col gap-4'
              }
            >
              {filteredEntries.map((entry) => (
                <DiaryCard
                  key={entry.id}
                  entry={entry}
                  view={view}
                  onDelete={handleDelete}
                  onView={handleView}
                  language={language}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal for viewing entries */}
      <DiaryModal
        entry={selectedEntry}
        onClose={() => setSelectedEntry(null)}
        language={language}
      />
    </>
  );
}
