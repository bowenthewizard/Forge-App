"use client";

import { ChevronDown, Settings } from "lucide-react";
import { useStore } from "@/lib/store";
import {
  DEMO_COMPLETED_THIS_WEEK,
  DEMO_SPLIT,
  DEMO_TEMPLATES,
} from "@/lib/demo-data";
import { WeekStrip } from "./WeekStrip";
import { TodayHeroCard } from "./TodayHeroCard";
import { UpcomingCard } from "./UpcomingCard";
import { CompletedCard } from "./CompletedCard";

function dowToShortLabel(d: number): string {
  const labels = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"] as const;
  return labels[d - 1] ?? "MON";
}

export default function WorkoutTabDashboard() {
  const setTab = useStore((s) => s.setTab);

  const today = 1;
  const completedDays: number[] = [];
  const scheduledDays = [1, 3, 5];

  const push = DEMO_TEMPLATES["push-day"];
  const pull = DEMO_TEMPLATES["pull-day"];
  const leg = DEMO_TEMPLATES["leg-day"];

  return (
    <div className="animate-fade-in pb-8">
      <header className="px-5 pb-3 pt-4">
        <div className="flex items-center justify-between">
          <button
            type="button"
            className="flex min-w-0 items-center gap-1 text-left"
            aria-label="Select split"
          >
            <span className="truncate text-base font-semibold text-white">
              {DEMO_SPLIT.name}
            </span>
            <ChevronDown className="h-[18px] w-[18px] shrink-0 text-white" strokeWidth={2} />
          </button>
          <div className="flex items-center">
            <button type="button" className="p-1 text-[#9CA3AF]" aria-label="Settings">
              <Settings className="h-5 w-5" strokeWidth={1.8} />
            </button>
            <button
              type="button"
              className="ml-3 text-sm font-medium text-purple"
            >
              Edit
            </button>
          </div>
        </div>
        <p className="mt-1 text-[13px] font-normal text-[#9CA3AF]">
          <span className="text-white">Push</span>
          <span className="mx-1.5 text-[#4B5563]">·</span>
          <span className="text-white">Pull</span>
          <span className="mx-1.5 text-[#4B5563]">·</span>
          <span className="text-white">Legs</span>
        </p>
      </header>

      <WeekStrip
        today={today}
        completedDays={completedDays}
        scheduledDays={scheduledDays}
      />

      <div className="flex flex-col">
        <TodayHeroCard
          template={push}
          dayLabel="TODAY · MON"
          onStartWorkout={() => setTab("workout-logging")}
          onMenu={() => {}}
        />

        <h3
          className="mb-2 mt-6 px-5 text-[11px] font-medium uppercase text-[#6B7280]"
          style={{ letterSpacing: "0.1em" }}
        >
          UPCOMING
        </h3>
        <UpcomingCard
          template={pull}
          dayLabel="WED"
          onTap={() => {}}
          onMenu={() => {}}
        />
        <UpcomingCard
          template={leg}
          dayLabel="FRI"
          onTap={() => {}}
          onMenu={() => {}}
        />

        <h3
          className="mb-2 mt-8 px-5 text-[11px] font-medium uppercase text-[#6B7280]"
          style={{ letterSpacing: "0.1em" }}
        >
          COMPLETED THIS WEEK
        </h3>
        {DEMO_COMPLETED_THIS_WEEK.length === 0 ? (
          <p className="py-8 text-center text-xs text-[#6B7280]">
            Your completed workouts will show here
          </p>
        ) : (
          DEMO_COMPLETED_THIS_WEEK.map((row, i) => (
            <CompletedCard
              key={`${row.dayOfWeek}-${i}`}
              dayLabel={dowToShortLabel(row.dayOfWeek)}
              templateName={row.templateName}
              totalVolumeLbs={row.totalVolumeLbs}
              durationMinutes={row.durationMinutes}
              daysAgo={row.daysAgo}
            />
          ))
        )}

        <button
          type="button"
          className="mt-6 w-full pb-8 pt-2 text-center text-sm font-medium text-purple"
          onClick={() => {}}
        >
          Browse Splits
        </button>
      </div>
    </div>
  );
}
