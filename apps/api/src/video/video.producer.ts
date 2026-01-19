import { Injectable, Logger } from "@nestjs/common";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";
import { VideoJobData } from "@repo/types";

@Injectable()
export class VideoProducer {
  private readonly logger = new Logger(VideoProducer.name);

  constructor(@InjectQueue("video-generation") private videoQueue: Queue) {}

  async addVideoGenerationJob(data: VideoJobData): Promise<void> {
    try {
      await this.videoQueue.add("generate-video", data, {
        jobId: data.diaryId, // 중복 방지
        removeOnComplete: {
          age: 7 * 24 * 60 * 60, // 7일 후 자동 삭제
        },
        removeOnFail: {
          age: 30 * 24 * 60 * 60, // 30일 후 자동 삭제
        },
        attempts: 3, // 3번 재시도
        backoff: {
          type: "exponential",
          delay: 5000, // 5초부터 시작
        },
      });

      this.logger.log(`Video generation job added for diary: ${data.diaryId}`);
    } catch (error: unknown) {
      this.logger.error(
        `Failed to add video generation job for diary ${data.diaryId}`,
        error instanceof Error ? error.stack : "Unknown error",
      );
      // 큐 등록 실패해도 일기 생성은 성공하도록 에러를 던지지 않음
    }
  }
}
