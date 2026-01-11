import { z } from "zod";

// 공통 검증 스키마
export const EmailSchema = z.email({
  message: "유효하지 않은 이메일 형식입니다",
});

export const NameSchema = z
  .string()
  .min(1, "이름은 필수입니다")
  .max(100, "이름이 너무 깁니다");

export const PasswordSchema = z
  .string()
  .min(8, "비밀번호는 최소 8자 이상이어야 합니다")
  .regex(/[A-Z]/, "대문자를 최소 1개 포함해야 합니다")
  .regex(/[a-z]/, "소문자를 최소 1개 포함해야 합니다")
  .regex(/[0-9]/, "숫자를 최소 1개 포함해야 합니다");

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
