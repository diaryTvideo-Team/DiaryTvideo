// TODO: DiaryEntry 타입을 @repo/types에서 가져오도록 수정 (Diary API 구현 시)
export interface DiaryEntry {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  thumbnailUrl?: string;
  videoUrl?: string;
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
