import {
  Controller,
  Post,
  Body,
  UsePipes,
  UseGuards,
  Get,
  Query,
} from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { AuthService } from "./auth.service";
import {
  ApiResponse,
  AuthData,
  ForgotPasswordRequest,
  ForgotPasswordRequestSchema,
  JwtAccessPayload,
  LoginRequest,
  LoginRequestSchema,
  RefreshData,
  RefreshTokenRequest,
  RefreshTokenRequestSchema,
  ResetPasswordRequest,
  ResetPasswordRequestSchema,
  ResetTokenData,
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
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @UsePipes(new ZodValidationPipe(SignupRequestSchema))
  async signup(@Body() data: SignupRequest): Promise<ApiResponse> {
    return this.authService.signup(data);
  }

  @Post("verify-email")
  @UsePipes(new ZodValidationPipe(VerifyEmailRequestSchema))
  async verifyEmail(
    @Body() data: VerifyEmailRequest,
  ): Promise<ApiResponse<AuthData>> {
    return this.authService.verifyEmail(data);
  }

  @Post("resend-verification")
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  async resendVerification(@Body("email") email: string): Promise<ApiResponse> {
    return this.authService.resendVerificationEmail(email);
  }

  @Post("signin")
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @UsePipes(new ZodValidationPipe(LoginRequestSchema))
  async signin(@Body() data: LoginRequest): Promise<ApiResponse<AuthData>> {
    return this.authService.signin(data);
  }

  @Post("logout")
  @UseGuards(JwtAuthGuard)
  async logout(@CurrentUser() user: JwtAccessPayload): Promise<ApiResponse> {
    return this.authService.logout(user.sub);
  }

  @Post("forgot-password")
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @UsePipes(new ZodValidationPipe(ForgotPasswordRequestSchema))
  async forgotPassword(
    @Body() data: ForgotPasswordRequest,
  ): Promise<ApiResponse> {
    return this.authService.requestPasswordReset(data.email);
  }

  @Get("verify-reset-token")
  @UsePipes(new ZodValidationPipe(VerifyResetTokenRequestSchema))
  async verifyResetToken(
    @Query() query: VerifyResetTokenRequest,
  ): Promise<ApiResponse<ResetTokenData>> {
    return this.authService.verifyResetToken(query.token);
  }

  @Post("reset-password")
  @UsePipes(new ZodValidationPipe(ResetPasswordRequestSchema))
  async resetPassword(
    @Body() data: ResetPasswordRequest,
  ): Promise<ApiResponse> {
    return this.authService.resetPassword(data.token, data.newPassword);
  }

  @Post("refresh")
  @UsePipes(new ZodValidationPipe(RefreshTokenRequestSchema))
  async refresh(
    @Body() data: RefreshTokenRequest,
  ): Promise<ApiResponse<RefreshData>> {
    return this.authService.refreshAccessToken(data.refreshToken);
  }
}
