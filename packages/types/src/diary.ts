import { z } from "zod";
import { DiaryErrors } from "./diaryErrors";

// Diary 요청 스키마
export const CreateDiaryRequestSchema = z.object({
  title: z.string().min(1, DiaryErrors.DIARY_TITLE_REQUIRED),
  content: z.string().min(1, DiaryErrors.DIARY_CONTENT_REQUIRED),
});

export const GetDiaryQuerySchema = z.object({
  filterDate: z.iso.date(),
});

export const DeleteDiaryParamsSchema = z.object({
  id: z.uuid(),
});

// 타입 추출
export type CreateDiaryRequest = z.infer<typeof CreateDiaryRequestSchema>;
export type GetDiaryQueryRequest = z.infer<typeof GetDiaryQuerySchema>;
export type DeleteDiaryParams = z.infer<typeof DeleteDiaryParamsSchema>;
