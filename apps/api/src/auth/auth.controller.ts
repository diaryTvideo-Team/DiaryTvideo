import { Controller, Post, Body, UsePipes, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import {
  JwtAccessPayload,
  LoginRequest,
  LoginRequestSchema,
  SignupRequest,
  SignupRequestSchema,
  VerifyEmailRequest,
  VerifyEmailRequestSchema,
} from "@repo/types";
import { ZodValidationPipe } from "src/common/pipes/zod-validation.pipe";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { CurrentUser } from "./decorators/current-user.decorator";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("signup")
  @UsePipes(new ZodValidationPipe(SignupRequestSchema))
  async signup(@Body() data: SignupRequest) {
    return this.authService.signup(data);
  }

  @Post("verify-email")
  @UsePipes(new ZodValidationPipe(VerifyEmailRequestSchema))
  async verifyEmail(@Body() data: VerifyEmailRequest) {
    return this.authService.verifyEmail(data);
  }

  @Post("resend-verification")
  async resendVerification(@Body("email") email: string) {
    return this.authService.resendVerificationEmail(email);
  }

  @Post("signin")
  @UsePipes(new ZodValidationPipe(LoginRequestSchema))
  async signin(@Body() data: LoginRequest) {
    return this.authService.signin(data);
  }

  @Post("logout")
  @UseGuards(JwtAuthGuard)
  async logout(@CurrentUser() user: JwtAccessPayload) {
    return this.authService.logout(user.sub);
  }
}
