import { z } from "zod";
import { EmailSchema, NameSchema, PasswordSchema } from "./common";

// 인증 요청 스키마
export const SignupRequestSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
  name: NameSchema,
});

export const LoginRequestSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
});

// 응답 스키마
export const AuthTokensSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

export const AuthResponseSchema = z.object({
  user: z.object({
    id: z.number(),
    email: EmailSchema,
    name: NameSchema,
    emailVerified: z.boolean(),
  }),
  tokens: AuthTokensSchema,
});

// JWT Payload 스키마
export const JwtAccessPayloadSchema = z.object({
  sub: z.number(), // user id
  email: EmailSchema,
  type: z.literal("access"),
});

export const JwtRefreshPayloadSchema = z.object({
  sub: z.number(), // user id
  type: z.literal("refresh"),
});

export type SignupRequest = z.infer<typeof SignupRequestSchema>;
export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type AuthTokens = z.infer<typeof AuthTokensSchema>;
export type AuthResponse = z.infer<typeof AuthResponseSchema>;
export type JwtAccessPayload = z.infer<typeof JwtAccessPayloadSchema>;
export type JwtRefreshPayload = z.infer<typeof JwtRefreshPayloadSchema>;
