import { Queue } from "bullmq";
import Redis from "ioredis";

describe("BullMQ Connection (e2e)", () => {
  let queue: Queue;
  let redis: Redis;

  beforeAll(() => {
    const connection = {
      host: process.env.REDIS_HOST || "localhost",
      port: parseInt(process.env.REDIS_PORT || "6379", 10),
      password: process.env.REDIS_PASSWORD || "dev_redis_password",
    };

    redis = new Redis(connection);
    queue = new Queue("video-generation-test", { connection });
  });

  afterAll(async () => {
    await queue.close();
    await redis.quit();
  });

  it("should create video-generation queue", () => {
    expect(queue).toBeDefined();
    expect(queue.name).toBe("video-generation-test");
  });

  it("should be connected to Redis", async () => {
    const result = await redis.ping();
    expect(result).toBe("PONG");
  });
});
