import { Test, TestingModule } from "@nestjs/testing";
import { BullModule, getQueueToken } from "@nestjs/bullmq";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { Queue } from "bullmq";
import { VideoProducer } from "./video.producer";

describe("VideoModule", () => {
  let module: TestingModule;
  let queue: Queue;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [
            () => ({
              redis: {
                host: process.env.REDIS_HOST || "localhost",
                port: parseInt(process.env.REDIS_PORT || "6379", 10),
                password: process.env.REDIS_PASSWORD || "dev_redis_password",
              },
            }),
          ],
        }),
        JwtModule.register({}),
        BullModule.forRoot({
          connection: {
            host: process.env.REDIS_HOST || "localhost",
            port: parseInt(process.env.REDIS_PORT || "6379", 10),
            password: process.env.REDIS_PASSWORD || "dev_redis_password",
          },
        }),
        BullModule.registerQueue({
          name: "video-generation",
        }),
      ],
      providers: [VideoProducer],
    }).compile();

    queue = module.get<Queue>(getQueueToken("video-generation"));
  });

  afterAll(async () => {
    await queue.close();
    await module.close();
  });

  it("should create video-generation queue", () => {
    expect(queue).toBeDefined();
    expect(queue.name).toBe("video-generation");
  });

  it("should have VideoProducer", () => {
    const producer = module.get<VideoProducer>(VideoProducer);
    expect(producer).toBeDefined();
  });
});
