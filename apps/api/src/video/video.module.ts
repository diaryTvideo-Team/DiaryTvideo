import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bullmq";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { DiaryRepository } from "../diary/diary.repository";
import { VideoProducer } from "./video.producer";
import { VideoProcessor } from "./video.processor";
import { VideoGateway } from "./video.gateway";
import { OpenAIService } from "./services/openai.service";
import { SceneSplitterService } from "./services/scene-splitter.service";
import { ImageGeneratorService } from "./services/image-generator.service";

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
  providers: [
    VideoProducer,
    VideoProcessor,
    VideoGateway,
    DiaryRepository,
    OpenAIService,
    SceneSplitterService,
    ImageGeneratorService,
  ],
  exports: [VideoProducer],
})
export class VideoModule {}
