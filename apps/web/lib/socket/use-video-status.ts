"use client";

import { useEffect, useCallback } from "react";
import { VideoProgressMessage, DiaryData } from "@repo/types";
import { useSocket } from "./socket-provider";

/**
 * 다이어리 목록의 실시간 비디오 상태 업데이트 Hook
 */
export function useVideoStatusUpdates(
  setEntries: React.Dispatch<React.SetStateAction<DiaryData[]>>,
) {
  const { subscribeToVideoStatus } = useSocket();

  const handleVideoStatus = useCallback(
    (data: VideoProgressMessage) => {
      setEntries((prev) =>
        prev.map((entry) =>
          entry.id === data.diaryId
            ? {
                ...entry,
                videoStatus: data.status,
                // FAILED 상태일 때 message를 videoError에 저장
                videoError: data.status === "FAILED" ? data.message : null,
              }
            : entry,
        ),
      );
    },
    [setEntries],
  );

  useEffect(() => {
    const unsubscribe = subscribeToVideoStatus(handleVideoStatus);
    return unsubscribe;
  }, [subscribeToVideoStatus, handleVideoStatus]);
}
