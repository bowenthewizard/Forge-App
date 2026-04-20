import { Trophy } from "lucide-react";
import { latestPR } from "@/lib/demo-data";

export function FeaturedPRCard() {
  return (
    <div className="bg-surface rounded-2xl border border-[rgba(16,185,129,0.15)] p-4">
      <div className="flex items-start justify-between mb-2">
        <div className="section-label">Latest PR</div>
        <Trophy size={18} className="text-white" />
      </div>
      <div className="text-[18px] font-semibold mb-1">{latestPR.exercise}</div>
      <div className="text-[24px] font-bold leading-tight mb-1.5">
        {latestPR.weight} lbs × {latestPR.reps} reps
      </div>
      <div className="text-xs text-text-secondary">
        {latestPR.daysAgo} days ago ·{" "}
        <span className="text-success">+{latestPR.deltaVsPrev} lbs</span> from last PR
      </div>
    </div>
  );
}
