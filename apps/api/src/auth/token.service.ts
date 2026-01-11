import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { JwtAccessPayload, JwtRefreshPayload, AuthTokens } from "@repo/types";
import * as crypto from "crypto";

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  generateAccessToken(userId: number, email: string): string {
    const payload: JwtAccessPayload = {
      sub: userId,
      email,
      type: "access",
    };

    const secret = this.configService.get<string>("jwt.accessSecret");
    if (!secret) {
      throw new Error("JWT_ACCESS_SECRET is not configured");
    }

    const expiresIn =
      this.configService.get<string>("jwt.accessExpiration") || "15m";

    // @ts-expect-error - ConfigService returns string but JwtService expects StringValue
    return this.jwtService.sign(payload, {
      secret,
      expiresIn,
    });
  }

  generateRefreshToken(userId: number): string {
    const payload: JwtRefreshPayload = {
      sub: userId,
      type: "refresh",
    };

    const secret = this.configService.get<string>("jwt.refreshSecret");
    if (!secret) {
      throw new Error("JWT_REFRESH_SECRET is not configured");
    }

    const expiresIn =
      this.configService.get<string>("jwt.refreshExpiration") || "7d";

    // @ts-expect-error - ConfigService returns string but JwtService expects StringValue
    return this.jwtService.sign(payload, {
      secret,
      expiresIn,
    });
  }

  generateTokenPair(userId: number, email: string): AuthTokens {
    return {
      accessToken: this.generateAccessToken(userId, email),
      refreshToken: this.generateRefreshToken(userId),
    };
  }

  verifyAccessToken(token: string): JwtAccessPayload {
    return this.jwtService.verify(token, {
      secret: this.configService.get<string>("jwt.accessSecret"),
    });
  }

  verifyRefreshToken(token: string): JwtRefreshPayload {
    return this.jwtService.verify(token, {
      secret: this.configService.get<string>("jwt.refreshSecret"),
    });
  }

  generateEmailVerificationToken(): string {
    return crypto.randomBytes(32).toString("hex");
  }

  calculateRefreshTokenExpiration(): Date {
    const expirationString = this.configService.get<string>(
      "jwt.refreshExpiration"
    )!;
    const days = parseInt(expirationString.replace("d", ""), 10);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + days);
    return expiresAt;
  }

  calculateEmailVerificationTokenExpiration(): Date {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 hours
    return expiresAt;
  }
}
