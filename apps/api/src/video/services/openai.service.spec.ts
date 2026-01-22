import { Test, TestingModule } from "@nestjs/testing";
import { ConfigService } from "@nestjs/config";
import { OpenAIService } from "./openai.service";
import OpenAI from "openai";

describe("OpenAIService", () => {
  let service: OpenAIService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OpenAIService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue("test-api-key"),
          },
        },
      ],
    }).compile();

    service = module.get<OpenAIService>(OpenAIService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should have getClient method", () => {
    expect(typeof service.getClient).toBe("function");
  });

  it("getClient should return OpenAI instance", () => {
    const client = service.getClient();
    expect(client).toBeInstanceOf(OpenAI);
  });
});
