"use client";

import { Flame, User, Dumbbell, Clock, Plus, Youtube, TrendingUp, Play } from "lucide-react";
import { useStore } from "@/lib/store";

const RECENT = [
  { name: "Push Day", date: "Apr 14", duration: "1h 12m", volume: "24,500 lbs" },
  { name: "Pull Day", date: "Apr 12", duration: "58m", volume: "21,200 lbs" },
  { name: "Leg Day", date: "Apr 10", duration: "1h 05m", volume: "32,100 lbs" },
];

export function HomeScreen() {
  const startWorkout = useStore((s) => s.startWorkout);
  const setTab = useStore((s) => s.setTab);

  return (
    <div className="px-5 pt-2 pb-28 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-[27px] font-bold leading-tight">Good morning,</h1>
          <h1 className="text-[27px] font-bold leading-tight">Alex</h1>
          <div className="flex items-center gap-1.5 mt-1.5">
            <Flame size={14} className="text-warning" fill="#F59E0B" />
            <span className="text-xs text-text-secondary font-medium">
              12 week streak
            </span>
          </div>
        </div>
        <button className="w-[46px] h-[46px] rounded-full bg-surface border border-[#2D2D2D] flex items-center justify-center mt-1.5">
          <User size={20} className="text-text-tertiary" strokeWidth={1.8} />
        </button>
      </div>

      {/* Today's workout card */}
      <div className="bg-surface rounded-2xl mb-4 overflow-hidden flex">
        <div className="w-[3px] bg-purple flex-shrink-0" />
        <div className="flex-1 p-[18px]">
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
          {/* THE purple CTA — one per screen */}
          <button
            onClick={startWorkout}
            className="w-full h-12 bg-purple hover:bg-purple-pressed active:bg-purple-pressed transition-colors rounded-button flex items-center justify-center gap-2 font-semibold text-sm"
          >
            <Play size={15} fill="white" />
            Start Workout
          </button>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-3 gap-2.5 mb-6">
        <QuickAction icon={Plus} label="New Routine" color="#9CA3AF" />
        <QuickAction
          icon={Youtube}
          label="YT Import"
          color="#EF4444"
          onClick={() => setTab("library")}
        />
        <QuickAction
          icon={TrendingUp}
          label="Progress"
          color="#10B981"
          onClick={() => setTab("profile")}
        />
      </div>

      {/* Recent activity */}
      <h2 className="text-lg font-bold mb-3.5">Recent Activity</h2>
      {RECENT.map((w) => (
        <div
          key={w.name + w.date}
          className="bg-surface rounded-xl p-4 mb-2.5 flex justify-between items-center"
        >
          <div>
            <div className="text-[15px] font-semibold">{w.name}</div>
            <div className="text-xs text-text-tertiary mt-0.5">{w.date}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-text-secondary">{w.duration}</div>
            <div className="text-[13px] font-semibold text-text-secondary mt-0.5">
              {w.volume}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function QuickAction({
  icon: Icon,
  label,
  color,
  onClick,
}: {
  icon: typeof Plus;
  label: string;
  color: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="bg-surface rounded-xl p-3.5 flex flex-col items-center gap-2 hover:bg-surface2 transition-colors"
    >
      <div className="w-10 h-10 bg-surface2 rounded-[10px] flex items-center justify-center">
        <Icon size={17} style={{ color }} strokeWidth={2} />
      </div>
      <span className="text-[11px] font-semibold text-text-secondary">{label}</span>
    </button>
  );
}
