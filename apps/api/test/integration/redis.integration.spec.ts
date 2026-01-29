import Redis from "ioredis";

describe("Redis Integration", () => {
  let redis: Redis;
  const testKey = "test:integration:key";

  beforeAll(() => {
    redis = new Redis({
      host: process.env.REDIS_HOST || "localhost",
      port: parseInt(process.env.REDIS_PORT || "6379", 10),
      password: process.env.REDIS_PASSWORD || "dev_redis_password",
    });
  });

  afterAll(async () => {
    await redis.del(testKey);
    await redis.quit();
  });

  afterEach(async () => {
    await redis.del(testKey);
  });

  it("should set and get value", async () => {
    await redis.set(testKey, "hello-world");
    const value = await redis.get(testKey);
    expect(value).toBe("hello-world");
  });

  it("should delete key", async () => {
    await redis.set(testKey, "to-be-deleted");
    const deleted = await redis.del(testKey);
    expect(deleted).toBe(1);

    const value = await redis.get(testKey);
    expect(value).toBeNull();
  });

  it("should handle TTL", async () => {
    await redis.set(testKey, "expires-soon", "EX", 10);
    const ttl = await redis.ttl(testKey);
    expect(ttl).toBeGreaterThan(0);
    expect(ttl).toBeLessThanOrEqual(10);
  });
});
