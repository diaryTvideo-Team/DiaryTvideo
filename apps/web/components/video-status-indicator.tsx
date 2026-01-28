"use client";

import { Play } from "lucide-react";
import { Language } from "@repo/types";
import { translations } from "@/lib/translations";
import { parseI18nMessage } from "@/lib/api/error-parser";

interface VideoStatusIndicatorProps {
  status: string;
  variant: "overlay" | "badge";
  language: Language;
  message?: string;
  className?: string;
}

export function VideoStatusIndicator({
  status,
  variant,
  language,
  message,
  className = "",
}: VideoStatusIndicatorProps) {
  if (variant === "overlay") {
    return <OverlayIndicator status={status} className={className} />;
  }

  if (variant === "badge") {
    return (
      <BadgeIndicator
        status={status}
        language={language}
        message={message}
        className={className}
      />
    );
  }

  return null;
}

function OverlayIndicator({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  if (status === "COMPLETED") {
    return (
      <div
        className={`absolute inset-0 flex items-center justify-center ${className}`}
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-card/90 shadow-lg transition-transform group-hover:scale-110">
          <Play className="h-6 w-6 text-primary ml-1" fill="currentColor" />
        </div>
      </div>
    );
  }

  const pulseColorClass =
    {
      PENDING: "bg-muted",
      PROCESSING: "bg-primary",
      FAILED: "bg-destructive",
    }[status] || "bg-muted";

  return (
    <div
      className={`absolute inset-0 flex items-center justify-center ${className}`}
    >
      <div
        className={`h-14 w-14 rounded-full ${pulseColorClass} animate-pulse shadow-lg`}
      />
    </div>
  );
}

function BadgeIndicator({
  status,
  language,
  message,
  className,
}: {
  status: string;
  language: Language;
  message?: string;
  className?: string;
}) {
  const t = translations[language];

  const config = {
    PENDING: {
      defaultText: t.videoStatusPending,
      style: "bg-muted text-muted-foreground",
    },
    PROCESSING: {
      defaultText: t.videoStatusProcessing,
      style: "bg-primary text-primary-foreground animate-pulse",
    },
    COMPLETED: {
      defaultText: t.videoStatusCompleted,
      style: "bg-foreground/80 text-background",
    },
    FAILED: {
      defaultText: t.videoStatusFailed,
      style: "bg-destructive text-white",
    },
  }[status] || {
    defaultText: "",
    style: "bg-muted text-muted-foreground",
  };

  const displayText =
    (message ? parseI18nMessage(message, language) : null) ||
    config.defaultText;

  return (
    <div className={`rounded px-2 py-0.5 text-xs ${config.style} ${className}`}>
      {displayText}
    </div>
  );
}
