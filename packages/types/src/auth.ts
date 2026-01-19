import { z } from "zod";
import { EmailSchema, NameSchema, PasswordSchema } from "./common";
import { AuthErrors } from "./authErrors";

// 인증 요청 스키마
export const SignupRequestSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
  name: NameSchema,
});

export const LoginRequestSchema = z.object({
  email: EmailSchema,
  password: z.string(),
});

export const VerifyEmailRequestSchema = z.object({
  email: EmailSchema,
  code: z.string(),
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

// Password Reset Request Types
export const ForgotPasswordRequestSchema = z.object({
  email: EmailSchema,
});

export const VerifyResetTokenRequestSchema = z.object({
  token: z.string().min(32),
});

export const ResetPasswordRequestSchema = z.object({
  token: z.string().min(32),
  newPassword: PasswordSchema,
});

export const RefreshTokenRequestSchema = z.object({
  refreshToken: z.string().min(1, AuthErrors.TOKEN_REQUIRED),
});

export type VerifyResetTokenRequest = z.infer<
  typeof VerifyResetTokenRequestSchema
>;
export type ForgotPasswordRequest = z.infer<typeof ForgotPasswordRequestSchema>;
export type ResetPasswordRequest = z.infer<typeof ResetPasswordRequestSchema>;
export type SignupRequest = z.infer<typeof SignupRequestSchema>;
export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type VerifyEmailRequest = z.infer<typeof VerifyEmailRequestSchema>;
export type JwtAccessPayload = z.infer<typeof JwtAccessPayloadSchema>;
export type JwtRefreshPayload = z.infer<typeof JwtRefreshPayloadSchema>;
export type RefreshTokenRequest = z.infer<typeof RefreshTokenRequestSchema>;
