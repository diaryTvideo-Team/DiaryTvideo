import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PrismaModule } from "./prisma/prisma.module";
import { ConfigModule } from "./config/config.module";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { DiaryModule } from "./diary/diary.module";
import { VideoModule } from "./video/video.module";
import { StorageModule } from "./storage/storage.module";

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    AuthModule,
    UserModule,
    DiaryModule,
    VideoModule,
    StorageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
