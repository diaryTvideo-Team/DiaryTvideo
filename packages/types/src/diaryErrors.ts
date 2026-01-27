import { Language } from "./language";

const i18nMessage = (msg: Record<Language, string>) => JSON.stringify(msg);

export const DiaryErrors = {
  DIARY_TITLE_REQUIRED: i18nMessage({
    en: "Title is required",
    ko: "제목은 필수 항목입니다.",
  }),
  DIARY_CONTENT_REQUIRED: i18nMessage({
    en: "Content is required",
    ko: "내용은 필수 항목입니다.",
  }),
  DIARY_NOT_FOUND: i18nMessage({
    en: "Diary entry not found",
    ko: "일기 항목을 찾을 수 없습니다.",
  }),
  DIARY_OWNERSHIP_MISMATCH: i18nMessage({
    en: "You can only delete your own diary",
    ko: "자신의 일기만 삭제할 수 있습니다.",
  }),
  DIARY_DATE_INVALID: i18nMessage({
    en: "Invalid diary date",
    ko: "유효하지 않은 일기 날짜입니다.",
  }),
} as const;
