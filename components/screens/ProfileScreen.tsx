"use client";

import { User, TrendingUp } from "lucide-react";

const STATS = [
  { label: "Workouts", value: "142" },
  { label: "This Month", value: "18" },
  { label: "Avg Duration", value: "58 min" },
  { label: "Total Volume", value: "2.1M lbs" },
];

const MAX_LIFTS: { name: string; max: string; trend: string; up: boolean }[] = [
  { name: "Bench Press", max: "275 lbs", trend: "+5 lbs", up: true },
  { name: "Squat", max: "365 lbs", trend: "+10 lbs", up: true },
  { name: "Deadlift", max: "405 lbs", trend: "—", up: false },
  { name: "OHP", max: "165 lbs", trend: "+5 lbs", up: true },
];

export function ProfileScreen() {
  return (
    <div className="px-5 pt-2 pb-28 animate-fade-in">
      {/* Profile header */}
      <div className="flex items-center gap-3.5 mb-[26px]">
        <div className="w-[62px] h-[62px] rounded-full bg-surface flex items-center justify-center border-[1.5px] border-[#2D2D2D]">
          <User size={26} className="text-text-tertiary" strokeWidth={1.8} />
        </div>
        <div>
          <h1 className="text-[22px] font-bold">FORGE</h1>
          <div className="text-[13px] text-text-tertiary mt-0.5">
            Preview Build · v0.1
          </div>
        </div>
      </div>

      <div className="mb-5 pl-3 pr-4 py-3 border-l-2 border-purple-500/50 bg-purple-500/5 rounded-r-[10px]">
        <div className="text-[10px] font-semibold text-purple-300 uppercase tracking-[0.14em] mb-1">
          Preview Build
        </div>
        <div className="text-[12px] text-text-secondary leading-relaxed">
          {
            "You're viewing an early preview of FORGE. Stats below are sample data — real tracking starts when you log your first workout."
          }
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-2.5 mb-6">
        {STATS.map((s) => (
          <div key={s.label} className="bg-surface rounded-xl p-4">
            <div className="section-label mb-2">{s.label}</div>
            <div className="text-[22px] font-bold">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="section-label mb-3">Max Lifts (Est. 1RM)</div>

      {MAX_LIFTS.map((l) => (
        <div
          key={l.name}
          className="bg-surface rounded-xl p-4 mb-2.5 flex items-center"
        >
          <div className="flex-1 text-sm font-semibold">{l.name}</div>
          <div className="text-right">
            <div className="text-xl font-bold tabular-nums">{l.max}</div>
            <div
              className={`text-[11px] font-semibold mt-0.5 flex items-center justify-end gap-0.5 ${
                l.up ? "text-success" : "text-text-tertiary"
              }`}
            >
              {l.up && <TrendingUp size={10} />}
              {l.trend} vs 30d
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
