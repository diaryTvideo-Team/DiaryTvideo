import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtAccessPayload } from "@repo/types";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>("jwt.accessSecret"),
    });
  }

  // 내부적으로 비동기 작업을 수행하기 때문에 async 키워드를 사용합니다.
  // eslint-disable-next-line @typescript-eslint/require-await
  async validate(payload: JwtAccessPayload): Promise<JwtAccessPayload> {
    if (payload.type !== "access") {
      throw new UnauthorizedException("Invalid token type");
    }
    return payload;
  }
}
