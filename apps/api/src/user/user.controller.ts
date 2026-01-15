import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  UseGuards,
} from "@nestjs/common";
import {
  ChangePasswordRequest,
  ChangePasswordRequestSchema,
  DeleteAccountRequest,
  DeleteAccountRequestSchema,
  JwtAccessPayload,
  UpdateNameRequest,
  UpdateNameRequestSchema,
} from "@repo/types";
import { CurrentUser } from "src/auth/decorators/current-user.decorator";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { UserService } from "./user.service";
import { ZodValidationPipe } from "src/common/pipes/zod-validation.pipe";

@Controller("user")
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get("me")
  async getUser(@CurrentUser() user: JwtAccessPayload) {
    return this.userService.getUser(user.sub);
  }

  @Patch("name")
  async updateName(
    @CurrentUser() user: JwtAccessPayload,
    @Body(new ZodValidationPipe(UpdateNameRequestSchema))
    data: UpdateNameRequest,
  ) {
    return this.userService.updateName(user.sub, data.name);
  }

  @Patch("password")
  async changePassword(
    @CurrentUser() user: JwtAccessPayload,
    @Body(new ZodValidationPipe(ChangePasswordRequestSchema))
    data: ChangePasswordRequest,
  ) {
    return this.userService.changePassword(
      user.sub,
      data.currentPassword,
      data.newPassword,
    );
  }

  @Delete()
  async deleteAccount(
    @CurrentUser() user: JwtAccessPayload,
    @Body(new ZodValidationPipe(DeleteAccountRequestSchema))
    data: DeleteAccountRequest,
  ) {
    return this.userService.deleteAccount(user.sub, data.password);
  }
}
