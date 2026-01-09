export interface DiaryEntry {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  videoUrl?: string;
  thumbnailUrl?: string;
  subtitleUrl?: string;
}

// TODO: Replace with actual API call to GET /api/diary
export function getEntries(): DiaryEntry[] {
  console.warn("getEntries: API not implemented yet");
  return [];
}

// TODO: Replace with actual API call to POST /api/diary
export function saveEntry(): DiaryEntry {
  console.warn("saveEntry: API not implemented yet");
  // Return a mock entry to maintain type compatibility
  return {
    id: "",
    title: "",
    content: "",
    createdAt: new Date(),
  };
}

// TODO: Replace with actual API call to DELETE /api/diary/:id
export function deleteEntry(): void {
  console.warn("deleteEntry: API not implemented yet");
}
