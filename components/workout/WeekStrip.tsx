"use client";

import type { ReactNode } from "react";
import { Check } from "lucide-react";

const DAY_LETTERS = ["M", "T", "W", "T", "F", "S", "S"] as const;

/** Monday-based day index 1–7 → calendar day number for demo week (week of 2026-04-20). */
function demoDayNumber(mondayBased: number): number {
  const mon = new Date("2026-04-20T12:00:00");
  mon.setDate(mon.getDate() + (mondayBased - 1));
  return mon.getDate();
}

type WeekStripProps = {
  today: number;
  completedDays: number[];
  scheduledDays: number[];
};

export function WeekStrip({ today, completedDays, scheduledDays }: WeekStripProps) {
  const completed = new Set(completedDays);
  const scheduled = new Set(scheduledDays);

  return (
    <div className="grid grid-cols-7 border-b border-[#1F1F1F] py-4 px-4">
      {([1, 2, 3, 4, 5, 6, 7] as const).map((d) => {
        const isCompleted = completed.has(d);
        const isToday = d === today;
        const isScheduled = scheduled.has(d);

        let indicator: ReactNode;
        if (isCompleted) {
          indicator = (
            <span className="flex h-2 w-2 items-center justify-center rounded-full bg-[#10B981]">
              <Check className="h-[7px] w-[7px] text-white" strokeWidth={3} />
            </span>
          );
        } else if (isToday) {
          indicator = (
            <span className="box-border h-[10px] w-[10px] shrink-0 animate-pulse rounded-full border-2 border-[#8B5CF6]" />
          );
        } else if (isScheduled) {
          indicator = (
            <span className="box-border h-2 w-2 shrink-0 rounded-full border-[1.5px] border-[#4B5563] bg-transparent" />
          );
        } else {
          indicator = (
            <span className="text-[10px] font-medium leading-none text-[#4B5563]">—</span>
          );
        }

        return (
          <div key={d} className="flex flex-col items-center gap-1">
            <span
              className="text-[11px] font-medium uppercase text-[#6B7280]"
              style={{ fontFamily: "var(--font-poppins), system-ui, sans-serif" }}
            >
              {DAY_LETTERS[d - 1]}
            </span>
            <span
              className={`text-[14px] font-semibold ${
                isToday ? "text-white" : "text-[#9CA3AF]"
              }`}
              style={{ fontFamily: "var(--font-poppins), system-ui, sans-serif" }}
            >
              {demoDayNumber(d)}
            </span>
            <div className="flex h-3 items-center justify-center">{indicator}</div>
          </div>
        );
      })}
    </div>
  );
}
