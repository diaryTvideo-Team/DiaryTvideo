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

export const RefreshTokenRequestSchema = z.object({
  refreshToken: z.string().min(1, "리프레시 토큰은 필수입니다"),
});

export const VerifyEmailRequestSchema = z.object({
  token: z.string().min(1, "인증 토큰은 필수입니다"),
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

export const MessageResponseSchema = z.object({
  message: z.string(),
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
export type RefreshTokenRequest = z.infer<typeof RefreshTokenRequestSchema>;
export type VerifyEmailRequest = z.infer<typeof VerifyEmailRequestSchema>;
export type AuthTokens = z.infer<typeof AuthTokensSchema>;
export type AuthResponse = z.infer<typeof AuthResponseSchema>;
export type MessageResponse = z.infer<typeof MessageResponseSchema>;
export type JwtAccessPayload = z.infer<typeof JwtAccessPayloadSchema>;
export type JwtRefreshPayload = z.infer<typeof JwtRefreshPayloadSchema>;
