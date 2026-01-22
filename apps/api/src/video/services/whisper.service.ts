import { Injectable, Logger } from "@nestjs/common";
import { OpenAIService } from "./openai.service";
import { GeneratedAudio } from "./tts.service";
import { toFile } from "openai";

export interface WhisperSegment {
  start: number;
  end: number;
  text: string;
}

export interface WhisperResult {
  scene: number;
  duration: number;
  segments: WhisperSegment[];
}

@Injectable()
export class WhisperService {
  private readonly logger = new Logger(WhisperService.name);

  constructor(private readonly openaiService: OpenAIService) {}

  async transcribe(
    audioBuffer: Buffer,
    sceneNumber: number,
  ): Promise<WhisperResult> {
    this.logger.log(`Transcribing audio for scene ${sceneNumber}`);

    const file = await toFile(audioBuffer, `scene_${sceneNumber}.mp3`, {
      type: "audio/mpeg",
    });

    const response = await this.openaiService
      .getClient()
      .audio.transcriptions.create({
        file,
        model: "whisper-1",
        response_format: "verbose_json",
        timestamp_granularities: ["segment"],
      });

    const segments: WhisperSegment[] = (response.segments || []).map((seg) => ({
      start: seg.start,
      end: seg.end,
      text: seg.text,
    }));

    const duration = response.duration || 0;

    this.logger.log(
      `Scene ${sceneNumber} transcribed: ${duration}s, ${segments.length} segments`,
    );

    return {
      scene: sceneNumber,
      duration,
      segments,
    };
  }

  async transcribeAll(audios: GeneratedAudio[]): Promise<WhisperResult[]> {
    this.logger.log(`Transcribing ${audios.length} audio files`);

    const results: WhisperResult[] = [];

    for (const audio of audios) {
      const result = await this.transcribe(audio.buffer, audio.scene);
      results.push(result);
    }

    return results;
  }
}
