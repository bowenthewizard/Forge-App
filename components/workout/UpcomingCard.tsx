"use client";

import { MoreHorizontal } from "lucide-react";
import type { TemplateType } from "@/lib/demo-data";

type UpcomingCardProps = {
  template: TemplateType;
  dayLabel: string;
  onTap: () => void;
  onMenu: () => void;
};

export function UpcomingCard({ template, dayLabel, onTap, onMenu }: UpcomingCardProps) {
  return (
    <div className="mx-4 mb-2.5 rounded-[14px] bg-[#1A1A1A] p-4">
      <div className="flex items-start justify-between gap-2">
        <button
          type="button"
          onClick={onTap}
          className="min-w-0 flex-1 text-left"
        >
          <p
            className="text-[10px] font-medium uppercase text-[#6B7280]"
            style={{ letterSpacing: "0.1em" }}
          >
            {dayLabel}
          </p>
          <p className="mt-1 text-base font-semibold text-white">{template.name}</p>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {template.muscleGroups.map((g) => (
              <span
                key={g}
                className="rounded-[10px] bg-white/[0.06] px-2 py-0.5 text-[10px] font-medium text-[#D1D5DB]"
              >
                {g}
              </span>
            ))}
          </div>
          <p className="mt-1.5 text-xs font-normal text-[#9CA3AF]">
            {template.exerciseCount} exercises · ~{template.estimatedDurationMin} min
          </p>
        </button>
        <button
          type="button"
          onClick={onMenu}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-[#9CA3AF] hover:bg-white/[0.04]"
          aria-label="More options"
        >
          <MoreHorizontal className="h-[18px] w-[18px]" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
