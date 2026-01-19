import { DiaryEntry } from "@prisma/client";
import { DiaryData } from "@repo/types";

export const toDiaryData = (diary: DiaryEntry): DiaryData => ({
  id: diary.id,
  userId: diary.userId,
  title: diary.title,
  content: diary.content,
  videoUrl: diary.videoUrl,
  thumbnailUrl: diary.thumbnailUrl,
  subtitleUrl: diary.subtitleUrl,
  createdAt: diary.createdAt,
  updatedAt: diary.updatedAt,
  deletedAt: diary.deletedAt,
  videoStatus: diary.videoStatus,
  videoError: diary.videoError,
});
