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
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { DiaryService } from "./diary.service";
import {
  JwtAccessPayload,
  GetDiaryQueryRequest,
  GetDiaryQuerySchema,
  CreateDiaryRequest,
  CreateDiaryRequestSchema,
  DeleteDiaryParamsSchema,
  DeleteDiaryParams,
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
  ) {
    return this.diaryService.getEntries(user.sub, query.filterDate);
  }

  @Post()
  async createEntry(
    @CurrentUser() user: JwtAccessPayload,
    @Body(new ZodValidationPipe(CreateDiaryRequestSchema))
    data: CreateDiaryRequest,
  ) {
    return this.diaryService.createEntry(user.sub, data);
  }

  @Delete(":id")
  async deleteEntry(
    @CurrentUser() user: JwtAccessPayload,
    @Param(new ZodValidationPipe(DeleteDiaryParamsSchema))
    data: DeleteDiaryParams,
  ) {
    return this.diaryService.deleteEntry(user.sub, data.id);
  }
}
