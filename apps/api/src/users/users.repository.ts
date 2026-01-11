import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { User } from "@prisma/client";

@Injectable()
export class UsersRepository {
  constructor(private prisma: PrismaService) {}

  // 유저 생성
  async create(data: {
    email: string;
    name: string;
    passwordHash: string;
    emailVerificationToken: string;
    emailVerificationTokenExpiresAt: Date;
  }): Promise<User> {
    return this.prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        passwordHash: data.passwordHash,
        emailVerificationToken: data.emailVerificationToken,
        emailVerificationTokenExpiresAt: data.emailVerificationTokenExpiresAt,
      },
    });
  }

  // 이메일로 유저 찾기
  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        email,
        deletedAt: null,
      },
    });
  }

  // 이메일 인증 처리
  async markEmailAsVerified(userId: number): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        emailVerified: true,
        emailVerificationToken: null,
        emailVerificationTokenExpiresAt: null,
      },
    });
  }

  // 리프레시 토큰 업데이트
  async updateRefreshToken(
    userId: number,
    refreshToken: string | null,
    expiresAt: Date | null
  ): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        refreshToken,
        refreshTokenExpiresAt: expiresAt,
      },
    });
  }

  // 인증 토큰 업데이트 (재발송용)
  async updateVerificationToken(
    userId: number,
    token: string,
    expiresAt: Date
  ): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        emailVerificationToken: token,
        emailVerificationTokenExpiresAt: expiresAt,
      },
    });
  }
}
