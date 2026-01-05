export interface DiaryEntry {
  id: string
  title: string
  content: string
  createdAt: Date
}

const STORAGE_KEY = "diary-entries"

export function getEntries(): DiaryEntry[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return []
  const entries = JSON.parse(stored)
  return entries.map((entry: DiaryEntry) => ({
    ...entry,
    createdAt: new Date(entry.createdAt),
  }))
}

export function saveEntry(entry: Omit<DiaryEntry, "id" | "createdAt">): DiaryEntry {
  const entries = getEntries()
  const newEntry: DiaryEntry = {
    ...entry,
    id: crypto.randomUUID(),
    createdAt: new Date(),
  }
  entries.unshift(newEntry)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  return newEntry
}

export function deleteEntry(id: string): void {
  const entries = getEntries()
  const filtered = entries.filter((e) => e.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
}
