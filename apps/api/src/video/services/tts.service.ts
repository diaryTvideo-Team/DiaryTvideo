import { Injectable, Logger } from "@nestjs/common";
import { OpenAIService } from "./openai.service";
import { Scene } from "./scene-splitter.service";

export interface GeneratedAudio {
  scene: number;
  buffer: Buffer;
}

@Injectable()
export class TtsService {
  private readonly logger = new Logger(TtsService.name);

  constructor(private readonly openaiService: OpenAIService) {}

  async generateAudio(
    scenes: Scene[],
    voice: "male" | "female",
  ): Promise<GeneratedAudio[]> {
    const client = this.openaiService.getClient();
    const audios: GeneratedAudio[] = [];

    // 음성 매핑: female → nova, male → onyx
    const voiceName = voice === "male" ? "onyx" : "nova";

    for (const scene of scenes) {
      try {
        const response = await client.audio.speech.create({
          model: "tts-1",
          voice: voiceName,
          input: scene.narration,
        });

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        if (!buffer || buffer.length === 0) {
          throw new Error(`음성 생성 결과가 비어있음: 장면 ${scene.scene}`);
        }

        audios.push({
          scene: scene.scene,
          buffer,
        });
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        this.logger.error(`음성 생성 실패: 장면 ${scene.scene} - ${message}`);
        throw new Error(`TTS 생성 실패 (장면 ${scene.scene}): ${message}`);
      }
    }

    if (audios.length !== scenes.length) {
      throw new Error(
        `음성 생성 개수 불일치: expected ${scenes.length}, got ${audios.length}`,
      );
    }

    return audios;
  }
}
