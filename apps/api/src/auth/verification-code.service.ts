import { Injectable } from "@nestjs/common";

@Injectable()
export class VerificationCodeService {
  /**
   * 6자리 영문+숫자 조합 인증 코드 생성
   * 예: A3K9P2, X7M4Q1
   */
  generateCode(): string {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // 혼동되는 문자 제외 (0, O, I, 1)
    let code = "";

    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      code += chars[randomIndex];
    }

    return code;
  }

  /**
   * 코드 만료 시간 계산 (15분 후)
   */
  calculateExpiration(): Date {
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15);
    return expiresAt;
  }
}
