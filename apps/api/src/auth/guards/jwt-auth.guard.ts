import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthErrors } from "@repo/types";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  handleRequest<TUser = any>(
    err: Error | null,
    user: TUser | false,
    info: { name?: string; message?: string } | undefined,
  ): TUser {
    // 에러가 있거나 user가 없으면 인증 실패
    if (err || !user) {
      // JWT 만료 에러 처리
      if (info?.name === "TokenExpiredError") {
        throw new UnauthorizedException(AuthErrors.ACCESS_TOKEN_EXPIRED);
      }

      // JWT 형식 오류 (malformed, invalid signature 등)
      if (info?.name === "JsonWebTokenError") {
        throw new UnauthorizedException(AuthErrors.INVALID_TOKEN);
      }

      // 토큰이 없는 경우
      if (info?.message === "No auth token") {
        throw new UnauthorizedException(AuthErrors.TOKEN_REQUIRED);
      }

      // 기타 에러
      throw new UnauthorizedException(AuthErrors.INVALID_TOKEN);
    }

    return user;
  }
}
