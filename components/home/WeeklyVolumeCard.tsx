import { weeklyVolume, weekTrendPercent } from "@/lib/demo-data";

const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];
const TODAY_INDEX = 5;

export function WeeklyVolumeCard() {
  const total = weeklyVolume.reduce((sum, value) => sum + value, 0);
  const maxValue = Math.max(...weeklyVolume, 1);
  const isPositiveTrend = weekTrendPercent > 0;
  const trendValue = Math.abs(weekTrendPercent);

  return (
    <div className="border-y border-separator py-5">
      <div className="section-label mb-2">This Week</div>
      <div className="text-[28px] font-bold leading-none mb-2">
        {total.toLocaleString()} lbs
      </div>
      <div
        className={`text-xs mb-4 ${
          isPositiveTrend ? "text-success" : "text-text-secondary"
        }`}
      >
        {isPositiveTrend ? "+" : "−"}
        {trendValue}% vs last week
      </div>

      <svg
        width="174"
        height="122"
        viewBox="0 0 174 122"
        role="img"
        aria-label="Weekly volume bar chart"
      >
        {weeklyVolume.map((value, index) => {
          const barHeight = Math.round((value / maxValue) * 76);
          const x = index * 26;
          const y = 84 - barHeight;
          const isToday = index === TODAY_INDEX;

          return (
            <g key={DAY_LABELS[index] + index}>
              <rect
                x={x}
                y={y}
                width={18}
                height={barHeight}
                rx={4}
                fill={isToday ? "#FFFFFF" : "rgba(255,255,255,0.7)"}
                stroke={isToday ? "#10B981" : "none"}
                strokeWidth={isToday ? 1 : 0}
              />
              <text
                x={x + 9}
                y={108}
                textAnchor="middle"
                fontSize="10"
                fill="#6B7280"
                fontFamily="var(--font-poppins), system-ui, sans-serif"
              >
                {DAY_LABELS[index]}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
