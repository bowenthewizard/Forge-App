"use client";

import { Clock, Dumbbell, Play } from "lucide-react";
import { useStore } from "@/lib/store";

export function TodaysWorkoutCard() {
  const startWorkout = useStore((s) => s.startWorkout);

  return (
    <div className="bg-surface rounded-2xl overflow-hidden">
      <div className="p-[18px]">
        <div className="section-label mb-2.5">Today's Workout</div>
        <div className="text-[22px] font-bold leading-tight mb-0.5">Push Day</div>
        <div className="text-[13px] text-text-secondary mb-3.5">
          Chest · Shoulders · Triceps
        </div>
        <div className="flex gap-4 mb-[18px]">
          <div className="flex items-center gap-1.5">
            <Dumbbell size={13} className="text-text-tertiary" />
            <span className="text-xs text-text-tertiary">6 exercises</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={13} className="text-text-tertiary" />
            <span className="text-xs text-text-tertiary">~60 min</span>
          </div>
        </div>
        <button
          onClick={startWorkout}
          className="w-full h-12 bg-purple hover:bg-purple-pressed active:bg-purple-pressed transition-colors rounded-button flex items-center justify-center gap-2 font-semibold text-sm"
        >
          <Play size={15} fill="white" />
          Start Workout
        </button>
      </div>
    </div>
  );
}
