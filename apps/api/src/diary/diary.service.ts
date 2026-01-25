import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { DiaryRepository } from "./diary.repository";
import {
  ApiResponse,
  CreateDiaryRequest,
  DiaryData,
  DiaryErrors,
} from "@repo/types";
import { VideoProducer } from "src/video/video.producer";
import { toDiaryData } from "./mapper/diary.mapper";

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
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const diaries = await this.diaryRepository.findByUserId(
      userId,
      startOfDay,
      endOfDay,
    );
    return { success: true, data: diaries.map(toDiaryData) };
  }

  // 일기 생성
  async createEntry(
    userId: number,
    data: CreateDiaryRequest,
  ): Promise<ApiResponse<DiaryData>> {
    const diary = await this.diaryRepository.create({ userId, ...data });

    // TODO: 테스트 후 주석 해제
    // 2. 비디오 생성 작업 큐에 등록 (비동기, non-blocking)
    // await this.videoProducer.addVideoGenerationJob({
    //   diaryId: diary.id,
    //   userId,
    //   title: data.title,
    //   content: data.content,
    // });

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
}
