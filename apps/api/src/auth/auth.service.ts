import {
  Injectable,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";
import { UsersRepository } from "../users/users.repository";
import { PasswordService } from "./password.service";
import { TokenService } from "./token.service";
import { EmailService } from "./email.service";
import { VerificationCodeService } from "./verification-code.service";
import { SignupRequest, AuthResponse } from "@repo/types";

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
      throw new ConflictException("Email already registered");
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

  async verifyEmail(code: string): Promise<AuthResponse> {
    if (!code || code.trim() === "") {
      throw new BadRequestException("Verification code must not be empty");
    }
    const user = await this.usersRepository.findByVerificationCode(code);

    if (!user) {
      throw new BadRequestException("Invalid verification code");
    }

    if (user.emailVerificationTokenExpiresAt! < new Date()) {
      throw new BadRequestException("Verification code has expired");
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
      throw new BadRequestException("Email must not be empty");
    }
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new BadRequestException("User not found");
    }

    if (user.emailVerified) {
      throw new BadRequestException("Email already verified");
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
}
