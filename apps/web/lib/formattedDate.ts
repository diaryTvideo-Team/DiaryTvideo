import { Language } from "@repo/types";
import { DiaryEntry } from "@/lib/diary-store";

interface FormattedDateProps {
  entry: DiaryEntry | null;
  language: Language;
}

export function useFormattedDate({ entry, language }: FormattedDateProps) {
  if (!entry) return null;

  const formattedDate_en = entry.createdAt.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedDate_ko = entry.createdAt.toLocaleDateString("ko-KR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedDate = language === "ko" ? formattedDate_ko : formattedDate_en;

  return formattedDate;
}
