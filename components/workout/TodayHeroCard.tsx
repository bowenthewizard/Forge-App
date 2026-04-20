"use client";

import { Play, MoreHorizontal } from "lucide-react";
import type { TemplateType } from "@/lib/demo-data";

type TodayHeroCardProps = {
  template: TemplateType;
  dayLabel: string;
  onStartWorkout: () => void;
  onMenu: () => void;
};

export function TodayHeroCard({
  template,
  dayLabel,
  onStartWorkout,
  onMenu,
}: TodayHeroCardProps) {
  return (
    <div
      className="mx-4 my-4 rounded-2xl p-5"
      style={{
        background:
          "linear-gradient(135deg, rgba(139,92,246,0.08), rgba(139,92,246,0.02))",
        border: "1px solid rgba(139,92,246,0.2)",
      }}
    >
      <p
        className="text-[11px] font-medium uppercase text-purple-light"
        style={{ letterSpacing: "0.12em" }}
      >
        {dayLabel}
      </p>
      <h2 className="mt-1 text-[22px] font-bold text-white">{template.name}</h2>
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        {template.muscleGroups.map((g) => (
          <span
            key={g}
            className="rounded-[10px] bg-white/[0.06] px-2.5 py-[3px] text-[11px] font-medium text-[#D1D5DB]"
          >
            {g}
          </span>
        ))}
      </div>
      <p className="mt-2 text-[13px] font-normal text-[#9CA3AF]">
        {template.exerciseCount} exercises · ~{template.estimatedDurationMin} min
      </p>
      <div className="mt-4 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onStartWorkout}
          className="flex h-12 flex-1 items-center justify-center gap-2 rounded-[10px] bg-purple text-[15px] font-semibold text-white"
        >
          <Play className="h-4 w-4 shrink-0" fill="currentColor" size={16} />
          <span>Start Workout</span>
        </button>
        <button
          type="button"
          onClick={onMenu}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-[#9CA3AF] hover:bg-white/[0.04]"
          aria-label="More options"
        >
          <MoreHorizontal className="h-5 w-5" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
