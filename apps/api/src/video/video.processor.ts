import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Logger } from "@nestjs/common";
import { Job } from "bullmq";
import { VideoJobData } from "@repo/types";
import { DiaryRepository } from "../diary/diary.repository";
import { VideoGateway } from "./video.gateway";

@Processor("video-generation")
export class VideoProcessor extends WorkerHost {
  private readonly logger = new Logger(VideoProcessor.name);

  constructor(
    private readonly videoGateway: VideoGateway,
    private readonly diaryRepository: DiaryRepository
  ) {
    super();
  }

  async process(job: Job<VideoJobData>): Promise<void> {
    const { diaryId, userId } = job.data;
    this.logger.log(`Processing video generation for diary: ${diaryId}`);

    try {
      // 0. 시작 알림
      this.videoGateway.sendVideoStatus(userId, {
        diaryId,
        status: "PENDING",
        message: "영상 생성 시작 대기 중...",
      });
      await this.delay(2000);

      // 1. 장면 분석 - DB 상태 업데이트
      await this.diaryRepository.updateVideoStatus(diaryId, "PROCESSING");
      this.videoGateway.sendVideoStatus(userId, {
        diaryId,
        status: "PROCESSING",
        message: "장면 분석 중...",
      });
      await this.delay(2000);

      // 2. 이미지 생성
      this.videoGateway.sendVideoStatus(userId, {
        diaryId,
        status: "PROCESSING",
        message: "이미지 생성 중...",
      });
      await this.delay(3000);

      // 3. 음성 생성
      this.videoGateway.sendVideoStatus(userId, {
        diaryId,
        status: "PROCESSING",
        message: "음성 생성 중...",
      });
      await this.delay(2000);

      // 4. 영상 합성
      this.videoGateway.sendVideoStatus(userId, {
        diaryId,
        status: "PROCESSING",
        message: "영상 합성 중...",
      });
      await this.delay(3000);

      // 5. 완료 - DB 상태 업데이트
      await this.diaryRepository.updateVideoStatus(diaryId, "COMPLETED");
      this.videoGateway.sendVideoStatus(userId, {
        diaryId,
        status: "COMPLETED",
        message: "완료!",
      });
      this.logger.log(`Video generation completed for diary: ${diaryId}`);
    } catch (error) {
      this.logger.error(`Video generation failed for diary: ${diaryId}`, error);
      // 실패 - DB 상태 업데이트
      await this.diaryRepository.updateVideoStatus(
        diaryId,
        "FAILED",
        "영상 생성에 실패했습니다."
      );
      this.videoGateway.sendVideoStatus(userId, {
        diaryId,
        status: "FAILED",
        message: "영상 생성에 실패했습니다.",
      });
      throw error;
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
