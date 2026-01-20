import { Injectable, Logger } from "@nestjs/common";
import { OpenAIService } from "./openai.service";
import { Scene } from "./scene-splitter.service";

export interface GeneratedImage {
  scene: number;
  url: string;
}

@Injectable()
export class ImageGeneratorService {
  private readonly logger = new Logger(ImageGeneratorService.name);

  constructor(private readonly openaiService: OpenAIService) {}

  async generateImages(scenes: Scene[]): Promise<GeneratedImage[]> {
    const client = this.openaiService.getClient();
    const images: GeneratedImage[] = [];

    for (const scene of scenes) {
      this.logger.log(`이미지 생성 중: 장면 ${scene.scene}`);

      const response = await client.images.generate({
        model: "dall-e-3",
        prompt: `Create a beautiful, cinematic illustration for a diary video: ${scene.description}. Style: warm, cozy, anime-inspired illustration with soft lighting.`,
        n: 1,
        size: "1792x1024",
        quality: "standard",
      });

      const imageUrl = response.data?.[0]?.url;

      if (!imageUrl) {
        throw new Error(`이미지 생성 실패: 장면 ${scene.scene}`);
      }

      images.push({
        scene: scene.scene,
        url: imageUrl,
      });
      this.logger.log(`이미지 생성 완료: 장면 ${scene.scene}`);
    }

    return images;
  }
}
