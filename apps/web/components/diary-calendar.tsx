"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Language } from "@/lib/translations";

interface DiaryCalendarProps {
  entryDates: Date[];
  selectedDate: Date | null;
  onSelectDate: (date: Date | null) => void;
  language: Language;
}

export function DiaryCalendar({
  entryDates,
  selectedDate,
  onSelectDate,
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
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1),
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1),
    );
  };

  const hasEntry = (day: number) => {
    return entryDates.some(
      (date) =>
        date.getDate() === day &&
        date.getMonth() === currentMonth.getMonth() &&
        date.getFullYear() === currentMonth.getFullYear(),
    );
  };

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
