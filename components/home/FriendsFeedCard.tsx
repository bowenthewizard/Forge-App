import { friendsFeed } from "@/lib/demo-data";

export function FriendsFeedCard() {
  return (
    <div className="bg-surface rounded-2xl p-4">
      <div className="section-label mb-3.5">From The Forge</div>
      <div className="space-y-3.5">
        {friendsFeed.map((entry) => (
          <div key={entry.initials + entry.timeAgo} className="flex items-center gap-3">
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
