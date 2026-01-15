import {
  Injectable,
  ConflictException,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { UserRepository } from "../user/user.repository";
import { PasswordService } from "./password.service";
import { TokenService } from "./token.service";
import { EmailService } from "./email.service";
import { VerificationCodeService } from "./verification-code.service";
import { ResetTokenService } from "./reset-token.service";
import {
  SignupRequest,
  AuthResponse,
  LoginRequest,
  VerifyEmailRequest,
  AuthErrors,
  JwtRefreshPayload,
} from "@repo/types";

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private passwordService: PasswordService,
    private tokenService: TokenService,
    private emailService: EmailService,
    private verificationCodeService: VerificationCodeService,
    private resetTokenService: ResetTokenService,
  ) {}

  async signup(data: SignupRequest): Promise<{ message: string }> {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictException(AuthErrors.EMAIL_ALREADY_REGISTERED);
    }

    const passwordHash = await this.passwordService.hashPassword(data.password);
    const verificationCode = this.verificationCodeService.generateCode();
    const verificationExpiration =
      this.verificationCodeService.calculateExpiration();

    const user = await this.userRepository.create({
      email: data.email,
      name: data.name,
      passwordHash,
      emailVerificationToken: verificationCode,
      emailVerificationTokenExpiresAt: verificationExpiration,
    });

    await this.emailService.sendVerificationEmail(
      user.email,
      user.name,
      verificationCode,
    );

    return {
      message:
        "Signup successful. Please check your email for verification code.",
    };
  }

  async verifyEmail(data: VerifyEmailRequest): Promise<AuthResponse> {
    const user = await this.userRepository.findByEmail(data.email);

    if (!user) {
      throw new NotFoundException(AuthErrors.USER_NOT_FOUND);
    }

    if (user.emailVerified) {
      throw new BadRequestException(AuthErrors.EMAIL_ALREADY_VERIFIED);
    }

    if (user.emailVerificationToken !== data.code) {
      throw new BadRequestException(AuthErrors.INVALID_VERIFICATION_CODE);
    }

    if (user.emailVerificationTokenExpiresAt! < new Date()) {
      throw new BadRequestException(AuthErrors.VERIFICATION_CODE_EXPIRED);
    }

    await this.userRepository.markEmailAsVerified(user.id);

    const tokens = this.tokenService.generateTokenPair(user.id, user.email);

    const hashedRefreshToken = await this.passwordService.hashPassword(
      tokens.refreshToken,
    );
    const refreshTokenExpiration =
      this.tokenService.calculateRefreshTokenExpiration();

    await this.userRepository.updateRefreshToken(
      user.id,
      hashedRefreshToken,
      refreshTokenExpiration,
    );

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        emailVerified: true,
      },
      tokens,
    };
  }

  async resendVerificationEmail(email: string): Promise<{ message: string }> {
    if (!email || email.trim() === "") {
      throw new BadRequestException(AuthErrors.EMAIL_REQUIRED);
    }
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new NotFoundException(AuthErrors.USER_NOT_FOUND);
    }

    if (user.emailVerified) {
      throw new BadRequestException(AuthErrors.EMAIL_ALREADY_VERIFIED);
    }

    const verificationCode = this.verificationCodeService.generateCode();
    const verificationExpiration =
      this.verificationCodeService.calculateExpiration();

    await this.userRepository.updateVerificationToken(
      user.id,
      verificationCode,
      verificationExpiration,
    );

    await this.emailService.sendVerificationEmail(
      user.email,
      user.name,
      verificationCode,
    );

    return {
      message: "Verification email sent. Please check your inbox.",
    };
  }

  async signin(data: LoginRequest): Promise<AuthResponse> {
    const user = await this.userRepository.findByEmail(data.email);

    // 계정 잠금 확인
    if (user?.accountLockedUntil && user.accountLockedUntil > new Date()) {
      throw new BadRequestException(AuthErrors.ACCOUNT_LOCKED);
    }

    // 잠금 기간이 지났으면 실패 카운트 리셋
    if (user?.accountLockedUntil && user.accountLockedUntil <= new Date()) {
      await this.userRepository.resetLoginAttempts(user.id);
    }

    // 사용자 존재 및 비밀번호 검증 (통합된 에러 메시지)
    const isPasswordValid = user
      ? await this.passwordService.comparePassword(
          data.password,
          user.passwordHash,
        )
      : false;

    if (!user || !isPasswordValid) {
      // 사용자가 존재하면 실패 카운트 증가
      if (user) {
        const updatedUser = await this.userRepository.recordFailedLoginAttempt(
          user.id,
        );

        // 5회 실패 시 계정 잠금 (15분)
        if (updatedUser.failedLoginAttempts >= 5) {
          const lockUntil = new Date();
          lockUntil.setMinutes(lockUntil.getMinutes() + 15);
          await this.userRepository.lockAccount(user.id, lockUntil);
        }
      }

      throw new BadRequestException(AuthErrors.INVALID_CREDENTIALS);
    }

    // 이메일 인증 확인
    if (!user.emailVerified) {
      throw new BadRequestException(AuthErrors.EMAIL_NOT_VERIFIED);
    }

    // 로그인 성공 처리
    await this.userRepository.resetLoginAttempts(user.id);
    await this.userRepository.recordSuccessfulLogin(user.id);

    // 토큰 생성 및 저장
    const tokens = this.tokenService.generateTokenPair(user.id, user.email);
    const hashedRefreshToken = await this.passwordService.hashPassword(
      tokens.refreshToken,
    );
    const refreshTokenExpiration =
      this.tokenService.calculateRefreshTokenExpiration();

    await this.userRepository.updateRefreshToken(
      user.id,
      hashedRefreshToken,
      refreshTokenExpiration,
    );

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        emailVerified: user.emailVerified, // 하드코딩 제거
      },
      tokens,
    };
  }

  async logout(userId: number): Promise<{ message: string }> {
    await this.userRepository.clearRefreshToken(userId);

    return {
      message: "Logged out successfully",
    };
  }

  // 비밀번호 재설정 요청
  async requestPasswordReset(email: string): Promise<{ message: string }> {
    const user = await this.userRepository.findByEmail(email);

    // 보안: 이메일 존재 여부 노출 방지 - 항상 성공 메시지 반환
    if (!user) {
      return {
        message: "If the email exists, a password reset link has been sent.",
      };
    }

    // 토큰 생성
    const resetToken = this.resetTokenService.generateToken();
    const tokenExpiration = this.resetTokenService.calculateExpiration();

    // DB 저장
    await this.userRepository.updatePasswordResetToken(
      user.id,
      resetToken,
      tokenExpiration,
    );

    // 이메일 전송
    await this.emailService.sendPasswordResetEmail(
      user.email,
      user.name,
      resetToken,
    );

    return {
      message: "If the email exists, a password reset link has been sent.",
    };
  }

  // 토큰 검증 (페이지 로딩 시)
  async verifyResetToken(
    token: string,
  ): Promise<{ valid: boolean; email: string }> {
    const user = await this.userRepository.findByPasswordResetToken(token);

    if (!user) {
      throw new BadRequestException(AuthErrors.INVALID_RESET_TOKEN);
    }

    if (user.passwordResetTokenExpiresAt! < new Date()) {
      throw new BadRequestException(AuthErrors.RESET_TOKEN_EXPIRED);
    }

    // 토큰 유효 - 이메일 반환 (UI에 표시용)
    return {
      valid: true,
      email: user.email,
    };
  }

  // 비밀번호 재설정
  async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    const user = await this.userRepository.findByPasswordResetToken(token);

    if (!user) {
      throw new BadRequestException(AuthErrors.INVALID_RESET_TOKEN);
    }

    if (user.passwordResetTokenExpiresAt! < new Date()) {
      throw new BadRequestException(AuthErrors.RESET_TOKEN_EXPIRED);
    }

    // 새 비밀번호 해싱
    const newPasswordHash =
      await this.passwordService.hashPassword(newPassword);

    // 비밀번호 업데이트 + 토큰 클리어
    await this.userRepository.resetPassword(user.id, newPasswordHash);

    // 보안: 모든 리프레시 토큰 무효화
    await this.userRepository.clearRefreshToken(user.id);

    return {
      message:
        "Password has been reset successfully. Please login with your new password.",
    };
  }

  // 액세스 토큰 갱신
  async refreshAccessToken(
    refreshToken: string,
  ): Promise<{ accessToken: string }> {
    let payload: JwtRefreshPayload;
    try {
      payload = this.tokenService.verifyRefreshToken(refreshToken);
    } catch {
      throw new BadRequestException(AuthErrors.INVALID_REFRESH_TOKEN);
    }

    // 2. DB에서 사용자 및 저장된 리프레시 토큰 조회
    const user = await this.userRepository.findById(payload.sub);
    if (!user || !user.refreshToken) {
      throw new BadRequestException(AuthErrors.INVALID_REFRESH_TOKEN);
    }

    // 3. 리프레시 토큰 만료 시간 확인
    if (user.refreshTokenExpiresAt && user.refreshTokenExpiresAt < new Date()) {
      throw new BadRequestException(AuthErrors.REFRESH_TOKEN_EXPIRED);
    }

    // 4. 제공된 리프레시 토큰과 DB에 저장된 해시값 비교(비밀번호 비교 사용)
    const isTokenValid = await this.passwordService.comparePassword(
      refreshToken,
      user.refreshToken,
    );
    if (!isTokenValid) {
      throw new BadRequestException(AuthErrors.INVALID_REFRESH_TOKEN);
    }

    // 5. 새로운 액세스 토큰 발급
    const accessToken = this.tokenService.generateAccessToken(
      user.id,
      user.email,
    );

    return { accessToken };
  }
}
