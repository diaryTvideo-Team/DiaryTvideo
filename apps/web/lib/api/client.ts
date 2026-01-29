"use client";

import { AuthErrors, Language } from "@repo/types";
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  clearTokens,
} from "./token";
import { ApiError, parseApiError } from "./error-parser";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

type RequestOptions = {
  headers?: Record<string, string>;
  withAuth?: boolean;
};

function getLanguage(): Language {
  if (typeof window === "undefined") return "en";
  const stored = localStorage.getItem("language");
  return stored === "en" || stored === "ko" ? stored : "en";
}

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

/**
 * 토큰 갱신 시도
 */
async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) return false;

    const data = await response.json();
    if (data.success && data.data?.accessToken) {
      setAccessToken(data.data.accessToken);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

/**
 * 동시 refresh 요청 방지
 */
async function handleTokenRefresh(): Promise<boolean> {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = refreshAccessToken();

  try {
    return await refreshPromise;
  } finally {
    isRefreshing = false;
    refreshPromise = null;
  }
}

/**
 * 401 에러가 토큰 만료인지 확인
 */
function isTokenExpiredError(message: string): boolean {
  try {
    return message.includes(AuthErrors.ACCESS_TOKEN_EXPIRED);
  } catch {
    return false;
  }
}

/**
 * 기본 fetch 요청
 */
async function request<T>(
  method: string,
  endpoint: string,
  body?: unknown,
  options: RequestOptions = {},
): Promise<T> {
  const { headers = {}, withAuth = false } = options;
  const language = getLanguage();

  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...headers,
  };

  if (withAuth) {
    const accessToken = getAccessToken();
    if (accessToken) {
      requestHeaders["Authorization"] = `Bearer ${accessToken}`;
    }
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers: requestHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });

  // 성공 응답
  if (response.ok) {
    return response.json();
  }

  // 401 + 토큰 만료 → refresh 시도
  if (response.status === 401 && withAuth) {
    const clonedResponse = response.clone();
    const errorBody = await clonedResponse.json().catch(() => ({}));
    const errorMessage = errorBody.message || "";

    if (isTokenExpiredError(errorMessage)) {
      const refreshed = await handleTokenRefresh();

      if (refreshed) {
        // 새 토큰으로 재시도
        const newAccessToken = getAccessToken();
        requestHeaders["Authorization"] = `Bearer ${newAccessToken}`;

        const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, {
          method,
          headers: requestHeaders,
          body: body ? JSON.stringify(body) : undefined,
        });

        if (retryResponse.ok) {
          return retryResponse.json();
        }

        const retryError = await parseApiError(retryResponse, language);
        throw retryError;
      }

      // refresh 실패 → 로그아웃
      clearTokens();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
  }

  // 에러 파싱 후 throw
  const apiError = await parseApiError(response, language);
  throw apiError;
}

// HTTP 메서드별 래퍼
export const api = {
  get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return request<T>("GET", endpoint, undefined, options);
  },

  post<T>(
    endpoint: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<T> {
    return request<T>("POST", endpoint, body, options);
  },

  patch<T>(
    endpoint: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<T> {
    return request<T>("PATCH", endpoint, body, options);
  },

  delete<T>(
    endpoint: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<T> {
    return request<T>("DELETE", endpoint, body, options);
  },
};

export type { ApiError };
