import { Injectable } from "@nestjs/common";
import * as crypto from "crypto";

@Injectable()
export class ResetTokenService {
  generateToken(): string {
    // 32바이트 랜덤 생성 → 64자 hex string (URL-safe)
    return crypto.randomBytes(32).toString("hex");
  }

  calculateExpiration(): Date {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // 1시간 만료
    return expiresAt;
  }
}
