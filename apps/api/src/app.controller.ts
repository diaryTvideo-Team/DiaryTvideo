import { Controller, Get, HttpStatus, Res } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Response } from "express";
import Redis from "ioredis";
import { PrismaService } from "./prisma/prisma.service";

@Controller()
export class AppController {
  private redis: Redis;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.redis = new Redis({
      host: this.configService.get("redis.host"),
      port: this.configService.get("redis.port"),
      password: this.configService.get("redis.password"),
      lazyConnect: true,
    });
  }

  @Get("health")
  async health(@Res() res: Response) {
    const checks: Record<string, string> = {};
    let healthy = true;

    try {
      await this.prisma.$queryRawUnsafe("SELECT 1");
      checks.database = "ok";
    } catch {
      checks.database = "fail";
      healthy = false;
    }

    try {
      await this.redis.ping();
      checks.redis = "ok";
    } catch {
      checks.redis = "fail";
      healthy = false;
    }

    const status = healthy ? "ok" : "degraded";
    const statusCode = healthy ? HttpStatus.OK : HttpStatus.SERVICE_UNAVAILABLE;

    res.status(statusCode).json({ status, checks });
  }
}
