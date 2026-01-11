"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Language } from "@repo/types";

interface DiaryFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  language: Language;
}

export function DiaryFilter({
  searchQuery,
  onSearchChange,
  language,
}: DiaryFilterProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder={
          language === "ko" ? "일기 검색..." : "Search diary entries..."
        }
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10 pr-10 bg-card border-border"
      />
      {searchQuery && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
          onClick={() => onSearchChange("")}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
