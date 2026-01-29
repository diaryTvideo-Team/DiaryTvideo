import { User } from "@prisma/client";
import { UserData } from "@repo/types";

export const toUserSafe = (user: User): UserData => ({
  id: user.id,
  email: user.email,
  name: user.name,
  emailVerified: user.emailVerified,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
  lastSuccessfulLogin: user.lastSuccessfulLogin,
});
