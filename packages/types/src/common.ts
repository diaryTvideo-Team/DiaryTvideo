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

export const UserSchema = z.object({
  id: z.number(),
  email: EmailSchema,
  name: NameSchema,
  createdAt: z.date(),
});

export const DiaryEntrySchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  createdAt: z.date(),
  videoUrl: z.string().optional(),
  thumbnailUrl: z.string().optional(),
  subtitleUrl: z.string().optional(),
});

// Zod 스키마로부터 TypeScript 타입 추출
export type User = z.infer<typeof UserSchema>;
export type DiaryEntry = z.infer<typeof DiaryEntrySchema>;
