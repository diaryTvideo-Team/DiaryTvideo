import { User } from "@prisma/client";

export const USER_PRIVATE_FIELDS = [
  "passwordHash",
  "refreshToken",
  "emailVerificationToken",
  "deletedAt",
  "failedLoginAttempts",
  "lastFailedLoginAt",
  "accountLockedUntil",
  "passwordResetToken",
] as const;

type UserPrivateField = (typeof USER_PRIVATE_FIELDS)[number];

export type UserSafeDataType = Omit<User, UserPrivateField>;

export function toUserSafe(user: User): UserSafeDataType {
  const clone = { ...user };

  for (const key of USER_PRIVATE_FIELDS) {
    delete clone[key];
  }

  return clone;
}
