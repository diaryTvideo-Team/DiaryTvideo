import { Injectable, Logger } from "@nestjs/common";
import ffmpeg from "fluent-ffmpeg";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { GeneratedImage } from "./image-generator.service";
import { GeneratedAudio } from "./tts.service";

export interface VideoComposeResult {
  videoPath: string;
  subtitlePath: string;
  thumbnailPath: string;
}

@Injectable()
export class FfmpegService {
  private readonly logger = new Logger(FfmpegService.name);

  async composeVideo(
    diaryId: string,
    images: GeneratedImage[],
    audios: GeneratedAudio[],
    vtt: string,
    durations: number[],
  ): Promise<VideoComposeResult> {
    // 입력 데이터 검증
    if (!images || images.length === 0) {
      throw new Error("영상 합성 실패: 이미지 데이터가 없습니다");
    }
    if (!audios || audios.length === 0) {
      throw new Error("영상 합성 실패: 음성 데이터가 없습니다");
    }
    if (!vtt || vtt.trim() === "") {
      throw new Error("영상 합성 실패: 자막 데이터가 없습니다");
    }
    if (!durations || durations.length === 0) {
      throw new Error("영상 합성 실패: duration 데이터가 없습니다");
    }

    const tempDir = path.join(os.tmpdir(), `video-${diaryId}`);
    fs.mkdirSync(tempDir, { recursive: true });

    this.logger.log(`임시 디렉토리 생성: ${tempDir}`);

    try {
      // 이미지 다운로드
      const imagePaths: string[] = [];
      for (let i = 0; i < images.length; i++) {
        const imagePath = path.join(tempDir, `image-${i + 1}.png`);
        await this.downloadFile(images[i].url, imagePath);

        if (!fs.existsSync(imagePath)) {
          throw new Error(`이미지 다운로드 실패: ${images[i].url}`);
        }

        imagePaths.push(imagePath);
      }

      // 음성 저장
      const audioPaths: string[] = [];
      for (let i = 0; i < audios.length; i++) {
        const audioPath = path.join(tempDir, `audio-${i + 1}.mp3`);
        fs.writeFileSync(audioPath, audios[i].buffer);

        if (!fs.existsSync(audioPath)) {
          throw new Error(`음성 파일 저장 실패: 장면 ${i + 1}`);
        }

        audioPaths.push(audioPath);
      }

      // 음성 합치기
      const mergedAudioPath = path.join(tempDir, "merged-audio.mp3");
      await this.mergeAudios(audioPaths, mergedAudioPath);

      if (!fs.existsSync(mergedAudioPath)) {
        throw new Error("음성 병합 파일 생성 실패");
      }

      // 이미지 슬라이드쇼 + 음성 합성
      const outputPath = path.join(tempDir, "output.mp4");
      await this.createSlideshow(
        imagePaths,
        durations,
        mergedAudioPath,
        outputPath,
      );

      if (!fs.existsSync(outputPath)) {
        throw new Error("영상 파일 생성 실패");
      }

      // 자막 파일 저장
      const subtitlePath = path.join(tempDir, "subtitle.vtt");
      fs.writeFileSync(subtitlePath, vtt);

      if (!fs.existsSync(subtitlePath)) {
        throw new Error("자막 파일 저장 실패");
      }

      // 썸네일 (첫 번째 이미지 사용)
      const thumbnailPath = imagePaths[0];

      return { videoPath: outputPath, subtitlePath, thumbnailPath };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`영상 합성 실패: ${message}`);
      throw new Error(`영상 합성 실패: ${message}`);
    }
  }

  private async downloadFile(url: string, destPath: string): Promise<void> {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP 오류: ${response.status} ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();

      if (!arrayBuffer || arrayBuffer.byteLength === 0) {
        throw new Error("다운로드된 파일이 비어있습니다");
      }

      fs.writeFileSync(destPath, Buffer.from(arrayBuffer));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`파일 다운로드 실패 (${url}): ${message}`);
    }
  }

  private async mergeAudios(
    audioPaths: string[],
    outputPath: string,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const command = ffmpeg();

      // 각 오디오 파일을 input으로 추가
      audioPaths.forEach((audioPath) => {
        command.input(audioPath);
      });

      // concat filter로 병합
      command
        .on("start", () => {})
        .on("error", (err) => {
          this.logger.error(`FFmpeg 음성 병합 오류: ${err.message}`);
          reject(new Error(`FFmpeg 음성 병합 실패: ${err.message}`));
        })
        .on("end", () => {
          resolve();
        })
        .mergeToFile(outputPath, os.tmpdir());
    });
  }

  private async createSlideshow(
    imagePaths: string[],
    durations: number[],
    audioPath: string,
    outputPath: string,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      // 각 이미지의 duration으로 concat demuxer용 파일 생성
      const concatFilePath = path.join(path.dirname(outputPath), "concat.txt");
      let concatContent = "";

      for (let i = 0; i < imagePaths.length; i++) {
        const duration = durations[i] || 5;
        concatContent += `file '${imagePaths[i]}'\n`;
        concatContent += `duration ${duration}\n`;
      }
      // 마지막 이미지 한번 더 추가 (FFmpeg concat demuxer 요구사항)
      if (imagePaths.length > 0) {
        concatContent += `file '${imagePaths[imagePaths.length - 1]}'\n`;
      }

      fs.writeFileSync(concatFilePath, concatContent);

      ffmpeg()
        .input(concatFilePath)
        .inputOptions(["-f", "concat", "-safe", "0"])
        .input(audioPath)
        .outputOptions([
          "-c:v",
          "libx264",
          "-pix_fmt",
          "yuv420p",
          "-c:a",
          "aac",
          "-movflags",
          "+faststart",
        ])
        .on("start", () => {})
        .on("error", (err) => {
          this.logger.error(`FFmpeg 영상 합성 오류: ${err.message}`);
          reject(new Error(`FFmpeg 영상 합성 실패: ${err.message}`));
        })
        .on("end", () => {
          resolve();
        })
        .save(outputPath);
    });
  }

  cleanupTempDir(diaryId: string): void {
    const tempDir = path.join(os.tmpdir(), `video-${diaryId}`);
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
      this.logger.log(`임시 디렉토리 삭제: ${tempDir}`);
    }
  }
}
