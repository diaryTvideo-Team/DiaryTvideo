import { z } from "zod";
import { Language } from "./language";

export const i18nMessage = (msg: Record<Language, string>) =>
  JSON.stringify(msg);

// 공통 검증 스키마
export const EmailSchema = z.email({
  message: i18nMessage({
    en: "Invalid email format",
    ko: "유효하지 않은 이메일 형식입니다",
  }),
});

export const NameSchema = z
  .string()
  .min(
    1,
    i18nMessage({
      en: "Name is required",
      ko: "이름은 필수입니다",
    })
  )
  .max(
    100,
    i18nMessage({
      en: "Name is too long",
      ko: "이름이 너무 깁니다",
    })
  );

export const PasswordSchema = z
  .string()
  .min(
    8,
    i18nMessage({
      en: "Password must be at least 8 characters",
      ko: "비밀번호는 최소 8자 이상이어야 합니다",
    })
  )
  .regex(
    /[A-Z]/,
    i18nMessage({
      en: "Password must contain at least one uppercase letter",
      ko: "대문자를 최소 1개 포함해야 합니다",
    })
  )
  .regex(
    /[a-z]/,
    i18nMessage({
      en: "Password must contain at least one lowercase letter",
      ko: "소문자를 최소 1개 포함해야 합니다",
    })
  )
  .regex(
    /[0-9]/,
    i18nMessage({
      en: "Password must contain at least one number",
      ko: "숫자를 최소 1개 포함해야 합니다",
    })
  );

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
