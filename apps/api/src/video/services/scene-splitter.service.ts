import { Injectable } from "@nestjs/common";
import { OpenAIService } from "./openai.service";

export interface Scene {
  scene: number;
  description: string;
  text: string;
}

export interface SceneSplitResult {
  scenes: Scene[];
}

@Injectable()
export class SceneSplitterService {
  constructor(private readonly openaiService: OpenAIService) {}

  async splitIntoScenes(
    title: string,
    content: string,
  ): Promise<SceneSplitResult> {
    const client = this.openaiService.getClient();

    const prompt = `당신은 일기를 영상으로 만들기 위해 장면을 분할하는 전문가입니다.

아래 일기를 읽고 2-4개의 장면으로 나눠주세요.
각 장면에는:
- scene: 장면 번호 (1부터 시작)
- description: 이미지 생성을 위한 시각적 설명 (영어, 상세하게)
- text: 해당 장면의 나레이션 텍스트 (한국어)

JSON 형식으로만 응답해주세요.

제목: ${title}
내용: ${content}

응답 형식:
{
  "scenes": [
    {
      "scene": 1,
      "description": "A cozy cafe interior with warm lighting, a person sitting by the window...",
      "text": "오늘 카페에서 조용한 시간을 보냈다."
    }
  ]
}`;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const result = JSON.parse(
      response.choices[0].message.content || "{}",
    ) as SceneSplitResult;

    return result;
  }
}
