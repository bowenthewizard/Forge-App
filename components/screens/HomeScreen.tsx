"use client";

import { User } from "lucide-react";
import { FeaturedPRCard } from "@/components/home/FeaturedPRCard";
import { FriendsFeedCard } from "@/components/home/FriendsFeedCard";
import { QuickActionsRow } from "@/components/home/QuickActionsRow";
import { RecentActivityCard } from "@/components/home/RecentActivityCard";
import { TodaysWorkoutCard } from "@/components/home/TodaysWorkoutCard";
import { WeeklyVolumeCard } from "@/components/home/WeeklyVolumeCard";

const HOME_CARDS = [
  { id: "todays-workout", Component: TodaysWorkoutCard },
  { id: "quick-actions", Component: QuickActionsRow },
  { id: "weekly-volume", Component: WeeklyVolumeCard },
  { id: "featured-pr", Component: FeaturedPRCard },
  { id: "friends-feed", Component: FriendsFeedCard },
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
