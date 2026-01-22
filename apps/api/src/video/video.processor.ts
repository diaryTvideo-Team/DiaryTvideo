import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Logger } from "@nestjs/common";
import { Job } from "bullmq";
import { VideoJobData } from "@repo/types";
import * as fs from "fs";
import { DiaryRepository } from "../diary/diary.repository";
import { S3Service } from "../storage/s3.service";
import { VideoGateway } from "./video.gateway";
import { SceneSplitterService } from "./services/scene-splitter.service";
import { ImageGeneratorService } from "./services/image-generator.service";
import { TtsService } from "./services/tts.service";
import { WhisperService } from "./services/whisper.service";
import { SubtitleService } from "./services/subtitle.service";
import { FfmpegService } from "./services/ffmpeg.service";
import { VideoStatus } from "@prisma/client";

@Processor("video-generation")
export class VideoProcessor extends WorkerHost {
  private readonly logger = new Logger(VideoProcessor.name);

  constructor(
    private readonly videoGateway: VideoGateway,
    private readonly diaryRepository: DiaryRepository,
    private readonly s3Service: S3Service,
    private readonly sceneSplitter: SceneSplitterService,
    private readonly imageGenerator: ImageGeneratorService,
    private readonly ttsService: TtsService,
    private readonly whisperService: WhisperService,
    private readonly subtitleService: SubtitleService,
    private readonly ffmpegService: FfmpegService,
  ) {
    super();
  }

  async process(job: Job<VideoJobData>): Promise<void> {
    const { diaryId, userId, title, content } = job.data;
    this.logger.log(`Processing video generation for diary: ${diaryId}`);

    try {
      // 장면 분석 + 캐릭터 프로필 - GPT
      await this.diaryRepository.updateVideoStatus(
        diaryId,
        VideoStatus.PROCESSING,
      );
      this.videoGateway.sendVideoStatus(userId, {
        diaryId,
        status: "PROCESSING",
        message: "장면 분석 및 캐릭터 생성 중...",
      });

      const { character, voice, scenes } =
        await this.sceneSplitter.splitIntoScenes(title, content);

      // TTS + 이미지 생성 (병렬 실행)
      this.videoGateway.sendVideoStatus(userId, {
        diaryId,
        status: "PROCESSING",
        message: "음성 및 이미지 생성 중...",
      });

      const [audios, images] = await Promise.all([
        this.ttsService.generateAudio(scenes, voice),
        this.imageGenerator.generateImages(scenes, character.profile),
      ]);

      // Whisper 타임스탬프 추출
      this.videoGateway.sendVideoStatus(userId, {
        diaryId,
        status: "PROCESSING",
        message: "음성 분석 중...",
      });

      const whisperResults = await this.whisperService.transcribeAll(audios);

      // 자막 생성 (Whisper 기반)
      this.videoGateway.sendVideoStatus(userId, {
        diaryId,
        status: "PROCESSING",
        message: "자막 생성 중...",
      });

      const vtt = this.subtitleService.generateVttFromWhisper(whisperResults);

      // 영상 합성 - FFmpeg
      this.videoGateway.sendVideoStatus(userId, {
        diaryId,
        status: "PROCESSING",
        message: "영상 합성 중...",
      });

      const durations = whisperResults.map((w) => w.duration);
      const { videoPath, subtitlePath, thumbnailPath } =
        await this.ffmpegService.composeVideo(
          diaryId,
          images,
          audios,
          vtt,
          durations,
        );
      this.logger.log(`영상 합성 완료: ${videoPath}`);
      this.logger.log(`자막 파일: ${subtitlePath}`);

      // S3 업로드
      this.videoGateway.sendVideoStatus(userId, {
        diaryId,
        status: "PROCESSING",
        message: "파일 업로드 중...",
      });

      const [videoUrl, thumbnailUrl, subtitleUrl] = await Promise.all([
        this.s3Service.upload(
          `videos/${diaryId}/video.mp4`,
          fs.readFileSync(videoPath),
          "video/mp4",
        ),
        this.s3Service.upload(
          `videos/${diaryId}/thumbnail.png`,
          fs.readFileSync(thumbnailPath),
          "image/png",
        ),
        this.s3Service.upload(
          `videos/${diaryId}/subtitle.vtt`,
          fs.readFileSync(subtitlePath),
          "text/vtt",
        ),
      ]);

      this.logger.log(`S3 업로드 완료: ${videoUrl}`);

      // DB에 URL 저장
      await this.diaryRepository.updateVideoUrls(diaryId, {
        videoUrl,
        thumbnailUrl,
        subtitleUrl,
      });

      // 완료
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
        VideoStatus.FAILED,
        "영상 생성에 실패했습니다.",
      );
      this.videoGateway.sendVideoStatus(userId, {
        diaryId,
        status: "FAILED",
        message: "영상 생성에 실패했습니다.",
      });

      throw error;
    } finally {
      // 임시 파일 정리
      this.ffmpegService.cleanupTempDir(diaryId);
    }
  }
}
