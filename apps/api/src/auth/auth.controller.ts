import { Controller, Post, Body, Get, UsePipes } from "@nestjs/common";
import { AuthService } from "./auth.service";
import {
  LoginRequest,
  LoginRequestSchema,
  SignupRequest,
  SignupRequestSchema,
  VerifyEmailRequest,
} from "@repo/types";
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
}
