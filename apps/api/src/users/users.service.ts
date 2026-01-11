import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";

export type UserSafeData = Omit<
  User,
  "passwordHash" | "refreshToken" | "emailVerificationToken" | "deletedAt"
>;

@Injectable()
export class UsersService {}
