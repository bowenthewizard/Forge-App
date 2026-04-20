"use client";

import { useEffect, useState } from "react";
import { formatClock } from "@/lib/utils";

export function StatusBar() {
  const [time, setTime] = useState("9:41");

  useEffect(() => {
    setTime(formatClock());
    const interval = setInterval(() => setTime(formatClock()), 30_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-end justify-between px-6 pb-2 pt-3 h-12 flex-shrink-0">
      <span className="text-[15px] font-bold tracking-tight">{time}</span>
      <div className="flex items-center gap-1.5 pb-0.5">
        {/* Signal bars */}
        <svg width="17" height="10" viewBox="0 0 17 10" fill="none" aria-hidden>
          <rect x="0" y="7" width="3" height="3" rx=".5" fill="#fff" />
          <rect x="4.5" y="5" width="3" height="5" rx=".5" fill="#fff" />
          <rect x="9" y="2.5" width="3" height="7.5" rx=".5" fill="#fff" />
          <rect x="13.5" y="0" width="3" height="10" rx=".5" fill="rgba(255,255,255,.35)" />
        </svg>
        {/* Battery */}
        <svg width="24" height="12" viewBox="0 0 24 12" fill="none" aria-hidden>
          <rect x=".5" y=".5" width="21" height="11" rx="3.5" stroke="rgba(255,255,255,.65)" />
          <rect x="22" y="3.5" width="2" height="5" rx="1" fill="rgba(255,255,255,.65)" />
          <rect x="2" y="2" width="16" height="8" rx="2" fill="#fff" />
        </svg>
      </div>
    </div>
  );
}
