"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import {
  getMonthOverMonthChange,
  getMonthTotal,
  monthlyWorkoutData,
} from "@/lib/demo-data";

const DEMO_TODAY = new Date(2026, 3, 20);
const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

type ViewedMonth = { year: number; month: number };
type TooltipState = {
  date: Date;
  volume: number;
  left: number;
  top: number;
};

function toMonthKey(year: number, month: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}`;
}

function getHeatmapColor(volume: number, maxVolume: number) {
  if (volume === 0) {
    return "#1A1A1A";
  }

  const ratio = volume / Math.max(maxVolume, 1);
  if (ratio <= 0.25) return "#2A3A30";
  if (ratio <= 0.5) return "#1D5C41";
  if (ratio <= 0.75) return "#10B981";
  return "#34D399";
}

export function WeeklyVolumeCard() {
  const [viewedMonth, setViewedMonth] = useState<ViewedMonth>({
    year: DEMO_TODAY.getFullYear(),
    month: DEMO_TODAY.getMonth(),
  });
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);

  const allKeys = Object.keys(monthlyWorkoutData).sort();
  const earliestKey = allKeys[0];
  const earliestYear = Number(earliestKey.slice(0, 4));
  const earliestMonth = Number(earliestKey.slice(5, 7)) - 1;
  const isCurrentMonth =
    viewedMonth.year === DEMO_TODAY.getFullYear() && viewedMonth.month === DEMO_TODAY.getMonth();
  const isEarliestMonth = viewedMonth.year === earliestYear && viewedMonth.month === earliestMonth;

  const monthKey = toMonthKey(viewedMonth.year, viewedMonth.month);
  const monthData = monthlyWorkoutData[monthKey] ?? [];
  const monthTotal = getMonthTotal(viewedMonth.year, viewedMonth.month);
  const monthChange = getMonthOverMonthChange(viewedMonth.year, viewedMonth.month);
  const monthlyMax = Math.max(...monthData.map((entry) => entry.volume), 1);

  const firstDayOffset = (new Date(viewedMonth.year, viewedMonth.month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(viewedMonth.year, viewedMonth.month + 1, 0).getDate();
  const totalCells = Math.ceil((firstDayOffset + daysInMonth) / 7) * 7;

  const cells = useMemo(() => {
    return Array.from({ length: totalCells }, (_, index) => {
      const day = index - firstDayOffset + 1;
      if (day < 1 || day > daysInMonth) {
        return null;
      }
      return monthData[day - 1] ?? { day, volume: 0 };
    });
  }, [daysInMonth, firstDayOffset, monthData, totalCells]);

  const monthTitle = new Date(viewedMonth.year, viewedMonth.month, 1)
    .toLocaleDateString("en-US", { month: "long", year: "numeric" })
    .toUpperCase();
  const previousMonthName = new Date(viewedMonth.year, viewedMonth.month - 1, 1).toLocaleDateString(
    "en-US",
    { month: "long" }
  );
  const trendPrefix = monthChange > 0 ? "+" : monthChange < 0 ? "−" : "";
  const trendText = `${trendPrefix}${Math.abs(monthChange)}% from ${previousMonthName}`;

  const handlePrevMonth = () => {
    if (isEarliestMonth) return;
    const prev = new Date(viewedMonth.year, viewedMonth.month - 1, 1);
    setViewedMonth({ year: prev.getFullYear(), month: prev.getMonth() });
    setTooltip(null);
  };

  const handleNextMonth = () => {
    if (isCurrentMonth) return;
    const next = new Date(viewedMonth.year, viewedMonth.month + 1, 1);
    setViewedMonth({ year: next.getFullYear(), month: next.getMonth() });
    setTooltip(null);
  };

  const showTooltip = (
    event: React.MouseEvent<HTMLButtonElement> | React.FocusEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>,
    day: number,
    volume: number
  ) => {
    const gridRect = gridRef.current?.getBoundingClientRect();
    const cellRect = event.currentTarget.getBoundingClientRect();
    if (!gridRect) return;
    setTooltip({
      date: new Date(viewedMonth.year, viewedMonth.month, day),
      volume,
      left: cellRect.left - gridRect.left + cellRect.width / 2,
      top: cellRect.top - gridRect.top - 6,
    });
  };

  return (
    <div className="border-y border-separator py-5">
      <div className="flex justify-center">
        <div className="w-full max-w-[340px]">
          <div className="flex items-center justify-center gap-4 mb-1.5">
            <button
              type="button"
              onClick={handlePrevMonth}
              disabled={isEarliestMonth}
              className={isEarliestMonth ? "pointer-events-none" : ""}
            >
              <ChevronLeft
                size={16}
                className={isEarliestMonth ? "text-[#2D2D2D]" : "text-text-tertiary"}
              />
            </button>
            <div className="text-xs font-semibold text-text-secondary tracking-[0.12em]">
              {monthTitle}
            </div>
            <button
              type="button"
              onClick={handleNextMonth}
              disabled={isCurrentMonth}
              className={isCurrentMonth ? "pointer-events-none" : ""}
            >
              <ChevronRight
                size={16}
                className={isCurrentMonth ? "text-[#2D2D2D]" : "text-text-tertiary"}
              />
            </button>
          </div>

          <div className="text-center text-[36px] font-bold text-white leading-[1.1] tabular-nums">
            {monthTotal.toLocaleString()} lbs
          </div>
          <div
            className={`text-center text-[13px] font-medium mt-0.5 ${
              monthChange > 0 ? "text-success" : "text-text-secondary"
            }`}
          >
            {trendText}
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2 mt-5">
            {DAY_LABELS.map((label) => (
              <div
                key={label}
                className="text-center text-[10px] font-medium text-[#4B5563] tracking-[0.1em]"
              >
                {label}
              </div>
            ))}
          </div>

          <div className="relative" ref={gridRef}>
            {tooltip && (
              <div
                className="absolute z-10 pointer-events-none -translate-x-1/2 -translate-y-full rounded-[6px] bg-surface border border-[#2D2D2D] px-2.5 py-1.5 transition-opacity duration-150"
                style={{ left: tooltip.left, top: tooltip.top }}
              >
                <div className="text-[11px] text-white whitespace-nowrap">
                  {tooltip.date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </div>
                <div className="text-xs font-bold text-text-secondary whitespace-nowrap">
                  {tooltip.volume > 0 ? `${tooltip.volume.toLocaleString()} lbs` : "Rest day"}
                </div>
              </div>
            )}

            <div className="grid grid-cols-7 gap-1">
              {cells.map((entry, index) => {
                if (!entry) {
                  return <div key={`pad-${index}`} className="aspect-square bg-transparent" />;
                }

                const cellDate = new Date(viewedMonth.year, viewedMonth.month, entry.day);
                const isToday =
                  cellDate.getFullYear() === DEMO_TODAY.getFullYear() &&
                  cellDate.getMonth() === DEMO_TODAY.getMonth() &&
                  cellDate.getDate() === DEMO_TODAY.getDate();

                return (
                  <button
                    key={cellDate.toISOString()}
                    type="button"
                    className="aspect-square rounded-[3px] border-none p-0"
                    style={{
                      backgroundColor: getHeatmapColor(entry.volume, monthlyMax),
                      boxShadow: isToday ? "inset 0 0 0 1.5px #FFFFFF" : "none",
                    }}
                    onMouseEnter={(event) => showTooltip(event, entry.day, entry.volume)}
                    onFocus={(event) => showTooltip(event, entry.day, entry.volume)}
                    onTouchStart={(event) => showTooltip(event, entry.day, entry.volume)}
                    onMouseLeave={() => setTooltip(null)}
                    onBlur={() => setTooltip(null)}
                    aria-label={`${cellDate.toDateString()}, ${entry.volume.toLocaleString()} lbs`}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
