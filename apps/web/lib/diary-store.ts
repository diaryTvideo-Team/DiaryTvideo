"use client";

import { ApiResponse, DiaryData, CreateDiaryRequest } from "@repo/types";
import { api } from "./api";

// 날짜별 다이어리 목록 조회
export async function getEntries(
  filterDate: string,
): Promise<ApiResponse<DiaryData[]>> {
  return api.get<ApiResponse<DiaryData[]>>(`/diary?filterDate=${filterDate}`, {
    withAuth: true,
  });
}

// 월별 다이어리 목록 조회
export async function getMonthlyEntries(
  year: number,
  month: number,
): Promise<ApiResponse<DiaryData[]>> {
  return api.get<ApiResponse<DiaryData[]>>(
    `/diary/monthly?year=${year}&month=${month}`,
    { withAuth: true },
  );
}

// 다이어리 생성
export async function createEntry(
  data: CreateDiaryRequest,
): Promise<ApiResponse<DiaryData>> {
  return api.post<ApiResponse<DiaryData>>("/diary", data, {
    withAuth: true,
  });
}

// 다이어리 삭제
export async function deleteEntry(
  diaryId: string,
): Promise<ApiResponse<DiaryData>> {
  return api.delete<ApiResponse<DiaryData>>(`/diary/${diaryId}`, undefined, {
    withAuth: true,
  });
}

// 비디오 생성 재시도
export async function retryVideoGeneration(
  diaryId: string,
): Promise<ApiResponse<DiaryData>> {
  return api.post<ApiResponse<DiaryData>>(
    `/diary/${diaryId}/retry`,
    {},
    {
      withAuth: true,
    },
  );
}
