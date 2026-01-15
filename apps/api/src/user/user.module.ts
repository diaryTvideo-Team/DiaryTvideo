import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserRepository } from "./user.repository";
import { UserController } from "./user.controller";
import { PasswordService } from "src/auth/password.service";

@Module({
  controllers: [UserController],
  providers: [UserService, UserRepository, PasswordService],
  exports: [UserService, UserRepository],
})
export class UserModule {}
