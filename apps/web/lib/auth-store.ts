"use client";

import {
  ApiResponse,
  AuthData,
  LoginRequest,
  ResetPasswordRequest,
  ResetTokenData,
  SignupRequest,
  VerifyEmailRequest,
} from "@repo/types";
import { api, setTokens, clearTokens } from "./api";

export async function signup(data: SignupRequest): Promise<ApiResponse> {
  return api.post<ApiResponse>("/auth/signup", data);
}

export async function signin(
  data: LoginRequest,
): Promise<ApiResponse<AuthData>> {
  const response = await api.post<ApiResponse<AuthData>>("/auth/signin", data);
  if (response.data) {
    setTokens(
      response.data.tokens.accessToken,
      response.data.tokens.refreshToken,
    );
  }
  return response;
}

export async function logout(): Promise<void> {
  try {
    await api.post<ApiResponse>("/auth/logout", undefined, { withAuth: true });
  } finally {
    clearTokens();
  }
}

export async function verifyEmail(
  data: VerifyEmailRequest,
): Promise<ApiResponse<AuthData>> {
  const response = await api.post<ApiResponse<AuthData>>(
    "/auth/verify-email",
    data,
  );
  if (response.data) {
    setTokens(
      response.data.tokens.accessToken,
      response.data.tokens.refreshToken,
    );
  }
  return response;
}

export async function resendVerification(email: string): Promise<ApiResponse> {
  return api.post<ApiResponse>("/auth/resend-verification", { email });
}

export async function forgotPassword(email: string): Promise<ApiResponse> {
  return api.post<ApiResponse>("/auth/forgot-password", { email });
}

export async function verifyResetToken(
  token: string,
): Promise<ApiResponse<ResetTokenData>> {
  return api.get<ApiResponse<ResetTokenData>>(
    `/auth/verify-reset-token?token=${token}`,
  );
}

export async function resetPassword(
  data: ResetPasswordRequest,
): Promise<ApiResponse> {
  return api.post<ApiResponse>("/auth/reset-password", data);
}
