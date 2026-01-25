"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { DiaryCard, DiaryCardSkeleton } from "./diary-card";
import { ViewToggle } from "./view-toggle";
import { DiaryFilter } from "./diary-filter";
import { DiaryCalendar } from "./diary-calendar";
import { DiaryModal } from "./diary-modal";
import { DeleteModal } from "./delete-modal";
import { getEntries, deleteEntry } from "@/lib/diary-store";
import { useVideoStatusUpdates } from "@/lib/socket";
import { DiaryData, Language } from "@repo/types";
import { ApiError } from "@/lib/api";
import { BookOpen, AlertCircle } from "lucide-react";
import { translations } from "@/lib/translations";

const SEEN_JOBS_KEY = "diary_seen_video_jobs";

export function DiaryList({ language = "en" }: { language?: Language }) {
  const [entries, setEntries] = useState<DiaryData[]>([]);
  const [view, setView] = useState<"video" | "text">("text");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<DiaryData | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null);
  const [seenJobIds, setSeenJobIds] = useState<Set<string>>(new Set());

  const t = translations[language];

  // 실시간 비디오 상태 업데이트 구독
  useVideoStatusUpdates(setEntries);

  // Load seen job IDs from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SEEN_JOBS_KEY);
      if (stored) {
        setSeenJobIds(new Set(JSON.parse(stored)));
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  useEffect(() => {
    async function fetchEntries() {
      const targetDate = selectedDate || new Date();
      const filterDate = targetDate.toISOString().split("T")[0]; // YYYY-MM-DD

      setIsLoading(true);
      setError(null);

      try {
        const response = await getEntries(filterDate);
        if (response.data) {
          setEntries(response.data);
        }
      } catch (err) {
        const apiError = err as ApiError;
        setError(apiError.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchEntries();
  }, [selectedDate]);

  const handleDelete = (id: string) => {
    setEntryToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (entryToDelete) {
      deleteEntry();
      // TODO: deleteEntry API 연동 후 재조회 로직 구현
      setEntryToDelete(null);
    }
  };

  const handleView = (entry: DiaryData) => {
    setSelectedEntry(entry);
  };

  const handleRetry = (entryId: string) => {
    // TODO: Implement retry API call
    console.log("Retry video generation for:", entryId);
  };

  // Get IDs of entries with pending/processing status
  const pendingJobIds = useMemo(() => {
    return entries
      .filter(
        (entry) =>
          entry.videoStatus === "PENDING" || entry.videoStatus === "PROCESSING",
      )
      .map((entry) => entry.id);
  }, [entries]);

  // Check if there are unseen jobs
  const hasUnseenJob = useMemo(() => {
    return pendingJobIds.some((id) => !seenJobIds.has(id));
  }, [pendingJobIds, seenJobIds]);

  // Handle view change - mark jobs as seen when switching to video view
  const handleViewChange = useCallback(
    (newView: "video" | "text") => {
      if (newView === "video" && pendingJobIds.length > 0) {
        const newSeenIds = new Set([...seenJobIds, ...pendingJobIds]);
        setSeenJobIds(newSeenIds);
        try {
          localStorage.setItem(SEEN_JOBS_KEY, JSON.stringify([...newSeenIds]));
        } catch {
          // Ignore localStorage errors
        }
      }
      setView(newView);
    },
    [pendingJobIds, seenJobIds],
  );

  const entryDates = useMemo(() => {
    return entries.map((entry) => new Date(entry.createdAt));
  }, [entries]);

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const matchesSearch =
        searchQuery === "" ||
        entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.content.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDate =
        !selectedDate ||
        new Date(entry.createdAt).toDateString() ===
          selectedDate.toDateString();

      return matchesSearch && matchesDate;
    });
  }, [entries, searchQuery, selectedDate]);

  if (isLoading) {
    return (
      <div className="flex flex-col lg:flex-row gap-6">
        <aside className="lg:w-72 shrink-0">
          <div className="lg:sticky lg:top-8 space-y-4">
            <DiaryCalendar
              entryDates={[]}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              language={language}
            />
          </div>
        </aside>
        <div className="flex-1 min-w-0">
          <div
            className={
              view === "video"
                ? "grid gap-5 sm:grid-cols-2"
                : "flex flex-col gap-4"
            }
          >
            {[1, 2, 3].map((i) => (
              <DiaryCardSkeleton key={i} view={view} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col lg:flex-row gap-6">
        <aside className="lg:w-72 shrink-0">
          <div className="lg:sticky lg:top-8 space-y-4">
            <DiaryCalendar
              entryDates={[]}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              language={language}
            />
          </div>
        </aside>
        <div className="flex-1 min-w-0 flex flex-col items-center justify-center py-16 text-center">
          <div className="rounded-full bg-destructive/10 p-4">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <h3 className="mt-4 font-serif text-xl font-semibold text-foreground">
            {t.failedToLoadEntries}
          </h3>
          <p className="mt-2 text-muted-foreground">{error}</p>
          <button
            onClick={() => setSelectedDate(new Date())}
            className="mt-4 text-sm text-primary hover:underline"
          >
            {t.tryAgain}
          </button>
        </div>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="flex flex-col lg:flex-row gap-6">
        <aside className="lg:w-72 shrink-0">
          <div className="lg:sticky lg:top-8 space-y-4">
            <DiaryCalendar
              entryDates={[]}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              language={language}
            />
          </div>
        </aside>
        <div className="flex-1 min-w-0 flex flex-col items-center justify-center py-16 text-center">
          <div className="rounded-full bg-secondary p-4">
            <BookOpen className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="mt-4 font-serif text-xl font-semibold text-foreground">
            {t.noEntriesYet}
          </h3>
          <p className="mt-2 text-muted-foreground">{t.startWritingFirst}</p>
        </div>
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
                {filteredEntries.length}{" "}
                {filteredEntries.length === 1 ? t.entry : t.entries}
                {(searchQuery || selectedDate) && ` (${t.filtered})`}
              </p>
              <ViewToggle
                view={view}
                onViewChange={handleViewChange}
                language={language}
                hasNewJob={hasUnseenJob}
              />
            </div>
          </div>

          {filteredEntries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground">{t.noEntriesMatch}</p>
              <button
                onClick={() => {
                  setSearchQuery("");
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
                view === "video"
                  ? "grid gap-5 sm:grid-cols-2"
                  : "flex flex-col gap-4"
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
        view={view}
        onRetry={handleRetry}
      />

      {/* Delete confirmation modal */}
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setEntryToDelete(null);
        }}
        onConfirm={confirmDelete}
        title={t.deleteEntryTitle}
        message={t.deleteEntryMessage}
        cancelText={t.cancel}
        confirmText={t.deleteConfirm}
      />
    </>
  );
}
