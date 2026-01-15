import { z } from "zod";
import { AuthErrors } from "./authErrors";

// 공통 검증 스키마
export const EmailSchema = z.email({
  message: AuthErrors.INVALID_EMAIL_FORMAT,
});

export const NameSchema = z
  .string()
  .min(1, AuthErrors.NAME_REQUIRED)
  .max(100, AuthErrors.NAME_TOO_LONG);

export const PasswordSchema = z
  .string()
  .min(8, AuthErrors.PASSWORD_MIN_LENGTH)
  .regex(/[A-Z]/, AuthErrors.PASSWORD_UPPERCASE_REQUIRED)
  .regex(/[a-z]/, AuthErrors.PASSWORD_LOWERCASE_REQUIRED)
  .regex(/[0-9]/, AuthErrors.PASSWORD_NUMBER_REQUIRED);
