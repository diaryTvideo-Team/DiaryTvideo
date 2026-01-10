import { z } from "zod";

export const UserSchema = z.object({
  id: z.number(),
  email: z.email(),
  name: z.string(),
  createdAt: z.date(),
});

export const DiaryEntrySchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  createdAt: z.date(),
  videoUrl: z.string().optional(),
  thumbnailUrl: z.string().optional(),
  subtitleUrl: z.string().optional(),
});

// Zod 스키마로부터 TypeScript 타입 추출
export type User = z.infer<typeof UserSchema>;
export type DiaryEntry = z.infer<typeof DiaryEntrySchema>;
