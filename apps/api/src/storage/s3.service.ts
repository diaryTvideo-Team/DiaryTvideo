import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

@Injectable()
export class S3Service {
  private readonly s3Client: S3Client;
  private readonly bucket: string;
  private readonly region: string;

  constructor(private readonly configService: ConfigService) {
    this.region = this.configService.get<string>("aws.region")!;
    this.bucket = this.configService.get<string>("aws.s3Bucket")!;

    this.s3Client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: this.configService.get<string>("aws.accessKeyId")!,
        secretAccessKey: this.configService.get<string>("aws.secretAccessKey")!,
      },
    });
  }

  /**
   * S3에 파일 업로드
   * @param key S3 객체 키 (경로)
   * @param buffer 파일 데이터
   * @param contentType MIME 타입
   * @returns 업로드된 파일의 퍼블릭 URL
   */
  async upload(
    key: string,
    buffer: Buffer,
    contentType: string,
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    });

    await this.s3Client.send(command);

    return this.getPublicUrl(key);
  }

  /**
   * S3에서 파일 삭제
   * @param key S3 객체 키 (경로)
   */
  async delete(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    await this.s3Client.send(command);
  }

  /**
   * S3 퍼블릭 URL 반환
   * @param key S3 객체 키 (경로)
   * @returns 퍼블릭 URL
   */
  getPublicUrl(key: string): string {
    return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;
  }
}
