import { z } from "zod";

const PRODUCTION_REQUIRED_KEYS = [
  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET",
  "SMTP_HOST",
  "SMTP_USER",
  "SMTP_PASS",
  "FRONTEND_URL",
  "AWS_ACCESS_KEY_ID",
  "AWS_SECRET_ACCESS_KEY",
  "AWS_S3_BUCKET",
] as const;

export const envSchema = z
  .object({
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
    PORT: z.string().optional(),

    // Database
    DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

    // Redis
    REDIS_HOST: z.string().default("localhost"),
    REDIS_PORT: z.string().default("6379"),
    REDIS_PASSWORD: z.string().optional(),

    // JWT
    JWT_ACCESS_SECRET: z.string().optional(),
    JWT_REFRESH_SECRET: z.string().optional(),
    JWT_ACCESS_EXPIRATION: z.string().default("15m"),
    JWT_REFRESH_EXPIRATION: z.string().default("7d"),

    // SMTP
    SMTP_HOST: z.string().optional(),
    SMTP_PORT: z.string().default("587"),
    SMTP_SECURE: z.string().default("false"),
    SMTP_USER: z.string().optional(),
    SMTP_PASS: z.string().optional(),
    EMAIL_FROM: z.string().default("noreply@diarytvideo.com"),

    // Frontend
    FRONTEND_URL: z.string().optional(),

    // AWS
    AWS_REGION: z.string().default("ap-northeast-2"),
    AWS_ACCESS_KEY_ID: z.string().optional(),
    AWS_SECRET_ACCESS_KEY: z.string().optional(),
    AWS_S3_BUCKET: z.string().optional(),
  })
  .superRefine((env, ctx) => {
    if (env.NODE_ENV === "production") {
      for (const key of PRODUCTION_REQUIRED_KEYS) {
        if (!env[key]) {
          ctx.addIssue({
            code: "custom",
            message: `${key} is required in production`,
            path: [key],
          });
        }
      }
    }
  });

export type Env = z.infer<typeof envSchema>;
