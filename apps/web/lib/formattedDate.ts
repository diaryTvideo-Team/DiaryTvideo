import { DiaryData, Language } from "@repo/types";

interface FormattedDateProps {
  entry: DiaryData | null;
  language: Language;
}

export function useFormattedDate({ entry, language }: FormattedDateProps) {
  if (!entry) return null;

  const date = new Date(entry.createdAt);

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

  const formattedDate = language === "ko" ? formattedDate_ko : formattedDate_en;

  return formattedDate;
}
