import { Test, TestingModule } from "@nestjs/testing";
import { getQueueToken } from "@nestjs/bullmq";
import { Logger } from "@nestjs/common";
import { VideoProducer } from "./video.producer";

describe("VideoProducer", () => {
  let producer: VideoProducer;
  let mockQueue: {
    add: jest.Mock;
  };

  beforeAll(() => {
    // 테스트 중 로그 출력 억제
    jest.spyOn(Logger.prototype, "log").mockImplementation();
    jest.spyOn(Logger.prototype, "error").mockImplementation();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(async () => {
    mockQueue = {
      add: jest.fn().mockResolvedValue({ id: "test-job-id" }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VideoProducer,
        {
          provide: getQueueToken("video-generation"),
          useValue: mockQueue,
        },
      ],
    }).compile();

    producer = module.get<VideoProducer>(VideoProducer);
  });

  it("should be defined", () => {
    expect(producer).toBeDefined();
  });

  it("should have addVideoGenerationJob method", () => {
    expect(typeof producer.addVideoGenerationJob).toBe("function");
  });

  it("should add job to queue with correct data", async () => {
    const jobData = {
      diaryId: "diary-123",
      userId: 1,
      title: "Test Diary",
      content: "Test content",
    };

    await producer.addVideoGenerationJob(jobData);

    expect(mockQueue.add).toHaveBeenCalledWith(
      "generate-video",
      jobData,
      expect.objectContaining({
        jobId: "diary-123",
      }),
    );
  });

  it("should not throw error when queue fails", async () => {
    mockQueue.add.mockRejectedValue(new Error("Queue error"));

    const jobData = {
      diaryId: "diary-123",
      userId: 1,
      title: "Test Diary",
      content: "Test content",
    };

    // 에러를 던지지 않아야 함
    await expect(
      producer.addVideoGenerationJob(jobData),
    ).resolves.not.toThrow();
  });
});
