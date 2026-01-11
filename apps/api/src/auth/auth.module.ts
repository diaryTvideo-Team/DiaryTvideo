import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PasswordService } from "./password.service";
import { TokenService } from "./token.service";
import { EmailService } from "./email.service";
import { VerificationCodeService } from "./verification-code.service";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [
    JwtModule.register({}), // Empty config, we'll provide secrets per-call
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PasswordService,
    TokenService,
    EmailService,
    VerificationCodeService,
  ],
  exports: [AuthService, TokenService, PasswordService],
})
export class AuthModule {}
