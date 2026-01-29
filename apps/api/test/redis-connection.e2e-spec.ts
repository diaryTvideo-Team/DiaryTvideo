import Redis from "ioredis";

describe("Redis Connection (e2e)", () => {
  let redis: Redis;

  beforeAll(async () => {
    redis = new Redis({
      host: process.env.REDIS_HOST || "localhost",
      port: parseInt(process.env.REDIS_PORT || "6379", 10),
      password: process.env.REDIS_PASSWORD || "dev_redis_password",
    });

    // 연결 완료 대기
    await new Promise<void>((resolve, reject) => {
      redis.on("ready", resolve);
      redis.on("error", reject);
    });
  });

  afterAll(async () => {
    await redis.quit();
  });

  it("should connect to Redis", () => {
    expect(redis.status).toBe("ready");
  });

  it("should respond to ping with PONG", async () => {
    const result = await redis.ping();
    expect(result).toBe("PONG");
  });
});
