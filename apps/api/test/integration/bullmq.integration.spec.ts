import { Queue, Worker, Job } from "bullmq";

describe("BullMQ Integration", () => {
  const connection = {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379", 10),
    password: process.env.REDIS_PASSWORD || "dev_redis_password",
  };

  it("should add job to queue", async () => {
    const queue = new Queue("test-add-queue", { connection });

    try {
      const job = await queue.add("test-job", { message: "hello" });

      expect(job).toBeDefined();
      expect(job.id).toBeDefined();
      expect(job.name).toBe("test-job");
      expect(job.data).toEqual({ message: "hello" });
    } finally {
      await queue.obliterate({ force: true });
      await queue.close();
    }
  });

  it("should process job with worker", async () => {
    const queue = new Queue("test-process-queue", { connection });
    let worker: Worker;

    try {
      const processedData: { message: string }[] = [];

      worker = new Worker(
        "test-process-queue",
        async (job: Job) => {
          processedData.push(job.data);
          return { success: true };
        },
        { connection },
      );

      await queue.add("process-test", { message: "process-me" });

      // Worker가 작업을 처리할 때까지 대기
      await new Promise<void>((resolve) => {
        worker.on("completed", () => {
          resolve();
        });
      });

      expect(processedData).toContainEqual({ message: "process-me" });
    } finally {
      await worker!.close();
      await queue.obliterate({ force: true });
      await queue.close();
    }
  });
});
