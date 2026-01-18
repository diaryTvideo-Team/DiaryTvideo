import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bullmq";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { DiaryRepository } from "../diary/diary.repository";
import { VideoProducer } from "./video.producer";
import { VideoProcessor } from "./video.processor";
import { VideoGateway } from "./video.gateway";

@Module({
  imports: [
    JwtModule.register({}),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get("redis.host"),
          port: configService.get("redis.port"),
          password: configService.get("redis.password"),
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: "video-generation",
    }),
  ],
  providers: [VideoProducer, VideoProcessor, VideoGateway, DiaryRepository],
  exports: [VideoProducer],
})
export class VideoModule {}
