import { Controller, Post, Body, Query, Get, UsePipes } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignupRequest, SignupRequestSchema } from "@repo/types";
import { ZodValidationPipe } from "src/common/pipes/zod-validation.pipe";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("signup")
  @UsePipes(new ZodValidationPipe(SignupRequestSchema))
  async signup(@Body() data: SignupRequest) {
    return this.authService.signup(data);
  }

  @Get("verify-email")
  async verifyEmail(@Query("code") code: string) {
    return this.authService.verifyEmail(code);
  }

  @Post("resend-verification")
  async resendVerification(@Body("email") email: string) {
    return this.authService.resendVerificationEmail(email);
  }
}
