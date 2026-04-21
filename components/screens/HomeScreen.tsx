"use client";

import { User } from "lucide-react";
import { FeaturedPRCard } from "@/components/home/FeaturedPRCard";
import { QuickActionsRow } from "@/components/home/QuickActionsRow";
import { RecentActivityCard } from "@/components/home/RecentActivityCard";
import { TodaysWorkoutCard } from "@/components/home/TodaysWorkoutCard";
import { WeeklyVolumeCard } from "@/components/home/WeeklyVolumeCard";

const PREVIEW_FRIENDS_FEED = [
  {
    initials: "CL",
    name: "Chris Lebbin",
    workout: "Push Day",
    volume: 24500,
    timeAgo: "2h",
  },
  {
    initials: "JR",
    name: "Joe Rosenberg",
    workout: "Pull Day",
    volume: 21200,
    timeAgo: "4h",
  },
  {
    initials: "SE",
    name: "Steven Edwards",
    workout: "Leg Day",
    volume: 32100,
    timeAgo: "1d",
  },
];

function PreviewFriendsFeedCard() {
  return (
    <div className="bg-surface rounded-2xl p-4">
      <div className="section-label mb-3.5">From The Forge</div>
      <div className="space-y-3.5">
        {PREVIEW_FRIENDS_FEED.map((entry) => (
          <div
            key={entry.initials + entry.timeAgo}
            className="flex items-center gap-3"
          >
            <div className="w-[30px] h-[30px] rounded-full bg-[#2D2D2D] flex items-center justify-center text-xs font-semibold text-white">
              {entry.initials}
            </div>
            <div className="min-w-0">
              <div className="text-sm truncate">
                <span className="font-semibold text-white">{entry.name}</span>
                <span className="text-text-secondary"> · {entry.workout}</span>
              </div>
              <div className="text-[11px] text-text-tertiary">
                {entry.volume.toLocaleString()} lbs · {entry.timeAgo} ago
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className="w-full mt-4 h-9 rounded-button text-sm font-medium text-text-secondary hover:bg-[#222222] transition-colors">
        See all workouts
      </button>
    </div>
  );
}

const HOME_CARDS = [
  { id: "todays-workout", Component: TodaysWorkoutCard },
  { id: "quick-actions", Component: QuickActionsRow },
  { id: "weekly-volume", Component: WeeklyVolumeCard },
  { id: "featured-pr", Component: FeaturedPRCard },
  { id: "friends-feed", Component: PreviewFriendsFeedCard },
  { id: "recent-activity", Component: RecentActivityCard },
];

export function HomeScreen() {
  return (
    <div className="px-5 pt-2 pb-28 animate-fade-in">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-[28px] font-bold leading-tight tracking-tight text-text-primary mb-1.5">
            Welcome to FORGE
          </h1>
          <div className="text-[10px] font-semibold text-text-tertiary uppercase tracking-[0.18em]">
            Build Yourself
          </div>
        </div>
        <button className="w-[46px] h-[46px] rounded-full bg-surface border border-[#2D2D2D] flex items-center justify-center mt-1.5">
          <User size={20} className="text-text-tertiary" strokeWidth={1.8} />
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {HOME_CARDS.map(({ id, Component }) => (
          <Component key={id} />
        ))}
      </div>
    </div>
  );
}
