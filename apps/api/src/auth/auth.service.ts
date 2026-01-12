import {
  Injectable,
  ConflictException,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { UsersRepository } from "../users/users.repository";
import { PasswordService } from "./password.service";
import { TokenService } from "./token.service";
import { EmailService } from "./email.service";
import { VerificationCodeService } from "./verification-code.service";
import {
  SignupRequest,
  AuthResponse,
  LoginRequest,
  VerifyEmailRequest,
  AuthErrors,
} from "@repo/types";

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private passwordService: PasswordService,
    private tokenService: TokenService,
    private emailService: EmailService,
    private verificationCodeService: VerificationCodeService
  ) {}

  async signup(data: SignupRequest): Promise<{ message: string }> {
    const existingUser = await this.usersRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictException(AuthErrors.EMAIL_ALREADY_REGISTERED);
    }

    const passwordHash = await this.passwordService.hashPassword(data.password);
    const verificationCode = this.verificationCodeService.generateCode();
    const verificationExpiration =
      this.verificationCodeService.calculateExpiration();

    const user = await this.usersRepository.create({
      email: data.email,
      name: data.name,
      passwordHash,
      emailVerificationToken: verificationCode,
      emailVerificationTokenExpiresAt: verificationExpiration,
    });

    await this.emailService.sendVerificationEmail(
      user.email,
      user.name,
      verificationCode
    );

    return {
      message:
        "Signup successful. Please check your email for verification code.",
    };
  }

  async verifyEmail(data: VerifyEmailRequest): Promise<AuthResponse> {
    const user = await this.usersRepository.findByEmail(data.email);

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

    await this.usersRepository.markEmailAsVerified(user.id);

    const tokens = this.tokenService.generateTokenPair(user.id, user.email);

    const hashedRefreshToken = await this.passwordService.hashPassword(
      tokens.refreshToken
    );
    const refreshTokenExpiration =
      this.tokenService.calculateRefreshTokenExpiration();

    await this.usersRepository.updateRefreshToken(
      user.id,
      hashedRefreshToken,
      refreshTokenExpiration
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
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new NotFoundException(AuthErrors.USER_NOT_FOUND);
    }

    if (user.emailVerified) {
      throw new BadRequestException(AuthErrors.EMAIL_ALREADY_VERIFIED);
    }

    const verificationCode = this.verificationCodeService.generateCode();
    const verificationExpiration =
      this.verificationCodeService.calculateExpiration();

    await this.usersRepository.updateVerificationToken(
      user.id,
      verificationCode,
      verificationExpiration
    );

    await this.emailService.sendVerificationEmail(
      user.email,
      user.name,
      verificationCode
    );

    return {
      message: "Verification email sent. Please check your inbox.",
    };
  }

  async signin(data: LoginRequest): Promise<AuthResponse> {
    const user = await this.usersRepository.findByEmail(data.email);

    // 계정 잠금 확인
    if (user?.accountLockedUntil && user.accountLockedUntil > new Date()) {
      throw new BadRequestException(AuthErrors.ACCOUNT_LOCKED);
    }

    // 사용자 존재 및 비밀번호 검증 (통합된 에러 메시지)
    const isPasswordValid = user
      ? await this.passwordService.comparePassword(
          data.password,
          user.passwordHash
        )
      : false;

    if (!user || !isPasswordValid) {
      // 사용자가 존재하면 실패 카운트 증가
      if (user) {
        const updatedUser = await this.usersRepository.recordFailedLoginAttempt(
          user.id
        );

        // 5회 실패 시 계정 잠금 (15분)
        if (updatedUser.failedLoginAttempts >= 5) {
          const lockUntil = new Date();
          lockUntil.setMinutes(lockUntil.getMinutes() + 15);
          await this.usersRepository.lockAccount(user.id, lockUntil);
        }
      }

      throw new BadRequestException(AuthErrors.INVALID_CREDENTIALS);
    }

    // 이메일 인증 확인
    if (!user.emailVerified) {
      throw new BadRequestException(AuthErrors.EMAIL_NOT_VERIFIED);
    }

    // 로그인 성공 처리
    await this.usersRepository.resetLoginAttempts(user.id);
    await this.usersRepository.recordSuccessfulLogin(user.id);

    // 토큰 생성 및 저장
    const tokens = this.tokenService.generateTokenPair(user.id, user.email);
    const hashedRefreshToken = await this.passwordService.hashPassword(
      tokens.refreshToken
    );
    const refreshTokenExpiration =
      this.tokenService.calculateRefreshTokenExpiration();

    await this.usersRepository.updateRefreshToken(
      user.id,
      hashedRefreshToken,
      refreshTokenExpiration
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
}
