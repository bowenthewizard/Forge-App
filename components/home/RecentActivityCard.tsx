const RECENT = [
  { name: "Push Day", date: "Apr 14", duration: "1h 12m", volume: "24,500 lbs" },
  { name: "Pull Day", date: "Apr 12", duration: "58m", volume: "21,200 lbs" },
  { name: "Leg Day", date: "Apr 10", duration: "1h 05m", volume: "32,100 lbs" },
];

export function RecentActivityCard() {
  return (
    <div>
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
