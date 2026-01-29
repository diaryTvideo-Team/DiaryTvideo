"use client";

import { Language } from "@repo/types";
import { Video, FileText } from "lucide-react";

interface ViewToggleProps {
  view: "video" | "text";
  onViewChange: (view: "video" | "text") => void;
  language: Language;
  hasNewJob?: boolean;
}

export function ViewToggle({
  view,
  onViewChange,
  language,
  hasNewJob,
}: ViewToggleProps) {
  return (
    <div className="flex items-center gap-1 rounded-lg bg-secondary p-1">
      <button
        onClick={() => onViewChange("video")}
        className={`relative flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
          view === "video"
            ? "bg-card text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Video className="h-4 w-4" />
        {language === "ko" ? "AI 비디오" : "AI Video"}
        {hasNewJob && (
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-primary animate-pulse" />
        )}
      </button>
      <button
        onClick={() => onViewChange("text")}
        className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
          view === "text"
            ? "bg-card text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <FileText className="h-4 w-4" />
        {language === "ko" ? "텍스트" : "Text"}
      </button>
    </div>
  );
}
