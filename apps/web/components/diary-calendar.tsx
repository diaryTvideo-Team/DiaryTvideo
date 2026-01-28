"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import { Language } from "@repo/types";

interface DiaryCalendarProps {
  entryDates: Date[];
  selectedDate: Date | null;
  onSelectDate: (date: Date | null) => void;
  onMonthChange?: (year: number, month: number) => void;
  isLoading?: boolean;
  language: Language;
}

export function DiaryCalendar({
  entryDates,
  selectedDate,
  onSelectDate,
  onMonthChange,
  isLoading = false,
  language,
}: DiaryCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0,
  ).getDate();

  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1,
  ).getDay();

  const monthNames_en = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const monthNames_ko = [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ];

  const dayNames_en = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dayNames_ko = ["일", "월", "화", "수", "목", "금", "토"];

  const monthNames = language === "ko" ? monthNames_ko : monthNames_en;
  const dayNames = language === "ko" ? dayNames_ko : dayNames_en;

  const prevMonth = () => {
    const newMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() - 1,
      1,
    );
    setCurrentMonth(newMonth);
    onMonthChange?.(newMonth.getFullYear(), newMonth.getMonth() + 1);
  };

  const nextMonth = () => {
    const newMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      1,
    );
    setCurrentMonth(newMonth);
    onMonthChange?.(newMonth.getFullYear(), newMonth.getMonth() + 1);
  };

  const entryDateSet = useMemo(() => {
    const set = new Set<string>();
    for (const date of entryDates) {
      set.add(`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`);
    }
    return set;
  }, [entryDates]);

  const hasEntry = (day: number) =>
    entryDateSet.has(
      `${currentMonth.getFullYear()}-${currentMonth.getMonth()}-${day}`,
    );

  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentMonth.getMonth() &&
      selectedDate.getFullYear() === currentMonth.getFullYear()
    );
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === currentMonth.getMonth() &&
      today.getFullYear() === currentMonth.getFullYear()
    );
  };

  const handleDayClick = (day: number) => {
    const clickedDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day,
    );
    if (selectedDate && isSelected(day)) {
      onSelectDate(null);
    } else {
      onSelectDate(clickedDate);
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="icon" onClick={prevMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h3 className="font-serif font-semibold text-foreground">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        <Button variant="ghost" size="icon" onClick={nextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div
            key={day}
            className="text-center text-xs text-muted-foreground font-medium py-1"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="relative">
        {/* 로딩 오버레이 */}
        {isLoading && (
          <div className="absolute inset-0 bg-card/50 backdrop-blur-[2px] rounded-lg flex items-center justify-center z-10">
            <div className="flex flex-col items-center gap-2">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-xs text-muted-foreground">
                {language === "ko" ? "불러오는 중..." : "Loading..."}
              </span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const hasEntryOnDay = hasEntry(day);
            const isSelectedDay = isSelected(day);
            const isTodayDay = isToday(day);

            return (
              <button
                key={day}
                onClick={() => handleDayClick(day)}
                className={`
                relative aspect-square flex items-center justify-center text-sm rounded-lg
                transition-colors
                ${
                  isSelectedDay
                    ? "bg-primary text-primary-foreground"
                    : hasEntryOnDay
                      ? "bg-accent text-accent-foreground hover:bg-accent/80"
                      : "hover:bg-muted"
                }
                ${isTodayDay && !isSelectedDay ? "ring-1 ring-primary" : ""}
              `}
              >
                {day}
                {hasEntryOnDay && !isSelectedDay && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {selectedDate && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onSelectDate(null)}
          className="w-full mt-3 text-muted-foreground"
        >
          Clear date filter
        </Button>
      )}
    </div>
  );
}
