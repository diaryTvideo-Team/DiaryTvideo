import { Injectable, Logger } from "@nestjs/common";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";
import { VideoJobData } from "@repo/types";

@Injectable()
export class VideoProducer {
  private readonly logger = new Logger(VideoProducer.name);

  constructor(@InjectQueue("video-generation") private videoQueue: Queue) {}

  async addVideoGenerationJob(data: VideoJobData): Promise<void> {
    await this.videoQueue.add("generate-video", data, {
      jobId: `${data.diaryId}-${Date.now()}`,
      removeOnComplete: {
        age: 7 * 24 * 60 * 60, // 7일 후 자동 삭제
      },
      removeOnFail: {
        age: 30 * 24 * 60 * 60, // 30일 후 자동 삭제
      },
    });

    this.logger.log(`Video generation job added for diary: ${data.diaryId}`);
  }
}
