"use client";

import {
  ApiResponse,
  UserData,
  UpdateNameRequest,
  ChangePasswordRequest,
  DeleteAccountRequest,
} from "@repo/types";
import { api } from "./api";

export async function getMe(): Promise<ApiResponse<UserData>> {
  return api.get<ApiResponse<UserData>>("/user/me", { withAuth: true });
}

export async function updateName(
  data: UpdateNameRequest,
): Promise<ApiResponse<UserData>> {
  return api.patch<ApiResponse<UserData>>("/user/name", data, {
    withAuth: true,
  });
}

export async function updatePassword(
  data: ChangePasswordRequest,
): Promise<ApiResponse> {
  return api.patch<ApiResponse>("/user/password", data, { withAuth: true });
}

export async function deleteAccount(
  data: DeleteAccountRequest,
): Promise<ApiResponse> {
  return api.delete<ApiResponse>("/user", data, { withAuth: true });
}
