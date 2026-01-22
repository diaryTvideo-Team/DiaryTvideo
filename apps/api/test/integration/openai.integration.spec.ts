import OpenAI from "openai";
import { toFile } from "openai";

describe("OpenAI Integration", () => {
  let client: OpenAI;

  beforeAll(() => {
    client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  });

  describe("GPT", () => {
    it("should respond to simple prompt", async () => {
      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: "Say hello in Korean" }],
        max_tokens: 50,
      });

      expect(response.choices).toBeDefined();
      expect(response.choices.length).toBeGreaterThan(0);
      expect(response.choices[0].message.content).toBeDefined();
    });
  });

  describe("TTS", () => {
    let audioBuffer: Buffer;

    it("should generate audio from text", async () => {
      const response = await client.audio.speech.create({
        model: "tts-1",
        voice: "nova",
        input: "안녕하세요",
      });

      const arrayBuffer = await response.arrayBuffer();
      audioBuffer = Buffer.from(arrayBuffer);

      expect(audioBuffer).toBeDefined();
      expect(audioBuffer.length).toBeGreaterThan(0);
    });

    it("should transcribe audio with Whisper", async () => {
      // TTS 테스트에서 생성된 오디오 사용
      if (!audioBuffer) {
        const response = await client.audio.speech.create({
          model: "tts-1",
          voice: "nova",
          input: "안녕하세요",
        });
        audioBuffer = Buffer.from(await response.arrayBuffer());
      }

      const file = await toFile(audioBuffer, "test.mp3", {
        type: "audio/mpeg",
      });

      const transcription = await client.audio.transcriptions.create({
        file,
        model: "whisper-1",
      });

      expect(transcription.text).toBeDefined();
      expect(transcription.text.length).toBeGreaterThan(0);
    });
  });

  describe("DALL-E", () => {
    it("should generate image", async () => {
      const response = await client.images.generate({
        model: "dall-e-3",
        prompt: "A simple blue circle on white background",
        n: 1,
        size: "1024x1024",
        quality: "standard",
      });

      expect(response.data).toBeDefined();
      expect(response.data!.length).toBeGreaterThan(0);
      expect(response.data![0].url).toBeDefined();
    });
  });
});
