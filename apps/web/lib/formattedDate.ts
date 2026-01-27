import { DiaryData, Language } from "@repo/types";

interface FormattedDateProps {
  entry: DiaryData | null;
  language: Language;
  includeTime?: boolean; // 시간 포함 여부 (기본값: false)
}

export function useFormattedDate({ entry, language, includeTime = false }: FormattedDateProps) {
  if (!entry) return null;

  // entry.createdAt은 ISO 8601 형식의 UTC 타임스탬프 (예: "2026-01-27T14:30:00Z")
  // new Date()로 파싱하면 자동으로 로컬 시간대(예: KST)로 변환됩니다.
  // toLocaleDateString()은 브라우저의 로컬 시간대 기준으로 날짜를 포맷팅합니다.
  const date = new Date(entry.createdAt);

  if (includeTime) {
    // 시간 포함 포맷
    const formattedDateTime_en = date.toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    const formattedDateTime_ko = date.toLocaleString("ko-KR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    return language === "ko" ? formattedDateTime_ko : formattedDateTime_en;
  }

  // 날짜만 포함 (기존 동작)
  const formattedDate_en = date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedDate_ko = date.toLocaleDateString("ko-KR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return language === "ko" ? formattedDate_ko : formattedDate_en;
}
