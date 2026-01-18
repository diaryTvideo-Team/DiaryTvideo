import { Injectable } from "@nestjs/common";
import { VideoStatus } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class DiaryRepository {
  constructor(private readonly prisma: PrismaService) {}

  // 일기 목록 조회 (날짜 필터링)
  async findByUserId(userId: number, startOfDay: Date, endOfDay: Date) {
    return this.prisma.diaryEntry.findMany({
      where: {
        userId,
        deletedAt: null,
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  // 일기 단건 조회
  async findById(id: string) {
    return this.prisma.diaryEntry.findUnique({
      where: { id },
    });
  }

  // 일기 생성
  async create(data: { userId: number; title: string; content: string }) {
    return this.prisma.diaryEntry.create({ data });
  }

  // 일기 삭제 (soft delete)
  async softDelete(id: string) {
    return this.prisma.diaryEntry.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  // 비디오 상태 업데이트
  async updateVideoStatus(id: string, status: VideoStatus, error?: string) {
    return this.prisma.diaryEntry.update({
      where: { id },
      data: {
        videoStatus: status,
        videoError: error ?? null,
      },
    });
  }
}
