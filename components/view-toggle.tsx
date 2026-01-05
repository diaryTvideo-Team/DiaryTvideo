"use client"

import { Video, FileText } from "lucide-react"

interface ViewToggleProps {
  view: "video" | "text"
  onViewChange: (view: "video" | "text") => void
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-1 rounded-lg bg-secondary p-1">
      <button
        onClick={() => onViewChange("video")}
        className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
          view === "video" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Video className="h-4 w-4" />
        AI Video
      </button>
      <button
        onClick={() => onViewChange("text")}
        className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
          view === "text" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <FileText className="h-4 w-4" />
        Text
      </button>
    </div>
  )
}
