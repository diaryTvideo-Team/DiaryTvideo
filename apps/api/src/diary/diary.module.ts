import { Module } from "@nestjs/common";
import { DiaryController } from "./diary.controller";
import { DiaryService } from "./diary.service";
import { DiaryRepository } from "./diary.repository";
import { VideoModule } from "src/video/video.module";

@Module({
  imports: [VideoModule],
  controllers: [DiaryController],
  providers: [DiaryService, DiaryRepository],
})
export class DiaryModule {}
