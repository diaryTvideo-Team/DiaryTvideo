import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { DiaryRepository } from "./diary.repository";
import { CreateDiaryRequest, DiaryErrors } from "@repo/types";

@Injectable()
export class DiaryService {
  constructor(private readonly diaryRepository: DiaryRepository) {}

  // 일기 목록 조회
  async getEntries(userId: number, date: string) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return this.diaryRepository.findByUserId(userId, startOfDay, endOfDay);
  }

  // 일기 생성
  async createEntry(userId: number, data: CreateDiaryRequest) {
    return this.diaryRepository.create({ userId, ...data });
  }

  // 일기 삭제
  async deleteEntry(userId: number, diaryId: string) {
    const diary = await this.diaryRepository.findById(diaryId);

    if (!diary || diary.deletedAt) {
      throw new NotFoundException(DiaryErrors.DIARY_NOT_FOUND);
    }

    if (diary.userId !== userId) {
      throw new ForbiddenException(DiaryErrors.DIARY_OWNERSHIP_MISMATCH);
    }

    return this.diaryRepository.softDelete(diaryId);
  }
}
