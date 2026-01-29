import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { DiaryService } from "./diary.service";
import {
  ApiResponse,
  DiaryData,
  JwtAccessPayload,
  GetDiaryQueryRequest,
  GetDiaryQuerySchema,
  GetMonthlyDiaryQueryRequest,
  GetMonthlyDiaryQuerySchema,
  CreateDiaryRequest,
  CreateDiaryRequestSchema,
  DeleteDiaryParamsSchema,
  DeleteDiaryParams,
  RetryVideoDiaryParamsSchema,
  RetryVideoDiaryParams,
} from "@repo/types";
import { ZodValidationPipe } from "src/common/pipes/zod-validation.pipe";

@Controller("diary")
@UseGuards(JwtAuthGuard)
export class DiaryController {
  constructor(private readonly diaryService: DiaryService) {}

  @Get()
  async getEntries(
    @CurrentUser() user: JwtAccessPayload,
    @Query(new ZodValidationPipe(GetDiaryQuerySchema))
    query: GetDiaryQueryRequest,
  ): Promise<ApiResponse<DiaryData[]>> {
    return this.diaryService.getEntries(user.sub, query.filterDate);
  }

  @Get("monthly")
  async getEntriesByMonth(
    @CurrentUser() user: JwtAccessPayload,
    @Query(new ZodValidationPipe(GetMonthlyDiaryQuerySchema))
    query: GetMonthlyDiaryQueryRequest,
  ): Promise<ApiResponse<DiaryData[]>> {
    return this.diaryService.getEntriesByMonth(
      user.sub,
      query.year,
      query.month,
    );
  }

  @Post()
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  async createEntry(
    @CurrentUser() user: JwtAccessPayload,
    @Body(new ZodValidationPipe(CreateDiaryRequestSchema))
    data: CreateDiaryRequest,
  ): Promise<ApiResponse<DiaryData>> {
    return this.diaryService.createEntry(user.sub, data);
  }

  @Delete(":id")
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  async deleteEntry(
    @CurrentUser() user: JwtAccessPayload,
    @Param(new ZodValidationPipe(DeleteDiaryParamsSchema))
    data: DeleteDiaryParams,
  ): Promise<ApiResponse<DiaryData>> {
    return this.diaryService.deleteEntry(user.sub, data.id);
  }

  @Post(":id/retry")
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  async retryVideoGeneration(
    @CurrentUser() user: JwtAccessPayload,
    @Param(new ZodValidationPipe(RetryVideoDiaryParamsSchema))
    params: RetryVideoDiaryParams,
  ): Promise<ApiResponse<DiaryData>> {
    return this.diaryService.retryVideoGeneration(user.sub, params.id);
  }
}
