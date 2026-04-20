"use client";

import { Check } from "lucide-react";

type CompletedCardProps = {
  dayLabel: string;
  templateName: string;
  totalVolumeLbs: number;
  durationMinutes: number;
  daysAgo: number;
};

function formatDurationCompact(minutes: number): string {
  if (minutes >= 60) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  }
  return `${minutes}m`;
}

function formatDaysAgo(n: number): string {
  if (n === 0) return "today";
  if (n === 1) return "yesterday";
  return `${n} days ago`;
}

export function CompletedCard({
  dayLabel,
  templateName,
  totalVolumeLbs,
  durationMinutes,
  daysAgo,
}: CompletedCardProps) {
  return (
    <div className="mx-4 mb-2.5 rounded-[14px] bg-[#1A1A1A] p-4 opacity-75">
      <div className="flex items-center gap-0.5">
        <span className="text-[10px] font-medium uppercase text-[#6B7280]">{dayLabel}</span>
        <Check className="h-3 w-3 text-[#10B981]" strokeWidth={3} aria-hidden />
      </div>
      <p className="mt-1 text-[15px] font-semibold text-white">
        {templateName} · {totalVolumeLbs.toLocaleString("en-US")} lbs
      </p>
      <p className="mt-1 text-xs text-[#9CA3AF]">
        {formatDurationCompact(durationMinutes)} · {formatDaysAgo(daysAgo)}
      </p>
    </div>
  );
}
