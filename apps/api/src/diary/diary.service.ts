import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from "@nestjs/common";
import { DiaryRepository } from "./diary.repository";
import {
  ApiResponse,
  CreateDiaryRequest,
  DiaryData,
  DiaryErrors,
  VideoStatusMessages,
} from "@repo/types";
import { VideoProducer } from "src/video/video.producer";
import { toDiaryData } from "./mapper/diary.mapper";
import { VideoStatus } from "@prisma/client";

@Injectable()
export class DiaryService {
  constructor(
    private readonly diaryRepository: DiaryRepository,
    private readonly videoProducer: VideoProducer,
  ) {}

  // 일기 목록 조회
  async getEntries(
    userId: number,
    date: string,
  ): Promise<ApiResponse<DiaryData[]>> {
    const diaries = await this.diaryRepository.findByUserId(userId, date);
    return { success: true, data: diaries.map(toDiaryData) };
  }

  // 월별 일기 목록 조회
  async getEntriesByMonth(
    userId: number,
    year: number,
    month: number,
  ): Promise<ApiResponse<DiaryData[]>> {
    const diaries = await this.diaryRepository.findByUserIdAndMonth(
      userId,
      year,
      month,
    );
    return { success: true, data: diaries.map(toDiaryData) };
  }

  // 일기 생성
  async createEntry(
    userId: number,
    data: CreateDiaryRequest,
  ): Promise<ApiResponse<DiaryData>> {
    const diary = await this.diaryRepository.create({ userId, ...data });

    try {
      // 2. 비디오 생성 작업 큐에 등록 (비동기, non-blocking)
      await this.videoProducer.addVideoGenerationJob({
        diaryId: diary.id,
        userId,
        title: data.title,
        content: data.content,
      });
    } catch {
      await this.diaryRepository.updateVideoStatus(
        diary.id,
        VideoStatus.FAILED,
        VideoStatusMessages.FAILED_START,
      );
    }

    return { success: true, data: toDiaryData(diary) };
  }

  // 일기 삭제
  async deleteEntry(
    userId: number,
    diaryId: string,
  ): Promise<ApiResponse<DiaryData>> {
    const diary = await this.diaryRepository.findById(diaryId);

    if (!diary || diary.deletedAt) {
      throw new NotFoundException(DiaryErrors.DIARY_NOT_FOUND);
    }

    if (diary.userId !== userId) {
      throw new ForbiddenException(DiaryErrors.DIARY_OWNERSHIP_MISMATCH);
    }

    const deletedDiary = await this.diaryRepository.softDelete(diaryId);
    return { success: true, data: toDiaryData(deletedDiary) };
  }

  // 비디오 생성 재시도
  async retryVideoGeneration(
    userId: number,
    diaryId: string,
  ): Promise<ApiResponse<DiaryData>> {
    const diary = await this.diaryRepository.findById(diaryId);

    // 1. 일기 존재 여부 확인
    if (!diary || diary.deletedAt) {
      throw new NotFoundException(DiaryErrors.DIARY_NOT_FOUND);
    }

    // 2. 소유권 확인
    if (diary.userId !== userId) {
      throw new ForbiddenException(DiaryErrors.DIARY_OWNERSHIP_MISMATCH);
    }

    // 3. FAILED 상태인지 확인
    if (diary.videoStatus !== VideoStatus.FAILED) {
      throw new BadRequestException(DiaryErrors.DIARY_RETRY_NOT_FAILED);
    }

    // 4. 재시도 횟수 제한 확인 (최대 3번 재시도)
    if (diary.videoRetryCount >= 3) {
      throw new BadRequestException(DiaryErrors.DIARY_RETRY_LIMIT_EXCEEDED);
    }

    // 5. 상태를 PENDING으로 변경하고 재시도 카운트 증가
    const updatedDiary = await this.diaryRepository.resetVideoForRetry(diaryId);

    try {
      await this.videoProducer.addVideoGenerationJob({
        diaryId: diary.id,
        userId,
        title: diary.title,
        content: diary.content,
      });
    } catch {
      await this.diaryRepository.updateVideoStatus(
        diary.id,
        VideoStatus.FAILED,
        VideoStatusMessages.FAILED_START,
      );
    }

    return { success: true, data: toDiaryData(updatedDiary) };
  }
}
