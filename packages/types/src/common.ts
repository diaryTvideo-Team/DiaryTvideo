export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface DiaryEntry {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  videoUrl?: string;
  thumbnailUrl?: string;
  subtitleUrl?: string;
}
