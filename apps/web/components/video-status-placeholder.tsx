"use client";

import { RefreshCw } from "lucide-react";
import { Language } from "@repo/types";
import { translations } from "@/lib/translations";
import { parseI18nMessage } from "@/lib/api/error-parser";

interface VideoStatusPlaceholderProps {
  status: string;
  language: Language;
  message?: string;
  retryCount?: number;
  onRetry?: () => void;
}

export function VideoStatusPlaceholder({
  status,
  language,
  message,
  retryCount = 0,
  onRetry,
}: VideoStatusPlaceholderProps) {
  const t = translations[language];

  const config = {
    PENDING: {
      pulseColor: "bg-muted",
      title: t.videoStatusPendingTitle,
      subtitle: t.videoStatusPendingSubtitle,
    },
    PROCESSING: {
      pulseColor: "bg-primary",
      title: t.videoStatusProcessingTitle,
      subtitle: t.videoStatusProcessingSubtitle,
    },
    FAILED: {
      pulseColor: "bg-destructive",
      title: t.videoStatusFailedTitle,
      subtitle: null,
    },
  }[status];

  if (!config) return null;

  return (
    <div className="relative aspect-video w-full rounded-lg overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-muted/50 to-muted" />

      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">
        <div
          className={`w-16 h-16 rounded-full ${config.pulseColor} animate-pulse`}
        />

        <p className="mt-4 text-foreground font-medium">{config.title}</p>

        {(message || config.subtitle) && (
          <p className="mt-1 text-sm text-muted-foreground">
            {(message ? parseI18nMessage(message, language) : null) ||
              config.subtitle}
          </p>
        )}

        {status === "FAILED" && onRetry && (
          <>
            <button
              onClick={onRetry}
              disabled={retryCount >= 3}
              className={`mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                retryCount >= 3
                  ? "bg-muted text-muted-foreground cursor-not-allowed"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              }`}
            >
              <RefreshCw className="w-4 h-4" />
              {retryCount >= 3
                ? language === "ko"
                  ? "재시도 불가"
                  : "Cannot Retry"
                : `${t.videoStatusRetry}${retryCount > 0 ? ` (${retryCount}/3)` : ""}`}
            </button>
            {retryCount > 0 && (
              <p className="mt-2 text-xs text-muted-foreground">
                {language === "ko"
                  ? `재시도 ${retryCount}/3회`
                  : `Retry attempt ${retryCount}/3`}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
