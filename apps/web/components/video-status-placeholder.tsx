"use client";

import { RefreshCw } from "lucide-react";
import { Language } from "@repo/types";
import { translations } from "@/lib/translations";

interface VideoStatusPlaceholderProps {
  status: string;
  thumbnailUrl?: string | null;
  language: Language;
  message?: string;
  onRetry?: () => void;
}

export function VideoStatusPlaceholder({
  status,
  thumbnailUrl,
  language,
  message,
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
      {thumbnailUrl ? (
        <img
          src={thumbnailUrl}
          alt=""
          className="absolute inset-0 w-full h-full object-cover blur-md scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-muted/50 to-muted" />
      )}

      <div className="absolute inset-0 bg-background/30" />

      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">
        <div
          className={`w-16 h-16 rounded-full ${config.pulseColor} animate-pulse`}
        />

        <p className="mt-4 text-foreground font-medium">{config.title}</p>

        {(message || config.subtitle) && (
          <p className="mt-1 text-sm text-muted-foreground">
            {message || config.subtitle}
          </p>
        )}

        {status === "FAILED" && onRetry && (
          <button
            onClick={onRetry}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            {t.videoStatusRetry}
          </button>
        )}
      </div>
    </div>
  );
}
