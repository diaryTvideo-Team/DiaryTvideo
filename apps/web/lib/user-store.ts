"use client";

import { ApiResponse, UserData } from "@repo/types";
import { api } from "./api";

export async function getMe(): Promise<ApiResponse<UserData>> {
  return api.get<ApiResponse<UserData>>("/user/me", { withAuth: true });
}
