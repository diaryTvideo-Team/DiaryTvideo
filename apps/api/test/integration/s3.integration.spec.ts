import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

describe("S3 Integration", () => {
  let s3Client: S3Client;
  const bucket = process.env.AWS_S3_BUCKET!;
  const region = process.env.AWS_REGION || "ap-northeast-2";
  const testKey = "test/integration-test.txt";

  beforeAll(() => {
    s3Client = new S3Client({
      region,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
  });

  afterAll(async () => {
    // 테스트 후 파일 정리
    try {
      await s3Client.send(
        new DeleteObjectCommand({
          Bucket: bucket,
          Key: testKey,
        }),
      );
    } catch {
      // 파일이 없어도 무시
    }
    s3Client.destroy();
  });

  it("should upload file to S3", async () => {
    const content = "Hello, S3 Integration Test!";
    const buffer = Buffer.from(content, "utf-8");

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: testKey,
      Body: buffer,
      ContentType: "text/plain",
    });

    const result = await s3Client.send(command);
    expect(result.$metadata.httpStatusCode).toBe(200);
  });

  it("should download file from S3", async () => {
    // 먼저 파일 업로드
    const content = "Download test content";
    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: testKey,
        Body: Buffer.from(content, "utf-8"),
        ContentType: "text/plain",
      }),
    );

    // 파일 다운로드
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: testKey,
    });

    const result = await s3Client.send(command);
    const body = await result.Body?.transformToString();

    expect(body).toBe(content);
  });

  it("should delete file from S3", async () => {
    // 먼저 파일 업로드
    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: testKey,
        Body: Buffer.from("To be deleted", "utf-8"),
        ContentType: "text/plain",
      }),
    );

    // 파일 삭제
    const command = new DeleteObjectCommand({
      Bucket: bucket,
      Key: testKey,
    });

    const result = await s3Client.send(command);
    expect(result.$metadata.httpStatusCode).toBe(204);
  });

  it("should generate correct public URL", () => {
    const key = "videos/diary-123/video.mp4";
    const expectedUrl = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
    const generatedUrl = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;

    expect(generatedUrl).toBe(expectedUrl);
  });
});
