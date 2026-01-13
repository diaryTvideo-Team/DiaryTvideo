"use client";

import { User } from "@repo/types";

// TODO: Replace with actual API call to POST /api/auth/register
export function register(): { success: boolean; error?: string } {
  console.warn("register: API not implemented yet");
  return { success: false, error: "API not implemented" };
}

// TODO: Replace with actual API call to POST /api/auth/login
export function login(): { success: boolean; user?: User; error?: string } {
  console.warn("login: API not implemented yet");
  return { success: false, error: "API not implemented" };
}

// TODO: Replace with actual API call to POST /api/auth/logout
export function logout() {
  console.warn("logout: API not implemented yet");
}

// TODO: Replace with actual API call to GET /api/auth/me
export function getCurrentUser(): User | null {
  console.warn("getCurrentUser: API not implemented yet");
  return null;
}

// TODO: Replace with actual API call to PATCH /api/user/name
export function updateName(): { success: boolean; error?: string } {
  console.warn("updateName: API not implemented yet");
  return { success: false, error: "API not implemented" };
}

// TODO: Replace with actual API call to PATCH /api/user/password
export function updatePassword(): { success: boolean; error?: string } {
  console.warn("updatePassword: API not implemented yet");
  return { success: false, error: "API not implemented" };
}

// TODO: Replace with actual API call to DELETE /api/user
export function deleteAccount(): { success: boolean; error?: string } {
  console.warn("deleteAccount: API not implemented yet");
  return { success: false, error: "API not implemented" };
}

// TODO: Replace with actual API call to POST /api/auth/verification/send
export function sendVerificationCode(): { success: boolean } {
  console.warn("sendVerificationCode: API not implemented yet");
  return { success: false };
}

// TODO: Replace with actual API call to POST /api/auth/verification/verify
export function verifyCode(): { success: boolean; error?: string } {
  console.warn("verifyCode: API not implemented yet");
  return { success: false, error: "API not implemented" };
}

// TODO: Replace with actual API call to POST /api/auth/verification/resend
export function resendVerificationCode(): { success: boolean } {
  console.warn("resendVerificationCode: API not implemented yet");
  return { success: false };
}

// TODO: Replace with actual API call to POST /api/auth/password-reset/send
export function sendPasswordResetEmail(email: string): {
  success: boolean;
  error?: string;
} {
  console.log("sendPasswordResetEmail called with:", email);
  // TODO: API 연동 - POST /auth/forgot-password
  // TODO: Body: { email, language }
  // TODO: Response: { success: boolean, message?: string }

  // Mock: 항상 성공 반환
  return { success: true };
}

// TODO: Replace with actual API call to POST /api/auth/password-reset/resend
export function resendPasswordResetEmail(email: string): {
  success: boolean;
  error?: string;
} {
  console.log("resendPasswordResetEmail called with:", email);
  // TODO: API 연동 - POST /auth/forgot-password (재사용)
  // TODO: Body: { email, language }

  // Mock: 항상 성공 반환
  return { success: true };
}
