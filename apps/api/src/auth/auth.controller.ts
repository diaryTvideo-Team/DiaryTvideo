import {
  Controller,
  Post,
  Body,
  UsePipes,
  UseGuards,
  Get,
  Query,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import {
  ForgotPasswordRequest,
  ForgotPasswordRequestSchema,
  JwtAccessPayload,
  LoginRequest,
  LoginRequestSchema,
  ResetPasswordRequest,
  ResetPasswordRequestSchema,
  SignupRequest,
  SignupRequestSchema,
  VerifyEmailRequest,
  VerifyEmailRequestSchema,
  VerifyResetTokenRequest,
  VerifyResetTokenRequestSchema,
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

  @Post("forgot-password")
  @UsePipes(new ZodValidationPipe(ForgotPasswordRequestSchema))
  async forgotPassword(@Body() data: ForgotPasswordRequest) {
    return this.authService.requestPasswordReset(data.email);
  }

  @Get("verify-reset-token")
  @UsePipes(new ZodValidationPipe(VerifyResetTokenRequestSchema))
  async verifyResetToken(@Query() query: VerifyResetTokenRequest) {
    return this.authService.verifyResetToken(query.token);
  }

  @Post("reset-password")
  @UsePipes(new ZodValidationPipe(ResetPasswordRequestSchema))
  async resetPassword(@Body() data: ResetPasswordRequest) {
    return this.authService.resetPassword(data.token, data.newPassword);
  }
}
