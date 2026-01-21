import { Injectable } from "@nestjs/common";
import { WhisperResult } from "./whisper.service";

@Injectable()
export class SubtitleService {
  /**
   * Whisper 결과를 기반으로 VTT 자막 생성
   * 장면별 오디오가 합쳐지므로 누적 오프셋 적용
   */
  generateVttFromWhisper(whisperResults: WhisperResult[]): string {
    if (!whisperResults || whisperResults.length === 0) {
      throw new Error("자막 생성 실패: Whisper 결과가 없습니다");
    }

    let vtt = "WEBVTT\n\n";
    let offset = 0; // 누적 오프셋 (이전 장면들의 duration 합계)

    for (const result of whisperResults) {
      let lastEndTime = 0;

      for (const segment of result.segments) {
        const startTime = this.formatTime(offset + segment.start);
        const endTime = this.formatTime(offset + segment.end);

        vtt += `${startTime} --> ${endTime}\n`;
        vtt += `${segment.text.trim()}\n\n`;

        lastEndTime = segment.end;
      }

      // 다음 장면을 위해 오프셋 업데이트 (마지막 segment의 end 시간 기준)
      offset += lastEndTime;
    }
    return vtt;
  }

  /**
   * 초 단위를 VTT 타임스탬프 형식으로 변환
   * 형식: HH:MM:SS.mmm
   */
  private formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 1000);

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}.${ms.toString().padStart(3, "0")}`;
  }
}
