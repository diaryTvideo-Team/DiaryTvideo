import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Logger } from "@nestjs/common";
import { Job } from "bullmq";
import { VideoJobData } from "@repo/types";
import { DiaryRepository } from "../diary/diary.repository";
import { VideoGateway } from "./video.gateway";
import { SceneSplitterService } from "./services/scene-splitter.service";
import { ImageGeneratorService } from "./services/image-generator.service";

@Processor("video-generation")
export class VideoProcessor extends WorkerHost {
  private readonly logger = new Logger(VideoProcessor.name);

  constructor(
    private readonly videoGateway: VideoGateway,
    private readonly diaryRepository: DiaryRepository,
    private readonly sceneSplitter: SceneSplitterService,
    private readonly imageGenerator: ImageGeneratorService,
  ) {
    super();
  }

  async process(job: Job<VideoJobData>): Promise<void> {
    const { diaryId, userId, title, content } = job.data;
    this.logger.log(`Processing video generation for diary: ${diaryId}`);

    try {
      // 1. 장면 분석 - GPT
      await this.diaryRepository.updateVideoStatus(diaryId, "PROCESSING");
      this.videoGateway.sendVideoStatus(userId, {
        diaryId,
        status: "PROCESSING",
        message: "장면 분석 중...",
      });

      const { scenes } = await this.sceneSplitter.splitIntoScenes(
        title,
        content,
      );
      this.logger.log(`장면 분할 완료: ${scenes.length}개 장면`);

      // 2. 이미지 생성 - DALL-E
      this.videoGateway.sendVideoStatus(userId, {
        diaryId,
        status: "PROCESSING",
        message: "이미지 생성 중...",
      });

      const images = await this.imageGenerator.generateImages(scenes);
      this.logger.log(`이미지 생성 완료: ${images.length}개`);

      // (임시) 생성된 이미지 URL 로그 출력
      images.forEach((img, idx) => {
        this.logger.log(`[이미지 ${idx + 1}] ${img.url}`);
      });

      // 3. 완료
      await this.diaryRepository.updateVideoStatus(diaryId, "COMPLETED");
      this.videoGateway.sendVideoStatus(userId, {
        diaryId,
        status: "COMPLETED",
        message: "완료!",
      });
      this.logger.log(`Video generation completed for diary: ${diaryId}`);
    } catch (error) {
      this.logger.error(`Video generation failed for diary: ${diaryId}`, error);
      await this.diaryRepository.updateVideoStatus(
        diaryId,
        "FAILED",
        "영상 생성에 실패했습니다.",
      );
      this.videoGateway.sendVideoStatus(userId, {
        diaryId,
        status: "FAILED",
        message: "영상 생성에 실패했습니다.",
      });
      throw error;
    }
  }
}
